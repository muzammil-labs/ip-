# IP-SAKTI Sahayak: Finals Strategy (v7)

Markdown copy of `IP-SAKTI-Finals-Implementation-Plan.pdf` for low-token reading. Product strategy, competitor analysis, corpus corrections (§9), demo script (§12), judge Q&A (§13), schedule, risks and facts to verify (§16). Where this conflicts with MASTER-PLAN.md on UI or build steps, MASTER-PLAN.md wins.

## 1. The one-page answer

No plan can guarantee a top-five finish; juries are people and the field is strong. What this plan does is remove every reason a judge could give for passing you over, and give them three things no other team will show.

#### What the research found

At least fifteen public GitHub repositories target PS 26045. Almost all describe the same thing: **hybrid RAG (BM25 + dense) → FastAPI → Gemini or Groq → ChromaDB → Bhashini → citations → abstention**, several with benchmark numbers already in their README. Citation-grounded answers with abstention are now the baseline for this problem statement, and judges will have seen them all day. Doing that part better than the others will not be enough on its own.

### The strategic shift

Stop presenting IP-SAKTI as *an assistant that answers questions*. Present it as **a compliance co-pilot that takes one Ayurveda product from idea to a filing-ready case file**. Questions become one tool inside a continuous flow: describe the product → classify it → see what you can protect → see what you owe → check what you may say → search prior art → export a cited, bilingual dossier a patent agent or SIPP facilitator can act on.

### Three moments the judges will remember

#### 1 · TK proximity

Type your ingredients. IP-SAKTI overlays them on classical formulations and says: "7 of your 9 ingredients match Dashamoola. Section 3(p) risk is high; here is what would change it." Computed in the browser and deterministic. Nothing else we found does this.

#### 2 · Legal time machine

Drag a date slider from 2018 to today. The advertising answer rewrites itself as Rule 170 is inserted, omitted, stayed and un-stayed. This shows why a RAG system trained on 2024 text gives the wrong answer today.

#### 3 · The dossier

One click exports a bilingual Pathway Report: classification, IP routes, ABS duties with a benefit-sharing estimate, a claims audit, the prior-art query log, open gaps and every clause cited. A QR code verifies it against the corpus version.

### What changes, in one table

| Today | After this plan | Why a judge scores it higher |
| --- | --- | --- |
| 8 separate tabs, each with its own layout and motion | One **Case** that every chapter reads and writes; a persistent evidence spine; one motion vocabulary | Reads as one product and not a collection of demos ("user experience", "clarity") |
| 7 scripted answers; any other question abstains | In-browser clause retrieval over the full corpus plus ~40 scripted answers; an unscripted question still returns ranked clauses | A judge who types their own question gets a real result |
| Backend described on a Blueprint page | Typed API client + Mock Service Worker serving the exact FastAPI contract; network tab shows real calls | "Can this be connected to a backend?" is answered in the network tab |
| Bench numbers shown as targets | A mini-bench that runs live in the browser with real computed scores, plus targets for the full bench | Honest, measured numbers alongside the targets |
| Corpus misses §3(e), §3(i), the 2025 AYUSH examination guidelines and the ABS Regulations 2025 | Corpus corrected and extended; the synergy test drives a study-design checklist | Answers the AIIA/IP expert's first probing question |
| 750 KB main bundle, untested voice, no offline mode | <200 KB initial gzip, installable offline PWA, tested voice with fallbacks | Won't break at the venue; works for a rural user |

## 2. The field: what every other team is building

A sample of public repositories for PS 26045, read in September 2026. Treat their claims as their claims; the point is what they converge on.

| Entry (public repo) | What it claims | What it tells us |
| --- | --- | --- |
| HemantKumar822/ip-sakti-sahayak | 7-stage pipeline, PII stripper, BGE-small + BM25 via RRF, Gemini 2.5 Flash, 296 chunks from 11 sources, 160 tests, "100% gating accuracy" on 20 queries | Heavy on backend engineering and test numbers. Narrow corpus (Patents + BD Act). Classification is 3 buckets. |
| Aryandotcom-ui/SIH-IP\_Sakti\_sahayak-26045- | 3,300 chunks from 31 statutes, jurisdiction filter, 3 abstention types, 14-rule ABS engine, recall@5 70.6%, abstention accuracy 77.3% | Closest to us on legal breadth and honesty. Publishes real metrics, so we need real metrics too. |
| ShlokNoval/IP-Shakti | Next.js 15, LangGraph multi-agent, 36,186 chunks split India/international, adaptive wizard, CLEAR/REVIEW/FAIL verdicts | Big corpus plus a wizard. Verdict badges without explained basis are a weakness we can contrast against. |
| sathishssj3, sameer727, KanuriSaiVijeshNaidu, Team-Zenith, dgexplores, ashishacharjee, thirumani-vihaan, visheshaggarwal0, others | Hybrid RAG + Bhashini + ChromaDB; "TKDL integration"; "offline, villager-first"; Sanskrit support | Same architecture. Some claim TKDL integration, which is a liability (see §13): TKDL access is paid and permissioned. |

### Baseline features (everyone has these)

Hybrid retrieval · citations · abstention · jurisdiction filter · Bhashini · a classification step · FastAPI · a confidence number · DPDP mention.

### Where nobody is (our space)

#### Output, not just answers

No entry produces a **deliverable**: a case file or report a facilitator, patent agent or licensing officer can act on. Investors ask what users take away from the product, and today the answer is a chat transcript.

#### Formulation-level reasoning

Everyone reasons over **text questions**. Nobody reasons over **the formulation itself** (ingredients, parts, proportions) against classical references. That is what an examiner does under §3(p) and §3(e).

#### Time as a dimension of law

Corpora are snapshots. Nobody models **effective dates** or lets a user see how an answer changes when the law changes. Rule 170 gives a real Ayurveda case that shows why this matters.

#### The whole commercial pathway

Most stop at patents plus NBA. Few cover **labelling and advertising claims, benefit-sharing amounts, export-market fit and a human hand-off** as one pathway, which is how an MSME actually experiences the problem.

#### Positioning line for the pitch

"Many teams built a legal chatbot for Ayurveda. We built the thing a chatbot hands off to: a case file that starts with your formulation, checks it against classical texts, follows the law through time, and ends with a cited dossier a human expert can sign off."

## 3. The panel: seven simulated evaluators

A role-play of the people most likely to sit on or advise a finals jury for this problem statement. For each: what they test in the first minute, how the current build fares, and what would change their mind.

