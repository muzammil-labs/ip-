# Phase 9: Professional polish and wow factor

**For the executing model (Sonnet).** This plan makes IP-SAKTI look like a finished, premium product in both themes and adds a small number of memorable visual moments. It was written after a screenshot audit of every route at 1440 and 390 widths in light and dark. Read this whole file before the first task.

- Branch: the branch you are told to use. Commit per task with the task ID (`UI-9.4: ...`). Push after each block (A, B, C, D).
- Still binding from `MASTER-PLAN.md`: **D0** (operating rules), **Part E** (pre-flight), **C3** (type scale), **C4** (radius, widths, elevation), **C8** (copy rules). Also `CLAUDE.md`: tokens only, primitives only, Motion only, every string in en, hi and te, no em-dashes or en-dashes in UI copy, do not reword legal text.
- Load the `design-taste-frontend` skill before starting (see `CLAUDE.md`).
- **Nothing here changes legal meaning.** New copy is marketing and UI copy only; the exact strings are given in each task.

---

## 0. Amendments to MASTER-PLAN (these override it where they conflict)

The master plan was written to rescue a noisy site, so it banned all decoration. The owner now wants a premium look with a wow factor for the finals. These amendments loosen exactly what is needed and nothing more.

| # | Master-plan rule | Amended rule |
|---|---|---|
| A1 | C1 dials 4 / 4 / 5 | Two zones. **Showcase zone** (Home, How it works, the Dossier completion moment): VARIANCE 6, MOTION 6, DENSITY 4. **Work zone** (the seven chapter screens, Ask, Library tables): unchanged at 4 / 4 / 5. Wow effects live in the showcase zone and at chapter completion, never while someone is filling a form. |
| A2 | C2 "No gradients on UI surfaces" | Allowed: (a) one soft radial glow per showcase hero, (b) the scrim inside Plate, (c) the new `--neem-deep` band may carry a subtle radial highlight. Still banned: gradient buttons, gradient text, gradient borders. |
| A3 | C5 "no infinite loops" | One slow ambient loop is allowed, only in the Home hero illustration (UI-9.15), 6s or slower, amplitude of 2 degrees or less, paused when off-screen, off under reduced motion. Nothing else loops. |
| A4 | C5 "exactly three named motions" | Add `fadeUp` and `staggerContainer` (already in `src/ui/motion.ts`), plus `sprout`, `leafFall` and `themeReveal` defined in this plan. |
| A5 | C6 "Seal is the only custom SVG" | Also allowed: `BotanicalMark` (exists, Plate placeholder), `VineRail` (UI-9.13), `Leaf` shapes used by `LeafFall` (UI-9.14) and `KolamPattern` (UI-9.17). All are decorative, `aria-hidden`, `pointer-events-none`, and use `currentColor`. Icons are still Phosphor only. |
| A6 | C4 section gap 96 / 64 | Unchanged, but `src/ui/Section.tsx` currently produces **128px** between stacked sections (py-16 + py-16). UI-9.2 fixes it to the C4 value. |

Everything still must pass: `prefers-reduced-motion` renders the final state with no motion; both themes complete; no horizontal overflow at 390; zero serious or critical axe violations; bundle check passes.

---

## 1. Audit findings (what is wrong today)

Evidence: `npm run shots` output, reviewed route by route.

