// Usage: npm run shots   (package.json: "shots": "vite build && node scripts/shots.mjs")
import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = ["/", "/case/describe", "/case/classify", "/case/protect", "/case/owe", "/case/say",
  "/case/search", "/case/dossier", "/library", "/how", "/ask", "/dev/ui"];
const SIZES = [["desk", 1440, 900, false], ["mob", 390, 844, true]];
const THEMES = ["light", "dark"];
const exe = process.env.CHROME_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

mkdirSync("shots", { recursive: true });
const server = spawn("npx", ["vite", "preview", "--port", "4173", "--strictPort"], { stdio: "ignore" });
await new Promise((r) => setTimeout(r, 2500));

const browser = await chromium.launch({ executablePath: exe, args: ["--no-sandbox"] });
let failures = 0;
for (const theme of THEMES) for (const [name, w, h, mobile] of SIZES) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile });
  await ctx.addInitScript((t) => { try { localStorage.setItem("ips.theme", t); } catch {} }, theme);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  for (const r of ROUTES) {
    await page.goto(`http://localhost:4173/#${r}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    const slug = r === "/" ? "home" : r.slice(1).replaceAll("/", "-");
    await page.screenshot({ path: `shots/${theme}-${name}-${slug}.png`, fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    if (overflow) { console.log(`OVERFLOW ${theme} ${name} ${r}`); failures++; }

    // UI-5.3: zero serious/critical axe violations on every route, in both themes.
    const axe = await new AxeBuilder({ page }).analyze();
    const serious = axe.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    if (serious.length) {
      console.log(`A11Y VIOLATIONS ${theme} ${name} ${r}:`);
      for (const v of serious) {
        console.log(`  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node${v.nodes.length === 1 ? "" : "s"})`);
        for (const node of v.nodes.slice(0, 3)) console.log(`    - ${node.target.join(" ")}`);
      }
      failures++;
    }
  }
  if (errors.length) { console.log(`CONSOLE ERRORS ${theme} ${name}:`, errors); failures++; }
  await ctx.close();
}
await browser.close();
server.kill();
process.exit(failures ? 1 : 0);
