import type { ReactNode } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "motion/react";
import { ArrowRight, CaretRight } from "@phosphor-icons/react";
import Button from "../ui/Button";
import Seal from "../ui/Seal";
import Plate from "../ui/Plate";
import { EvidenceRow, EvidenceList } from "../ui/EvidenceRow";
import { fadeUp, staggerContainer, stamp, useMotionOK } from "../ui/motion";
import { useT } from "../i18n/useT";
import { useSession } from "../state/session";
import { useCase } from "../state/case";
import { EXAMPLES } from "../data/examples";
import { ANSWERS } from "../data/answers";
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

const CHAPTER_KEYS: Record<string, { titleKey: string; purposeKey: string }> = {
  describe: { titleKey: "chDescribeTitle", purposeKey: "chDescribePurpose" },
  classify: { titleKey: "chClassifyTitle", purposeKey: "chClassifyPurpose" },
  protect: { titleKey: "chProtectTitle", purposeKey: "chProtectPurpose" },
  owe: { titleKey: "chOweTitle", purposeKey: "chOwePurpose" },
  say: { titleKey: "chSayTitle", purposeKey: "chSayPurpose" },
  search: { titleKey: "chSearchTitle", purposeKey: "chSearchPurpose" },
  dossier: { titleKey: "chDossierTitle", purposeKey: "chDossierPurpose" },
};

const TRUST_FACTS = [
  { titleKey: "homeTrust0Title", bodyKey: "homeTrust0Body" },
  { titleKey: "homeTrust1Title", bodyKey: "homeTrust1Body" },
  { titleKey: "homeTrust2Title", bodyKey: "homeTrust2Body" },
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
      <section className="mx-auto max-w-[var(--w-shell)] overflow-hidden px-4 pb-14 pt-10 sm:px-6 sm:pt-16">
        <motion.div
          className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16"
          initial={motionOK ? "hidden" : false}
          animate="visible"
          variants={staggerContainer}
        >
          <div>
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
          </div>

          <motion.div variants={fadeUp} className="relative">
            <motion.div
              className="aspect-[16/9] sm:aspect-[4/3]"
              initial={motionOK ? { opacity: 0, scale: 0.96 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            >
              <Plate botanicalName="Withania somnifera" commonNames={t("plantAshwagandha")} />
            </motion.div>
            <motion.div
              className="relative z-10 -mt-10 max-w-[380px] rounded-container border border-line bg-surface p-5 shadow-2 sm:ml-8 sm:-mt-14"
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
        <Reveal className="mt-6 grid gap-4 sm:grid-cols-3">
          {EXAMPLES.map((ex) => (
            <motion.button
              key={ex.key}
              type="button"
              variants={fadeUp}
              whileHover={motionOK ? { y: -6, boxShadow: "var(--shadow-2)" } : undefined}
              whileTap={motionOK ? { scale: 0.98 } : undefined}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
              onClick={() => openExample(ex)}
              className="flex flex-col items-start gap-3 rounded-container border border-line bg-surface p-5 text-left shadow-1"
            >
              <div className="aspect-[4/3] w-full">
                <Plate botanicalName={ex.build().formula[0]?.plant.botanicalName ?? ""} />
              </div>
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
    </div>
  );
}
