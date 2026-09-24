# IP-SAKTI Sahayak — Rebuilt Plan for SIH PS 26045

*Reviewed from five seats: SIH jury, AIIA domain expert, investor, frontend lead, backend lead.*

---

## 1. The honest verdict on v5

Nothing guarantees selection; juries are human and every shortlist has variance. What you can control is removing every reason to reject you and giving evaluators three moments they remember. v5 failed that test for four reasons.

| Problem in v5 | Why a judge marks it down | Fix in v6 |
|---|---|---|
| **Concept sprawl.** Innovation Genome, IP-DNA, Mutation Lab, Evidence Guardian, Time Machine, Command Center, Passport | An AIIA vaidya or IP examiner can't tell what the product *does* in 30 seconds. Invented nouns read as decoration | Plain task names: Ask, Classify, Prior art, Claim check, Sources, Trust |
| **The PS checklist is not visible.** Classification-with-questions, ABS helper, TKDL pointer, logged paid-source permission, escalation, DPDP, disclaimer are buried or missing | Evaluators score against the PS text line by line | Every requirement has a screen, and a coverage table maps all 17 of them |
| **Dashboard, not an assistant.** The PS asks for an assistant for practitioners, startups and *cultivators* | A farmer will never use a "Command Center" | Question-first UI, Hindi/Telugu, voice, persona-specific suggestions |
| **Looks generic.** Cream background, serif display, orbiting circles | Reads as templated; nothing specific to Indian law or Indic scripts | Indigo/neem/turmeric palette, Anek type family (Indian foundry, covers Latin, Devanagari, Telugu) |

What v5 got right and v6 keeps: evidence states, abstention, jurisdiction separation, the what-if idea, no fake scores.

---

## 2. The repositioned pitch

**One line:** *IP-SAKTI tells an Ayurveda innovator what their product legally is, what they can protect, what they owe, and what they may claim — with the exact clause under every sentence, India and international kept apart, and a human when the evidence runs out.*

**Tagline:** Every answer has a clause behind it.

### Five differentiators (each one demonstrable, not claimed)

1. **Classify before advising.** A 3–5 question adaptive flow places the product in one of six legal categories (classical, proprietary, new ASU drug, phytopharmaceutical, Ayurveda Aahara, cosmetic). Rules-based, so it's deterministic and auditable. Every IP/ABS answer depends on it.
2. **Two answers, never one blend.** India and international columns with separate citations. A measurable "jurisdiction leakage" metric with a target of zero.
3. **Confidence computed, not self-reported.** Three factors from the evidence itself: source authority tier, share of verified sentences, agreement between sources. Lowest wins. The model never grades itself.
4. **Law-change awareness.** Every source has version and status. The Rule 170 story — omitted July 2024, stayed by the Supreme Court August 2024, stay vacated August 2025 — is the proof: a naive RAG on 2024 text gives the wrong answer today.
5. **Honest conflict and abstention.** Where commentators disagree (e.g. whether BD Act s.6 registration applies to cultivated medicinal plants), both readings are shown and escalated. Dosing and grant-prediction questions are declined with next steps.

Plus two practical tools MSMEs will pay for: **Claim check** (ad/label text against the DMR Act Schedule, CCPA guidelines, FSSAI Ayurveda Aahara, Cosmetics Rules) and **What-if** (change one fact, see exactly which obligations move).

---

## 3. What each evaluator checks, and your answer

**SIH jury (innovation, feasibility, impact, presentation)**
- *"How is this different from ChatGPT with a PDF?"* → Classification engine, clause-level citation verification, versioned corpus, computed confidence, jurisdiction split. Show the Rule 170 timeline and the conflict drawer.
- *"Can students build this?"* → Stage 1 is ~40 documents and a rules engine. Show the three-stage plan.

**AIIA / Ministry of Ayush domain expert**
- Will test legal accuracy. Every fact in the demo corpus was checked; carry the source list printed. Know Section 3(p), 3(d), 10(4)(d)(ii)(D), 25(1)(k) of the Patents Act; BD Act s.6(1A)/(1B), s.7 exemptions; D&C Act s.3(a)/3(h); Rule 158B; DMR Act Schedule.
- Will ask about TKDL. Answer: TKDL access for non-patent-office users is through paid subscription, phased; IP-SAKTI only points to it and queries it with logged user permission.

