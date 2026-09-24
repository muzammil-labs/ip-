# IP-SAKTI Sahayak: Spotlight Playbook

How to make the project stand out in a field of more than fifteen public entries for PS 26045 that nearly all use the same stack. Everything here works with a **frontend-only build** (engines, mocks and static data in the browser); items marked *(team)* need people, not code.

Ranked by impact on the jury per day of effort.

## Tier 1: build these (they decide whether you are remembered)

### 1. Put a printed dossier in the judges' hands *(team + UI-6.4)*
Print five copies of the bilingual Pathway Report for the demo case (A4, colour, stapled) and hand them over when you reach the dossier step. Most teams will show only screens, so a document the judges can hold and keep sets you apart. The QR on the cover opens the same case live on their phone.
*Effort:* printing plus UI-6.4. *Risk:* none.

### 2. Judges follow along on their own phones
Slide 1 carries a large QR code that opens the PWA on the demo case (`#/case/describe?c=…`). Judges can tap along while you present, and try their own question afterwards. Being able to use the product during the pitch turns them from spectators into users.
*Effort:* half a day (share links exist from UI-3.4). *Risk:* venue Wi-Fi; the PWA caches after first load, so ask them to scan at the start.

### 3. Examiner's view (new, frontend-only)
A toggle on any Case: "See this as a patent examiner would." It lists the objections an examiner is likely to raise, in the order a First Examination Report would: §3(p) traditional knowledge, §3(d) new form, §3(e) admixture without synergy, §3(i) method of treatment, §10(4)(d)(ii)(D) source and origin disclosure, §25(1)(j)/(k) opposition grounds. Each objection shows **what evidence answers it** and whether the Case already has it. Built from the existing classify rows plus a rules table; it cites the 2025 AYUSH examination guidelines.
This is the feature the patent attorney on the panel will talk about afterwards.
*Effort:* 2 days. *Content:* rules table reviewed by your patent agent.

### 4. The Rule 170 test: a general chatbot versus IP-SAKTI *(team)*
Before finals, ask a general chatbot the advertising question ("Do I need State approval before advertising my Ayurvedic churna?"). Screenshot the answer with the date visible. On one slide, show it next to IP-SAKTI's time-machine answer with the dated events. If the general chatbot happens to get it right, don't use the slide; never stage or edit this comparison. When it holds up, it is the clearest proof of why a versioned corpus matters.
*Effort:* an hour. *Risk:* must be genuine and dated.

### 5. A live coverage tracker for the 17 PS requirements
In presenter mode, a slim bar at the top shows the 17 requirements of the problem statement. Each ticks green when the demo touches the screen that satisfies it (classification, jurisdiction switch, ABS helper, TKDL pointer with consent, abstention, escalation, multilingual, disclaimer, audit…). By the end of five minutes all 17 are ticked, in front of judges who are scoring against that same list.
*Effort:* 1 day (reuses `data/coverage.ts`). *Risk:* none.

## Tier 2: strong additions if Tier 1 is done

### 6. Where the benefit-sharing money goes
Beside the benefit-share estimate, a simple flow: company → NBA → Biodiversity Management Committee → local community, with the Regulation's share retained by the NBA. It turns a compliance number into impact for farmers, which Ministry judges care about. Use only confirmed percentages.
*Effort:* 1 day after UI-6.3.

### 7. "Law changed since you last opened this case"
When a saved Case is reopened and the corpus version is newer, a banner lists the clauses that changed and the rows they affect, each with a Shift highlight. It shows the product keeps working after day one. Demo it by loading a case saved "in 2024".
*Effort:* 1 day after UI-6.2.

### 8. Invite a judge to try to break it
A "Try to trick it" box on How it works, preloaded with five adversarial prompts (dosing, grant prediction, "ignore your rules", a prompt injection hidden inside ad copy, an out-of-domain question) plus free text. Each shows the guardrail that fired. Offering the keyboard shows you are confident the guardrails hold.
*Effort:* 1 day (reuses the mini-bench red-team set).

### 9. Real people on screen *(team)*
- A 20-second video of a real Ashwagandha grower or FPO member asking a question in Hindi or Telugu and hearing the answer read aloud. Get consent in writing.
- One quote each from your AIIA reviewer and your patent agent, with names, on the Trust slide.
- The 5-person usability test result: task success count and one quote.
Evidence from real users counts for more with the jury than further polish.

### 10. Airplane-mode moment
During the Kisan step, switch on airplane mode on the phone and keep going: "This is how it works in a village with no signal." It takes three seconds and supports the rural-reach claim with a live demonstration.
*Effort:* none once the PWA ships.

## Tier 3: polish that compounds

- **Lighthouse and axe results on screen** (accessibility 100, zero serious axe issues) in How it works, with the CI badge.
- **Open the mini-bench** as a small public dataset in the repo (questions, gold clause IDs, expected abstentions) under a clear licence, and say so on the roadmap slide. It supports the public-good story.
- **One consistent name for every feature** across app, deck, dossier and script: Case, Chapters, Sahayak, Examiner's view, Time machine, TK proximity, Dossier. Judges remember named things.
- **A 30-second silent screen recording loop** for the stall or poster session, and a printed A3 poster that mirrors the §5 diagram.

## What not to do

- Do not claim TKDL integration. Say "pointer and consented query".
- Do not show accuracy numbers you did not measure. Show the live mini-bench.
- Do not add AI-generated plant images or fake testimonials.
- Do not add more animation. The polish judges notice comes from consistency, and the master plan already covers that.
- Do not spread the demo across more than one device.

## How these map to the master plan

| Idea | Depends on | Suggested slot |
|---|---|---|
| 1 Printed dossier | UI-6.4 | Phase 6 |
| 2 Phone follow-along | UI-3.4, UI-5.2 | Phase 5 |
| 3 Examiner's view | UI-4.3, UI-6.5 | New task UI-6.7 |
| 4 Chatbot comparison | none | Team, week 4 |
| 5 Coverage tracker | UI-7.2 | New task UI-7.5 |
| 6 Benefit flow | UI-6.3 | New task UI-6.8 |
| 7 Law-changed banner | UI-6.2 | New task UI-6.9 |
| 8 Try to trick it | mini-bench | New task UI-7.6 |
| 9 Real people | none | Team, weeks 2 to 4 |
| 10 Airplane mode | UI-5.2 | Rehearsal |
