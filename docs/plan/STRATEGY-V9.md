# IP-SAKTI Sahayak: Competitive Strategy v9

**Date:** 24 September 2026. **Supersedes** the priorities (not the design system) of v7 and v8. Read with `PS-26045.md` (official text) and `MASTER-PLAN.md` (build spec).

This version is written from an SIH evaluator's side of the table, and it accounts for one fact the earlier plans did not: **every serious team has Claude or ChatGPT.** Polished code and pretty screens are now cheap. What remains scarce is domain truth, real-world validation, and a product that matches the problem statement line by line. This plan puts the effort where the scarcity is.

---

## 1. The facts that decide selection

| Fact | Evidence | Consequence |
|---|---|---|
| **National idea deadline is 30 Sep 2026.** Screening results in October, finalists in November, 36-hour grand finale in Nov/Dec. | SIH 2026 timeline reporting; PS record shows deadline "30 September 2026". | The first gate is **6 days away**. The 24-day build plan cannot finish before it, so a screening sprint goes first (§3). |
| **The first screen is a 6-slide PDF on the official template.** Evaluators spend roughly 2 to 3 minutes per submission. Exceeding 6 slides or altering the template's fonts or layout risks disqualification. | SIH 2025/2026 guidance and template walkthroughs. | The PDF matters more than the code for the next month. The prototype link on the slides is a bonus that evaluators may click for 30 seconds, so the first screen of the live site must be flawless. |
| **PS 26045 had 62 submissions on 24 Sep** (cap 500), rising from 4 on 6 Sep, recently about 8 a day. Median across all 240 statements: 41. | Twice-daily dataset `Zaidusyy/sih-2026-problem-statements`. | Expect about **100 to 160** submissions by the deadline, with a final-days spike. The cap of 500 is unlikely to be reached for this PS. |
| **About 4 to 5 teams per PS reach the finale**, and the PS-owning organisation may select fewer if nothing meets its bar. | SIH guidelines. | Roughly a **3 to 5% selection rate**. You are not competing with 15 repos; you are competing with ~100 to 160 PDFs, most AI-assisted, read quickly by AIIA and Ayush evaluators. |
| **The PS owner is AIIA (All India Institute of Ayurveda), Ministry of Ayush.** | PS record. | Evaluators are Ayurveda domain people first and technologists second. Legal and Ayurvedic accuracy will be checked; generic AI language will be noticed. |
| **The official PS text names specific expectations** (see `PS-26045.md`): version-tracked corpus of "statutes, rules, treaties, **pharmacopoeial standards, registry records and case law**"; move "from a question to the right **registry, record or form**"; **export-market** herbal regimes; privacy aligned to DPDP and "**recognised AI-application standards**"; "relational **knowledge graph** and **agentic, multi-source orchestration**"; staged build; "evaluable on **answer accuracy, citation correctness, safe abstention** … and **multilingual quality**". | Official text. | Items in bold are **not yet covered** by v7/v8 or are covered only lightly. Each becomes a feature or a slide line (§4). Evaluators score against this text. |
| **The finale is 36 hours with about three mentoring or evaluation rounds and a final round.** Judges critique and expect changes between rounds. | SIH participant accounts. | Build so that common asks (add Siddha/Unani, add a language, add an export market, add a source) are **data changes, not code changes**, and rehearse them (§6). |
| **Teams need 6 members including at least one female member, and a faculty mentor; nomination goes through the college SPOC** after the internal hackathon. | SIH rules. | Confirm the nomination is done or scheduled; without it nothing else matters. |

### What "everyone has Claude" means in practice

A judge reading 120 PDFs will see the same shapes repeatedly: "RAG pipeline with FAISS/Chroma", "LLM with citations", "multilingual via Bhashini", "revolutionise Ayurveda IP". AI-assisted submissions tend toward the same vocabulary and the same architecture diagram. The ways to separate from that crowd are the ones an AI cannot produce on its own:

1. **Verified domain specifics** that only come from reading primary sources: exact sections, dated events, case names, Ayurvedic terms.
2. **Evidence from people**: an AIIA faculty reviewer, a registered patent agent, a farmer or FPO, a small usability test. Names and dates.
3. **A product idea competitors did not think of**, clearly tied to a line in the PS.
4. **Something measured**, shown live.
5. **Craft consistency**: one visual language, zero broken states. AI makes it easy to produce many screens and hard to make them coherent.

---

## 2. Positioning (one line for every slide and the demo)