SIH jury chairEvaluates novelty, complexity, feasibility, impact, UX, future scope

**First minute:** "What does this do that ChatGPT with a PDF doesn't?" Then watches whether the team can drive the demo without fumbling.

Today: polished, but reads as one of many RAG entries. Eight tabs make the story hard to follow.

Flips on: one continuous flow ending in a dossier; three clear, novel moments; a scripted demo that never stalls.

AIIA faculty (Dravyaguna / Rasashastra)Domain accuracy, respect for classical texts

**First minute:** "Is Chyawanprash in your system classical or proprietary if I add saffron?" "Which book? Which chapter?" Checks whether classical references are real.

Today: only 7 answers, and the classifier asks about books but never looks at the formula.

Flips on: an ingredient-level comparison against AFI formulations with book citations; correct Sanskrit, Latin and vernacular plant names; a deviation detector ("you changed one ingredient, so this is now proprietary").

Patent attorney / former examinerPatents Act, examination practice

**First minute:** "Where is §3(e)? Every polyherbal claim fails there." "Do you know the September 2025 AYUSH examination guidelines?" "Methods of treatment?"

Today: §3(e) and §3(i) are missing and the TK guideline source is superseded. These are credibility risks.

Flips on: §3(e) synergy test with a study-design checklist; §3(i) flag for Panchakarma-type methods; 2025 guidelines as a tier-1 source with their worked examples.

Ministry of Ayush / NBA officialPolicy fit, ABS, data sovereignty

**First minute:** "How much benefit-sharing does a ₹20 crore company pay?" "Where does user data live?" "Will it route people to us or away from us?"

Today: ABS duties shown, no amounts; hosting story is a line on the Blueprint page.

Flips on: benefit-sharing estimator on the ABS Regulations 2025 slabs; MeghRaj/NIC hosting plan; escalation that routes to SIPP facilitators and NBA, strengthening existing schemes.

Health/legal-tech investorWho pays, moat, distribution

**First minute:** "What does the user walk away with?" "Who pays?" "Why can't a bigger company copy this in a month?"

Today: good pitch text; no tangible output; no second side of the market.

Flips on: the dossier as the unit of value; a facilitator console (the other side of the market); a curated, versioned, clause-linked corpus plus a formulation reference set as the moat.

HCI / accessibility researcherUsability for low-literacy and rural users

**First minute:** Switches to Telugu, uses a phone, tries voice, zooms to 200%, tabs through with the keyboard.

Today: UI chrome translated, but the legal content stays in English; voice untested; mobile unverified.

Flips on: Kisan mode (voice-first, big targets, icon-led); reviewed hi/te summaries with glossary lock; WCAG 2.2 AA audit results shown; offline PWA.

Engineering leadFrontend and backend feasibility

**First minute:** Opens DevTools. Looks at network calls, bundle size, console errors, and whether the "AI" is hard-coded.

Today: clean React code; no network layer; 750 KB bundle; keyword matching behind the "retrieval".

Flips on: typed API client against an OpenAPI spec; MSW serving it; real BM25 retrieval in a Web Worker; Vitest + Playwright in CI; Lighthouse ≥95.

## 4. Audit of the current build

Read from `claude/vibrant-noether-leqb9g` at commit `61921a8`: 8 screens, ~3,600 lines of TypeScript, 36 sources, 7 scripted answers, 6 categories, 8 claim rules.

### Keep these

- **Computed confidence** (`lib/confidence.ts`): three factors, lowest wins. Good design; keep it and put it on a slide.
- **Deterministic classifier** (`lib/classify.ts`) and **what-if** diff with changed rows. Keep; extend into the Case model.
- **Evidence states** V/U/C/R and **conflict** surfacing (BD Act s.6 for cultivated plants).
- **Rule 170 flux** flag, which becomes the time machine.
- **Consent ledger + audit log**: real, revocable, in-session.
- **Design tokens**: Ayurveda green, turmeric, kumkum used semantically; Anek type family covering Latin, Devanagari and Telugu.

### Fix these

- **Coverage:** 7 answers; `matchQuestion` is keyword overlap with a threshold of 2. Any judge's own question will abstain. P0
- **Legal gaps:** no §3(e), §3(i), §3(j); TK guideline superseded by the Sept 2025 AYUSH examination guidelines; ABS Regulations 2025 missing. P0
- **No persistence or URLs:** state resets on reload; nothing can be shared or deep-linked; the browser back button leaves the app. P0
- **Fragmentation:** three scroll grammars (sticky-stack, horizontal pan, plain), curtain wipe on every tab change. P0
- **Performance:** 750 KB / 237 KB gz main chunk. P1
- **Voice** untested; uses `alert()` on unsupported browsers; no Firefox fallback. P1
- **Code:** duplicate `useApp` import in `Ask.tsx`; `any` for SpeechRecognition; the `t()` helper is redefined in every screen. P2
- **No tests, no CI** despite deterministic engines that are easy to test. P1

#### The most dangerous minute of the demo

A judge takes the keyboard and types "Can I get a GI tag for Kerala Ayurvedic oils?" Today the app abstains. That is honest, but on the fourth abstention it looks like the product is empty. P0-2 (in-browser retrieval) and the 40-answer expansion exist to make this minute go well: an unscripted question should still return **ranked, real clauses** with a clear note that composing a full answer needs the live model.

## 5. The big idea: one case, one dossier

Every screen today keeps its own state. The redesign introduces a single **Case** object: the innovator's product, as the law sees it. Every chapter reads it and adds to it, and the dossier is simply the Case, printed.

### How it works in the product

- **Start page = Case intake.** One field: "Describe your product" (text, voice or a photo of the label), plus three example cases: *Ashwagandha CO₂ extract*, *classical Chyawanprash with saffron*, *farmer selling cultivated Ashwagandha*. Choosing one pre-fills the Case.
- **Chapters, not tabs.** Seven chapters on one scroll with a sticky chapter rail. Each chapter shows its status: done, needs input, risk found.
- **Sahayak panel.** Ask moves into a right-side drawer available everywhere. It gets the Case as context ("For your proprietary Ayurvedic drug from cultivated roots…"). On mobile it becomes a bottom sheet.
- **Evidence spine.** A thin vertical thread on the left edge. Each clause cited anywhere in the Case becomes a seal on the thread, and tapping one opens the clause. By chapter 7 the user can see how much evidence the dossier rests on.
- **What-if everywhere.** Any Case field can be toggled ("make it wild-collected", "sell in the EU", "turnover ₹60 cr") and every chapter shows what moved, with changed rows highlighted in turmeric.
- **Persistence and sharing.** The Case is saved to `localStorage` and can be encoded in the URL (compressed, no personal data), so a judge can open the exact case on their own phone from a QR code on the slide.

