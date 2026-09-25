import { CORPUS_VERSION, type Case } from "../state/case";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function base(overrides: Omit<Case, "id" | "createdAt" | "corpusVersion" | "audit" | "asOf">): Case {
  const now = new Date().toISOString();
  return {
    id: `example_${overrides.product.name}`,
    createdAt: now,
    corpusVersion: CORPUS_VERSION,
    audit: [{ time: now, ev: "Example case loaded", detail: overrides.product.name }],
    asOf: today(),
    ...overrides,
  };
}

/** A startup's new supercritical-CO2 extraction process. Real patent potential, real ABS duties. */
export function ashwaExtractExample(): Case {
  return base({
    product: {
      name: "Ashwagandha root extract (CO₂)",
      description: "A standardised root extract made with a new supercritical CO₂ extraction process, sold as a capsule.",
      form: "capsule",
    },
    formula: [{ plant: { name: "Ashwagandha", botanicalName: "Withania somnifera" }, part: "root" }],
    answers: { use: "med", text: "new", frac: "no", src: "cult", ent: "in" },
    persona: "startup",
    markets: ["IN", "US"],
    turnoverCr: 2,
    claims: [],
    questions: [],
    consent: [],
  });
}

/** A vaidya's classical formula with one addition: saffron, itself a classical ingredient, moves it from classical to proprietary. */
export function chyawanprashSaffronExample(): Case {
  return base({
    product: {
      name: "Chyawanprash with saffron",
      description: "Chyawanprash made per the classical formula with saffron (kesar) added for flavour.",
      form: "other",
    },
    formula: [
      { plant: { name: "Amla", botanicalName: "Phyllanthus emblica" }, part: "fruit" },
      { plant: { name: "Saffron", botanicalName: "Crocus sativus" }, part: "stigma" },
    ],
    answers: { use: "med", text: "ingr", src: "cult", ent: "in" },
    persona: "vaidya",
    markets: ["IN"],
    turnoverCr: 0.5,
    claims: [],
    questions: [],
    consent: [],
  });
}

/** A grower in Hindi, selling cultivated raw material to a manufacturer: exempt from prior intimation, not deciding a drug category. */
export function farmerAshwaExample(): Case {
  return base({
    product: {
      name: "अश्वगंधा (जड़)",
      description: "मैं अश्वगंधा की खेती करता हूँ और एक कंपनी को कच्चा माल बेचता हूँ।",
    },
    formula: [{ plant: { name: "अश्वगंधा", botanicalName: "Withania somnifera" }, part: "जड़" }],
    answers: { src: "cult", ent: "grow" },
    persona: "farmer",
    markets: ["IN"],
    claims: [],
    questions: [],
    consent: [],
  });
}

/** UI-6.9: saved before the Biological Diversity (Amendment) Act, 2023's provisions took effect
 * (1 Apr 2024), so the pre-amendment bda-6/bda-7 versions applied when this Case was made. Loading
 * it now, against the current corpus, demonstrates the law-changed banner and the Shift highlight
 * on the affected Owe/Protect rows. */
export function wildHarvestPreAmendmentExample(): Case {
  const now = new Date().toISOString();
  return {
    id: "example_wild-harvest-2024",
    createdAt: now,
    corpusVersion: "2024-01-01",
    product: {
      name: "Wild-harvested Ashwagandha capsule",
      description: "A capsule made from wild-collected Ashwagandha root, sold by an Indian company.",
      form: "capsule",
    },
    formula: [{ plant: { name: "Ashwagandha", botanicalName: "Withania somnifera" }, part: "root" }],
    answers: { use: "med", text: "ingr", src: "wild", ent: "in" },
    persona: "startup",
    markets: ["IN"],
    turnoverCr: 8,
    claims: [],
    questions: [],
    consent: [],
    audit: [{ time: now, ev: "Example case loaded", detail: "Wild-harvested Ashwagandha capsule" }],
    asOf: "2024-01-01",
  };
}

export interface ExampleCase {
  key: string;
  titleKey: string;
  descKey: string;
  build: () => Case;
}

/** Home's example cards. Choosing one dispatches loadExample with build(). */
export const EXAMPLES: ExampleCase[] = [
  { key: "ashwa-extract", titleKey: "example0title", descKey: "example0desc", build: ashwaExtractExample },
  { key: "chyawan-saffron", titleKey: "example1title", descKey: "example1desc", build: chyawanprashSaffronExample },
  { key: "farmer-ashwa", titleKey: "example2title", descKey: "example2desc", build: farmerAshwaExample },
  { key: "wild-harvest-2024", titleKey: "example3title", descKey: "example3desc", build: wildHarvestPreAmendmentExample },
];