> **IP-SAKTI protects Ayurvedic innovation and defends India's traditional knowledge, with a clause behind every answer.**

Two halves, both in the PS background ("legitimate Ayurvedic innovation is under-protected … while India's traditional knowledge remains exposed to misappropriation abroad"). Almost every competing submission addresses only the first half. The second half (§4, angle A) is our most distinctive idea.

---

## 3. The screening sprint (24 to 29 September)

Goal: a PDF that survives a 2-minute read, a live link that looks finished in 30 seconds, and a clean demo video. **Target submission 27 September**; 28 or 29 September as fallback; never the 30th (portals and SPOCs are overloaded on deadline day). See §3A for why the 27th.

| Day | Build (Sonnet sessions, from MASTER-PLAN.md) | Team (people) |
|---|---|---|
| **Wed 24** | Phase 0 (grid bug, mobile language switch, screenshot script, tests, CLAUDE.md update). | Confirm SPOC nomination, the SPOC's own upload cut-off, and whether a video and an abstract are required (§3A). Message the AIIA faculty contact and a patent agent (§7). Turn off the Netlify badge; point Netlify at the build branch. |
| **Thu 25** | Phase 1 (tokens, fonts, remove Three.js and GSAP, shell). The site now looks light-first and consistent. | Draft the 6 slides on the official template (§5) and the abstract (§3A). |
| **Fri 26** | S-1, S-2, S-3. Deploy by evening. | Screenshots of the deployed build for the slides; record the demo video (§5.2); 2-minute test with two outsiders. |
| **Sat 27** | S-4 to S-6 only if time allows; otherwise freeze. | Final PDF, video link and abstract to the SPOC by midday. **Target submission: 27 Sep.** |
| **Sun 28 / Mon 29** | Buffer, fixes only. | Fallback submission window. Do not wait for 30 Sep. |

### Sprint tasks (added to MASTER-PLAN as Phase S; they reuse the Phase 1 tokens, and do not need the full Phase 2 to 4)

- **S-1 Home that sells in 30 seconds.** Replace the Overview hero with the Home hero from UI-4.1 in simplified form: headline, 20-word sub, "Start a case" and "Ask Sahayak", and the live q1 answer card with working cite chips. Below it: the two-mission line (§2) and three example cases linking into existing screens.
- **S-2 PS coverage page.** A single page (`How it works`) listing all expectations from the official PS text in the PS's own words, each with a status (Built / Prototype / Planned) and a link to where it is shown. This is what an evaluator who clicks the link wants to see.
- **S-3 Ayurvedic-term claim check** (angle B, a small data addition to the existing claim engine): catch "Madhumeha", "मधुमेह", "మధుమేహం" and similar as Schedule conditions.
- **S-4 Case-law and "next step" links** (angles C and E, data only): add 4 landmark cases to sources and add official portal links at the end of each scripted answer.
- **S-5 Agent trace** (angle K): under each answer, a collapsible step list (classify → retrieve India → retrieve international → verify each sentence → compute confidence → compose), with the sources touched at each step.
- **S-6 Evaluation panel named exactly as the PS**: "Answer accuracy, citation correctness, safe abstention, multilingual quality", showing live-computed results on the scripted set (P1-6 in simplified form).

After 29 September, continue MASTER-PLAN Phase 2 onward. There are about 6 to 9 weeks until the finale, enough for the full build plus the angles below.

## 3A. Submission tactics (what is known, what is not)

**Evaluation order.** There is no public evidence, official or from participants, on whether evaluators read ideas in submission order, randomly, or in batches. The evaluation portal (`evaluations.sih.gov.in`) is not public. Shortlisting is by rubric score across all ideas for the statement, not first-come. Two things are plausible but unproven: portal lists often default to ascending ID, and reviewer attention fades over a long pile. So treat "the first 100 are favoured" as a rumour, but note that it costs little to be early anyway:

- PS 26045 had 62 ideas on 24 Sep, growing about 8 a day, so idea 100 arrives around 27 to 28 Sep. **Submitting on the 27th almost certainly puts you in the first 100** with no loss of quality.
- Never trade quality for position. A strong PDF on the 28th beats a weak one on the 26th.
- Ask the SPOC whether a submitted idea can be replaced before the deadline. If yes, submit a complete version on the 27th and replace it only if something important improves.

**Numbers that set expectations.** SIH 2025 had 72,165 ideas for 271 statements (about 266 per statement on average) and 1,360 finalist teams (about 5 per statement). PS 26045 will likely close at 100 to 160 ideas, so the selection rate is about 3 to 5%.