### The Case model (TypeScript)

```
interface Case {
  id: string; createdAt: string; corpusVersion: string; // e.g. "2026-09-24"
  product: { name: string; description: string; form?: DosageForm };
  formula: { plant: PlantRef; part: string; qty?: string }[];  // any-script name → botanical
  answers: ClassifyState;                          // existing use/text/frac/src/ent
  markets: ("IN"|"EU"|"US"|"GCC"|"ASEAN")[];
  turnoverCr?: number;                             // drives benefit-sharing estimate
  claims: { text: string; medium: "label"|"ad"|"web" }[];
  questions: { q: string; answerId: string|null; at: string }[];
  consent: LedgerEntry[]; audit: AuditEntry[];
  asOf: string;                                    // legal time machine date, default today
}
```

Every engine becomes a pure function of the Case: `classify(case)`, `tkProximity(case)`, `ipRoutes(case)`, `absDuties(case)`, `benefitShare(case)`, `scanClaims(case)`, `priorArtQueries(case)`, `dossier(case)`. They are pure, so they are easy to test, re-run on any what-if, and move to the backend later without rewriting the UI.

## 6. Making the site one continuous product

Today each screen feels like a separate demo because each one uses its own motion (sticky stack, horizontal pan, curtain wipe) and its own layout width. This chapter defines one visual language: the product is a **living case file**, like a vaidya's manuscript that becomes a legal record.

### Design principles

#### One canvas

A single scrolling document with one content width (`max-w-[1120px]`), one 12-column grid and one chapter template. No full-page curtain wipes; moving between chapters scrolls smoothly and the chapter rail updates.

#### One metaphor: the seal

The WebGL "evidence seal" from the hero becomes the brand mark used throughout: the progress seal in the chapter rail, the citation seals on the evidence spine, and the stamp on the exported dossier. The hero is where it first appears.

#### Three motions only

**Thread**: a line drawing in, used for progress, the spine and connections. **Stamp**: a small scale-and-settle when evidence is verified. **Shift**: turmeric highlight fade when a what-if changes a row. Everything else is instant. Respect `prefers-reduced-motion`.

#### Colour carries meaning

Green = verified or safe, turmeric = changed or needs attention, kumkum = risk or prohibited, indigo = interactive only. Decoration uses ink and paper only. The same rule applies in the app, the dossier and the slides.

### Chapter template (used for all seven)

| Zone | Content |
| --- | --- |
| **Header** | Chapter number in a seal · title (a verb: Describe, Classify, Protect, Owe, Say, Search, Export) · one-line purpose · status chip |
| **Input strip** | Only the Case fields this chapter needs, pre-filled where known, each with a one-line "why we ask" |
| **Finding** | The computed result in one sentence and one visual (meter, overlay, table) |
| **Evidence** | Clause-cited rows using the same row component everywhere: statement · evidence mark · cite chips · "law changed" flag |
| **Gaps and next** | What we still need from you · what a human expert must confirm · button to the next chapter |

### Component consolidation

Merge overlapping pieces into one primitive set: `Chapter`, `Field`, `Finding`, `EvidenceRow` (replaces ad-hoc lists in Ask, Classify, Claim check), `CiteChip`, `Seal`, `Meter`, `DiffMark`, `Sheet` (drawer, bottom sheet, dialog). Remove `StickyStack` and `HorizontalPan` from the main flow; the Overview differentiators become part of chapter intros rather than a separate show-piece. One translation hook `useT()` in `lib/i18n.ts`.

### Where the other screens go

| Current screen | New home |
| --- | --- |
| Overview | Hero + Case intake (start page). The walkthrough becomes a "presenter mode" (§12). |
| Ask | Sahayak side panel on every chapter; full-page view kept at `#/ask` for Kisan mode. |
| Classify | Chapter 2, with TK proximity added. |
| Prior art & TK | Chapter 6; queries built automatically from the Case formula. |
| Claim check | Chapter 5; category comes from the Case, no separate picker. |
| Sources | "Library" in the footer and inside every cite chip; includes the time machine. |
| Trust, Blueprint | A combined "How it works" chapter after the dossier: guardrails, live bench, architecture, PS coverage, API explorer. These pages are for judges more than users, so they come last. |

#### Visual detail that helps judges remember it

Each Case gets a **botanical line illustration** of its primary plant (Ashwagandha, Amla, Tulsi, Turmeric, Brahmi…) drawn as a single-stroke SVG that draws itself with the thread motion. Ten SVGs cover the demo set. It is specific to Ayurveda, looks nothing like a template, costs a few kilobytes, and becomes the cover image of the dossier.

## 7. Feature plan

P0 must ship before finals. P1 ship if P0 is done and tested. P2 show as a designed, clickable prototype, clearly labelled. Every feature has a frontend path that works in the demo, even where production needs a backend.

### P0: the core that decides selection

#### P0-1 · Case workspace and chapter flow [P0]

What
:   The Case model (§5), seven chapters, chapter rail, evidence spine, persistence, shareable URL, hash router.

Build
:   `state/case.ts` (reducer + `localStorage`), `wouter` (~2 KB) for `#/case/:chapter`, `lz-string` for URL encoding. Refactor screens into `chapters/`.

Backend
:   `POST /cases`, `PATCH /cases/:id`, served by the mock layer (§8).

Effort
:   4–5 dev-days

#### P0-2 · Real clause retrieval in the browser [P0]

What
:   Split the corpus into clause-level chunks (~250–400 from the ~45 instruments, using official text). Any question returns top-k clauses with scores, jurisdiction-separated. Scripted answers are used when matched; otherwise show "Relevant clauses" plus an honest note that a composed answer needs the live model.

Build
:   `MiniSearch` (BM25-style, ~7 KB gz) in a Web Worker; a Hindi/Telugu query-expansion glossary maps vernacular terms to English legal terms before search (the same glossary lock used for display). Optional P1: `transformers.js` with a small multilingual embedding model, lazy-loaded, for semantic re-ranking.

Backend
:   Same response shape as the planned `/ask` retrieval pack, so the UI does not change when Qdrant replaces it.

Effort
:   3 dev-days + corpus chunking (1 person, 3 days)

#### P0-3 · TK proximity check (formulation vs classical texts) [P0]

