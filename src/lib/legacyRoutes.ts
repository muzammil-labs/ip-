/** The pre-Phase-3 screen keys, kept only as a lookup into the real B2 routes below:
 * data/coverage.ts's PS-coverage table still groups by these, and AskPage links out
 * with them (SCREEN_ROUTE.classify). */
export type LegacyScreen = "overview" | "ask" | "classify" | "tk" | "claims" | "sources" | "trust" | "blueprint";

/** Maps each pre-Phase-3 Screen key to its real B2 hash route. */
export const SCREEN_ROUTE: Record<LegacyScreen, string> = {
  overview: "/",
  ask: "/ask",
  classify: "/case/classify",
  tk: "/case/search",
  claims: "/case/say",
  sources: "/library",
  trust: "/how",
  blueprint: "/how",
};
