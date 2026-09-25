import MiniSearch from "minisearch";
import { SOURCES } from "../data/sources";
import { expandQuery } from "../data/glossary";

interface ClauseDoc {
  id: string;
  text: string;
  act: string;
  jur: string;
}

/** UI-6.6 clause retrieval: one document per data/sources.ts entry. The demo corpus's entries are
 * already short, single-clause summaries/excerpts (not long instrument text), so each source is
 * itself one chunk; a separate data/chunks.json splitting longer text was not needed at this scale.
 * See docs/plan/QUESTIONS.md (Phase 6) for the reasoning. */
const docs: ClauseDoc[] = Object.entries(SOURCES).map(([id, s]) => ({
  id,
  text: [s.t, s.act, s.section, s.excerpt, s.summary].filter(Boolean).join(" "),
  act: s.act ?? s.t,
  jur: s.jur,
}));

const index = new MiniSearch<ClauseDoc>({
  idField: "id",
  fields: ["text"],
  storeFields: ["id", "act", "jur"],
});
index.addAll(docs);

export interface ClauseHit {
  id: string;
  act: string;
  jur: string;
  score: number;
}

interface SearchRequest {
  query: string;
}

interface SearchResponse {
  results: ClauseHit[];
}

self.onmessage = (event: MessageEvent<SearchRequest>) => {
  const expanded = expandQuery(event.data.query);
  const hits = index.search(expanded, { prefix: true, fuzzy: 0.2 });
  const results: ClauseHit[] = hits.map((h) => ({ id: String(h.id), act: h.act as string, jur: h.jur as string, score: h.score }));
  const response: SearchResponse = { results };
  self.postMessage(response);
};