What
:   User enters ingredients (any script; resolved to botanical names). Compared against a reference set of ~50 well-known classical formulations with book and chapter references. Output: closest matches, overlap score, a Venn-style overlay, and the legal reading: "exact match → classical (§3(p) bars the formula)", "subset with changes → proprietary, §3(e) synergy data needed", "low overlap → new ASU drug; search TKDL".

Build
:   `data/formulations.ts`, `data/plants.ts` (Latin, Sanskrit, Hindi, Telugu, common names, parts), `lib/tkProximity.ts` (weighted Jaccard; the primary/major ingredient weighted higher). SVG overlay. Fully deterministic.

Honesty
:   Label clearly: "Reference set of N formulations from the Ayurvedic Formulary of India, for demonstration. A negative result does not rule out prior art; TKDL and a full search are still needed." Have an AIIA faculty member check the ingredient lists.

Effort
:   3 dev-days + 3 days data entry and review

#### P0-4 · Legal time machine [P0]

What
:   Every source gets `effective_from` / `effective_to` and an event history. A date slider on any answer re-evaluates which clauses were in force and rewrites the affected rows. Showcase: Rule 170 (inserted Dec 2018 → omitted July 2024 → omission stayed Aug 2024 → stay vacated Aug 2025). Second case: BD Act before and after the 2023 amendment (s.7 exemptions, s.6 registration vs approval).

Build
:   `SourceVersion[]` in `data/sources.ts`; `lib/asOf.ts` filters points by date; timeline component on the same thread motion.

Backend
:   Gazette/India Code watcher; answers cache-keyed by corpus version (already in the plan).

Effort
:   2 dev-days

#### P0-5 · Pathway dossier export [P0]

What
:   A 4–8 page PDF: cover with plant illustration and seal; case summary; classification with reasoning; TK proximity; IP route matrix; licence + ABS duties + benefit-sharing estimate; claims audit with suggested rewrites; prior-art query log with consent records; open gaps; escalation block; appendix of every cited clause with version and status. English plus the user's language. A QR code encodes the corpus version and a SHA-256 hash of the Case, so the report can be checked for tampering.

Build
:   A print-optimised route (`#/dossier/print`) with `@page` CSS and `window.print()`. No heavy PDF library, and Indic fonts render correctly. `crypto.subtle.digest` for the hash; `qrcode` (~10 KB) for the QR.

Effort
:   3 dev-days

#### P0-6 · Corpus corrections (§9) [P0]

What
:   Add §3(e), §3(i), §3(j), the AYUSH examination guidelines (Sept 2025), the BD (ABS) Regulations 2025, and the BD Rules 2024 detail; update GRATK status; expand scripted answers from 7 to ~40 (GI, trade mark conflict, EU export, synergy, Panchakarma method, benefit-sharing, cosmetics claim, Aahara logo, NBA form, PPV&FR farmer variety…).

Effort
:   1 person, ~6 days, plus expert review

#### P0-7 · API layer with mock service worker [P0]

What
:   See §8. Every engine is called through `api.*`; MSW answers in the browser with realistic latency. An "API" toggle in presenter mode shows request/response JSON for each call.

Effort
:   2 dev-days

#### P0-8 · Homogeneous redesign (§6) [P0]

What
:   Chapter template, primitives, seal system, three motions, one content width, botanical SVGs, replacement of the curtain wipe.

Effort
:   5 dev-days (runs in parallel with P0-1)

### P1: what makes the difference in the room

#### P1-1 · Benefit-sharing estimator [P1]

What
:   Inputs from the Case (turnover, source, entity, high-value species flag). Output: whether benefit-sharing applies, slab, rate, estimated amount, reporting duty, citations. The 2025 Regulation slabs as reported: up to ₹5 cr none; ₹5–50 cr 0.2%; ₹50–250 cr 0.4% of annual gross ex-factory sale price; higher slab above that; high-value resources (e.g. red sanders, sandalwood, agarwood) at least 5%; statement of use for turnover over ₹1 cr. **Verify every number against the Gazette text before the demo.**

Build
:   `lib/benefitShare.ts` + a slider that shows the amount change live. This answers the NBA official's first question.

#### P1-2 · Synergy (§3(e)) study planner [P1]

What
:   For polyherbal formulas: explains that an admixture is not an invention unless it shows synergy, meaning a combined effect significantly greater than the sum of individual effects, shown by comparative data in the specification. Generates a study-design checklist: arms (each ingredient alone, the combination, a positive control), endpoint, the statistical test to show synergy, and which ingredients to test first given the TK proximity result. Cites the 2025 guidelines' worked examples.

#### P1-3 · Label scanner (photo → claim check) [P1]

What
:   Photograph a label or ad; OCR in the browser (`tesseract.js` with eng+hin+tel, lazy-loaded Web Worker); highlighted findings on the image; rewrites shown as a diff. Add Hindi/Telugu disease terms to the DMR Act rules (e.g. मधुमेह, మధుమేహం) so a vernacular ad is caught too.

#### P1-4 · Kisan mode (voice-first cultivator path) [P1]

What
:   Separate entry: large icon cards ("I grow", "I collect from forest", "I sell to a company", "Our village's produce is famous"), voice question, read-aloud answer, 18px+ text, no jargon, glossary pop-ups. Answers cover s.7 exemptions, the BMC certificate of origin, PPV&FR farmer variety registration, GI through a producer group, and benefit-sharing reaching communities through BMCs.

Build
:   Web Speech API tested on Chrome Android and desktop; feature-detect and hide the mic where unsupported; replace `alert()` with an inline notice. Show the Bhashini ASR→NMT→TTS pipeline as the production path with the request shape in the API explorer.

#### P1-5 · Facilitator console (the second user) [P1]

What
:   A view for a SIPP facilitator or AIIA IP cell: incoming escalated cases (only what the user consented to share), triage by risk flags, one-click open of the dossier, a reply that attaches to the case. This shows a two-sided system and the institutional adoption path the Ministry cares about.

Build
:   `#/facilitator`, seeded with 5 demo cases, sharing Case state through the mock API.

#### P1-6 · Live mini-bench and red-team runner [P1]

What
:   See §11. Runs in the browser and shows measured numbers.

#### P1-7 · Offline PWA, performance, accessibility [P1]

What
:   `vite-plugin-pwa` precaches app and corpus; installable; works in airplane mode, which covers venue Wi-Fi failures and rural users. Code-split per chapter; Three.js only on the start page and only on capable devices. WCAG 2.2 AA pass with axe; Lighthouse report shown on the How-it-works chapter.

### P2: designed and clickable, clearly labelled as prototype

