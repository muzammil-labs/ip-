import { CAT } from "./classifyCategories";

export type ProtectionIp = "patent" | "trademark" | "design" | "copyright" | "gi" | "ppvfr" | "tradeSecret";
export type ProtectionStrength = "strong" | "limited" | "none";

export interface ProtectionRow {
  ip: ProtectionIp;
  strength: ProtectionStrength;
  text: string;
  cites: string[];
}

/**
 * The seven IP rows for Chapter 3 Protect, one set per classify category. Patent reuses
 * CAT[cat].rows.patent verbatim (already vetted in Phase 0/1). The other six are new,
 * conservative restructuring of facts already in the corpus (trade mark, design and
 * copyright text mirrors CAT[cat].rows.other; GI, PPV&FR and trade secret are general
 * and do not vary by category, since none of them turn on the classify pathway). Logged
 * in QUESTIONS.md for a human legal reviewer to confirm the strength calls.
 */
const PATENT_STRENGTH: Record<string, ProtectionStrength> = {
  classical: "none",
  pp: "limited",
  newasu: "strong",
  phyto: "strong",
  aahara: "limited",
  cosmetic: "limited",
};

export function protectionRows(cat: string): ProtectionRow[] {
  const def = CAT[cat];
  const [patentText, patentCites] = def.rows.patent;
  return [
    { ip: "patent", strength: PATENT_STRENGTH[cat] ?? "limited", text: patentText, cites: patentCites },
    { ip: "trademark", strength: "strong", text: "Your brand name, logo and trade dress can be registered regardless of category.", cites: ["tm-1999"] },
    { ip: "design", strength: "strong", text: "A distinctive container, bottle or pack shape can be registered if it is new.", cites: ["des-2000"] },
    { ip: "copyright", strength: "strong", text: "Label artwork and product literature are protected automatically, from creation.", cites: ["cr-1957"] },
    { ip: "gi", strength: "none", text: "Geographical indications are registered by producer associations for goods tied to a region, not by a single manufacturer for its own product.", cites: ["gi-1999"] },
    { ip: "ppvfr", strength: "none", text: "Applies to a new, bred plant variety, not to an extract or formulation made from an existing plant.", cites: ["ppvfr"] },
    { ip: "tradeSecret", strength: "limited", text: "Manufacturing know-how can be kept confidential, but India has no dedicated trade-secret statute; protection relies on contracts and confidentiality obligations.", cites: [] },
  ];
}
