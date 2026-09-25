import { CAT } from "./classifyCategories";
import { categoryOf, nextSteps } from "../engines/classify";
import type { Case } from "../state/case";

export interface ExaminerRule {
  id: string;
  /** Cite ids in SOURCES for the objection currently shown; empty while content is pending review. */
  cites(kase: Case): string[];
  /** Empty string while the ground has no reviewed objection text yet (see docs/plan/QUESTIONS.md). */
  objection(kase: Case): string;
  evidenceNeeded(kase: Case): string[];
  trigger(kase: Case): boolean;
  satisfiedBy(kase: Case): boolean;
}

/** First Examination Report order: Section 3(p)/3(d)/3(e)/3(i) exclusions, then Section 10(4) disclosure and
 * Section 25 opposition grounds. Every objection and evidence line below is reused verbatim from content the
 * team already reviewed (data/classifyCategories.ts's own patent/evidence rows, engines/classify.ts's
 * nextSteps(), or the scripted answer at data/answers.ts's q1.in.pts[3]): the executing model writes only the
 * structure and the triggers, per the master plan's UI-6.7 rule, and never authors new legal statements.
 * Sections 3(e) (admixture without synergy) and 3(i) (method of treatment) have no reviewed citation in the
 * corpus yet, so they render with no objection text until the patent agent supplies one; see QUESTIONS.md. */
export const EXAMINER_RULES: ExaminerRule[] = [
  {
    id: "3p",
    cites: (kase) => {
      const cat = categoryOf(kase.answers);
      return cat ? CAT[cat].rows.patent[1] : [];
    },
    objection: (kase) => {
      const cat = categoryOf(kase.answers);
      return cat ? CAT[cat].rows.patent[0] : "";
    },
    evidenceNeeded: (kase) => {
      const cat = categoryOf(kase.answers);
      if (!cat) return [];
      return nextSteps(cat, kase.answers).filter((s) => s.includes("book reference") || s.includes("prior-art search"));
    },
    trigger: (kase) => {
      const cat = categoryOf(kase.answers);
      return !!cat && CAT[cat].rows.patent[1].includes("pa-3p");
    },
    // Every category that cites pa-3p (classical, pp, aahara, cosmetic) is, by its own classify-engine
    // definition, built from known ingredients or a codified formula: the Case model has no field that
    // could honestly flip this to "answered" without changing the category itself, so it never claims done.
    satisfiedBy: () => false,
  },
  {
    id: "3d",
    cites: () => ["pa-3d"],
    objection: () =>
      "If the result is only a new form of a known extract, you will need data showing enhanced therapeutic efficacy over the known form.",
    evidenceNeeded: (kase) => {
      const cat = categoryOf(kase.answers);
      if (!cat) return [];
      return [CAT[cat].rows.evidence[0]];
    },
    trigger: (kase) => {
      const cat = categoryOf(kase.answers);
      return !!cat && CAT[cat].rows.patent[1].includes("pa-3d");
    },
    satisfiedBy: (kase) => categoryOf(kase.answers) === "phyto",
  },
  {
    id: "3e",
    cites: () => [],
    objection: () => "",
    evidenceNeeded: () => [],
    trigger: () => false,
    satisfiedBy: () => false,
  },
  {
    id: "3i",
    cites: () => [],
    objection: () => "",
    evidenceNeeded: () => [],
    trigger: () => false,
    satisfiedBy: () => false,
  },
  {
    id: "10-25",
    cites: () => ["pa-10", "pa-25"],
    objection: () =>
      "Your specification must name the source and geographical origin of the plant material; omitting it is a ground for opposition.",
    evidenceNeeded: () => ["The source and geographical origin of the plant material, named in the specification"],
    trigger: (kase) => kase.formula.length > 0,
    satisfiedBy: (kase) => kase.formula.every((f) => !!f.plant.botanicalName),
  },
];

export function objectionsFor(kase: Case): ExaminerRule[] {
  return EXAMINER_RULES.filter((r) => r.trigger(kase));
}