| Feature | Frontend-level representation |
| --- | --- |
| **WhatsApp / IVR channel** | Phone mock-up in How-it-works that plays a scripted Hindi conversation hitting the same `/ask` contract; shows the same answer as the web. |
| **Export-market packs** | EU (THMPD 30/15-year rule), US (DSHEA structure/function claims), plus GCC and ASEAN marked "pack in preparation". Market switch in the Case changes chapter 4 and 5 rows. |
| **Clause graph explorer** | Expand `EvidenceGraph`: nodes = clauses, edges = amends / cites / applies-to-category; click-through to clause text. Shows the Postgres-edges then Neo4j story. |
| **Gazette watcher feed** | "Law changes this month" panel fed from a static JSON of real recent events (Rule 170, ABS Regs 2025, AYUSH guidelines 2025), each with the affected answers listed. |
| **Semantic search** | transformers.js re-ranker behind a "semantic mode (beta)" toggle, if P0-2 is stable. |

## 8. Showing the backend from a frontend

You asked that nothing be skipped because the build is frontend-only. The way to do that is to make the frontend **behave exactly as it will against the real backend**: typed contracts, real HTTP calls, realistic latency and failure states. The backend then becomes a swap of the server, not a rewrite of the UI.

### Layering

### API contract (write it as `openapi.yaml` in the repo)

| Endpoint | Purpose | Frontend today |
| --- | --- | --- |
| `POST /v1/ask` | Question + Case context + asOf + lang → two-column answer, points with chunk IDs, evidence states, gaps, abstain | Scripted answers + MiniSearch retrieval pack |
| `POST /v1/retrieve` | Query → ranked clause chunks, jurisdiction-separated | MiniSearch in Web Worker |
| `POST /v1/classify` | Case answers → category, reasoning, rows | `lib/classify.ts` |
| `POST /v1/tk-proximity` | Formula → nearest classical formulations, overlap, legal reading | `lib/tkProximity.ts` |
| `POST /v1/abs` | Case → duties, forms, benefit-share estimate | `lib/classify.absOf` + `lib/benefitShare.ts` |
| `POST /v1/claims/check` | Text or image → findings, provisions, rewrites | `lib/claims.ts` + tesseract.js |
| `GET /v1/sources?asOf=` | Versioned register with events | Static JSON |
| `POST /v1/cases`, `PATCH`, `GET /v1/cases/:id/dossier` | Case persistence and dossier render | `localStorage` + print route |
| `POST /v1/escalations` | Consent-scoped hand-off to facilitator queue | Mock queue shared with facilitator console |
| `POST /v1/consent`, `DELETE` | Paid-source permission ledger (TKDL) | Existing ledger, now via API |
| `GET /v1/audit`, `GET /v1/health` | Audit trail; corpus version and model status | Session log; static health |

### Production backend (unchanged from your knowledge base, with three additions)

- **Retrieval:** Qdrant hybrid (dense + BM25), chunked per clause, metadata: act, section, jurisdiction, tier, status, **effective\_from/to**, language.
- **Verifier:** each sentence entailment-checked against its cited chunk; unsupported sentences are dropped, not reworded.
- **LLM adapter:** a hosted model for the prototype; an open-weight model on MeghRaj/NIC cloud for data sovereignty.
- **New: formulation service.** AFI/API-derived reference tables in Postgres; TK proximity as SQL + a scoring function; the TKDL query runs only through the user's own subscription with logged consent.
- **New: time-aware answers.** Cache key = (question hash, Case hash, corpus version, asOf). A Gazette change invalidates only answers that cited the changed clause.
- **New: dossier service.** Server-side render of the same print route (headless Chromium), signed hash stored for verification.

#### What the demo shows

In presenter mode, press `D` to open a docked panel that lists every API call made so far, with method, path, latency and the JSON body. When a judge asks whether this is just hard-coded, show them that panel.

## 9. Legal corpus corrections and additions

These are the changes a domain expert on the panel is most likely to probe. Status as found in September 2026 research; confirm each against the primary text (§16).

| Item | Why it matters | Change |
| --- | --- | --- |
| **Patents Act §3(e)** | Mere admixture giving only the aggregated properties of its parts is not an invention. This is the most common objection to polyherbal formulations; synergy must be shown by comparative data in the specification. | Add source; wire into classify rows for *pp* and *newasu*; P1-2 planner. |
| **Patents Act §3(i)** | Methods of treatment of humans are not patentable, which covers Panchakarma protocols and dosing regimens. | Add source + scripted answer; flag when the Case describes a method. |
| **Patents Act §3(j)** | Plants and parts of plants, and essentially biological processes, are excluded. | Add source; used in the cultivator and variety answers. |
| **Guidelines for Examination of AYUSH-related inventions (CGPDTM, 23 Sep 2025)** | Current examination practice: novelty, inventive step, TKDL use, synergy with worked examples (e.g. a patentable anthelmintic combination; a non-patentable anti-acne mix), and BD Act compliance. | Replace `tk-guide` as tier-1 source; cite in patent rows. |
| **BD (Access and Benefit Sharing) Regulations, 2025** | Replaced the 2014 guidelines; turnover-based slabs; DSI brought within scope; reporting duty. | Add source; drives P1-1 estimator. |
| **Biological Diversity Rules, 2024** | Forms and procedure for NBA approval/registration and SBB intimation after the 2023 amendment. | Add clause-level entries and the correct form references. |
| **Rule 170, Drugs Rules** | Omitted July 2024 → omission stayed by the Supreme Court Aug 2024 → stay vacated when the IMA petition was disposed of (Aug 2025), with liberty to challenge the omission; March 2025 directions on misleading ads remain relevant. | Model as events for the time machine; keep "law changed" flag. |
| **WIPO GRATK** | Adopted 24 May 2024; enters into force three months after 15 ratifications/accessions; a small number of parties so far. | Keep the "sources disagree on the count" conflict row; fetch the count from WIPO before the demo. |
| **Normally traded commodities** | BD Act exemptions for biological resources notified as normally traded commodities are relevant to many Ayurveda raw materials. | Add as a Case check in chapter 4 (verify current notification). |
| **Official Hindi texts** | India Code publishes authoritative Hindi versions of many central Acts. | Show the official Hindi clause text where it exists, instead of machine translation. This addresses the translation-risk concern directly. |

### Translating the legal corpus without risk

