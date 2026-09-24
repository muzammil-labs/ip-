# Prompt for the next chat

Paste everything inside the box into a new Claude Code session on `muzammil-labs/ip-`. It is kept short on purpose: the detail lives in the repo, so the session reads only what each phase needs.

---

```
Project: IP-SAKTI Sahayak, our Smart India Hackathon entry for PS 26045 (Ministry of Ayush × AIIA). FRONTEND ONLY for now: every backend feature is shown through in-browser engines, a typed API client and MSW mocks. Never skip a feature because it "needs a backend".

1. Setup
- git fetch origin claude/stoic-lamport-0n2ux8 and work from that branch. It has the full app plus all plans. If this session is assigned another branch name, create it from origin/claude/stoic-lamport-0n2ux8 and push there.
- Run npm install.

2. Use the plans in the repo. They are the source of truth; do not re-plan or re-research.
- Read CLAUDE.md, then docs/plan/README.md.
- docs/plan/README.md has a "What to read per phase" table. Read ONLY the sections listed for the phase you are on, plus D0 (operating rules) and Part E (pre-flight) of docs/plan/MASTER-PLAN.md. Do not read the PDFs.
- Decisions in the plans are final (light-first "Clean Record" palette, remove Three.js and GSAP, Motion only, hash routing, real licence-checked plant images only, no rewording of legal content).

3. Work loop
- Execute docs/plan/MASTER-PLAN.md Part D in order, task by task, following D0 exactly.
- After each task: npm run typecheck and npm run build (and npm test once it exists). After each UI task: npm run shots (once it exists) or use the chrome-devtools MCP to screenshot the touched routes at 1440 and 390 in light mode, and fix anything that fails Part E.
- Commit per task with its ID (e.g. "UI-0.1: Fix Tailwind v4 grid syntax"). Push at the end of each phase.
- Write open questions to docs/plan/QUESTIONS.md and move on to the next independent task.

4. Tools
- chrome-devtools MCP is configured (scripts/chrome-devtools-mcp.sh). context7 and magic may be blocked by network policy; if so, continue without them and do not use generated components.
- Load the design-taste-frontend skill before UI work.

5. This session
- Do Phase 0 (UI-0.1 to UI-0.5), then Phase 1 if Phase 0 passes every check.
- At the end, stop and report: what changed, screenshot paths for touched routes, open questions, and the next phase.
```

---

## For later sessions

Use the same prompt and change only section 5, for example:

> 5. This session: Do Phase 2 (UI-2.1 to UI-2.20). At the end, stop and report as above.

## Before certain phases

- **Phase 4:** have the botanical images ready in `public/plates/src/` with `CREDITS.md`, or allow `commons.wikimedia.org` and `upload.wikimedia.org` in the environment's network settings.
- **Phase 6:** get the formulation reference set and the examiner rules reviewed (AIIA contact, patent agent); confirm the ABS Regulations 2025 numbers from the Gazette.

If a session drifts from the plan, reply: "Re-read D0 and Part E of docs/plan/MASTER-PLAN.md and redo the last task to that standard."
