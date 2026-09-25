import { SOURCES } from "../data/sources";
import { versionAt } from "./asOf";
import { allCitedSources } from "./dossier";
import { CORPUS_VERSION, type Case } from "../state/case";

export interface ChangedClause {
  sourceId: string;
  fromStatus: string;
  toStatus: string;
}

/** UI-6.9: the clauses a Case cites whose applicable version differs between the corpus as it stood
 * when the Case was saved (`Case.corpusVersion`) and the app's current corpus (`CORPUS_VERSION`).
 * Only sources with real version history (data/sources.ts's `versions[]`, from UI-6.2) can appear
 * here; a source with no version history never "changed" as far as this Case can tell. */
export function changedClausesSince(kase: Case): ChangedClause[] {
  if (kase.corpusVersion === CORPUS_VERSION) return [];
  const caseDate = new Date(kase.corpusVersion);
  const today = new Date(CORPUS_VERSION);
  const out: ChangedClause[] = [];
  for (const id of allCitedSources(kase)) {
    const source = SOURCES[id];
    if (!source?.versions?.length) continue;
    const from = versionAt(source, caseDate);
    const to = versionAt(source, today);
    if (from && to && from !== to) {
      out.push({ sourceId: id, fromStatus: from.status, toStatus: to.status });
    }
  }
  return out;
}

export function changedSourceIdSet(kase: Case): Set<string> {
  return new Set(changedClausesSince(kase).map((c) => c.sourceId));
}