**What goes in with the PDF.** Several guides and walkthroughs describe the SPOC uploading the idea PDF **and a video demonstration** for national screening, and walkthrough videos for 2025 and 2026 mention an **abstract** and a **business model** in the submission. Confirm the exact fields with your SPOC today. Prepare all three anyway:

- **Demo video:** 2 minutes, unlisted YouTube, script in §5.2. For a frontend demo this is where you stand out: many teams submit no video or a slideshow recording, and "no prototype, no video, no screenshot" is listed as a critical mistake in screening guides.
- **Abstract (about 200 words; trim to the portal limit):**

> IP-SAKTI Sahayak helps Ayurveda innovators, practitioners, researchers and cultivators understand what their product legally is, what they can protect, what they owe under biodiversity law and what they may claim, with a clause-level citation under every answer. It first classifies the formulation (classical, proprietary, new ASU drug, phytopharmaceutical, Ayurveda Aahara or cosmetic) with a few adaptive questions, because every IP and access-and-benefit-sharing answer depends on that category. Answers keep Indian law and international regimes in two visibly separate columns, compute confidence from the evidence rather than self-reporting it, abstain when evidence is insufficient, and hand off to a human IP facilitator with consent. A version-tracked corpus of statutes, rules, treaties, pharmacopoeial standards, registry records and case law tracks when each clause is in force, so answers stay correct as law changes (for example the 2024 to 2025 changes to Rule 170 on Ayurvedic advertising). Beyond protecting innovation, IP-SAKTI helps defend India's traditional knowledge: it compares a formulation or a foreign patent against classical formulations and points to the right challenge route. The assistant works in English, Hindi and Telugu with voice, and aligns with DPDP, India's AI Governance Guidelines and GIGW 3.0.

- **Business model (if asked, 3 lines):** public deployment by Ministry of Ayush and AIIA as a free information service; SIPP facilitators and IP cells use the triage queue and dossiers; MSMEs and exporters pay for dossier exports, claim checks at scale and export-market packs, with the curated, versioned corpus as the moat.

**Coordinate with the SPOC.** The SPOC uploads for the college and may set an earlier internal cut-off. Send them the final PDF, video link and abstract by **27 Sep midday**, and get a screenshot of the submitted entry.

**A second problem statement (optional, decide today).** Guides report that a team leader can select **up to 2 problem statements**. Confirm with the SPOC. The other AIIA software statement, **SIH26046 (AIIA Clinical Trials Dashboard: CTMS with CTRI, GCP-ASU, pharmacovigilance, CDISC/FHIR)**, had only **25 ideas** on 24 Sep, the lowest of all MedTech software statements, and the same organisation evaluates it. A 6-slide PDF for it could be written by one or two team members in a day, reusing the same visual language, without touching the PS 26045 build. Trade-offs: it splits attention in the busiest week, it is a different domain (clinical research operations, not IP law), and you should check with the SPOC what happens if both are shortlisted. Recommendation: do it only if two team members are free and PS 26045's PDF is on track by Thursday.

**Avoid screening killers:**
- More than 6 slides, a modified template, or a non-PDF file.
- Copying the PS text into slides instead of restating it.
- Generic AI phrasing ("revolutionise", "seamless", "cutting-edge"); evaluators say they can spot recycled or AI-generated content.
- Invented statistics. Use cited facts or qualitative framing.
- A prototype link that opens to a blank, broken or slow page. Test it on a phone over mobile data before submitting.

---

## 4. Unique angles, ranked (effort is frontend-only unless stated)

