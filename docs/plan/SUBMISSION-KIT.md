# IP-SAKTI Sahayak: Submission Kit (SIH 2026 national screening)

Ready-to-use content for every field of the idea submission, based on the official template walkthrough and on first-hand accounts from people who evaluated SIH 2023 to 2025 screening rounds (see §8). Target submission: **27 Sep 2026**. Verify every limit on the portal itself; the numbers here are as reported by evaluators.

---

## 1. What evaluators actually do (from people who did it)

- **Time per idea is under 5 minutes.** One official evaluator was given **100 ideas for one problem statement and one day** to score them. Another scored **about 257 ideas across 3 to 4 statements** in 2025.
- **What got teams eliminated in 2025** (from the evaluator who scored 257 ideas):
  1. **Breaking the template.** More than 6 slides (one team sent 22) or a modified template led to elimination.
  2. **Clutter.** About **half** of that evaluator's eliminations were slides too dense to read: no white space, data dumped, message lost.
  3. **Feature dumping.** Many extra features hid the core solution.
  4. **No flow or architecture diagram.** About **120 of 257** submissions lacked one, losing roughly half the points on the technical slide.
  5. **What the finalists had in common:** all five teams that went through from that pile had a **strong demo video**.
- **Additional documents were not visible to evaluators** on the 2025 portal (reported by several evaluators). Do not rely on them; put everything that matters in the PDF and the video.
- **A statement can have zero finalists** if the panel is not satisfied. In SIH 2022, around 250 statements had none.
- **The expected-solution section of the PS is now detailed**, so every serious team will cover the same items. Uniqueness has to come from somewhere else (see STRATEGY-V9 §4).
- **Evaluation order is still unknown.** Nobody describes the order within a statement's pile. Ideas appear to be split into batches per evaluator (about 100 each), which makes a global "first 100" advantage even less likely. Submit on the 27th anyway, for safety.
- Deadlines were **extended** for some statements in 2025 (to mid-October). Do not plan around an extension.

## 2. Portal fields (team leader fills them after logging in with SPOC-issued credentials)

| Field | Limit (as reported) | Content |
|---|---|---|
| Problem statement | select | SIH26045 |
| **Idea title** | **about 100 characters** | §3 |
| **Idea description** | **about 50,000 characters** (a detailed breakdown) | §5 |
| **Abstract / summary** | **about 10,000 characters** (an overview; some evaluators read only this) | §4 |
| Idea PDF | 6 slides, official template, PDF only | §6 |
| **Demo video link** | optional field; YouTube (unlisted) or Drive | §7 |
| Additional documents | optional; were not visible to evaluators in 2025 | Business model canvas PDF, only as a backup |
| Team details, mentor details | up to 2 mentors (academic or industry) with phone and email | Double-check spellings |

**Admin mistakes that have knocked teams out:** a misspelled team leader email (no credentials arrive, and the college cannot swap in another team); a team name that differs between portal, bonafide and SPOC records; uploading an old or empty PDF. Open the final PDF from the upload page before submitting.

## 3. Idea title (≤ 100 characters)

Pick one:

1. `IP-SAKTI Sahayak: Protect Ayurvedic innovation, defend India's TK, a clause behind every answer` (95)
2. `IP-SAKTI Sahayak: Cited IP, ABS and claims guidance for Ayurveda, from formulation to dossier` (93)
3. `IP-SAKTI Sahayak: Every Ayurveda IP answer cited to the clause, India and global kept apart` (91)

Recommended: **1** (it carries the two-mission idea).

## 4. Abstract (overview; about 2,600 characters, well under the limit)