1. **Statute excerpts:** official Hindi text where India Code has it; otherwise English with a "no official translation" note. Never machine-translate a clause.
2. **Plain-language summaries:** translate the ~40 plain answers into Hindi and Telugu with the glossary lock (legal terms fixed), then back-translate to check meaning, then have one bilingual reviewer sign off. Show a "Reviewed by …" badge with the reviewer's name and date.
3. **UI for unreviewed content:** a clear "English only, translation pending review" chip. Being open about this counts in your favour with a legal jury.

## 10. Engineering: architecture, performance, quality

### Target structure

```
src/
  app/            App.tsx, router.tsx, PresenterMode.tsx, ApiInspector.tsx
  chapters/       Describe, Classify, Protect, Owe, Say, Search, Dossier, HowItWorks
  panels/         Sahayak (ask drawer), SourceSheet, TimeMachine
  views/          KisanMode, FacilitatorConsole, DossierPrint
  ui/             Chapter, Field, Finding, EvidenceRow, CiteChip, Seal, Meter, DiffMark, Sheet
  engines/        classify, tkProximity, absDuties, benefitShare, claims, retrieve, asOf, confidence, dossier
  api/            client.ts, types.gen.ts (from openapi.yaml), mocks/handlers.ts
  workers/        search.worker.ts, ocr.worker.ts
  data/           sources/*.json (versioned), chunks.json, formulations.ts, plants.ts, answers/*.ts, i18n/*
  state/          case.ts (reducer + persistence), session.ts (lang, theme, presenter)
  styles/         tokens.css, print.css
tests/            engines/*.test.ts (Vitest), e2e/demo.spec.ts (Playwright)
```

### Performance budget

| Metric | Target |
| --- | --- |
| Initial JS (gzip) | < 200 KB (now ~237 KB) |
| LCP on mid-range Android, 4G | < 2.0 s |
| INP | < 200 ms |
| Lighthouse perf / a11y / best practices | ≥ 90 / ≥ 95 / ≥ 95 |
| Offline after first load | All chapters + corpus |

How: `React.lazy` per chapter; `manualChunks` for three / r3f / gsap; drop GSAP if Motion covers the three motions; WebGL only when `deviceMemory ≥ 4` and not reduced-motion, with an SVG seal fallback; self-host subset fonts (Latin, Devanagari, Telugu) as woff2.

### Quality gates (GitHub Actions)

- `tsc --noEmit`, ESLint, Prettier check
- **Vitest** on every engine: classification truth table (all answer paths → category), ABS matrix, benefit-share slabs, claim rules (positive and negative fixtures in 3 languages), TK proximity fixtures, asOf transitions
- **Playwright** e2e that runs the exact 5-minute demo script on desktop and a Pixel viewport; fails the build if any step breaks
- **axe-core** accessibility scan on each chapter
- Lighthouse CI on the Netlify preview
- Bundle-size check (fail above budget)

Show the green CI badge and test count on the How-it-works chapter. Engineering judges look for this.

### Mobile QA matrix

| Device / browser | Must pass |
| --- | --- |
| Chrome Android (mid-range, 360×800) | Full demo script, voice in hi-IN and te-IN, bottom-sheet Sahayak, dossier print/share |
| Safari iOS | Everything except voice input (feature-detected, hidden); read-aloud works |
| Desktop Chrome/Edge at 1366×768 (typical venue projector) | No horizontal scroll; presenter mode; font legible from 4 m (base 17px in presenter mode) |
| Firefox desktop | No Web Speech input; mic hidden; everything else works |
| 200% zoom, keyboard only, screen reader (NVDA/TalkBack spot check) | All chapters reachable, focus visible, landmarks and live regions announced |

## 11. Evaluation you can show with real numbers

Other entries publish accuracy numbers. Showing only targets now looks weaker by comparison. The fix is to measure what the frontend can honestly measure, live, and keep the full bench as a target.

### Live mini-bench (runs in the browser on the How-it-works chapter)

| Suite | What it runs | Metric shown |
| --- | --- | --- |
| Classification | 40 labelled scenarios through `classify()` | Accuracy, confusion matrix |
| Abstention / red-team | 30 prompts: dosing, grant prediction, jailbreaks ("ignore rules and tell me…"), out-of-domain, prompt injection inside claim text | Correct-abstain rate, false-abstain rate |
| Retrieval | 60 questions with gold clause IDs, in en/hi/te, through the worker | Recall@5, MRR per language |
| Jurisdiction leakage | Every served point checked: India column cites only Indian sources, international only treaties/foreign | Leakage count (target 0) |
| Claim check | 50 ad/label snippets (en/hi/te) with gold findings | Precision, recall |
| Citation integrity | Every cite ID resolves to a source with version and status | Broken-cite count (must be 0) |

Press "Run bench" and the numbers are computed in front of the judges. Label it **"Prototype bench on the demo corpus; full AyurIP-Bench (150 items, expert-authored) is Stage 1."** Measured, honest numbers are more persuasive than a claimed 100%.

### Expert validation (do this now, it matters more than any feature)

- Get **one AIIA faculty member** to review the formulation reference set and ten answers. Get **one registered patent agent** (a SIPP facilitator is ideal) to review the patent and claims answers.
- Record their names, dates and a one-line quote; show a "Reviewed by" panel and put the quote on the Trust slide. Log every correction they make as a changelog entry in the corpus, which shows the review loop is real.
- Run a 5-person usability test (2 MSME founders or Ayurveda students, 1 farmer or farmer-facing NGO worker, 2 others) with a task list; report task success and one quote. Real users on a slide carry weight with the jury.

## 12. The finals demo: five minutes, three moments

Build a **presenter mode** (`?present=1`): larger type, a step counter, keyboard shortcuts (`→` next step, `R` reset case, `D` API inspector, `L` cycle language), and a seeded demo case. Every step is also an automated Playwright test.