| # | Angle | PS line it answers | Why it stands out | Effort |
|---|---|---|---|---|
| **A** | **TK Guard: defend Indian TK abroad.** Paste a foreign patent's title, abstract or claims. IP-SAKTI runs TK proximity against the classical formulation set and lists the matches with book references, then gives the route to challenge it: EPO third-party observations (Art. 115 EPC), US preissuance submissions (35 U.S.C. 122(e)), and the TKDL unit as the national channel. Framed with India's own history: the **turmeric wound-healing patent revoked by the USPTO in 1997** after CSIR's challenge, and the **neem patent revoked by the EPO** (2000, upheld on appeal 2005), the cases that led to TKDL. | Background: "India's traditional knowledge remains exposed to misappropriation abroad"; "defended through the Traditional Knowledge Digital Library". | Turns the product from a compliance tool into a national-interest tool. Ministry evaluators have heard the turmeric and neem stories; almost no team will build this. | 2 days after TK proximity (UI-6.1). Legal text reviewed by patent agent. |
| **B** | **Ayurvedic-term claim screening via NAMASTE and ICD-11 TM2.** Advertisements use Ayurvedic disease names (Madhumeha for diabetes, and others) that plain English rules miss. Map a small, reviewed set of Ayurvedic morbidity terms (Devanagari, transliteration, Telugu) to the DMR Act Schedule conditions, citing the Ministry's NAMASTE portal and WHO ICD-11 Chapter 26 (TM2, on the ICD-11 browser since 2025). | "advertising, labelling … regimes"; multilingual quality. | Uses the Ministry's own terminology infrastructure. Catches exactly the ads that slip past naive tools. | 1 day + term list reviewed by AIIA contact. |
| **C** | **Case law layer.** Add landmark decisions as tier-1 sources, clause-linked: **Novartis v. Union of India (SC, 2013)** on §3(d); **Divya Pharmacy v. Union of India (Uttarakhand HC, 21 Dec 2018)**, which held that Indian companies using biological resources owe fair and equitable benefit sharing; turmeric (USPTO 1997) and neem (EPO 2000/2005) as TK precedents. | "case law" is named in the expected corpus. | Divya Pharmacy is the Ayurveda benefit-sharing case; citing it tells an AIIA judge you did the reading. | Half a day (data). |
| **D** | **From question to registry, record or form.** Every answer ends with "Next steps" buttons that open the right official place: IP India e-filing, NBA application portal, GI registry, FSSAI FoSCoS, State licensing authority, TKDL, WIPO Patentscope, SIPP facilitator list. Deep links where stable, portal home otherwise. | "so that a user can move from a question to the right registry, record or form". | A literal PS line most teams will skip. | Half a day (data). |
| **E** | **Pharmacopoeial identity in the formula builder.** Plant entries show botanical name, part used and a pointer to the Ayurvedic Pharmacopoeia of India monograph (API Part I volume and monograph number, entered and checked by the team). | "pharmacopoeial standards" in the corpus. | Signals domain depth; required anyway for TK proximity. | Data entry, 1 to 2 days (team). |
| **F** | **Responsible-AI conformance card.** Map each guardrail to MeitY's **India AI Governance Guidelines (Nov 2025)**, whose seven sutras are Trust, People First, Innovation over Restraint, Fairness & Equity, Accountability, Understandable by Design, and Safety, Resilience & Sustainability; to **ICMR's Ethical Guidelines for AI in Biomedical Research and Healthcare (2023)**; and to the DPDP Act. One table on How it works and one line on the slide. | "recognised AI-application standards". | Ministry evaluators recognise these documents; almost no student team maps to them. | Half a day. |
| **G** | **Government-grade accessibility.** State conformance with **GIGW 3.0** (NIC/MeitY; WCAG 2.1 AA baseline plus multilingual and usability requirements). Add a small accessibility menu (text size, high contrast, dyslexia-friendly font, reduce motion) similar to what UX4G sites offer. Keep our own design system (adopting UX4G wholesale would conflict with it); say "GIGW 3.0-aligned". | "user experience"; public deployment. | Speaks the language of government deployment. | 1 day. |
| **H** | **Visible agentic orchestration.** The agent trace from S-5, plus a "sources consulted" count per answer. In production each step is an agent over its own source (statutes, registry, pharmacopoeia, case law); in the prototype the trace comes from the mock. | "agentic, multi-source orchestration". | Makes an abstract PS phrase visible in five seconds. | Half a day. |
| **I** | **Relational knowledge graph view.** Promote the clause-graph explorer from P2 to P1: nodes for acts, sections, cases, categories, plants; edges for amends, cites, applies-to, interprets. Click through to clause text. | "A relational knowledge graph". | A visual that shows structure beyond a vector store. | 1.5 days. |
| **J** | **Export-market packs.** A five-market table for the Case: EU (THMPD, 30 years of use with 15 in the EU), UK (THR), US (DSHEA structure/function claims), Canada (Natural Health Products), Australia (TGA listed medicines). Only regimes the team verifies; others marked "pack in preparation". | "herbal-product market-access regimes of key export markets". | Export councils and MSMEs care; few teams go beyond EU/US. | 1 day + verification. |
| **K** | **Exact PS metrics, measured live.** The mini-bench reports exactly the four PS metrics, by name. | "evaluable on answer accuracy, citation correctness, safe abstention … multilingual quality". | Evaluators see their own rubric measured. | Included in S-6 / P1-6. |
| **L** | **One real national integration (optional, needs a tiny serverless function).** Register for Bhashini (ULCA) and call its translation or ASR from a Netlify Function, so one Hindi or Telugu step is truly live rather than mocked. | "leveraging national language infrastructure such as Bhashini". | The only real external integration most teams claim but do not show. | 1 day if API access is granted. This steps slightly outside "frontend only"; skip if the team prefers. |
| **M** | **Extension drills for the finale.** Corpus, languages, markets, categories and claim terms all live in data files with a schema. Rehearse: "add Siddha" (new category + sources), "add Tamil" (i18n file), "add Canada" (market pack) in under an hour each. | "the build can be staged". | Judges ask for changes between finale rounds; teams that adapt fast stand out. | Built into Phase 3 data structures; rehearse in November. |

