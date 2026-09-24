# Prompt for the next chat

Copy everything inside the box into a new Claude Code session on the `muzammil-labs/ip-` repo.

---

```
You are continuing IP-SAKTI Sahayak, our Smart India Hackathon entry for PS 26045 (Ministry of Ayush × All India Institute of Ayurveda): an assistant that tells an Ayurveda innovator what their product legally is, what they can protect, what they owe under biodiversity law and what they may claim, with a clause-level citation under every sentence, India and international law kept separate, computed confidence, and honest abstention.

SCOPE: FRONTEND ONLY for now. There is no backend. Every backend feature must still be shown working at frontend level: deterministic engines in the browser, a typed API client against openapi.yaml, and MSW (Mock Service Worker) serving that contract with realistic latency. Never skip a feature because "it needs a backend"; build the frontend path and the mock.

REPO AND BRANCHES
- Repo: muzammil-labs/ip-
- Start from branch claude/stoic-lamport-0n2ux8. It contains all app code (same as claude/vibrant-noether-leqb9g at 61921a8) plus the plans in docs/plan/. If this session is assigned a different working branch, create it from claude/stoic-lamport-0n2ux8 and push there.
- Existing PR: https://github.com/muzammil-labs/ip-/pull/1 (from claude/vibrant-noether-leqb9g). Netlify (https://ip-sa.netlify.app/) auto-deploys that branch. When a phase is done, tell me so I can point Netlify at the new branch or merge.
- Stack: React 19, TypeScript, Vite 6 (base "./"), Tailwind v4, Motion, Phosphor icons. Languages: English, Hindi, Telugu.

READ FIRST, IN THIS ORDER
1. docs/plan/MASTER-PLAN.md: the spec you execute. Part A is the audit, Part C the design system ("The Clean Record", light-first), Part D the task-by-task plan with operating rules in D0, Part E the pre-flight checklist, and the appendices hold the exact token CSS, Tailwind mapping, CLAUDE.md content, screenshot script and MCP config.
2. docs/plan/SPOTLIGHT.md: features that make us stand out (Phase 8 in the master plan).
3. docs/plan/IP-SAKTI-Finals-Implementation-Plan.pdf (v7): product strategy, legal corpus corrections (§9), demo script (§12), judge Q&A (§13), and facts to verify before presenting (§16).
4. The src/ tree and recent commits.

DECISIONS ALREADY MADE (do not reopen)
- Complete UI overhaul into one homogeneous product: four destinations (Home, Case, Library, How it works), the Case as seven chapters (Describe, Classify, Protect, Owe, Say, Search, Dossier), Ask becomes the Sahayak panel on every page. Hash routing with wouter.
- Light mode is the primary, designed theme. Palette: canvas #F7F9F6, surface #FFFFFF, ink #0B1A13, single accent neem #0B6B45; haldi #8A5A00 only for changed/needs input, kumkum #B3261E only for risk, indigo #2F4BC8 only for focus and links. All pairs contrast-checked in the plan. Dark mode stays complete but is secondary.
- Remove Three.js, @react-three/fiber and GSAP entirely (including the WebGL hero, sticky-stack, horizontal pan, magnetic button, curtain wipe). Motion library only, three named motions (Thread, Stamp, Shift), reduced motion respected.
- Botanical plates: real, licence-checked images only (Wikimedia Commons, public domain or CC BY/BY-SA with credits). No AI-generated plant images. Until files exist, the Plate component shows its empty state.
- Anek font family (Latin, Devanagari, Telugu) self-hosted; six text sizes plus mono; 16px minimum body.
- Do not reword legal statements, citations, category rules or claim rules. Structure them only. Put doubts in docs/plan/QUESTIONS.md.
- No em-dashes or en-dashes in UI copy. One label per intent: "Start a case", "Ask Sahayak".

KNOWN BUGS TO FIX FIRST (Phase 0)
- Tailwind v4 arbitrary values written with commas collapse the layout: src/screens/Overview.tsx:46 and :92, Blueprint.tsx:57, PriorArt.tsx:156, SourceDrawer.tsx:27. Use underscores.
- The language switch is hidden on mobile (src/App.tsx:95, "hidden sm:flex"). Hindi/Telugu must be reachable on phones.
- ink-3 text fails contrast (3.66:1). Fixed by the new tokens.
- Netlify injects a "Powered by Netlify" badge over the footer. That is a Netlify site setting; tell me and I will turn it off.

TOOLS
- MCP: chrome-devtools works through scripts/chrome-devtools-mcp.sh (uses the pre-installed Chromium at /opt/pw-browsers). Use it to open pages, take screenshots, run scripts and run Lighthouse on the preview build. context7 and magic only work if mcp.context7.com and mcp.21st.dev are allowed in the environment's network settings; if they fail, carry on without them. Do not use generated components from magic; the plan requires our own primitives.
- The design-taste-frontend skill is in .claude/skills. Load it before UI work; its pre-flight rules are already folded into Part E.
- Screenshot script: scripts/shots.mjs (Appendix E) with playwright-core and executablePath /opt/pw-browsers/chromium-1194/chrome-linux/chrome.

HOW TO WORK
- Execute Part D phase by phase, task by task, in order, following D0 exactly.
- After every task: npm run typecheck, npm test, npm run build. After every UI task: npm run shots, look at the light-mode screenshots at 1440 and 390 for the routes you touched, and fix anything that fails Part E before committing.
- Commit per task with the task ID (for example "UI-2.10: Add CiteChip primitive"). Push at the end of each phase.
- At the end of each phase, stop and give me: what changed, the screenshots of the touched routes, any open questions, and what the next phase will do.

START NOW WITH PHASE 0 (UI-0.1 to UI-0.5), then continue into Phase 1 if Phase 0 passes all checks.
```

---

## Tips for running it

- **One phase per session** keeps each session focused and cheaper. Open a new chat with the same prompt and change only the last line (for example "Start with Phase 2").
- **Before Phase 4**, collect the botanical images (or allow `commons.wikimedia.org` and `upload.wikimedia.org` in the environment's network settings).
- **Before Phase 6**, get the formulation reference set and the examiner rules reviewed by your AIIA contact and patent agent, and confirm the ABS Regulation 2025 numbers from the Gazette.
- If a session starts drifting from the plan, reply with: "Re-read D0 and Part E of MASTER-PLAN.md and redo the last task to that standard."