> **Problem.** An Ayurveda innovator must navigate patents, geographical indications, trade marks, designs, copyright, plant-variety rights, the Biological Diversity Act and its access-and-benefit-sharing (ABS) duties, and the drug, advertising, food and cosmetic regimes, all at once, while the law keeps changing (Rule 170 on Ayurvedic advertising was omitted in July 2024, the omission was stayed in August 2024, and the stay was vacated in August 2025). General chatbots blend Indian and foreign law, cite nothing verifiable and do not know when a rule changed. Meanwhile India's traditional knowledge remains exposed to misappropriation abroad.
>
> **Solution.** IP-SAKTI Sahayak is a multilingual, citation-grounded assistant that first classifies the product (classical, proprietary, new ASU drug, phytopharmaceutical, Ayurveda Aahara or cosmetic) with a few adaptive questions, because every IP and ABS answer depends on that category. It then walks the user through one case: what they can protect, what they owe (licence route, ABS duties, benefit-sharing estimate), what they may claim on labels and ads, and where to search prior art, ending in a cited, bilingual dossier a SIPP facilitator or patent agent can act on.
>
> **Key innovations.** (1) Indian and international answers in two visibly separate columns with separate citations. (2) Confidence computed from the evidence (source authority, verified coverage, agreement), never self-reported by the model. (3) A version-tracked corpus with effective dates, so answers follow the law as it changes. (4) TK proximity: a formulation, or a foreign patent's claims, compared against classical formulations to flag Section 3(p) risk and to support challenges to misappropriation abroad. (5) Claim screening that catches Ayurvedic disease terms such as Madhumeha, not only English words. (6) Honest abstention on clinical or predictive questions, with a consented hand-off to a human IP facilitator.
>
> **Feasibility.** The prototype runs in the browser with deterministic, tested engines and a typed API contract. Stage 1 adds a FastAPI backend with hybrid retrieval over clause-level chunks and sentence-level citation verification; Stage 2 the knowledge graph and agentic orchestration; Stage 3 paid-source connectors and full Bhashini voice. English, Hindi and Telugu; DPDP-aligned privacy; mapped to India's AI Governance Guidelines (2025).

## 5. Idea description (detailed; about 7,500 characters, structured as evaluators recommend)

