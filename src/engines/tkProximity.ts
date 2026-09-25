import { resolvePlant } from "../data/plants";
import { FORMULATIONS, type FormulationRef } from "../data/formulations";
import type { FormulaItem } from "../state/case";

export type TkReading = "classical" | "proprietary" | "newAsu";

export interface TkMatch {
  formulation: FormulationRef;
  /** Weighted Jaccard, 0 to 1. */
  score: number;
  shared: string[];
  caseOnly: string[];
  formulationOnly: string[];
  reading: TkReading;
}

/** Resolves each formula item to a known demo plant slug (data/plants.ts); items that don't resolve
 * (not in the small demo plant set) are dropped, since there is nothing to score them against. */
function resolveSlugs(formula: FormulaItem[]): Set<string> {
  const slugs = new Set<string>();
  for (const item of formula) {
    const plant = resolvePlant(item.plant.botanicalName || item.plant.name);
    if (plant) slugs.add(plant.slug);
  }
  return slugs;
}

/** Each ingredient's weight is 2 for the formulation's own primary ingredient, 1 for every other
 * ingredient in the union of the Case's formula and the formulation (MASTER-PLAN UI-6.1: "the formula's
 * primary ingredient weight 2, others 1"). Weighted Jaccard = shared weight over total weight. */
function ingredientWeight(slug: string, formulation: FormulationRef): number {
  return slug === formulation.primary ? 2 : 1;
}

function weightedJaccard(caseSlugs: Set<string>, formulation: FormulationRef): number {
  const inFormulation = (slug: string) => formulation.ingredients.includes(slug);
  const all = new Set<string>([...caseSlugs, ...formulation.ingredients]);
  let sharedWeight = 0;
  let totalWeight = 0;
  for (const slug of all) {
    const w = ingredientWeight(slug, formulation);
    totalWeight += w;
    if (caseSlugs.has(slug) && inFormulation(slug)) sharedWeight += w;
  }
  return totalWeight === 0 ? 0 : sharedWeight / totalWeight;
}

function setEquals(a: Set<string>, b: string[]): boolean {
  if (a.size !== b.length) return false;
  return b.every((x) => a.has(x));
}

/** Legal reading, MASTER-PLAN UI-6.1: an exact ingredient-set match reads as classical (Patents Act
 * §3(p), traditional-knowledge bar). A 0.6+ overlap with real changes reads as potentially proprietary,
 * needing synergy data (Patents Act §3(e), not yet in this corpus; see docs/plan/QUESTIONS.md). Anything
 * lower reads as a possible new ASU drug, worth a TKDL search before relying on that. */
function readingFor(exactMatch: boolean, score: number): TkReading {
  if (exactMatch) return "classical";
  if (score >= 0.6) return "proprietary";
  return "newAsu";
}

/** Top matches (default 3) between the Case's formula and the reference formulation set, by weighted
 * Jaccard score, highest first. Returns [] if the Case has no ingredients this app's small demo plant
 * set can resolve. */
export function computeTkMatches(formula: FormulaItem[], formulations: FormulationRef[] = FORMULATIONS, limit = 3): TkMatch[] {
  const caseSlugs = resolveSlugs(formula);
  if (caseSlugs.size === 0) return [];

  const matches: TkMatch[] = formulations.map((formulation) => {
    const score = weightedJaccard(caseSlugs, formulation);
    const shared = formulation.ingredients.filter((i) => caseSlugs.has(i));
    const caseOnly = [...caseSlugs].filter((s) => !formulation.ingredients.includes(s));
    const formulationOnly = formulation.ingredients.filter((i) => !caseSlugs.has(i));
    const exactMatch = setEquals(caseSlugs, formulation.ingredients);
    return { formulation, score, shared, caseOnly, formulationOnly, reading: readingFor(exactMatch, score) };
  });

  return matches.sort((a, b) => b.score - a.score).slice(0, limit);
}
