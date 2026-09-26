// UI-7.1 CI e2e: walks the actual demo path (not just static route loads, which scripts/shots.mjs
// already covers) with real assertions on content appearing, plus axe scans at a few interactive
// states. Usage: npm run e2e (package.json: "vite build && node tests/e2e/demo.spec.mjs").
// Written as a bespoke Playwright-core script, matching scripts/shots.mjs's own established
// convention, rather than adding @playwright/test as a new dependency for a single suite (D1 lists
// playwright-core only); see docs/plan/QUESTIONS.md (Phase 7).
import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import AxeBuilder from "@axe-core/playwright";

const exe = process.env.CHROME_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const BASE = "http://localhost:4180";

let failures = 0;
function ok(cond, label) {
  if (cond) {
    console.log(`  ok - ${label}`);
  } else {
    console.log(`  FAIL - ${label}`);
    failures++;
  }
}

async function axeCheck(page, label) {
  const axe = await new AxeBuilder({ page }).analyze();
  const serious = axe.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  ok(serious.length === 0, `axe: zero serious/critical violations (${label})`);
  if (serious.length) for (const v of serious) console.log(`    [${v.impact}] ${v.id}: ${v.help}`);
}

const server = spawn("npx", ["vite", "preview", "--port", "4180", "--strictPort"], { stdio: "ignore" });
await new Promise((r) => setTimeout(r, 2500));

const browser = await chromium.launch({ executablePath: exe, args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1200 } });
const page = await ctx.newPage();
const consoleErrors = [];
page.on("pageerror", (e) => consoleErrors.push(String(e)));
page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));

console.log("Step: Home");
await page.goto(`${BASE}/#/`, { waitUntil: "networkidle" });
await page.waitForTimeout(500);
ok(await page.getByText("Open this case", { exact: false }).first().isVisible(), "an example case card is visible");

console.log("Step: load example case, Classify shows TK proximity");
await page.getByText("Open this case", { exact: false }).first().click();
await page.waitForTimeout(400);
await page.goto(`${BASE}/#/case/classify`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
ok(await page.getByText("Traditional-knowledge proximity", { exact: false }).isVisible(), "TK proximity section heading renders");
await axeCheck(page, "classify with a loaded case");

console.log("Step: Owe shows benefit-share estimate");
await page.goto(`${BASE}/#/case/owe`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
ok(await page.getByText("Benefit sharing", { exact: false }).isVisible(), "benefit sharing section heading renders");
ok(await page.getByText("No payment due", { exact: false }).isVisible(), "the seeded example's ₹2cr turnover computes the nil slab");

console.log("Step: Say checks a claim");
await page.goto(`${BASE}/#/case/say`, { waitUntil: "networkidle" });
await page.waitForTimeout(300);
await page.getByRole("button", { name: "Try a sample advertisement", exact: false }).click();
await page.waitForTimeout(400);
ok(await page.getByText("cures", { exact: false }).first().isVisible().catch(() => false), "the sample claim text renders for checking");

console.log("Step: Kisan mode entry cards");
await page.goto(`${BASE}/#/ask?mode=kisan`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
ok(await page.getByText("I grow", { exact: false }).isVisible(), "Kisan mode's entry cards render");
await axeCheck(page, "kisan mode");

console.log("Step: unmatched question falls back to relevant clauses");
await page.goto(`${BASE}/#/ask`, { waitUntil: "networkidle" });
await page.waitForTimeout(300);
await page.getByLabel("Ask about your Ayurvedic product").fill("a question with no scripted answer at all");
await page.getByRole("button", { name: "Ask", exact: true }).click();
await page.waitForTimeout(1200);
ok(await page.getByText("Relevant clauses", { exact: false }).isVisible(), "relevant-clauses fallback renders for an unmatched question");

console.log("Step: dossier print shows the QR code and appendix");
await page.goto(`${BASE}/#/dossier/print`, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
ok(await page.getByAltText(/QR code/i).isVisible(), "dossier QR code renders");
ok(await page.getByText("Clause appendix", { exact: false }).isVisible(), "clause appendix renders");
await axeCheck(page, "dossier print");

console.log("Step: How it works shows PS coverage and API contract");
await page.goto(`${BASE}/#/how`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
ok(await page.getByRole("heading", { name: "Problem-statement coverage" }).isVisible(), "PS coverage section renders");
ok(await page.getByText("/v1/ask", { exact: false }).isVisible(), "API contract table renders");

ok(consoleErrors.length === 0, "zero console errors across the whole demo path");
if (consoleErrors.length) console.log(consoleErrors);

await ctx.close();
await browser.close();
server.kill();

console.log(`\n${failures === 0 ? "PASS" : "FAIL"}: ${failures} failure(s)`);
process.exit(failures ? 1 : 0);
