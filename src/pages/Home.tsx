import type { ReactNode } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "motion/react";
import { ArrowRight, CaretRight } from "@phosphor-icons/react";
import Button from "../ui/Button";
import Seal from "../ui/Seal";
import Plate from "../ui/Plate";
import BotanicalMark from "../ui/BotanicalMark";
import KolamPattern from "../ui/KolamPattern";
import { EvidenceRow, EvidenceList } from "../ui/EvidenceRow";
import { fadeUp, staggerContainer, stamp, useMotionOK } from "../ui/motion";
import { useT } from "../i18n/useT";
import { useSession } from "../state/session";
import { useCase } from "../state/case";
import { EXAMPLES } from "../data/examples";
import { ANSWERS } from "../data/answers";
import { SOURCES } from "../data/sources";
import { CHAPTER_ORDER } from "../chapters/order";

/** Scroll-reveal wrapper: children stagger-fade-up once the section enters the viewport,
 * never re-triggering on re-scroll, and collapsing to an instant static render when the
 * visitor asked for reduced motion. */
function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const motionOK = useMotionOK();
  return (
    <motion.div
      className={className}
      initial={motionOK ? "hidden" : false}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}

const HERO_ANSWER = ANSWERS.find((a) => a.id === "q1")!;

const HERO_STATS = [
  { value: CHAPTER_ORDER.length, labelKey: "homeStatChapters" },
  { value: Object.keys(SOURCES).length, labelKey: "homeStatSources" },
  { value: 3, labelKey: "homeStatLanguages" },
];

const CHAPTER_KEYS: Record<string, { titleKey: string; purposeKey: string }> = {
  describe: { titleKey: "chDescribeTitle", purposeKey: "chDescribePurpose" },
  classify: { titleKey: "chClassifyTitle", purposeKey: "chClassifyPurpose" },
  protect: { titleKey: "chProtectTitle", purposeKey: "chProtectPurpose" },
  owe: { titleKey: "chOweTitle", purposeKey: "chOwePurpose" },
  say: { titleKey: "chSayTitle", purposeKey: "chSayPurpose" },
  search: { titleKey: "chSearchTitle", purposeKey: "chSearchPurpose" },
  dossier: { titleKey: "chDossierTitle", purposeKey: "chDossierPurpose" },
};

const TRUST_SPECIMEN = ANSWERS.find((a) => a.id === "q2")!.in!.pts[2];

const TRUST_FACTS = [
  { titleKey: "homeTrust0Title", bodyKey: "homeTrust0Body" },
  { titleKey: "homeTrust1Title", bodyKey: "homeTrust1Body" },
  { titleKey: "homeTrust2Title", bodyKey: "homeTrust2Body" },
];

const LANGUAGE_SHOWCASE = [
  { nameKey: "langNameEn", taglineKey: "homeLangTaglineEn" },
  { nameKey: "langNameHi", taglineKey: "homeLangTaglineHi" },
  { nameKey: "langNameTe", taglineKey: "homeLangTaglineTe" },
];

/** #/ (B2, B3). The four-destination home: hero with a real live answer, three example
 * cases, how a case works, and why to trust it. Replaces the retired WebGL Overview. */
