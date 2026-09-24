import { http, HttpResponse } from "msw";
import { matchQuestion, unknownAnswer } from "../../engines/ask";
import { classify } from "../../engines/classify";
import { runClaims } from "../../engines/claims";
import { SOURCES } from "../../data/sources";
import type {
  AskRequest, ClaimsCheckRequest, ClassifyRequest,
  ConsentRequest, EscalateRequest, RevokeConsentRequest,
} from "../types";

function latency() {
  return 250 + Math.random() * 350;
}

/** In-memory, request-scoped: enough to make /v1/consent DELETE behave sensibly in the mock without a real database. */
let consentLedger: { src: string; scope: string; time: string; active: boolean }[] = [];

export const handlers = [
  http.post("/v1/ask", async ({ request }) => {
    await delay();
    const { q } = (await request.json()) as AskRequest;
    const answer = matchQuestion(q) || unknownAnswer(q);
    return HttpResponse.json(answer);
  }),

  http.post("/v1/classify", async ({ request }) => {
    await delay();
    const { kase, prev } = (await request.json()) as ClassifyRequest;
    return HttpResponse.json(classify(kase, prev ?? null));
  }),

  http.post("/v1/claims/check", async ({ request }) => {
    await delay();
    const { text, category } = (await request.json()) as ClaimsCheckRequest;
    return HttpResponse.json(runClaims(text, category));
  }),

  http.get("/v1/sources", async () => {
    await delay();
    // asOf filtering arrives with the legal time machine (Phase 6); today this returns the current register.
    return HttpResponse.json(SOURCES);
  }),

  http.post("/v1/escalations", async ({ request }) => {
    await delay();
    const { caseId, scope } = (await request.json()) as EscalateRequest;
    return HttpResponse.json({ id: `esc_${Date.now().toString(36)}`, caseId, scope, queuedAt: new Date().toISOString() });
  }),

  http.post("/v1/consent", async ({ request }) => {
    await delay();
    const { src, scope } = (await request.json()) as ConsentRequest;
    const entry = { src, scope, time: new Date().toISOString(), active: true };
    consentLedger = [...consentLedger, entry];
    return HttpResponse.json(entry);
  }),

  http.delete("/v1/consent", async ({ request }) => {
    await delay();
    const { index } = (await request.json()) as RevokeConsentRequest;
    consentLedger = consentLedger.map((e, i) => (i === index ? { ...e, active: false } : e));
    return HttpResponse.json(consentLedger);
  }),
];

function delay() {
  return new Promise((resolve) => setTimeout(resolve, latency()));
}
