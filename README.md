# IP-SAKTI Sahayak

**Every answer has a clause behind it.**

IP-SAKTI Sahayak is a guidance app for Ayurveda innovators: startup founders, registered vaidyas, researchers and growers. It helps them understand the intellectual property, drug-licensing and biodiversity rules that apply to their product, in **English, Hindi and Telugu**. Every statement the app makes links back to the specific law or guideline it rests on.

Built for the Smart India Hackathon, Problem Statement 26045.

> **Information, not legal advice.** Verify with the cited source or a registered IP professional before acting.

## What it does

The app walks a user through a **Case** in seven chapters:

| # | Chapter | What you get |
|---|---------|--------------|
| 1 | **Describe** | Describe your product, ingredients and situation |
| 2 | **Classify** | Your legal category and what it means for you |
| 3 | **Protect** | What you can patent, and which other IP (trade mark, design, copyright) to use |
| 4 | **Owe** | Biodiversity access and benefit-sharing duties, with a benefit-share estimate |
| 5 | **Say** | A label and advertisement claim checker |
| 6 | **Search** | Prior-art and traditional-knowledge search guidance |
| 7 | **Dossier** | A printable summary of the whole Case |

Product categories it classifies into: classical Ayurvedic drug, patent or proprietary medicine, new Ayurvedic drug, phytopharmaceutical drug, Ayurveda Aahara (food) and cosmetic.

### Features

- **Cited answers.** Ask a question by typing or by voice. Each sentence in the answer links to a source clause.
- **Source library.** A versioned register of statutes, rules and guidance, each with an authority tier, jurisdiction, version and legal status.
- **Legal time machine.** View the law as it read on a chosen date, for example before and after the Biological Diversity (Amendment) Act, 2023 took effect.
- **Claim check.** Paste label or advertisement text. Prohibited claims are flagged with the provision that prohibits them.
- **Prior art and TK proximity.** Compares a formulation against classical formulations. Paid sources such as TKDL open only after the user grants permission, and every grant is logged in a permission ledger.
- **Confidence and abstention.** Answers carry a confidence indicator. When a question is out of scope, the app declines and offers to escalate to a human IP facilitator.
- **Shareable and printable.** Case state can be shared via link, and the dossier has a print layout.
- **Installable PWA.** Works offline after the first load.
- **Accessible.** Light and dark themes, and axe accessibility checks run in CI.

## Tech stack

- React 19, TypeScript, Vite 6
- Tailwind CSS 4, Radix UI, Motion
- Wouter for routing
- MiniSearch for clause retrieval
- MSW (Mock Service Worker) for the in-browser API
- vite-plugin-pwa and Workbox for the service worker
- Vitest for unit tests, Playwright and axe-core for end-to-end and accessibility checks

## Getting started

**Prerequisites:** Node.js 20 or newer.

```bash
git clone https://github.com/muzammil-labs/ip-sakti.git
cd ip-sakti
npm ci
npm run dev
```

Then open the URL Vite prints, usually <http://localhost:5173>.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Typecheck and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |
| `npm test` | Run unit and engine tests (Vitest) |
| `npm run sizecheck` | Build, then verify the entry bundle is within the 200 KB gzip budget |
| `npm run shots` | Build, then screenshot every route in both themes and sizes, with overflow and axe checks |
| `npm run e2e` | Build, then run the Playwright end-to-end test of the demo path |

`shots` and `e2e` drive `playwright-core`, which ships without a browser. Set the `CHROME_PATH` environment variable to a Chrome or Chromium executable before running them.

## Architecture

This is currently a **frontend-only build**. There is no real server yet.

- Each API call is served in the browser by MSW handlers (`src/api/mock/handlers.ts`), which run the matching engine from `src/engines/`.
- [`openapi.yaml`](openapi.yaml) describes the intended production API (`/ask`, `/classify`, `/claims/check`, `/sources`, `/cases`, `/escalations`, `/consent`, `/audit`, and more). Moving to a real backend means pointing the client at a real base URL; the UI should not need to change.
- Some endpoints in the spec, such as `/retrieve`, `/tk-proximity`, `/abs` and `/cases/{id}/dossier`, are marked there as not yet backed by a real engine.

```
src/
├── api/        API client, types and MSW mock handlers
├── app/        Shell, top bar, routes, presenter mode, API inspector
├── chapters/   The seven Case chapters
├── data/       Source register, categories, rules, plants and formulations
├── engines/    Classification, asOf, claims, TK proximity, benefit share, dossier, confidence
├── i18n/       English, Hindi and Telugu strings
├── pages/      Home, Ask, Library, Source, How it works, Dossier print
├── panels/     Sahayak panel, time machine, clause sheet and other panels
├── state/      Case, session, coverage and store
└── ui/         Shared UI primitives
tests/          Unit, engine and Playwright end-to-end tests
scripts/        Bundle-size check and screenshot runner
legacy/         The earlier single-file prototype (IP-SAKTI-Sahayak-v6.html)
```

## Testing and CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every push to `main` and on pull requests:

1. Typecheck
2. Vitest unit and engine tests
3. Production build
4. Bundle-size check (initial JS at most 200 KB gzip)
5. Screenshots, overflow and axe checks on every route
6. Playwright end-to-end test of the demo path

## Deployment

The app is configured for **Netlify**. `netlify.toml` builds with `npm run build`, publishes `dist/`, and rewrites all paths to `index.html` so shared deep links do not 404.

## Data and sources

The source register lives in `src/data/sources.ts`. It covers, among others, the Patents Act, 1970, the Biological Diversity Act, 2002 (as amended in 2023), the Drugs and Cosmetics Act, 1940, the Drugs Rules, 1945, and IP India guidelines. Commentary is included but ranked below statutes by authority tier.

Answers may cite only what is in the register.

## Status

Work in progress. Several features currently run on mock data and rule-based engines. Voice input in the demo uses the browser's speech recognition and needs Chrome or Edge.

## License

No license has been specified yet.
