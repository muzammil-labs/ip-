import type { Case } from "../state/case";
import { classify } from "../engines/classify";
import { absDuties } from "../engines/absDuties";
import { protectionRows } from "../data/protectionRows";
import { claimsCheck } from "../engines/claims";

/** Every unique clause id cited by the Case's current state, for the chapter rail's evidence spine (UI-4.11). */
export function evidenceSpine(kase: Case): string[] {
  const ids = new Set<string>();
  const result = classify(kase);

  if (result) {
    for (const row of result.rows) for (const c of row.cites) ids.add(c);
    for (const row of protectionRows(result.cat)) for (const c of row.cites) ids.add(c);
  }

  const [, absCites] = absDuties(kase);
  for (const c of absCites) ids.add(c);

  if (kase.claims[0]?.text) {
    const report = claimsCheck(kase, kase.claims[0].text);
    for (const f of report.findings) ids.add(f.rule.cite);
  }

  return [...ids];
}
