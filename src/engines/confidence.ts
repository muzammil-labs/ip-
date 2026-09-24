import { SOURCES } from "../data/sources";
import type { Answer, Confidence } from "../lib/types";

/** Lowest tier number (0 = primary law) among a point's citations. Uncited points count as tier 4 (weakest). */
function bestTier(cites: string[]): number {
  return cites.length ? Math.min(...cites.map((c) => SOURCES[c]?.tier ?? 4)) : 4;
}

/**
 * Confidence is derived from the evidence itself, never self-reported by the model.
 * Three factors (authority, coverage, agreement) are each leveled 1-3; the overall
 * score is the minimum of the three, so a single weak factor caps the whole answer.
 */
export function computeConfidence(a: Answer): Confidence {
  const pts = [...(a.in?.pts || []), ...(a.intl?.pts || [])];
  const n = pts.length || 1;
  const strong = pts.filter((p) => bestTier(p.c) <= 1).length;
  const ver = pts.filter((p) => p.s === "V").length;
  const conf = pts.filter((p) => p.s === "C").length;
  const lvl = (x: number) => (x >= 0.8 ? 3 : x >= 0.5 ? 2 : 1);
  const auth = lvl(strong / n);
  const cov = lvl(ver / n);
  const agr = conf === 0 ? 3 : conf === 1 && pts.length >= 4 ? 2 : 1;
  const overall = Math.min(auth, cov, agr);
  return { auth, cov, agr, overall, strong, ver, conf, n: pts.length };
}
