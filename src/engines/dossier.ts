import { classify } from "./classify";
import { absDuties } from "./absDuties";
import { claimsCheck } from "./claims";
import { protectionRows } from "../data/protectionRows";
import { encodeCaseForShare } from "../lib/shareLink";
import type { Case } from "../state/case";

/** Every source id cited anywhere in this Case's computed chapters (Classify's pathway rows,
 * Protect's IP rows, Owe's ABS duties, Say's claim findings), for the dossier's clause appendix
 * (MASTER-PLAN UI-6.4). Owe's benefit-share estimate isn't included: it has no reviewed citation
 * yet (docs/plan/QUESTIONS.md, Phase 6). */
export function allCitedSources(kase: Case): string[] {
  const set = new Set<string>();
  const result = classify(kase);
  if (result) {
    for (const r of result.rows) for (const c of r.cites) set.add(c);
    for (const r of protectionRows(result.cat)) for (const c of r.cites) set.add(c);
  }
  const [, absCites] = absDuties(kase);
  for (const c of absCites) set.add(c);
  if (kase.claims[0]?.text) {
    const report = claimsCheck(kase, kase.claims[0].text);
    for (const f of report.findings) set.add(f.rule.cite);
  }
  return [...set];
}

/** SHA-256 hex digest of the same shareable Case payload a share link encodes (UI-3.4's
 * encodeCaseForShare, personal-activity fields excluded), so the dossier's QR code can be checked
 * against tampering (MASTER-PLAN UI-6.4: "a SHA-256 hash of the Case JSON"). */
export async function hashCase(kase: Case): Promise<string> {
  const payload = encodeCaseForShare(kase);
  const bytes = new TextEncoder().encode(payload);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