1. **Screenshots were lying.** Full-page shots rendered most of Home blank because scroll-reveal sections never enter the viewport in a full-page capture. Real visitors see them; our review tooling did not. (UI-9.1)
2. **Home hero is lopsided.** The left column (headline, lede, two buttons) ends around 260px down; the right column (plate plus overlapping answer card) runs about 650px. The result is a large dead area under the buttons on desktop.
3. **Home examples orphan a card.** Four example cases in a three-column grid leave the fourth alone on a second row. All four tiles show the same illustration at the same angle, and on mobile each tile is a full 4:3 image, which makes Home about 4,700px tall.
4. **"Why trust it" has an empty card.** The tall left card (row-span-2) holds two lines of text and a link, then 200px of nothing.
5. **Home just stops.** After "Why trust it" the page ends at the disclaimer. There is no closing call to action.
6. **Section rhythm is too loose** on every chapter, Library and How it works screen: 128px between sections, so Describe needs three screens of scrolling for six short form groups.
7. **Library table:** "Tier 0" wraps onto two lines in every row, doubling row height for the whole register.
8. **Describe** uses a single 760px column on a 1440px screen with the summary at the very bottom; the "Your case so far" summary is the most useful thing on the page and nobody sees it while filling the form.
9. **How it works** is 4,700px of stacked sections with no in-page navigation.
10. **Ask** shows a large empty area under the controls before a question is asked.
11. **Dark mode** is correct but flat: surfaces, washes and lines are so close in value that cards barely separate from the canvas.
12. **A thorny vine prototype was tried and rejected.** Drawn as a thin stroked stem with triangular thorns, it read as barbed wire perched on the hero tile, not as botany. Do not rebuild it. The vine idea survives in a better form as UI-9.13 (a growing vine that shows chapter progress) and one leafy ornament in UI-9.8.

---

## 2. Design direction

> Reading this as: a **finals-ready, trust-first legal guidance product** for Ayurveda makers and a government jury, with a **calm, botanical, document-like language that comes alive at moments of progress**, leaning toward **our existing Tailwind v4 tokens, Phosphor icons, Anek type and Motion**.

The concept is **"The Living Record"**: the product is still a clean legal record (paper, ink, one neem accent), but it **grows** as your case grows. Leaves appear when chapters complete; the dossier is sealed with a stamp; the hero sprig breathes. Every animation means something, which is why it will not feel gimmicky to a jury.

### 2.1 Palette

Keep the single neem accent and the strict semantic colours. Add depth, not hue. Changes are to `src/styles/tokens.css` (and the Tailwind mapping in `src/styles/global.css` for any new token). All pairs below were contrast-checked.

**Light (the designed theme)**

| Token | Old | New | Notes |
|---|---|---|---|
| `--canvas` | `#F7F9F6` | `#F6F8F5` | Marginally cooler; ink-3 on it 5.70:1 |
| `--surface` | `#FFFFFF` | unchanged | |
| `--wash` | `#EDF3EE` | `#ECF2EE` | neem-strong on it 7.91:1, ink-3 5.36:1 |
| `--neem-deep` | (new) | `#063D29` | Showcase bands (closing CTA, dossier seal backdrop). White on it 12.3:1; neem-deep text on canvas 11.5:1 |
| `--leaf` | (new) | `#8DBFA2` | Decorative only (vines, falling leaves, kolam). Never text, never UI state |
| `--leaf-2` | (new) | `#C9A94E` | Decorative only: the occasional ripe leaf in LeafFall and the dossier seal ring. Never text, never state (haldi keeps its "changed" meaning) |
| `--edge` | (new) | `rgba(255,255,255,0)` | Card top highlight; invisible in light |

**Dark (must stay complete)**

| Token | Old | New | Notes |
|---|---|---|---|
| `--canvas` | `#0A1410` | `#07110D` | Deeper, so cards lift. ink 16.6:1, ink-3 7.18:1, neem 9.16:1 |
| `--surface` | `#111E18` | `#0E1A15` | |
| `--surface-2` | (new) | `#15241D` | Raised surfaces (answer card, sheets). ink-3 on it 6.04:1 |
| `--wash` | `#16261E` | `#12211A` | |
| `--line` | `#223429` | `#26392E` | Slightly stronger so dividers read |
| `--neem-deep` | (new) | `#0F3324` | ink 12.0:1, ink-2 7.66:1, neem-strong 8.46:1 |
| `--leaf` | (new) | `#3F8A63` | Decorative only |
| `--leaf-2` | (new) | `#A8893A` | Decorative only |
| `--edge` | (new) | `rgba(255,255,255,0.05)` | 1px inset top highlight on cards: `box-shadow: inset 0 1px 0 var(--edge)` added to `--shadow-1` and `--shadow-2` in dark |