**Investor**
- *Who pays?* Ministry/AIIA as the anchor deployer (public good); SIPP facilitators and IP firms get a triage queue; MSMEs pay for Claim check and pathway reports; export councils license the export-market packs.
- *Moat?* The curated, versioned, clause-linked Ayurveda-law corpus and the benchmark, not the model.

**Frontend lead**
- Checks responsiveness, accessibility, state handling, no fake data. v6: keyboard focus, reduced motion, dark mode, mobile layout, all interactions real (classification, what-if, claim scan, permission ledger, audit log are genuinely computed in the browser).

**Backend lead**
- Checks the API contract, retrieval design, cost. See §5.

---

## 4. Screens in v6 and what each proves

| Screen | Proves |
|---|---|
| Overview | 30-second pitch, live sample answer, 8-step clickable walkthrough |
| Ask | Citations, jurisdiction toggle, plain/expert, computed confidence, gaps, abstention, voice input, read-aloud, Hindi answer with locked glossary |
| Classify | Minimum-question flow, 7-row pathway (licence, evidence, patent, other IP, TK exposure, claims, ABS), what-if with changed rows highlighted |
| Prior art & TK | Query builder for five databases, paid-source consent with revocable ledger |
| Claim check | Highlights prohibited claims with the provision, suggests rewording, category-aware |
| Sources | Tiered, versioned register with filters; Rule 170 timeline |
| Trust | 7-step guardrail pipeline, AyurIP-Bench targets (labelled as targets), DPDP handling, live audit trail |
| Blueprint | Architecture, staged delivery, 17-row PS coverage table |

Every scripted element is labelled as prototype. That honesty is itself a scoring point with legal-domain judges.

---

## 5. Backend plan (for the idea round: show it's buildable)

### Stack
Keep what your knowledge base chose, with two de-risking changes.

| Layer | Choice | Note |
|---|---|---|
| API | FastAPI + Pydantic | Endpoints: `/ask`, `/classify`, `/claims/check`, `/sources`, `/escalate`, `/health` |
| Retrieval | Qdrant hybrid (dense + BM25) | Chunk **per clause**, not per page; metadata: act, section, jurisdiction, tier, status, effective_from/to |
| Graph | **Postgres tables first**, Neo4j in Stage 2 | `amends`, `cites`, `applies_to_category` edges fit in SQL for Stage 1; avoids a second database in the build week |
| LLM | Model-agnostic adapter | Gemini for the prototype; an open-weight option on government cloud (MeghRaj) answers the data-sovereignty question Ministry judges will ask |
| Classifier | **Rules engine**, LLM only to extract answers from free text | Deterministic, testable, explainable |
| Citation verifier | Second pass: each sentence + cited chunk → entailment check; unsupported sentences removed | This is the anti-hallucination claim; it must exist |
| Language | Bhashini translation/ASR/TTS; IndicTrans2 fallback; glossary lock (legal terms substituted pre/post translation); back-translation check | |
| Trust | Append-only audit table; consent records; formulation fields encrypted and excluded from logs | DPDP Act, 2023 |

### Confidence formula (put on a slide)
```
authority = share of sentences whose best citation is Tier 0–1  → ≥0.8 Strong, ≥0.5 Partial, else Weak
coverage  = share of sentences in VERIFIED state                 → same thresholds
agreement = 0 conflicts → Consistent; 1 conflict (≥4 sentences) → Partial; else Weak
overall   = min(authority, coverage, agreement)
```

### Corpus for Stage 1 (~40 instruments)
Patents Act + 2024 Rules; IP India TK/biological-material guidelines; BD Act as amended 2023 + BD Rules 2024; D&C Act + Drugs Rules (158B, 2(eb), Rule 170 history); DMR Act + Schedule; CCPA 2022 guidelines; FSS Ayurveda Aahara Regulations 2022; Cosmetics Rules 2020; TM, Designs, Copyright, GI, PPV&FR Acts; DPDP Act; TRIPS; CBD + Nagoya; WIPO GRATK; PCT, Madrid, Hague, Budapest; EU 2004/24/EC; US DSHEA.