> **1. Problem analysis**
> Ayurvedic products sit at the intersection of IP law, biodiversity law and drug, advertising, food and cosmetic regulation. The category of the product (classical, proprietary, new drug, phytopharmaceutical, Ayurveda Aahara, cosmetic) changes everything: a classical formulation is largely traditional knowledge barred from patenting under Section 3(p) of the Patents Act, while a new drug has genuine patent potential but must generate evidence. Practitioners, researchers, startups, MSMEs and cultivators lack a single place that answers "what is my product in law, what can I protect, what do I owe, what may I claim" with the exact clause behind each statement. The law also moves: the 2024 Patent Rules, the Biological Diversity (Amendment) Act 2023 and 2024 Rules, the BD (Access and Benefit Sharing) Regulations 2025, the CGPDTM guidelines for examining AYUSH-related inventions (23 September 2025), the WIPO GRATK Treaty (2024) and the Rule 170 litigation. Existing resources are either general chatbots (no versioned law, no jurisdiction separation, no verifiable citations) or specialised databases such as TKDL (prior art, not guidance).
>
> **2. Users and their jobs**
> Startup founder: can I patent my extract, and what must I register with the National Biodiversity Authority? Vaidya making a classical formulation: what can I protect if the recipe is traditional knowledge? Researcher: what does GRATK change? Cultivator: do I need any permission to sell my Ashwagandha to a company? SIPP facilitator or AIIA IP cell: a triaged, cited case file instead of a vague query.
>
> **3. Proposed solution**
> One case, seven steps. Describe the product (text, voice or label photo) → Classify it with the minimum clarifying questions → Protect (patent, trade mark, design, copyright, GI, plant variety, trade secret, each cited) → Owe (licence route, ABS duties from source of material and type of entity, benefit-sharing estimate) → Say (label and advertising claims checked against the Drugs and Magic Remedies Act Schedule, CCPA guidelines, FSSAI Ayurveda Aahara and Cosmetics Rules) → Search (prior-art queries for free databases, and the user's paid subscriptions only with explicit, logged, revocable permission) → Dossier (a cited, bilingual report with a verification code). A conversational assistant, Sahayak, is available at every step and knows the case context.
>
> **4. How it answers the PS line by line**
> Jurisdiction toggle with two separate answer sets; formulation classification; routing across all IP types; ABS helper; TKDL and prior-art pointer; mandatory citations with a computed confidence indicator; escalation to a human IP facilitator; multilingual delivery via Bhashini with glossary-locked legal terms; standing "information, not legal advice" disclaimer; DPDP-aligned privacy, audit trail and consent ledger; version-tracked corpus of statutes, rules, treaties, pharmacopoeial standards, registry records and case law; relational knowledge graph and agentic multi-source orchestration; staged build; evaluation on answer accuracy, citation correctness, safe abstention and multilingual quality.
>
> **5. Technical implementation**
> Corpus chunked per clause with metadata (instrument, section, jurisdiction, authority tier, status, effective from and to, language). Hybrid retrieval (dense plus BM25) per jurisdiction. Orchestration: classify → retrieve India → retrieve international → draft → verify each sentence against its cited clause (entailment check; unsupported sentences are removed) → compute confidence → compose, or abstain. Deterministic engines for classification, ABS duties, claim screening and TK proximity, so these results are auditable and testable. Relational graph of clauses, cases, categories and plants (amends, cites, applies-to, interprets). Answer cache keyed by question, case and corpus version; a gazette watcher invalidates only answers that cited a changed clause. Model-agnostic LLM adapter with an open-weight option on government cloud for data sovereignty. Prototype: React and TypeScript frontend with in-browser engines, a typed API contract and mock service, installable and usable offline.
>
> **6. Feasibility and risks**
> Stage 1 needs about 40 legal instruments and a rules engine, which a student team can build and test. Risks and mitigations: law changes (effective-dated corpus, watcher, visible "law changed" flags); hallucination (retrieval-only citations, sentence verification, abstention); TKDL access limits (pointer and consented queries only, no scraping); translation errors in legal terms (official Hindi texts where they exist, glossary lock, back-translation, human review); low bandwidth (offline-capable app, small bundle).
>
> **7. Impact**
> Innovators protect what is genuinely new and stop paying for applications barred by Section 3(p); cultivators learn their exemptions and their right to benefit sharing; facilitators receive structured cases; advertisers avoid prohibited claims before publication; India gains a tool that helps detect and challenge misappropriation of its traditional knowledge abroad, continuing the path of the turmeric (USPTO, 1997) and neem (EPO, 2000/2005) revocations.
>
> **8. Innovation and research**
> Formulation-level TK proximity against classical references; Ayurvedic morbidity terms (aligned with the Ministry's NAMASTE terminology and WHO ICD-11 Chapter 26) in claim screening; a legal time machine that shows how an answer changes across dates; computed confidence; landmark cases such as Novartis v. Union of India (2013) on Section 3(d) and Divya Pharmacy v. Union of India (Uttarakhand HC, 2018) on benefit sharing by Indian companies. Research sources are listed in the PDF's last slide.

## 6. The 6 slides, in the official template's order

The official template's slide order and headings are fixed. Do not reorder or rename them. Fill each placeholder; delete the template's instructions slide (slide 7) before exporting. No animations. No watermarks. Diagrams exported as SVG or at high DPI. Consistent fonts, sizes and colours; links in one colour. **Use titled hyperlinks, not QR codes and not URL shorteners** (evaluators do not scan QR codes on a PDF, and shortened links can expire).

**Slide 1: Title page.** Problem Statement ID SIH26045; official PS title; theme; category Software; team ID and team name exactly as registered.

**Slide 2: Proposed solution.** Three prompts, in bullets:
- *Detailed explanation:* one-line positioning ("Protects Ayurvedic innovation and defends India's traditional knowledge, with a clause behind every answer"); the seven-step case flow as a small diagram; one real screenshot of the prototype (answer with cite chips).
- *How it solves AIIA's challenge:* classification first; India and international kept apart; cited, versioned, abstains when unsure; hands off to a human facilitator.
- *Innovation and uniqueness:* the five or six differentiators from §4, one line each, plus a compact comparison table against general chatbots, TKDL and IP India resources (columns: cites clauses, India/international split, tracks law changes, classifies formulation, ABS helper, TK defence, Hindi/Telugu voice).

**Slide 3: Technical approach** (carries the most weight).
- *Technologies:* written out as text, not only logos (React, TypeScript, Vite, Tailwind, Motion; FastAPI, Pydantic; Qdrant hybrid dense+BM25; PostgreSQL graph tables; model-agnostic LLM adapter with open-weight option on MeghRaj; Bhashini ASR/NMT/TTS; IndicTrans2 fallback; MiniSearch and Web Workers in the prototype; Vitest, Playwright).
- *Methodology:* **one clear architecture or flow diagram** (ingestion of clause-level corpus → retrieval per jurisdiction → verify → confidence → answer or abstain → escalate), plus the confidence formula in one line.

**Slide 4: Feasibility and viability.** Feasibility in three lines (prototype built; Stage 1 scope; staged plan). A risk table with mitigations (law changes, hallucination, TKDL access, translation of legal terms, low bandwidth, data privacy). Compliance line: DPDP, India AI Governance Guidelines 2025, ICMR AI ethics 2023, GIGW 3.0-aligned accessibility.

**Slide 5: Impact and benefits.** By audience (innovators and MSMEs, vaidyas, cultivators, researchers, SIPP facilitators and AIIA IP cell, exporters, the nation's TK). Social, economic and environmental benefits (benefit sharing to biodiversity management committees). Quantified only where you have a real, sourced number or a measured prototype result (for example "prototype evaluation: N of N citations resolve to a versioned source; N of N unsafe prompts abstained"). No invented market figures.

**Slide 6: Research and references.** 8 to 10 primary sources (Patents Act sections; CGPDTM AYUSH guidelines 2025; BD Act 2002 as amended 2023 and ABS Regulations 2025; D&C Act and Rule 158B; DMR Act; FSS Ayurveda Aahara Regulations 2022; Novartis 2013; Divya Pharmacy 2018; WIPO GRATK 2024; NAMASTE / ICD-11 TM2), each as a titled hyperlink. Titled links to the **live prototype** and the **demo video**. "Reviewed by" line if you have an expert. Use leftover space for the comparison table if it did not fit on slide 2.

**Before export:** the first two slides must hook in seconds; leave white space; one message per slide; no paragraphs.

## 7. Demo video (≤ 2 minutes, English, one narrator, own voice)

Evaluators said videos over 3 minutes are skipped in favour of the PDF, and several advise 2 minutes as the maximum. Record with OBS (screen plus optional webcam). Upload to YouTube as **Unlisted** (never Public: competitors search the PS number) or share from Drive with view access. Show the real prototype working; do not edit the video to fake behaviour.

| Time | Screen | Narration (approximate) |
|---|---|---|
| 0:00 to 0:15 | Rule 170 timeline | "In thirteen months the rule on advertising Ayurvedic medicines was removed, frozen by the Supreme Court and then allowed to lapse. A tool trained on last year's law gives the wrong answer today. IP-SAKTI answers with the clause, and knows when it changed." |
| 0:15 to 0:35 | Home, start a case | "IP-SAKTI protects Ayurvedic innovation and defends India's traditional knowledge. It first classifies your product, because the category decides everything else." |
| 0:35 to 1:05 | Classify → answer with two columns, click a cite chip, open the agent trace | "India and international law stay in separate columns. Every sentence carries a clause. Confidence is computed from the evidence, and here is how the answer was built." |
| 1:05 to 1:20 | Claim check with "Madhumeha" | "An advert says it cures Madhumeha. That is diabetes, which no drug may be advertised to treat. Most tools miss the Ayurvedic term." |
| 1:20 to 1:35 | Switch to Hindi, voice question, read aloud | "A cultivator asks in Hindi by voice. Same corpus, same citations, legal terms locked." |
| 1:35 to 1:50 | Abstain on a dosing question; escalate with consent | "When the evidence runs out it says so and hands off to a human facilitator." |
| 1:50 to 2:00 | PS coverage page | "Every requirement of the problem statement, mapped to where it works. Thank you." |

## 8. Pre-submission checklist

- [ ] Team leader email and team name match everywhere (portal, bonafide, SPOC list).
- [ ] PDF is the **final** file, exactly 6 slides, official template unmodified, instructions slide deleted, opened and checked after export (fonts, diagrams, links).
- [ ] Every slide has white space; one message per slide; a flow or architecture diagram on slide 3.
- [ ] No QR codes, no URL shorteners, no watermarks, no animations.
- [ ] Idea title ≤ 100 characters; abstract and description pasted and proofread.
- [ ] Demo video ≤ 2 minutes, unlisted, link opens in a private browser window.
- [ ] Live prototype link opens fast on a phone over mobile data, in light mode, with no broken states.
- [ ] Every team member has reviewed everything; faculty mentor has reviewed it.
- [ ] Every team member can explain the solution and the law behind it (the finale questions everyone).
- [ ] Screenshot of the submitted entry saved.

## 9. Sources (evaluator and participant accounts, 2023 to 2025)

- Codehunters Academy (SIH 2022 winner; SIH 2023 to 2025 evaluator): "Crack SIH 2025/2026 Idea Submission: Abstract, Demo Video & Business Model"; "SIH 2025 Results: Key Mistakes From an Evaluator Perspective"; "SIH 2025 Complete Roadmap: SIH Evaluation Experience".
- BlinkNBuild: "SIH 2026 Official PPT Template Walkthrough".
- Mayank Yadav: "SIH 2025 Screening Round: PPT & Demo Video Tips, Mistakes to Avoid".
- Divya Kaurani (SIH 2024 winner): "SIH 2025 Screening Round: Common PPT Mistakes to Avoid".
- Surrvesh Joshua (SIH official evaluator for screening): "SIH Idea Submission 2025: Common Mistakes & Winning Strategy".