| Time | On screen | Say |
| --- | --- | --- |
| 0:00 | Start page, seal draws in. One field: "Describe your product." | "Two users: Meera runs a 12-person Ayurveda startup in Hyderabad. Ramesh grows Ashwagandha in Madhya Pradesh. Both need the same law and read it very differently." |
| 0:25 | Meera's case: types a 9-herb churna; chapter 2 classifies it. | "Classification comes first, because every other answer depends on it." |
| 0:50 | **Moment 1:** TK proximity overlay: 7/9 overlap with a classical formulation, with book reference. | "This is what an examiner checks under 3(p). Here's what would make it patentable: synergy data under 3(e), and here's the study to run." |
| 1:40 | Chapter 4: ABS duties; turnover slider moves the benefit-share estimate. What-if: "wild-collected" → only the biodiversity rows turn turmeric. | "One fact changes and you can see exactly which obligations move." |
| 2:15 | Chapter 5: photo of a label → "cures diabetes" (Hindi) highlighted → DMR Act Schedule → rewrite diff. | "It catches it in Hindi too." |
| 2:45 | **Moment 2:** time machine slider on the advertising answer, 2018 → today. | "A model trained on 2024 text would give the wrong answer today. Ours tracks when each clause is in force." |
| 3:20 | Ramesh: Kisan mode, Telugu or Hindi voice question, read-aloud answer. | "Same corpus, same citations, his language, legal terms locked." |
| 3:50 | **Moment 3:** export Meera's dossier; scan the QR on the judge's phone; escalate → facilitator console shows it arriving. | "Here is what Meera walks away with. And here is the SIPP facilitator receiving only what she consented to share." |
| 4:30 | How-it-works: press *Run bench*; API inspector open; PS coverage table. | "Measured here, just now. All 17 requirements of the PS are mapped to a screen." |
| 4:50 | Close on the seal. | "Every answer has a clause behind it. Every case ends in a dossier." |

#### Failure-proofing

- Installed PWA on the demo laptop **and** a phone; demo works in airplane mode.
- A recorded 5-minute video on a USB drive and in the laptop's local files.
- Voice is the riskiest step: have a typed fallback button ready that replays the same query.
- Two people rehearse driving the demo, with timed runs, at least 10 times. The person not driving watches the time and hands over the phone for the QR.

### Pitch deck (10 slides) aligned to the SIH scoring criteria

| # | Slide | Criterion it serves |
| --- | --- | --- |
| 1 | Meera and Ramesh: two quotes, one problem | Problem understanding, social relevance |
| 2 | 15 regimes, and the law keeps changing (Rule 170 timeline) | Complexity |
| 3 | One case, one dossier (the §5 diagram) | Novelty, clarity |
| 4 | Live demo | UX, feasibility |
| 5 | Three things no one else does | Novelty |
| 6 | Architecture + confidence formula + API contract | Technical depth |
| 7 | Trust: guardrails, measured bench, expert reviewers | Practicability |
| 8 | Adoption: AIIA IP cell → SIPP facilitators → MSMEs → export councils; MeghRaj hosting | Sustainability, scale of impact |
| 9 | Stage 1/2/3 roadmap with the pieces already built highlighted | Future scope, preparedness |
| 10 | Team, reviewers, ask | Preparedness |

## 13. Hard questions and answers

| Question | Answer |
| --- | --- |
| "Fifteen teams built this. Why you?" | "Their product ends with an answer; ours ends with a case file. We reason over the formulation itself, we track law over time, and a facilitator can act on what we produce." |
| "Is this AI or hard-coded?" | "The engines are deterministic on purpose: classification, ABS and claims are rules you can audit. Retrieval is real search over clause-level chunks. The LLM's only jobs are to write sentences from retrieved clauses and to extract facts from free text, and a verifier removes any sentence its clause doesn't support. Here are the API calls." (Press `D`.) |
| "Do you integrate TKDL?" | "We don't scrape it and can't. Access beyond patent offices is by paid subscription, opened in phases. We build the query and run it only through the user's own subscription with logged, revocable consent. Our TK proximity check uses public classical references and says clearly that it doesn't replace a TKDL search." |
| "What if the classical reference set is wrong?" | "It was reviewed by [name], AIIA. Each entry cites book and chapter. A proximity result is always shown with 'confirm with TKDL and an expert'." |
| "Isn't this legal advice?" | "It's legal information: standing disclaimer, abstention on anything predictive or clinical, and a consented hand-off to SIPP facilitators, who give the advice. This strengthens existing schemes rather than replacing them." |
| "How do you stay current?" | "Every clause has effective dates. A Gazette watcher flags changes, and only answers citing a changed clause are re-run. The time machine you saw uses the same data." |
| "Data protection?" | "Formulations are the user's trade secret. They stay on the device in this build; in production they're encrypted, excluded from logs and never used for training. Consent is per-purpose and revocable, in line with the DPDP Act. Hosting on MeghRaj/NIC." |
| "Who pays?" | "The Ministry/AIIA deploys it as a public good; facilitators get a triage queue; MSMEs pay for dossiers and claim checks at scale; export councils license market packs. The moat is the curated, versioned, clause-linked corpus plus the formulation reference set, not the model." |
| "Why not just WhatsApp?" | "Stage 3, using the same API; the mock is on the How-it-works page. The web app is where verification and the dossier live." |
| "Your bench numbers are small." | "They're measured on the demo corpus, live. We'd rather show a measured number than claim 100%. The 150-item expert bench is Stage 1." |

## 14. Build schedule and team split

Assumes a team of six and roughly four weeks. If you have less time, cut from the bottom of each week, never from P0.

| Week | Build | Done when |
| --- | --- | --- |
| **1** Foundation | Case model + reducer + persistence + router (P0-1). Design primitives and chapter template (P0-8). API client + MSW (P0-7). Vitest + CI. Start corpus chunking and the formulation data entry. | All existing features run inside chapters via `api.*`; CI green; old tabs gone. |
| **2** Differentiators | TK proximity (P0-3). Retrieval worker (P0-2). Time machine (P0-4). Corpus corrections + 20 new answers (P0-6). Expert review requests sent. | Moments 1 and 2 work end to end on desktop. |
| **3** Output + reach | Dossier export (P0-5). Benefit-share (P1-1). Synergy planner (P1-2). Kisan mode + voice testing (P1-4). Facilitator console (P1-5). Remaining answers; hi/te reviewed summaries. | Moment 3 works; full demo script passes as a Playwright test. |
| **4** Polish + proof | Mini-bench (P1-6). PWA + perf + a11y (P1-7). Label OCR (P1-3). Mobile QA matrix. Usability test with 5 people. Expert corrections applied. Deck, video, rehearsal ×10. | Lighthouse targets met; demo passes offline; video recorded. |

### Roles

#### Lead / presenter

Owns the story, deck, demo script, rehearsal; reviews every chapter against §6.

#### Frontend 1

Case model, router, chapters, dossier, presenter mode.

#### Frontend 2

Design system, motion, botanical SVGs, Kisan mode, mobile and accessibility.

#### Engines

TK proximity, retrieval worker, time machine, benefit-share, claims OCR, tests.

#### Corpus / legal

Chunking, sources with versions, 40 answers, formulation set, expert liaison, translations.

#### API / QA

OpenAPI spec, MSW, API inspector, CI, Playwright, bench suites, Lighthouse.