Also update the `theme-color` meta values in `src/state/session.tsx` to the new canvas colours. Update the C2 tables in `MASTER-PLAN.md` in the same commit so the spec matches the code.

### 2.2 Type

No new sizes. Two usage changes: stats and the closing CTA headline use `text-h1`; the Home hero headline stays `text-display`. Stat numbers use `tabular-nums` so count-up does not jitter.

---

## 3. Tasks

### Block A: tooling and global layout (do first, all low risk)

**UI-9.1 Screenshots render every section.** In `scripts/shots.mjs`, pass `reducedMotion: "reduce"` to `browser.newContext(...)` with a one-line comment (scroll-reveal sections render statically in full-page captures). Re-run `npm run shots`; Home must show every section. *Done when* no light or dark full-page shot has a blank band taller than half the viewport.

**UI-9.2 Section rhythm to C4.** `src/ui/Section.tsx`: change `py-12 sm:py-16` to `py-8 sm:py-12` (64px mobile, 96px desktop between stacked sections, per C4), and fix its docstring to say 96 / 64. Check Describe, Library and How it works shots.

**UI-9.3 Library tier column.** `src/pages/Library.tsx`, the `tier` column render: wrap the label in `<span className="whitespace-nowrap">`. Every row returns to one line of height for that column.

**UI-9.4 Palette.** Apply section 2.1. Add Tailwind mappings for `neem-deep`, `leaf`, `leaf-2`, `surface-2` in `global.css`. Use `bg-surface-2` for the Home answer card, `Sheet` and the Sahayak panel in dark (in light it equals surface, so define `--surface-2: #FFFFFF` in light). Run shots in both themes and compare against the old ones.

**UI-9.5 Footer.** Replace the one-line footer in `src/app/Shell.tsx` with a structured footer inside `max-w-[var(--w-shell)]`: left, the logo mark and "IP-SAKTI Sahayak" with the tagline (existing key `tagline`); middle, links Home, Case, Library, How it works (existing nav keys); right, a small line "Smart India Hackathon, PS 26045" (new key `footerPs`; hi and te copy the English, it is a proper name). The disclaimer (`disc`) stays, full width, on its own row below, never hidden. Divider `border-t border-line`. On mobile the three parts stack.

### Block B: page structure

