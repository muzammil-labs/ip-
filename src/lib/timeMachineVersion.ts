import { SOURCES } from "../data/sources";
import { versionAt } from "../engines/asOf";

export function hasVersions(sourceId: string): boolean {
  return !!SOURCES[sourceId]?.versions?.length;
}

/** The first cited source (if any) that carries UI-6.2 version history. */
export function findVersionedCite(cites: string[]): string | null {
  return cites.find(hasVersions) ?? null;
}

export interface VersionStatus {
  sourceId: string;
  status: string;
  note?: string;
  /** True when the time machine is set to a date whose status differs from today's. */
  changed: boolean;
}

/** For an EvidenceRow's citations: the applicable version as of `asOfDate` (null = today), if any of the
 * citations carries version history. Used to add a "status as of {date}" line and Shift the row when the
 * time machine's date makes the applicable status different from today's (UI-6.2). */
export function versionStatusFor(cites: string[], asOfDate: string | null): VersionStatus | null {
  const sourceId = findVersionedCite(cites);
  if (!sourceId) return null;
  const source = SOURCES[sourceId];
  const version = versionAt(source, asOfDate ? new Date(asOfDate) : new Date());
  if (!version) return null;
  const todayVersion = versionAt(source, new Date());
  return { sourceId, status: version.status, note: version.note, changed: !!asOfDate && version.status !== todayVersion?.status };
}