export default function Home() {
  const t = useT();
  const [, navigate] = useLocation();
  const { setSahayakOpen } = useSession();
  const { dispatch } = useCase();
  const motionOK = useMotionOK();

  function openExample(example: (typeof EXAMPLES)[number]) {
    dispatch({ type: "loadExample", example: example.build() });
    navigate("/case/describe");
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative mx-auto max-w-[var(--w-shell)] overflow-hidden px-4 pb-14 pt-10 sm:px-6 sm:pt-16">
        <KolamPattern id="kolam-hero" />
        <motion.div
          className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16"
          initial={motionOK ? "hidden" : false}
          animate="visible"
          variants={staggerContainer}
        >
          <div className="lg:pt-8">
            <motion.h1 variants={fadeUp} className="max-w-[16ch] text-display text-ink">
              {t("homeH1")}
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-5 max-w-[46ch] text-body-lg text-ink-2">
              {t("homeSub")}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-3">
              <motion.span whileHover={motionOK ? { y: -2 } : undefined} whileTap={motionOK ? { scale: 0.97 } : undefined} className="inline-block">
                <Button size="lg" icon={<ArrowRight size={18} />} iconPosition="right" onClick={() => navigate("/case/describe")}>
                  {t("startCase")}
                </Button>
              </motion.span>
              <motion.span whileHover={motionOK ? { y: -2 } : undefined} whileTap={motionOK ? { scale: 0.97 } : undefined} className="inline-block">
                <Button size="lg" variant="secondary" onClick={() => setSahayakOpen(true)}>
                  {t("askSahayak")}
                </Button>
              </motion.span>
            </motion.div>
            <motion.dl variants={fadeUp} className="mt-10 grid max-w-[30rem] grid-cols-3 gap-6 border-t border-line pt-6">
              {HERO_STATS.map((s) => (
                <div key={s.labelKey} className="flex flex-col-reverse">
                  <dt className="mt-1 text-small text-ink-3">{t(s.labelKey)}</dt>
                  <dd className="text-h1 tabular-nums text-neem">{s.value}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          <motion.div variants={fadeUp} className="relative">
            <div aria-hidden="true" className="pointer-events-none absolute -inset-10 -z-10 rounded-pill bg-neem-wash opacity-80 blur-3xl" />
            <motion.div
              className="aspect-[16/9] sm:aspect-[5/4]"
              initial={motionOK ? { opacity: 0, scale: 0.96 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            >
              <Plate botanicalName="Withania somnifera" commonNames={t("plantAshwagandha")} living />
            </motion.div>
            <motion.div
              className="relative z-10 -mt-10 rounded-container border border-line bg-surface-2 p-5 shadow-2 sm:ml-8 sm:mr-0 sm:-mt-32"
              variants={stamp}
              initial={motionOK ? "hidden" : false}
              animate="visible"
              transition={{ delay: 0.35 }}
            >
              <p className="text-small font-semibold text-ink-3">{t("homeLiveAnswerLabel")}</p>
              <p className="mt-1 text-body font-semibold text-ink">{HERO_ANSWER.q}</p>
              <div className="mt-1">
                <EvidenceList>
                  {HERO_ANSWER.in!.pts.slice(0, 3).map((p, i) => (
                    <EvidenceRow key={i} state={p.s} cites={p.c}>
                      {p.t}
                    </EvidenceRow>
                  ))}
                </EvidenceList>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Example cases */}
      <section className="mx-auto max-w-[var(--w-shell)] px-4 py-14 sm:px-6">
        <h2 className="text-h2 text-ink">{t("homeExamplesHeading")}</h2>
        <p className="mt-2 max-w-[56ch] text-body text-ink-2">{t("homeExamplesLede")}</p>
        <Reveal className="-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {EXAMPLES.map((ex, i) => (
            <motion.button
              key={ex.key}
              type="button"
              variants={fadeUp}
              whileHover={motionOK ? { y: -6, boxShadow: "var(--shadow-2)" } : undefined}
              whileTap={motionOK ? { scale: 0.98 } : undefined}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
              onClick={() => openExample(ex)}
              className="flex w-[80%] shrink-0 snap-start flex-col items-start gap-3 rounded-container border border-line bg-surface p-4 text-left shadow-1 sm:w-auto"
            >
              <Plate compact markVariant={i} botanicalName={ex.build().formula[0]?.plant.botanicalName ?? ""} />
              <h3 className="text-h3 text-ink">{t(ex.titleKey)}</h3>
              <p className="text-small text-ink-2">{t(ex.descKey)}</p>
              <span className="mt-auto inline-flex items-center gap-1 text-small font-semibold text-neem">
                {t("homeExampleCta")} <CaretRight size={13} />
              </span>
            </motion.button>
          ))}
        </Reveal>
      </section>

      {/* How a case works */}
      <section className="mx-auto max-w-[var(--w-shell)] px-4 py-14 sm:px-6">
        <h2 className="text-h2 text-ink">{t("homeHowHeading")}</h2>
        <p className="mt-2 max-w-[56ch] text-body text-ink-2">{t("homeHowLede")}</p>
        <div className="relative mt-8">
          <motion.div
            className="absolute left-6 top-0 hidden h-full w-px origin-top bg-line lg:left-0 lg:top-6 lg:h-px lg:w-full lg:origin-left"
            aria-hidden="true"
            initial={motionOK ? { scaleY: 0, scaleX: 0 } : false}
            whileInView={{ scaleY: 1, scaleX: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
          <Reveal className="relative">
            <ol className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:gap-2">
              {CHAPTER_ORDER.map((slug, i) => (
                <motion.li
                  key={slug}
                  variants={fadeUp}
                  className="flex items-start gap-3 lg:flex-1 lg:flex-col lg:items-center lg:text-center"
                >
                  <Seal size={48} variant="number" number={i + 1} className="shrink-0 bg-canvas" />
                  <div className="min-w-0">
                    <p className="text-h3 text-ink">{t(CHAPTER_KEYS[slug].titleKey)}</p>
                    <p className="mt-0.5 text-small text-ink-2 lg:max-w-[16ch]">{t(CHAPTER_KEYS[slug].purposeKey)}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* Why trust it */}
      <section className="mx-auto max-w-[var(--w-shell)] px-4 py-14 sm:px-6">
        <h2 className="text-h2 text-ink">{t("homeTrustHeading")}</h2>
        <Reveal className="mt-6 grid gap-4 lg:grid-cols-2">
          <motion.div
            variants={fadeUp}
            whileHover={motionOK ? { y: -4 } : undefined}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="lg:row-span-2"
          >
            <Link
              href="/how"
              className="flex h-full flex-col gap-2 rounded-container border border-line bg-surface p-6 shadow-1 transition-colors hover:border-line-strong"
            >
              <h3 className="text-h3 text-ink">{t(TRUST_FACTS[0].titleKey)}</h3>
              <p className="text-body text-ink-2">{t(TRUST_FACTS[0].bodyKey)}</p>
              <div className="my-4 rounded-control border border-line bg-canvas px-4 py-1">
                <EvidenceList>
                  <EvidenceRow state={TRUST_SPECIMEN.s} cites={TRUST_SPECIMEN.c}>
                    {TRUST_SPECIMEN.t}
                  </EvidenceRow>
                </EvidenceList>
              </div>
              <span className="mt-auto inline-flex items-center gap-1 text-small font-semibold text-neem">
                {t("homeTrustCta")} <CaretRight size={13} />
              </span>
            </Link>
          </motion.div>
          {TRUST_FACTS.slice(1).map((f) => (
            <motion.div
              key={f.titleKey}
              variants={fadeUp}
              whileHover={motionOK ? { y: -4 } : undefined}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
            >
              <Link
                href="/how"
                className="flex h-full flex-col gap-2 rounded-container border border-line bg-surface p-6 shadow-1 transition-colors hover:border-line-strong"
              >
                <h3 className="text-h3 text-ink">{t(f.titleKey)}</h3>
                <p className="text-body text-ink-2">{t(f.bodyKey)}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-small font-semibold text-neem">
                  {t("homeTrustCta")} <CaretRight size={13} />
                </span>
              </Link>
            </motion.div>
          ))}
        </Reveal>
      </section>

      {/* One system, three scripts */}
      <section className="mx-auto max-w-[var(--w-shell)] px-4 pb-14 sm:px-6">
        <h2 className="text-h2 text-ink">{t("homeLangHeading")}</h2>
        <p className="mt-2 max-w-[52ch] text-body text-ink-2">{t("homeLangBody")}</p>
        <Reveal className="mt-6 grid gap-4 sm:grid-cols-3">
          {LANGUAGE_SHOWCASE.map((l) => (
            <motion.div
              key={l.nameKey}
              variants={fadeUp}
              className="rounded-container border border-line bg-surface p-6 text-center"
            >
              <span className="text-h2 text-ink">{t(l.nameKey)}</span>
              <p className="mt-2 text-small text-ink-3">{t(l.taglineKey)}</p>
            </motion.div>
          ))}
        </Reveal>
      </section>

      {/* Closing call to action */}
      <section className="mx-auto max-w-[var(--w-shell)] px-4 pb-14 sm:px-6">
        <motion.div
          className="relative overflow-hidden rounded-container bg-neem-deep px-6 py-12 text-center sm:px-12 sm:py-16"
          initial={motionOK ? "hidden" : false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <BotanicalMark className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 -rotate-45 text-on-neem-deep/10 sm:h-72 sm:w-72" />
          <KolamPattern id="kolam-cta" className="text-on-neem-deep opacity-[0.14]! dark:opacity-[0.14]!" />
          <div className="relative">
            {/* text-on-neem-deep!: beats global.css's bare "h1, h2, h3 { color: var(--ink) }" rule,
                which otherwise wins over this Tailwind utility class (unlayered CSS always
                outranks a layered utility of equal or lower specificity). */}
            <h2 className="mx-auto max-w-[24ch] text-h1 text-on-neem-deep!">{t("homeCtaHeading")}</h2>
            <p className="mx-auto mt-3 max-w-[52ch] text-body-lg text-on-neem-deep/85">{t("homeCtaBody")}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" variant="secondary" icon={<ArrowRight size={18} />} iconPosition="right" onClick={() => navigate("/case/describe")}>
                {t("startCase")}
              </Button>
              <Button size="lg" variant="ghost" className="text-on-neem-deep! hover:bg-on-neem-deep/10!" onClick={() => setSahayakOpen(true)}>
                {t("askSahayak")}
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
