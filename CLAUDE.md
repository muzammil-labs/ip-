# IP-SAKTI Sahayak

Ayurveda IP and regulatory guidance for Smart India Hackathon PS 26045 (Ministry of Ayush × AIIA).
React 19, TypeScript, Vite 6 (base "./"), Tailwind v4, Motion, Phosphor icons. Languages: en, hi, te.
**Frontend only for now.** Backend features are shown through in-browser engines, a typed API client and MSW mocks.

## Plans (source of truth)
Start with `docs/plan/README.md`. It lists every plan and what to read for each phase.
- `docs/plan/MASTER-PLAN.md`: the build spec. Part D (tasks) + D0 (operating rules) + Part E (pre-flight) govern all work.
- `docs/plan/SPOTLIGHT.md`: stand-out features (Phase 8).
- `docs/plan/FINALS-STRATEGY.md`: product strategy, legal corrections, demo script, judge Q&A.

## Commands
- npm run dev / build / preview / typecheck
- npm test (Vitest), npm run shots (screenshots of every route, light and dark, 1440 and 390)

## Rules
- Use only token-based Tailwind classes (bg-canvas, text-ink-2, border-line, rounded-control, rounded-container, text-h1, ...). No hex values or raw px sizes in components.
- Compose screens from src/ui primitives. No one-off styles.
- Motion library only (motion/react). No GSAP, no Three.js.
- Every visible string goes in the en, hi and te translation files.
- No em-dashes or en-dashes in UI copy. One label per intent: "Start a case", "Ask Sahayak".
- Do not reword legal statements, citations, category rules or claim rules. Report doubts in docs/plan/QUESTIONS.md.
- Routes are hash-based (wouter useHashLocation) because vite base is "./".
- Chapters call src/api (MSW-mocked), not engines directly.
- Light theme is the default and the designed theme; dark must stay complete.

## Tools
- chrome-devtools MCP starts via scripts/chrome-devtools-mcp.sh (pre-installed Chromium in the cloud). Use it to inspect and screenshot the preview build.
- Load the design-taste-frontend skill (.claude/skills) before UI work.
