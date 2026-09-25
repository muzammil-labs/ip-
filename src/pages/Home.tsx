import { useLocation, Link } from "wouter";
import { ArrowRight, CaretRight } from "@phosphor-icons/react";
import Button from "../ui/Button";
import Seal from "../ui/Seal";
import Plate from "../ui/Plate";
import { EvidenceRow, EvidenceList } from "../ui/EvidenceRow";
import { useT } from "../i18n/useT";
import { useSession } from "../state/session";
import { useCase } from "../state/case";
import { EXAMPLES } from "../data/examples";
import { ANSWERS } from "../data/answers";
import { CHAPTER_ORDER } from "../chapters/order";

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

  function openExample(example: (typeof EXAMPLES)[number]) {
    dispatch({ type: "loadExample", example: example.build() });
    navigate("/case/describe");
  }

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-[var(--w-shell)] px-4 pb-14 pt-10 sm:px-6 sm:pt-16">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <h1 className="max-w-[16ch] text-display text-ink">{t("homeH1")}</h1>
            <p className="mt-5 max-w-[46ch] text-body-lg text-ink-2">{t("homeSub")}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" icon={<ArrowRight size={18} />} iconPosition="right" onClick={() => navigate("/case/describe")}>
                {t("startCase")}
              </Button>
              <Button size="lg" variant="secondary" onClick={() => setSahayakOpen(true)}>
                {t("askSahayak")}
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[16/9] sm:aspect-[4/3]">
              <Plate botanicalName="Withania somnifera" commonNames={t("plantAshwagandha")} />
            </div>
            <div className="relative z-10 -mt-10 max-w-[380px] rounded-container border border-line bg-surface p-5 shadow-2 sm:ml-8 sm:-mt-14">
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
            </div>
          </div>
        </div>
      </section>

      {/* Example cases */}
      <section className="mx-auto max-w-[var(--w-shell)] px-4 py-14 sm:px-6">
        <h2 className="text-h2 text-ink">{t("homeExamplesHeading")}</h2>
        <p className="mt-2 max-w-[56ch] text-body text-ink-2">{t("homeExamplesLede")}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.key}
              type="button"
              onClick={() => openExample(ex)}
              className="flex flex-col items-start gap-3 rounded-container border border-line bg-surface p-5 text-left shadow-1 transition-colors hover:border-line-strong"
            >
              <div className="aspect-[4/3] w-full">
                <Plate botanicalName={ex.build().formula[0]?.plant.botanicalName ?? ""} />
              </div>
              <h3 className="text-h3 text-ink">{t(ex.titleKey)}</h3>
              <p className="text-small text-ink-2">{t(ex.descKey)}</p>
              <span className="mt-auto inline-flex items-center gap-1 text-small font-semibold text-neem">
                {t("homeExampleCta")} <CaretRight size={13} />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* How a case works */}
      <section className="mx-auto max-w-[var(--w-shell)] px-4 py-14 sm:px-6">
        <h2 className="text-h2 text-ink">{t("homeHowHeading")}</h2>
        <p className="mt-2 max-w-[56ch] text-body text-ink-2">{t("homeHowLede")}</p>
        <div className="relative mt-8">
          <div className="absolute left-6 top-0 hidden h-full w-px bg-line lg:left-0 lg:top-6 lg:h-px lg:w-full" aria-hidden="true" />
          <ol className="relative flex flex-col gap-6 lg:flex-row lg:justify-between lg:gap-2">
            {CHAPTER_ORDER.map((slug, i) => (
              <li key={slug} className="flex items-start gap-3 lg:flex-1 lg:flex-col lg:items-center lg:text-center">
                <Seal size={48} variant="number" number={i + 1} className="shrink-0 bg-canvas" />
                <div className="min-w-0">
                  <p className="text-h3 text-ink">{t(CHAPTER_KEYS[slug].titleKey)}</p>
                  <p className="mt-0.5 text-small text-ink-2 lg:max-w-[16ch]">{t(CHAPTER_KEYS[slug].purposeKey)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why trust it */}
      <section className="mx-auto max-w-[var(--w-shell)] px-4 py-14 sm:px-6">
        <h2 className="text-h2 text-ink">{t("homeTrustHeading")}</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Link
            href="/how"
            className="flex flex-col gap-2 rounded-container border border-line bg-surface p-6 shadow-1 transition-colors hover:border-line-strong lg:row-span-2"
          >
            <h3 className="text-h3 text-ink">{t(TRUST_FACTS[0].titleKey)}</h3>
            <p className="text-body text-ink-2">{t(TRUST_FACTS[0].bodyKey)}</p>
            <span className="mt-auto inline-flex items-center gap-1 text-small font-semibold text-neem">
              {t("homeTrustCta")} <CaretRight size={13} />
            </span>
          </Link>
          {TRUST_FACTS.slice(1).map((f) => (
            <Link
              key={f.titleKey}
              href="/how"
              className="flex flex-col gap-2 rounded-container border border-line bg-surface p-6 shadow-1 transition-colors hover:border-line-strong"
            >
              <h3 className="text-h3 text-ink">{t(f.titleKey)}</h3>
              <p className="text-body text-ink-2">{t(f.bodyKey)}</p>
              <span className="mt-auto inline-flex items-center gap-1 text-small font-semibold text-neem">
                {t("homeTrustCta")} <CaretRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
