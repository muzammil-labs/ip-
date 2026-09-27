// UI-5.1: fails if the app's own entry chunk exceeds Part E's 200KB gzip budget.
// Framework/vendor chunks (react, motion, radix) and the MSW mock chunk are tracked
// separately (see docs/plan/QUESTIONS.md, Phase 3) since they are not app code and,
// for MSW, stand in for a backend that does not exist yet. Wired into CI in Phase 7.
import { gzipSync } from "node:zlib";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const BUDGET_BYTES = 200 * 1024;
const assetsDir = join("dist", "assets");

const entryFile = readdirSync(assetsDir).find((f) => /^index-.*\.js$/.test(f));
if (!entryFile) {
  console.error("check-bundle-size: no index-*.js entry chunk found in dist/assets. Run `npm run build` first.");
  process.exit(1);
}

const bytes = readFileSync(join(assetsDir, entryFile));
const gzipBytes = gzipSync(bytes).length;
const gzipKB = (gzipBytes / 1024).toFixed(2);

console.log(`check-bundle-size: ${entryFile} is ${gzipKB}KB gzip (budget: 200KB)`);

if (gzipBytes > BUDGET_BYTES) {
  console.error(`check-bundle-size: FAIL — entry chunk exceeds the 200KB gzip budget.`);
  process.exit(1);
}
