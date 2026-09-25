import type { Screen } from "../state/store";

/**
 * Maps the pre-Phase-3 Screen keys to their real B2 hash routes, for the old screens'
 * remaining internal navigation buttons (and the guided tour) until Phase 4 rebuilds
 * them as chapters/pages that link directly.
 */
export const SCREEN_ROUTE: Record<Screen, string> = {
  overview: "/",
  ask: "/ask",
  classify: "/case/classify",
  tk: "/case/search",
  claims: "/case/say",
  sources: "/library",
  trust: "/how",
  blueprint: "/how",
};
