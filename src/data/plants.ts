export interface PlantEntry {
  slug: string;
  botanicalName: string;
  names: Partial<Record<"en" | "hi" | "te" | "sa", string>>;
}

/** Demo plants (C6): the 8 named for botanical plates, plus Saffron (used in the Chyawanprash example's formula). */
export const PLANTS: PlantEntry[] = [
  { slug: "ashwagandha", botanicalName: "Withania somnifera", names: { en: "Ashwagandha", hi: "अश्वगंधा", te: "అశ్వగంధ", sa: "Aśvagandhā" } },
  { slug: "amla", botanicalName: "Phyllanthus emblica", names: { en: "Amla", hi: "आंवला", te: "ఉసిరి", sa: "Āmalakī" } },
  { slug: "tulsi", botanicalName: "Ocimum tenuiflorum", names: { en: "Tulsi", hi: "तुलसी", te: "తులసి", sa: "Tulasī" } },
  { slug: "turmeric", botanicalName: "Curcuma longa", names: { en: "Turmeric", hi: "हल्दी", te: "పసుపు", sa: "Haridrā" } },
  { slug: "brahmi", botanicalName: "Bacopa monnieri", names: { en: "Brahmi", hi: "ब्राह्मी", te: "బ్రాహ్మి", sa: "Brāhmī" } },
  { slug: "guduchi", botanicalName: "Tinospora cordifolia", names: { en: "Guduchi", hi: "गिलोय", te: "తిప్పతీగ", sa: "Guḍūcī" } },
  { slug: "shatavari", botanicalName: "Asparagus racemosus", names: { en: "Shatavari", hi: "शतावरी", te: "పిల్లి తీగ", sa: "Śatāvarī" } },
  { slug: "neem", botanicalName: "Azadirachta indica", names: { en: "Neem", hi: "नीम", te: "వేప", sa: "Nimba" } },
  { slug: "saffron", botanicalName: "Crocus sativus", names: { en: "Saffron", hi: "केसर", te: "కుంకుమ పువ్వు" } },
];

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

/** Exact match across botanical name, Hindi, Telugu, Sanskrit and common name, for any script the user typed. */
export function resolvePlant(query: string): PlantEntry | null {
  const q = normalize(query);
  if (!q) return null;
  return (
    PLANTS.find((p) => normalize(p.botanicalName) === q || Object.values(p.names).some((n) => n && normalize(n) === q)) ?? null
  );
}

/** Substring search across every name field, for a type-ahead list. */
export function searchPlants(query: string, limit = 6): PlantEntry[] {
  const q = normalize(query);
  if (!q) return [];
  return PLANTS.filter(
    (p) => normalize(p.botanicalName).includes(q) || Object.values(p.names).some((n) => n && normalize(n).includes(q))
  ).slice(0, limit);
}