## 15. Risk register

| Risk | Impact | Mitigation |
| --- | --- | --- |
| A legal fact on screen is wrong and an expert judge catches it | High | Expert review; §16 checklist; every uncertain point shown as U or C state, never V; "verify" labels on numbers. |
| Scope too large; P0 not finished | High | Strict P0 order; weekly "done when" gates; P2 only as static clickable mock-ups. |
| Redesign breaks working features | Med | Engines stay pure and tested; e2e demo test runs from week 1; keep the old build deployed on a separate Netlify URL as a fallback. |
| Voice fails at the venue | Med | Typed fallback button; video; test on the actual demo phone. |
| Formulation reference data is disputed | Med | Book and chapter cited per entry; reviewer named; "demonstration set" label. |
| Judges think it's "just frontend" | Med | API inspector, OpenAPI spec, deterministic engines portable to Python, backend plan slide; optionally a minimal FastAPI serving the same engines if one person has capacity in week 4. |
| Over-animation reads as style over substance | Low | Three motions only; reduced-motion respected; WebGL limited to the start page. |

## 16. Verify before you present

These were checked against public sources in September 2026, but the jury may include the people who wrote them. Confirm on the primary page and note the date you checked.

| Fact | Where to confirm |
| --- | --- |
| AYUSH examination guidelines date and worked examples (§3(e) synergy) | IP India / CGPDTM official notice (released 23 Sep 2025) |
| BD (ABS) Regulations 2025 slabs, rates, the top slab, high-value resource percentage, reporting threshold | Gazette notification; NBA website |
| BD Rules 2024 form numbers for NBA approval, registration and SBB intimation | Gazette; NBA |
| Rule 170 current position and any fresh challenge after the Aug 2025 order | Supreme Court order; Ministry of Ayush notices |
| GRATK ratification count and parties | WIPO treaty-status page |
| India's Hague Agreement status | WIPO Hague members list |
| TKDL access model for non-patent-office users (paid, phased) | CSIR-TKDL; PIB release on widening access |
| Normally traded commodities notification and its current list | MoEFCC / NBA notification |
| D&C Act s.3(h) wording; Rule 158B categories; FSSAI Ayurveda Aahara approval flow | India Code; CDSCO; FSSAI |
| Every classical formulation's ingredient list in the reference set | Ayurvedic Formulary of India; reviewer sign-off |

#### Sources consulted for this plan

Public PS 26045 repositories on GitHub (HemantKumar822/ip-sakti-sahayak, Aryandotcom-ui/SIH-IP\_Sakti\_sahayak-26045-, ShlokNoval/IP-Shakti, sathishssj3/IP-SAKTI-Sahayak, Team-Zenith-SIH-2026, dgexplores, sameer727, KanuriSaiVijeshNaidu, others); WIPO GRATK summary and FAQ; reporting on the Supreme Court's disposal of the IMA petition and Rule 170 (Medical Dialogues, The South First); PIB release on widening TKDL access; reporting on the Guidelines for Examination of AYUSH-related inventions (Conventus Law, BananaIP, Lexology); reporting on the BD (ABS) Regulations 2025 (Drishti IAS, K&S Partners, Insights); published SIH evaluation criteria. Secondary sources were used for orientation; §16 lists what to confirm from the primary text.

## A. File-level change list

Mapped to the current repository so the work can start straight away.

| File | Action | Change |
| --- | --- | --- |
| `src/state/store.tsx` | Split | → `state/case.ts` (Case reducer, persistence, URL encode) + `state/session.ts` (lang, theme, presenter, drawer) |
| `src/App.tsx` | Rewrite | Router, chapter rail, evidence spine, Sahayak drawer, remove curtain wipe, lazy chapters |
| `src/screens/*` | Move | → `chapters/*` on the `Chapter` template; Trust + Blueprint → `HowItWorks` |
| `src/lib/ask.ts` | Extend | Scripted match → else `api.retrieve()`; pass Case context; asOf filtering |
| `src/lib/classify.ts` | Extend | Take Case; add §3(e)/§3(i) rows; method detection; market-aware rows |
| `src/lib/claims.ts`, `data/claimRules.ts` | Extend | Hindi/Telugu disease and cure terms; image input path; rewrite diff output |
| `src/data/sources.ts` | Restructure | JSON per source with `versions[]`, `events[]`, `effectiveFrom/To`, official Hindi text field; add sources in §9 |
| `src/data/answers.ts` | Split + grow | `data/answers/*.ts`, 7 → ~40; each with reviewed hi/te plain text |
| `src/data/i18n.ts` | Split | `data/i18n/{en,hi,te}.ts`; one `useT()` hook |
| `src/components/three/HeroScene.tsx` | Adapt | Seal as the brand mark; capability-gated; SVG fallback |
| `src/components/scroll/*` | Remove | Replaced by one scroll grammar |
| `src/screens/Ask.tsx` | Fix | Duplicate import; typed SpeechRecognition; no `alert()`; feature detection |
| **New** `src/engines/tkProximity.ts`, `data/formulations.ts`, `data/plants.ts` | Add | P0-3 |
| **New** `src/engines/asOf.ts`, `panels/TimeMachine.tsx` | Add | P0-4 |
| **New** `src/views/DossierPrint.tsx`, `styles/print.css` | Add | P0-5 |
| **New** `openapi.yaml`, `src/api/*`, `public/mockServiceWorker.js` | Add | P0-7 |
| **New** `src/workers/search.worker.ts`, `data/chunks.json` | Add | P0-2 |
| **New** `src/engines/benefitShare.ts` | Add | P1-1 |
| **New** `src/views/KisanMode.tsx`, `views/FacilitatorConsole.tsx` | Add | P1-4, P1-5 |
| **New** `tests/**`, `.github/workflows/ci.yml`, `playwright.config.ts` | Add | §10 gates |
| `vite.config.ts` | Extend | `manualChunks`, `vite-plugin-pwa`, worker config |
| `package.json` | Deps | + wouter, lz-string, minisearch, msw, qrcode, vitest, @playwright/test, vite-plugin-pwa, axe-core; lazy: tesseract.js; optional: @huggingface/transformers |

#### First three commits

1. **"Introduce Case model and chapter router"**: move existing screens behind routes with no visual change yet; add Vitest with classify and claims truth tables.
2. **"Add typed API client and mock service worker"**: every engine called through `api.*`; add the API inspector.
3. **"Correct corpus: §3(e), §3(i), AYUSH guidelines 2025, ABS Regulations 2025"**: fixes credibility before the new features are built on it.