### Scale and cost (state as estimates)
Small corpus (tens of thousands of chunks) → a single Qdrant node is enough. Stateless API scales horizontally; cache answers per (question-hash, corpus-version). A gazette watcher re-embeds only changed sections and invalidates cached answers that cited them — that's the "law changed" feature at scale.

---

## 6. Evaluation (AyurIP-Bench)
150 questions co-written with AIIA/IP faculty: 40 classification scenarios, 30 abstention/adversarial, 80 domain Q&A across English, Hindi, Telugu, each with gold citations. Metrics: citation correctness, answer accuracy per jurisdiction, abstention rate on the 30, classification accuracy, language fidelity, jurisdiction leakage. **Never show numbers before running it**; v6 labels them "targets".

---

## 7. The 3-minute demo script (use the built-in walkthrough)
1. **0:00** Overview headline. "Every answer has a clause behind it."
2. **0:15** Ask the Ashwagandha question. Point at two columns, click chip 1 → Section 3(p) text.
3. **0:45** Open the ≠ line. "Commentators disagree; we don't pick one — we show both and send it to a human."
4. **1:05** Switch to Hindi, cultivator. "Same system, a farmer's question, legal terms locked."
5. **1:25** Classify → Ashwagandha preset → make it wild-collected. "Only the biodiversity row moved."
6. **1:50** Claim check. "Diabetes is in the DMR Act Schedule. Here's the provision."
7. **2:10** Sources → Rule 170 timeline. "A 2024-trained bot is wrong today."
8. **2:30** Ask a dosing question → declined. Escalate with consent.
9. **2:45** Trust → audit trail. Close on the coverage table.

---

## 8. Pitch deck (10 slides)
1. Problem, in one farmer's and one startup's words
2. Why it's hard: 15+ overlapping regimes, law changing (Rule 170 timeline)
3. The idea + tagline
4. Live demo (or recording as backup)
5. Five differentiators
6. Architecture + confidence formula
7. Trust: guardrails, DPDP, AyurIP-Bench
8. Staged roadmap and feasibility
9. Impact and adoption (AIIA, SIPP facilitators, MSMEs, export)
10. Team and ask

---

## 9. Questions judges will ask
- **"What if the LLM hallucinates a section?"** It can only cite chunk IDs from the retrieval pack; the verifier drops sentences whose cited chunk doesn't entail them; section text is shown verbatim from the corpus, not generated.
- **"How do you keep it current?"** Gazette/India Code watcher; each chunk has effective dates; answers cache-keyed to corpus version; affected answers re-run.
- **"Isn't this legal advice?"** Information only, standing disclaimer, abstention, human escalation — mirrors how IP India's own guidance is framed.
- **"TKDL is restricted."** We never scrape it. Pointer only, and permissioned queries through the user's own subscription, logged.
- **"Why not just a WhatsApp bot?"** Stage 3 adds one, on the same API. The web app is where the verification UI lives.

---

## 10. Before you submit: verify these yourself
The demo corpus was checked against current sources, but confirm these on the official pages before presenting:
- India's status in the **Hague** design system (shown as "check status" in the app).
- **GRATK** ratification count on WIPO's treaty page (the app deliberately shows sources disagreeing).
- Exact wording of **D&C Act s.3(h)** and **Rule 158B** categories.
- Whether **FSSAI Ayurveda Aahara** approval flow has changed since the 2025–26 orders noted in your knowledge base.
- Current **Rule 170** position (stands omitted after the August 2025 order; watch for fresh litigation).

## 11. What to change before the idea round (priority order)
1. Record a 3-minute screen capture of the walkthrough as a fallback.
2. Get one AIIA faculty member or IP attorney to review ten answers; quote them on the Trust slide.
3. Add your team's own scripted answers for 5 more questions (GI, trade mark clash, export to EU) using the same data shape — the `ANSWERS` array in the HTML.
4. Replace the Google Fonts link with self-hosted font files if the venue has poor internet (the page falls back to system fonts otherwise).
