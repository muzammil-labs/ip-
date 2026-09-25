export interface FormulationRef {
  slug: string;
  name: string;
  /** Plant slug (data/plants.ts) weighted 2 in the Jaccard score; every other ingredient is weighted 1. */
  primary: string;
  /** Plant slugs, including primary. */
  ingredients: string[];
  /** Set once the team's AIIA contact has checked this entry's ingredient list and citation against the AFI. */
  reviewed: boolean;
  citation?: { book: string; chapter: string };
}

/** UI-6.1: a small demonstration set built only from the app's 9 demo plants (data/plants.ts), for the TK
 * proximity check. Content rule (MASTER-PLAN UI-6.1): a real entry needs book and chapter from the Ayurvedic
 * Formulary of India and sign-off from the team's AIIA contact before the demo. None of these are reviewed yet,
 * so `citation` is left unset and every card shows a "Review pending" chip instead of an invented page number.
 * See docs/plan/QUESTIONS.md (Phase 6) for why the executing model did not write citation text itself. */
export const FORMULATIONS: FormulationRef[] = [
  { slug: "chyawanprash", name: "Chyawanprash", primary: "amla", ingredients: ["amla", "guduchi", "ashwagandha"], reviewed: false },
  { slug: "ashwagandharishta", name: "Ashwagandharishta", primary: "ashwagandha", ingredients: ["ashwagandha", "guduchi"], reviewed: false },
  { slug: "brahmi-ghrita", name: "Brahmi Ghrita", primary: "brahmi", ingredients: ["brahmi", "shatavari"], reviewed: false },
  { slug: "shatavari-rasayana", name: "Shatavari Rasayana", primary: "shatavari", ingredients: ["shatavari", "ashwagandha"], reviewed: false },
  { slug: "nimba-compound", name: "Nimba compound (skin)", primary: "neem", ingredients: ["neem", "turmeric", "tulsi"], reviewed: false },
  { slug: "kesar-turmeric-paste", name: "Kesar-turmeric paste", primary: "saffron", ingredients: ["saffron", "turmeric"], reviewed: false },
];