**Also from v7/v8, still top priority:** TK proximity, legal time machine, dossier export, Examiner's view, the printed dossier and phone follow-along (SPOTLIGHT.md).

### Angles considered and rejected

- **Adopting UX4G components wholesale.** It would replace our coherent design system with a generic one and fight Part C. We align with GIGW 3.0 instead.
- **Claiming TKDL integration.** TKDL access for non-patent-office users is paid and phased. Pointer and consented query only.
- **AI-generated plant images or synthetic testimonials.** One error seen by an AIIA judge costs more than the visual gains.
- **Blockchain for the audit log or dossier.** A signed hash plus QR verification makes the same point without the buzzword penalty.
- **More languages before the existing two are reviewed.** Two reviewed languages beat six machine-translated ones with a legal audience.

---

## 5. The 6-slide PDF (content blueprint)

Use the **official SIH 2026 template unchanged** (fonts, layout, slide count). Put the content below into its placeholders. Keep text as real text, not images, so it stays readable if evaluators search or skim the PDF, and use the PS's own words where they fit. No invented statistics.

**Slide 1: Title.** Problem Statement ID SIH26045; title as on the portal; theme; organisation (Ministry of Ayush, AIIA); team name; category Software. Add a small QR to the live prototype and one to the 2-minute video if the template allows it on this slide; otherwise put them on slide 3.

**Slide 2: Idea / problem understanding.**
- Two users in one line each: an Ayurveda startup founder with a new extract, and an Ashwagandha grower selling to a company.
- The problem in three facts, each with a source: overlapping regimes (patents, GI, TM, designs, copyright, PPV&FR, BD Act, D&C Act, DMR Act, FSSAI); law in motion (Rule 170: omitted Jul 2024, stayed Aug 2024, stay vacated Aug 2025); TK exposure abroad (turmeric 1997, neem 2000/2005).
- The positioning line from §2.

**Slide 3: Proposed solution.**
- The one-case flow diagram (Describe → Classify → Protect → Owe → Say → Search → Dossier) with Sahayak (cited Q&A) beside it.
- Five differentiators in short lines: classification before advice; India and international kept visibly separate; confidence computed from evidence, not self-reported; law-change awareness with effective dates; TK Guard against misappropriation abroad.
- One screenshot of the real app (light mode, answer with cite chips) and the QR codes.

**Slide 4: Technical approach.**
- Architecture: version-tracked clause corpus (statutes, rules, treaties, pharmacopoeial standards, registry records, case law) → hybrid retrieval → agentic orchestration (classify, retrieve per jurisdiction, verify each sentence against its cited clause, compute confidence) → cited answer or abstention → escalation to a human IP facilitator. Relational knowledge graph beside the corpus. Bhashini for language and voice.
- Stack in one line. Prototype status: frontend with in-browser engines and a mocked API contract; Stage 1 backend (FastAPI, Qdrant, Postgres graph) planned.
- Staging, mirroring the PS: citation-grounded MVP → graph and agentic layers → paid-source connectors, full multilingual and voice.

**Slide 5: Feasibility and viability / impact.**
- Guardrails and compliance: information-not-advice disclaimer, abstention, consented and logged paid-source access, DPDP handling, mapping to India AI Governance Guidelines (2025) and ICMR AI ethics guidelines (2023), GIGW 3.0-aligned accessibility.
- Evaluation, named as in the PS: answer accuracy, citation correctness, safe abstention, multilingual quality, with the live prototype-bench numbers once measured (label them as such).
- Risks and mitigations in three lines (law changes → effective-dated corpus and watcher; hallucination → sentence-level verification and abstention; TKDL access → pointer and consented queries).
- Impact in qualitative terms (Low/Medium/High framing, no invented figures): innovators, cultivators, SIPP facilitators, AIIA IP cell, export.