**UI-9.6 Home hero rebalance.** `src/pages/Home.tsx`.
- Keep `items-start` (do **not** switch to `items-center`: it was tried and pushed the headline down, leaving an empty top-left).
- Left column: add `lg:pt-8`. Under the buttons add a **stats row**: a `<dl>` with three items, each a `<div className="flex flex-col">` containing `<dt>` (label) then `<dd>` (number); visually put the number first with `order-first` on the `dd` (keeps valid dt-before-dd order). Numbers `text-h1 text-neem tabular-nums`, labels `text-small text-ink-3`. Container `mt-10 grid max-w-[30rem] grid-cols-3 gap-6 border-t border-line pt-6` (no vertical dividers: labels wrap to different heights and dividers made the numbers look misaligned in the prototype). Items: `CHAPTER_ORDER.length` with key `homeStatChapters` ("chapters, in order"); `Object.keys(SOURCES).length` (38 today) with `homeStatSources` ("sources in the corpus"); `3` with `homeStatLanguages` ("languages, typed or spoken").
- Right column: the plate becomes `aspect-[5/4]` and the answer card overlaps it by `-mt-24` on lg (currently -14), shown at `max-w-[400px]`, `lg:ml-auto lg:mr-6`, so the right column is about 520px tall instead of 650px.
- Glow: an `absolute` element **inside the right column** (not the section, the section's `overflow-hidden` clipped it into a hard edge at the shell boundary in the prototype): `-inset-10 rounded-pill bg-neem-wash blur-3xl opacity-80 -z-10`. No dark override is needed: `--neem-wash` is already a deep green in dark.
- hi strings: "अध्याय, क्रम में" / "स्रोत, संग्रह में" / "भाषाएँ, लिखकर या बोलकर". te: "అధ్యాయాలు, క్రమంలో" / "మూలాలు, సంగ్రహంలో" / "భాషలు, టైప్ చేసి లేదా మాట్లాడి".
- *Done when* at 1440 the bottom of the stats row and the bottom of the answer card are within about 120px of each other, and nothing overlaps at 390.

**UI-9.7 Home examples grid.** Four cards: `sm:grid-cols-2 lg:grid-cols-4`. On mobile (below `sm`) a horizontal snap row: container `-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3`, cards `w-[80%] shrink-0 snap-start`, then `sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:w-auto`. Add to `Plate` two props: `compact` (placeholder uses `aspect-[16/9]` and `p-5` around the mark) and `markVariant` (index into `["", "-scale-x-100", "rotate-6", "-scale-x-100 -rotate-6"]` applied to `BotanicalMark`), and pass `compact markVariant={i}`. Card padding `p-4`. Check the document does not overflow horizontally at 390 (the shots script checks this).

**UI-9.8 Home "Why trust it" bento and closing CTA.**
- Tall card: under its body add a specimen: a `rounded-control border border-line bg-canvas px-4 py-1` box containing one `EvidenceRow` taken from `ANSWERS` id `q2`, `in.pts[2]` (the trade mark, design and copyright sentence, which has three cite chips). Render it through `EvidenceList`/`EvidenceRow` unchanged; do not edit the text.
- New closing section after "Why trust it": a `rounded-container bg-neem-deep` band, `px-6 py-12 sm:px-12 sm:py-16`, centred. Headline `text-h1 text-on-neem` key `homeCtaHeading` = "Bring your product. Leave with a cited dossier." Body `text-body-lg`, key `homeCtaBody` = "Seven chapters in English, Hindi or Telugu. Every finding names the clause it rests on." Buttons: `Start a case` (secondary variant, which is a surface button that reads well on the dark band) and `Ask Sahayak` (ghost, forced to `text-on-neem! hover:bg-on-neem/10!`). One leafy vine ornament (UI-9.13's `Vine` shape, **no thorns**) in `text-leaf/40` curling in from the top-left corner, drawn in once on view. Hindi: "अपना उत्पाद लाइए। उद्धरणों सहित डोज़ियर लेकर जाइए।" / "अंग्रेज़ी, हिंदी या तेलुगु में सात अध्याय। हर निष्कर्ष उस धारा का नाम बताता है जिस पर वह आधारित है।" Telugu: "మీ ఉత్పత్తిని తీసుకురండి. ఉదహరించిన డోసియర్‌తో వెళ్లండి." / "ఇంగ్లీష్, హిందీ లేదా తెలుగులో ఏడు అధ్యాయాలు. ప్రతి అన్వేషణ అది ఆధారపడిన నిబంధనను పేర్కొంటుంది."

**UI-9.9 Describe: summary beside the form.** At `xl` and above, `src/chapters/Describe.tsx` becomes two columns inside the chapter body: the form (max `--w-main`) and a `sticky top-24` right column (`w-80`) holding the existing "Your case so far" summary card. Below `xl` the summary stays at the bottom as today. The Chapter body wrapper may need a `wide` prop (`max-w-[var(--w-shell)]` instead of `--w-main`) so only Describe widens; add it to `src/ui/Chapter.tsx`, default false. Dosage-form `RadioCards`: 3 columns at `lg`.

**UI-9.10 How it works: in-page navigation.** At `lg`, a sticky left column (`w-56`, `top-24`) listing the page's sections (Guardrail pipeline, Try to trick it, Architecture, Problem-statement coverage, API contract) as anchor links; the active one gets `text-neem font-semibold` via an IntersectionObserver. Reuse the section titles' existing keys. Content column stays as is. Mobile: no sidebar.

**UI-9.11 Ask: pre-question state.** Under the Jurisdiction/Detail bar, before any answer, show a quiet panel (`rounded-container border border-dashed border-line p-6`) with a `Seal` and one line using existing key `askLede`, plus the persona segmented control's current value echoed ("Answers are written for: Startup founder"; new key `askForPersona` = "Answers are written for: {p}"). It disappears when an answer renders. Fills the dead area without inventing content.

**UI-9.12 Chapter header band.** `src/ui/Chapter.tsx`: the wash band's left edge must line up with the body content's left edge (today the seal sits about 18px left of the form). Put header and body in the same `max-w` container with the same horizontal padding.

### Block C: the wow features

Ranked. Build in order. Each has a **look test**: take light and dark screenshots (and, for motion, a short screen recording or 4 frames at 0 / 300 / 800 / 1500ms via Playwright), and if it looks cheap, cluttered or slows the demo, **revert the task and note it in `QUESTIONS.md`**. Do not ship an effect that fails its look test.

**UI-9.13 VineRail: the chapter rail grows (recommended, highest value).**
Why: this is the tasteful version of "vines". It carries meaning (your case growing), sits in the chapter rail the jury watches during the whole demo, and costs almost nothing.
- New `src/ui/VineRail.tsx` replacing the straight `bg-neem` progress line inside `src/ui/ChapterRail.tsx` (the `absolute left-4 top-4 bottom-4` element).
- An SVG as tall as the list: a gently wavy stem (amplitude 3px, one wave per chapter row) in `text-line`, and over it the same path in `text-neem` drawn with `pathLength` up to the current chapter (reuse `threadPath`, 480ms).
- For each chapter whose status is done, a small leaf (two cubic curves, about 10 by 6px, `fill-leaf`) attached to the stem beside that chapter's seal, alternating sides; it **sprouts** (new variant `sprout` in `motion.ts`: scale 0 to 1 plus rotate from -30 degrees to 0, spring 300 / 20) the moment the status flips to done. The current chapter gets a closed bud (small circle, `fill-neem`).
- No thorns. Stem stroke 1.5px. Everything `aria-hidden`. Reduced motion: final state.
- Look test: at 1440 in the Case flow, rail reads as "progress", not as ornament.

**UI-9.14 LeafFall: leaves fall when a chapter is completed (the owner's idea, scoped).**
Why scoped: falling leaves on **every** section switch would fire about fifteen times in a five-minute demo, slow every navigation and start to feel like a screensaver. On **completion** it becomes a reward the jury notices.
- New `src/ui/LeafFall.tsx`, rendered once in `Shell` through a portal: `fixed inset-0 pointer-events-none`, `z` just below the header (`LAYER` in `src/ui/layers.ts`).
- Trigger: a new session event `celebrate()` in `src/state/session.tsx`, called when a chapter's status goes from not done to done (compare previous and next `chapterStatus` in the Case provider or in `ChapterRail`), and once when the dossier is complete (UI-9.16). At most once per chapter per session.
- 7 leaves (desktop) / 4 (mobile). Each: random but seeded start x across the top 60% of the width, falls 55 to 75% of the viewport height over 1.6 to 2.2s, sways with `x` keyframes (±24px, 2 cycles) and rotates 120 to 280 degrees, fades out over the last 30%. Leaf shape reused from VineRail; 5 in `text-leaf`, 2 in `text-leaf-2`. Unmount after the longest finishes.
- Off entirely under reduced motion. Never blocks clicks.
- Optional after look test: a single leaf drifting across the Home hero once on first load.

**UI-9.15 Theme switch reveal.**
- In `setTheme`, if `document.startViewTransition` exists and motion is allowed, wrap the `data-theme` change in it and animate `::view-transition-new(root)` with a `clip-path: circle()` growing from the theme toggle button's centre (pass the click coordinates), 450ms, ease `[0.16, 1, 0.3, 1]`. CSS goes in `global.css` (`::view-transition-old(root), ::view-transition-new(root) { animation: none; mix-blend-mode: normal; }` plus the keyframe on new). Fallback: instant switch (Firefox, reduced motion).
- This is the single most "wow" effect for the least code, and it is honest: it just shows the theme change.

**UI-9.16 Dossier seal moment.** In the Dossier chapter, when every chapter is done and the dossier renders for the first time in the session: a large `Seal` (96px, `variant="filled"`) stamps onto the dossier header (existing `stamp` spring, preceded by a scale from 1.4 and a 2px downward settle), a single ring ripples out from it (`scale` 1 to 1.8, opacity 0.5 to 0, 700ms, stroke `leaf-2`), then `celebrate()` fires LeafFall. Once per session.

**UI-9.17 Kolam texture (cultural signature).** New `src/ui/KolamPattern.tsx`: an SVG `<pattern>` of a simple kolam/rangoli dot grid (dots every 24px with a few connecting loops), `text-leaf` at 12% opacity in light, 10% in dark, masked with a radial fade so it only shows around the edges of the Home hero and the closing CTA band. Static. Look test is strict: if it reads as noise or wallpaper, delete it.

**UI-9.18 Living hero sprig.** The Home hero `BotanicalMark` (not the example cards) sways: the whole mark rotates between -1.5 and 1.5 degrees around its stem base over 7s, `repeat: Infinity, repeatType: "mirror"`, ease in-out. Pause when the hero is off-screen (`useInView`). Add pointer parallax on desktop only: the mark shifts up to 6px opposite the cursor, using `useMotionValue` / `useSpring` (never `useState`). Amendment A3 applies.

**UI-9.19 Stat count-up.** The three hero stats count from 0 to their value over 900ms when first visible (`animate` from `motion` driving a `useMotionValue`, rendered with `useTransform` to a rounded number). Reduced motion: show the value.

**UI-9.20 Card spotlight (optional).** On pointer devices, example and trust cards get a soft radial highlight that follows the cursor (`--x`/`--y` CSS variables set from `onPointerMove`, background `radial-gradient(240px circle at var(--x) var(--y), var(--neem-wash), transparent 70%)` on a pseudo layer at 60% opacity). Skip on touch. Amendment A2 covers it only on these cards.

**Explicitly not doing:** literal thorny vines (tested, looked like barbed wire); leaves on every navigation; 3D or WebGL (removed in C7 for good reasons); cursor trails; confetti; sound; auto-playing carousels; parallax on text.

### Block D: verification and ship

**UI-9.21 Full pass.**
1. `npm run typecheck`, `npm test`, `npm run build`, `npm run sizecheck`, `npm run shots` (must exit 0), `npm run e2e`.
2. Review every light and dark shot at 1440 and 390. Fix overlap, clipping, orphans, blank bands.
3. Reduced motion: in DevTools emulate `prefers-reduced-motion: reduce` and click through Home, a chapter completion and the dossier; nothing moves, nothing is missing.
4. Keyboard: tab through Home and the Case flow; no decorative element takes focus.
5. hi and te: switch language on Home and Describe; nothing overflows (Devanagari and Telugu run longer).
6. Update `MASTER-PLAN.md` C1, C2, C5, C6 with the amendments in section 0 so the spec matches the code. (`docs/plan/README.md` already lists this file.)
7. Open a PR to `main` with before and after screenshots of Home, Describe and Dossier in both themes.

---

## 4. Order and effort

| Block | Tasks | Rough effort | Risk |
|---|---|---|---|
| A | 9.1 to 9.5 | small | low |
| B | 9.6 to 9.12 | medium | low to medium (layout) |
| C | 9.13 to 9.16 first, then 9.17 to 9.20 only if time allows | medium | medium (look tests) |
| D | 9.21 | small | low |

If time is short, ship **A, B, 9.13, 9.14, 9.15, 9.16**. That set alone changes how the product feels in the demo.

---

## 5. Kick-off prompt for a new Sonnet session

> Read `CLAUDE.md`, then `docs/plan/UI-POLISH-PLAN.md` in full, then MASTER-PLAN D0 and Part E. Load the design-taste-frontend skill. Execute Phase 9 blocks A to D in order on branch `<branch>`, committing per task with its UI-9.x ID and pushing after each block. Section 0 amendments override MASTER-PLAN where they conflict. Run each Block C look test and revert any effect that fails it, logging why in `docs/plan/QUESTIONS.md`. Do not reword legal text. When done, open a PR to main with before and after screenshots.
