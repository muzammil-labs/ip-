import type { Case } from "../state/case";
import { classify } from "../engines/classify";
import { CHAPTER_ORDER, type ChapterSlug } from "./order";

/** Whether each chapter has enough Case data to count as done, shared by Dossier (UI-4.8) and the chapter rail (UI-4.11). */
export function chapterStatus(kase: Case): Record<ChapterSlug, boolean> {
  const classified = !!classify(kase);
  const hasProduct = kase.product.name.trim().length > 0 && kase.formula.length > 0;
  return {
    describe: hasProduct,
    classify: classified,
    protect: classified,
    owe: classified,
    say: kase.claims.length > 0,
    search: kase.formula.length > 0,
    dossier: true,
  };
}

export function chapterGaps(kase: Case): ChapterSlug[] {
  const status = chapterStatus(kase);
  return CHAPTER_ORDER.filter((slug) => slug !== "dossier" && !status[slug]);
}