**Slide 6: Research and references.**
- 8 to 10 primary references: Patents Act §§3(d), 3(e), 3(p), 10(4)(d)(ii)(D); CGPDTM AYUSH examination guidelines (23 Sep 2025); BD Act 2002 (amended 2023) and ABS Regulations 2025; D&C Act and Rule 158B; DMR Act; FSS (Ayurveda Aahara) Regulations 2022; Novartis (SC 2013); Divya Pharmacy (Uttarakhand HC 2018); WIPO GRATK (2024); NAMASTE / ICD-11 TM2.
- "Reviewed by" line if you have it (name, role, date).
- Existing tools studied and the gap: general chatbots (no versioned law, no jurisdiction split), TKDL (prior-art database, not guidance), IP India resources (not Ayurveda-specific).

### 5.1 The 2-minute test

Before submitting, give the PDF to two people who have not seen the project, for exactly 2 minutes. Then ask: what does it do, for whom, and what is different? If either cannot answer all three, simplify slides 2 and 3.

### 5.2 Demo video (2 minutes, unlisted YouTube, linked from the slides)

0:00 the question on screen · 0:10 classification · 0:30 TK proximity result · 0:50 claim check catching "Madhumeha" · 1:05 time machine on Rule 170 · 1:20 Hindi answer read aloud · 1:35 dossier export · 1:50 PS coverage page. Voice-over by a team member; captions on; no music.

---

## 6. After screening: the finale build (October and November)

1. MASTER-PLAN Phases 2 to 7, then Phase 8 (SPOTLIGHT) with angles A, F, G, I, J folded in (tasks UI-6.10 to UI-6.14 in MASTER-PLAN).
2. Expert review of all legal content and the formulation, term and examiner datasets.
3. Usability test with five people, including one cultivator.
4. Rehearse the finale: the 5-minute demo from FINALS-STRATEGY §12, the Q&A, and the extension drills (angle M).
5. Prepare physical materials: printed dossiers, A3 poster, QR cards.

---

## 7. Messages to send today (people, not code)

**To an AIIA faculty member (Dravyaguna or Rasashastra):**
> We are students building IP-SAKTI Sahayak for SIH PS 26045 (AIIA). It helps Ayurveda innovators understand what they can protect and what they owe under biodiversity law, with citations. Could you spare 20 minutes to check 10 short answers and a list of 30 classical formulations for accuracy? We will credit your review by name only if you agree.

**To a registered patent agent or SIPP facilitator:**
> We are building an information tool (not legal advice) for Ayurveda innovators under SIH PS 26045. Could you review about ten short statements on Sections 3(d), 3(e), 3(p) and 10(4)(d)(ii)(D), and the examiner-objection checklist, for 20 minutes? We would credit you by name if you agree.

**To an FPO or farmer contact:** ask for a 20-minute call to try the Hindi voice question on a phone and, with written consent, a short clip.

---

## 8. Sources used for this strategy

- SIH 2025 totals (72,165 ideas, 271 statements, 1,360 finalist teams): SIH 2025 reporting. Submission components (PDF, video demonstration, abstract): SIH 2026 guides and walkthroughs; confirm with the SPOC. Two problem statements per team: SIH 2026 portal guidance as reported; confirm with the SPOC.

- Official PS text and live submission counts: `Zaidusyy/sih-2026-problem-statements` (GitHub dataset, snapshot 24 Sep 2026); verify on sih.gov.in.
- SIH 2026 timeline and template guidance: reskilll.com and thenewviews.com SIH 2026 guides; `tharsan1305/SIH-2026` template notes; SIH 2025 guidance on 6-slide PDF, evaluator time and team composition.
- Divya Pharmacy v. Union of India (Uttarakhand HC, 21 Dec 2018): SCC Online blog, S.S. Rana, NLS ABS case summary.
- India AI Governance Guidelines (MeitY, 5 Nov 2025): PIB document and law-firm summaries. ICMR Ethical Guidelines for AI in Biomedical Research and Healthcare (2023): icmr.gov.in.
- NAMASTE and ICD-11 TM2: PIB releases on the TM2 launch; International Journal of Ayurveda Research roadmap article.
- Turmeric (USPTO 1997) and neem (EPO 2000/2005) cases: Mondaq, IIPRD, Legacy IAS summaries.
- GIGW 3.0: guidelines.india.gov.in. UX4G: ux4g.gov.in and negd.gov.in.
