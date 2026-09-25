import { ANSWERS } from "./answers";

/** Vernacular-to-English legal term pairs, reused from the scripted answers' own already-reviewed
 * `gloss` fields (data/answers.ts) rather than a new glossary invented for this task. Used for
 * Hindi/Telugu query expansion in clause search (UI-6.6): a query containing a vernacular term also
 * searches for its English equivalent, since the clause index itself (data/sources.ts) is English. */
export const GLOSSARY: [string, string][] = ANSWERS.flatMap((a) => a.gloss ?? []);

/** Appends the English equivalent of any glossary term found in `query`, deduplicated. */
export function expandQuery(query: string): string {
  const extra = GLOSSARY.filter(([vernacular]) => query.includes(vernacular)).map(([, english]) => english);
  return extra.length ? `${query} ${extra.join(" ")}` : query;
}
