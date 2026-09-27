import { CAT } from "../data/classifyCategories";
import { ROWNAME } from "../data/constants";
import { CLAIM_RULES } from "../data/claimRules";
import { CAT_RULES } from "../data/claimCategoryRules";
import { ANSWERS } from "../data/answers";
import { protectionRows } from "../data/protectionRows";

export interface CitedInEntry {
  label: string;
}

/** Scans the corpus for every place a source id is cited, for SourcePage's "Cited in" list. Cheap: runs once per page view over a small, static corpus. */
export function citedIn(sourceId: string): CitedInEntry[] {
  const out: CitedInEntry[] = [];

  for (const [catKey, def] of Object.entries(CAT)) {
    for (const [rowKey, [, cites]] of Object.entries(def.rows)) {
      if (cites.includes(sourceId)) out.push({ label: `Classify: ${def.name}, ${ROWNAME[rowKey] ?? rowKey}` });
    }
    for (const row of protectionRows(catKey)) {
      if (row.cites.includes(sourceId) && !out.some((e) => e.label === `Protect: ${def.name}, ${row.ip}`)) {
        out.push({ label: `Protect: ${def.name}, ${row.ip}` });
      }
    }
  }

  for (const rule of CLAIM_RULES) {
    if (rule.cite === sourceId) out.push({ label: "Say: claim check rule" });
  }
  for (const rule of Object.values(CAT_RULES)) {
    if (rule.cite === sourceId) out.push({ label: "Say: claim check rule" });
  }

  for (const a of ANSWERS) {
    const cited = [...(a.in?.pts ?? []), ...(a.intl?.pts ?? [])].some((p) => p.c.includes(sourceId));
    if (cited) out.push({ label: `Ask: "${a.q}"` });
  }

  return out;
}
