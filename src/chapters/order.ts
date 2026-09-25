/** The seven Case chapter slugs, in journey order (B2). Kept separate from index.ts's
 * lazy CHAPTERS map so chapters can import the order/slugs without a circular import. */
export type ChapterSlug = "describe" | "classify" | "protect" | "owe" | "say" | "search" | "dossier";

export const CHAPTER_ORDER: ChapterSlug[] = ["describe", "classify", "protect", "owe", "say", "search", "dossier"];
