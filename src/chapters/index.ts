import { lazy } from "react";
import { CHAPTER_ORDER, type ChapterSlug } from "./order";

/** The seven Case chapters (B2), in journey order. Keyed by the #/case/:chapter slug.
 * Lazy so each chapter's own dependencies (Radix, DataTable) split out of the main
 * bundle, same as the top-level pages in app/routes.tsx (Part E's 200KB gzip budget). */
export const CHAPTERS = {
  describe: lazy(() => import("./Describe")),
  classify: lazy(() => import("./Classify")),
  protect: lazy(() => import("./Protect")),
  owe: lazy(() => import("./Owe")),
  say: lazy(() => import("./Say")),
  search: lazy(() => import("./Search")),
  dossier: lazy(() => import("./Dossier")),
} as const;

export { CHAPTER_ORDER };
export type { ChapterSlug };
