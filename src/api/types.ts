import type { Answer, LedgerEntry, Source } from "../lib/types";
import type { ClassifyResult } from "../engines/classify";
import type { ClaimReport } from "../engines/claims";
import type { Case } from "../state/case";

export interface AskRequest {
  q: string;
  kase?: Case;
}
export type AskResponse = Answer;

export interface ClassifyRequest {
  kase: Case;
  prev?: { cat: string; rowsByKey: Record<string, string> } | null;
}
export type ClassifyResponse = ClassifyResult | null;

export interface ClaimsCheckRequest {
  text: string;
  category: string;
}
export type ClaimsCheckResponse = ClaimReport;

export interface SourcesRequest {
  asOf?: string;
}
export type SourcesResponse = Record<string, Source>;

export interface EscalateRequest {
  caseId: string;
  scope: string;
}
export interface EscalateResponse {
  id: string;
  caseId: string;
  scope: string;
  queuedAt: string;
}

export interface ConsentRequest {
  src: string;
  scope: string;
}
export type ConsentResponse = LedgerEntry;

export interface RevokeConsentRequest {
  index: number;
}
