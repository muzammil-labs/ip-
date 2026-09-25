import { SOURCES } from "../data/sources";
import type { Source, SourceEvent, SourceVersion } from "../lib/types";

/** Parses "YYYY", "YYYY-MM" or "YYYY-MM-DD" into a comparable timestamp. A missing month or day is
 * treated as the start of that period (MASTER-PLAN UI-6.2: dates may be shown without a day). */
function parseDate(d: string): number {
  const [y, m = 1, day = 1] = d.split("-").map(Number);
  return new Date(y, m - 1, day).getTime();
}

/** The version of `source` that applies on `asOf`, or null if the source has no version history.
 * If `asOf` falls outside every window (before the first version's start, since the last version has
 * no `to` and always matches any later date), falls back to the nearest end: the first version for a
 * date before it began, otherwise the last. */
export function versionAt(source: Source | undefined, asOf: Date): SourceVersion | null {
  if (!source?.versions?.length) return null;
  const t = asOf.getTime();
  const hit = source.versions.find((v) => t >= parseDate(v.from) && t < (v.to ? parseDate(v.to) : Infinity));
  if (hit) return hit;
  return t < parseDate(source.versions[0].from) ? source.versions[0] : source.versions[source.versions.length - 1];
}

export function versionAtId(sourceId: string, asOf: Date): SourceVersion | null {
  return versionAt(SOURCES[sourceId], asOf);
}

/** True once a source's applicable version status reads as some form of "in force". */
export function isInForceAt(sourceId: string, asOf: Date): boolean {
  const v = versionAtId(sourceId, asOf);
  const status = (v?.status ?? SOURCES[sourceId]?.status ?? "").toLowerCase();
  return status.includes("in force");
}

/** Every event across the given sources, sorted oldest first, each carrying its source id. */
export function eventsFor(sourceIds: string[]): (SourceEvent & { sourceId: string })[] {
  return sourceIds
    .flatMap((id) => (SOURCES[id]?.events ?? []).map((e) => ({ ...e, sourceId: id })))
    .sort((a, b) => parseDate(a.date) - parseDate(b.date));
}

/** Fraction (0 to 1) of the way from `start` to `end` that `date` falls at, clamped to the range.
 * Used to place a date or event tick along the time machine's track. */
export function fractionBetween(date: string | Date, start: Date, end: Date): number {
  const t = typeof date === "string" ? parseDate(date) : date.getTime();
  const span = end.getTime() - start.getTime();
  if (span <= 0) return 0;
  return Math.min(1, Math.max(0, (t - start.getTime()) / span));
}

export { parseDate };
