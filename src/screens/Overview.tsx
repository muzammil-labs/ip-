import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Compass, Columns, Gauge, ClockCounterClockwise, Scales, Play, CaretRight } from "@phosphor-icons/react";
import { useApp } from "../state/store";
import { useSession } from "../state/session";
import { useT } from "../i18n/useT";
import EvidenceGraph from "../components/EvidenceGraph";
import HeroDemo from "../components/HeroDemo";
import Reveal from "../components/Reveal";
import { TOUR } from "../lib/tour";

const DIFFERENTIATORS = [
  { icon: Compass, tKey: "diff0t", bKey: "diff0b" },
  { icon: Columns, tKey: "diff1t", bKey: "diff1b" },
  { icon: Gauge, tKey: "diff2t", bKey: "diff2b" },
  { icon: ClockCounterClockwise, tKey: "diff3t", bKey: "diff3b" },
  { icon: Scales, tKey: "diff4t", bKey: "diff4b" },
];

export default function Overview() {
  const { go } = useApp();
  const t = useT();
  const reduce = useReducedMotion();
  const [tourOn, setTourOn] = useState(false);
  const [tourIx, setTourIx] = useState(0);
  const app = useApp();
  const session = useSession();

  function startTour(i: number) {
    setTourIx(i);
    setTourOn(true);
    TOUR[i].run({ ...app, ...session });
  }

  return (
    <div>
      {/* Hero: asymmetric split, max 4 text elements, no eyebrow */}
      <section className="mx-auto max-w-[1400px] px-4 pb-10 pt-16 sm:px-6 sm:pt-20 lg:pt-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1
              className="text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem] [&_.clause]:block [&_.clause]:text-brand"
              dangerouslySetInnerHTML={{ __html: t("ovH1") }}
            />
            <p className="mt-5 max-w-[46ch] text-[16.5px] leading-relaxed text-ink-2">
              {t("heroSubhead")}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => go("ask")}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-[14.5px] font-semibold text-white shadow-sm transition-transform active:scale-[0.98]"
              >
                {t("askQuestionBtn")} <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => go("blueprint")}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-[14.5px] font-semibold text-ink transition-colors hover:bg-sunk"
              >
                {t("seeHowBuiltBtn")}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="aspect-[4/3] overflow-hidden rounded-lg border border-line p-4 shadow-sm"
            style={{ background: "radial-gradient(circle at 50% 42%, var(--brand-soft) 0%, var(--surface) 72%)" }}
          >
            <EvidenceGraph />
          </motion.div>
        </div>
      </section>

      {/* Supporting lede + live demo */}
      <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <Reveal>
            <p className="max-w-[52ch] text-[15.5px] leading-relaxed text-ink-2">{t("ovLede")}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <HeroDemo />
          </Reveal>
        </div>
      </section>

      {/* Differentiators: plain stacked cards. A pinned scroll treatment returns with the Phase 4 Home rebuild. */}
      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6">
        <Reveal>
          <h2 className="max-w-[24ch] text-2xl font-bold tracking-tight sm:text-3xl">{t("diffHeading")}</h2>
        </Reveal>
        <div className="mt-6 space-y-4">
          {DIFFERENTIATORS.map((d, i) => (
            <Reveal key={d.tKey} delay={i * 0.05}>
              <div className="mx-auto flex w-full max-w-[720px] flex-col gap-4 rounded-lg border border-line bg-surface p-8 shadow-md sm:p-10">
                <span className="text-[12px] font-bold text-ink-3">{String(i + 1).padStart(2, "0")} / {DIFFERENTIATORS.length}</span>
                <d.icon size={30} weight="duotone" className="text-brand" />
                <h3 className="text-xl font-bold text-ink sm:text-2xl">{t(d.tKey)}</h3>
                <p className="max-w-[52ch] text-[15px] leading-relaxed text-ink-2">{t(d.bKey)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Guided walkthrough */}
      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6">
        <Reveal>
          <h2 className="max-w-[24ch] text-2xl font-bold tracking-tight sm:text-3xl">{t("walkthroughHeading")}</h2>
          <p className="mt-2 max-w-[56ch] text-[14.5px] text-ink-2">{t("walkthroughLede")}</p>
        </Reveal>
        <ol className="mt-8 divide-y divide-line rounded-lg border border-line bg-surface">
          {TOUR.map((step, i) => (
            <li key={step.titleKey} className="flex items-center gap-4 px-5 py-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[13px] font-bold text-brand-strong">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] font-semibold text-ink">{t(step.titleKey)}</p>
                <p className="truncate text-[13px] text-ink-3 sm:whitespace-normal">{t(step.descKey)}</p>
              </div>
              <button
                type="button"
                onClick={() => startTour(i)}
                className="flex shrink-0 items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[12.5px] font-semibold text-ink-2 transition-colors hover:bg-sunk"
              >
                <Play size={12} weight="fill" /> {t("showMe")}
              </button>
            </li>
          ))}
        </ol>
      </section>

      {tourOn && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 px-4 py-3 shadow-lg backdrop-blur-md sm:px-6">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-ink-3">
              {t("stepOf").replace("{i}", String(tourIx + 1)).replace("{n}", String(TOUR.length))}
            </span>
            <p className="flex-1 truncate text-[14px] font-medium text-ink">{t(TOUR[tourIx].titleKey)}</p>
            {tourIx > 0 && (
              <button type="button" onClick={() => startTour(tourIx - 1)} className="rounded-full border border-line px-3 py-1.5 text-[13px] font-medium text-ink-2">
                {t("back")}
              </button>
            )}
            {tourIx < TOUR.length - 1 ? (
              <button type="button" onClick={() => startTour(tourIx + 1)} className="inline-flex items-center gap-1 rounded-full bg-brand px-3.5 py-1.5 text-[13px] font-semibold text-white">
                {t("next")} <CaretRight size={13} />
              </button>
            ) : (
              <button type="button" onClick={() => setTourOn(false)} className="rounded-full bg-brand px-3.5 py-1.5 text-[13px] font-semibold text-white">
                {t("finish")}
              </button>
            )}
            <button type="button" onClick={() => setTourOn(false)} className="text-[13px] text-ink-3 hover:text-ink">
              {t("endWalkthrough")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
