import Describe from "./Describe";
import Classify from "./Classify";
import Protect from "./Protect";
import Owe from "./Owe";
import Say from "./Say";
import Search from "./Search";
import Dossier from "./Dossier";

/** The seven Case chapters (B2), in journey order. Keyed by the #/case/:chapter slug. */
export const CHAPTERS = {
  describe: Describe,
  classify: Classify,
  protect: Protect,
  owe: Owe,
  say: Say,
  search: Search,
  dossier: Dossier,
} as const;

export type ChapterSlug = keyof typeof CHAPTERS;

export const CHAPTER_ORDER: ChapterSlug[] = ["describe", "classify", "protect", "owe", "say", "search", "dossier"];
