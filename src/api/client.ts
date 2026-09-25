import type {
  AskRequest, AskResponse,
  ClaimsCheckRequest, ClaimsCheckResponse,
  ClassifyRequest, ClassifyResponse,
  ConsentRequest, ConsentResponse, RevokeConsentRequest,
  EscalateRequest, EscalateResponse,
  SourcesRequest, SourcesResponse,
} from "./types";

export interface ApiCallLogEntry {
  id: number;
  method: string;
  path: string;
  status: number;
  latencyMs: number;
  request: unknown;
  response: unknown;
  at: string;
}

let nextId = 1;
let log: ApiCallLogEntry[] = [];
type Listener = (log: ApiCallLogEntry[]) => void;
const listeners = new Set<Listener>();

function notify() {
  for (const l of listeners) l(log);
}

/** For app/ApiInspector.tsx: subscribe to the running call log. Returns an unsubscribe function. */
export function subscribeApiLog(listener: Listener): () => void {
  listeners.add(listener);
  listener(log);
  return () => listeners.delete(listener);
}

export function clearApiLog() {
  log = [];
  notify();
}

async function call<TReq, TRes>(method: string, path: string, body?: TReq): Promise<TRes> {
  const started = performance.now();
  const res = await fetch(path, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const latencyMs = Math.round(performance.now() - started);
  const json = await res.json().catch(() => null);

  log = [
    { id: nextId++, method, path, status: res.status, latencyMs, request: body ?? null, response: json, at: new Date().toISOString() },
    ...log,
  ].slice(0, 100);
  notify();

  if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status}`);
  return json as TRes;
}

/**
 * The typed API client. Chapters call these, never the engines in src/engines/ directly
 * (D0 rule). Every call is a real fetch() against a relative /v1/* path, intercepted by
 * the MSW handlers in src/api/mock/handlers.ts, which run the local engine and add
 * realistic latency. Swapping in a real backend later is a base-URL change here, not a
 * rewrite of any chapter.
 */
export const api = {
  ask: (q: string, kase?: AskRequest["kase"]) => call<AskRequest, AskResponse>("POST", "/v1/ask", { q, kase }),

  classify: (kase: ClassifyRequest["kase"], prev: ClassifyRequest["prev"] = null) =>
    call<ClassifyRequest, ClassifyResponse>("POST", "/v1/classify", { kase, prev }),

  claimsCheck: (text: string, category: string) =>
    call<ClaimsCheckRequest, ClaimsCheckResponse>("POST", "/v1/claims/check", { text, category }),

  sources: (asOf?: string) => call<SourcesRequest, SourcesResponse>("GET", `/v1/sources${asOf ? `?asOf=${asOf}` : ""}`),

  escalate: (caseId: string, scope: string) =>
    call<EscalateRequest, EscalateResponse>("POST", "/v1/escalations", { caseId, scope }),

  consent: (src: string, scope: string) => call<ConsentRequest, ConsentResponse>("POST", "/v1/consent", { src, scope }),

  revokeConsent: (index: number) => call<RevokeConsentRequest, ConsentResponse[]>("DELETE", "/v1/consent", { index }),
};
