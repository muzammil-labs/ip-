import { CAT } from "../data/classifyCategories";
import { SOURCES } from "../data/sources";
import { ROWNAME } from "../data/constants";
import type { ClassifyState } from "./types";

export function categoryOf(c: ClassifyState): string | null {
  if (c.use === "food") return "aahara";
  if (c.use === "cos") return "cosmetic";
  if (c.use === "med") {
    if (c.text === "exact") return "classical";
    if (c.text === "ingr") return "pp";
    if (c.text === "new" && c.frac) return c.frac === "yes" ? "phyto" : "newasu";
  }
  return null;
}

export function absOf(c: ClassifyState, cat: string | null): [string, string[]] {
  if (!c.src || !c.ent) return ["Answer the last two questions to see your duties.", []];
  if (c.src === "imp")
    return [
      "BD Act access duties attach to resources from India. For imported material, follow the source country's access law under the Nagoya Protocol and keep your import papers.",
      ["nagoya"],
    ];
  let t: string;
  let cs: string[];
  if (c.ent === "fr") {
    t = "Prior NBA approval is needed before accessing the resource and before applying for any IPR.";
    cs = ["bda-6"];
  } else if (c.ent === "grow") {
    t = "Growers and local communities are exempt from prior intimation to the State Biodiversity Board.";
    cs = ["bda-7"];
  } else if (c.ent === "prac") {
    t = "Registered practitioners practising for their livelihood are exempt from SBB intimation; manufacturing for wider sale may still need it.";
    cs = ["bda-7"];
  } else if (c.src === "cult") {
    t = "Cultivated medicinal plants are exempt from SBB intimation; keep a certificate of origin from the Biodiversity Management Committee. Register with the NBA before any IPR is granted.";
    cs = ["bda-7", "bda-6"];
  } else {
    t = "Give prior intimation to the State Biodiversity Board before commercial use; benefit sharing may apply. Register with the NBA before any IPR is granted.";
    cs = ["bda-7", "bda-6"];
  }
  if (cat === "classical" && c.ent !== "fr") t = "Codified traditional knowledge from the First Schedule books is itself exempt. " + t;
  if (c.src === "mic") {
    t += " If a patent claims the strain, deposit it under the Budapest Treaty.";
    cs = [...cs, "budapest"];
  }
  return [t, cs];
}

export function meterColor(level: number, polarity: "good" | "risk"): string {
  if (polarity === "risk") return level === 3 ? "var(--kumkum)" : level === 2 ? "var(--turmeric)" : "var(--brand)";
  return level === 3 ? "var(--brand)" : level === 2 ? "var(--turmeric)" : "var(--kumkum)";
}

const SHORT_CITE: Record<string, string> = {
  "pa-3p": "PA 3(p)", "pa-2": "PA 2(1)(j)", "pa-3d": "PA 3(d)", "pa-25": "PA 25",
  "dca-3a": "D&C 3(a)", "dca-3h": "D&C 3(h)", "dr-158b": "R.158B", "dr-2eb": "R.2(eb)",
  "bda-6": "BDA 6", "bda-7": "BDA 7", "tm-1999": "TM Act", "des-2000": "Designs",
  "cr-1957": "Copyright", "tkdl": "TKDL", "dmr-3": "DMR 3", "dmr-4": "DMR 4",
  "dr-170": "R.170", "ccpa": "CCPA", "fssai-aa": "FSSAI AA", "cos-2020": "Cos. Rules",
  "nagoya": "Nagoya", "budapest": "Budapest",
};
export function shortCite(id: string): string {
  return SHORT_CITE[id] || "src";
}

export function nextSteps(cat: string, c: ClassifyState): string[] {
  const s: string[] = [];
  if (cat === "classical") s.push("Record the exact book reference for the formula");
  if (["newasu", "phyto", "pp"].includes(cat)) s.push("Run a prior-art search, including TKDL, before disclosing anything publicly");
  if (["newasu", "phyto"].includes(cat)) s.push("Consider a provisional patent application to secure a filing date");
  if (c.ent === "fr") s.push("Apply to the NBA for prior approval before access");
  else if (c.src === "wild") s.push("File prior intimation with your State Biodiversity Board");
  else if (c.src === "cult") s.push("Obtain a certificate of origin from the local Biodiversity Management Committee");
  s.push("File your trade mark before launch");
  s.push(
    cat === "aahara"
      ? "Apply for FSSAI approval"
      : cat === "cosmetic"
        ? "Complete registration under the Cosmetics Rules"
        : cat === "phyto"
          ? "Plan the CDSCO new-drug submission"
          : "Apply for the ASU manufacturing licence"
  );
  s.push("Check label and ad text in Claim check");
  return s;
}

export interface ClassifyRow {
  key: string;
  label: string;
  text: string;
  cites: string[];
  changedFrom: string | null;
}

export interface ClassifyResult {
  cat: string;
  def: (typeof CAT)[string];
  rows: ClassifyRow[];
  changedLabels: string[];
  categoryChanged: boolean;
}

/** Recomputes the full pathway result, diffing against the previous result so "what changed" is honest and incremental. */
export function buildResult(c: ClassifyState, prev: { cat: string; rowsByKey: Record<string, string> } | null): ClassifyResult | null {
  const cat = categoryOf(c);
  if (!cat) return null;
  const def = CAT[cat];
  const rawRows: Record<string, [string, string[]]> = { ...def.rows, abs: absOf(c, cat) };
  const changedLabels: string[] = [];
  const rows: ClassifyRow[] = Object.keys(ROWNAME).map((k) => {
    const [txt, cs] = rawRows[k];
    const was = prev && prev.rowsByKey[k] && prev.rowsByKey[k] !== txt ? prev.rowsByKey[k] : null;
    if (was) changedLabels.push(ROWNAME[k]);
    return { key: k, label: ROWNAME[k], text: txt, cites: cs, changedFrom: was };
  });
  return { cat, def, rows, changedLabels, categoryChanged: !!prev && prev.cat !== cat };
}

export function sourceTitle(id: string): string {
  return SOURCES[id]?.t ?? id;
}
