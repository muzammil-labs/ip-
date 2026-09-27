import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import type { Case } from "../state/case";

/** Encodes a Case without its audit log (or consent ledger, both personal-activity records) for sharing in a URL. */
export function encodeCaseForShare(kase: Case): string {
  const { audit: _audit, consent: _consent, ...shareable } = kase;
  return compressToEncodedURIComponent(JSON.stringify(shareable));
}

/** Decodes a shared Case from a URL, or null if the string is missing, corrupt or not a Case. */
export function decodeSharedCase(encoded: string): Case | null {
  try {
    const json = decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== "object" || !parsed.product || !parsed.answers) return null;
    return { ...parsed, audit: [], consent: [] } as Case;
  } catch {
    return null;
  }
}

export function shareLinkFor(kase: Case): string {
  const encoded = encodeCaseForShare(kase);
  return `${window.location.origin}${window.location.pathname}#/case/describe?c=${encoded}`;
}
