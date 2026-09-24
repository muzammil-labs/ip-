import { useMemo } from "react";
import { useApp } from "../state/store";
import { I18N } from "../data/i18n";
import { COVERAGE } from "../data/coverage";
import { NAV } from "../data/constants";
import Reveal from "../components/Reveal";
import HorizontalPan from "../components/scroll/HorizontalPan";

const STACK: [string, string, string][] = [
  ["API", "FastAPI + Pydantic", "/ask, /classify, /claims/check, /sources, /escalate"],
  ["Retrieval", "Qdrant, hybrid dense + BM25", "Chunked per clause, with act, section, jurisdiction, tier, status"],
  ["Graph", "Postgres tables, Stage 1", "amends, cites, applies_to_category as SQL edges; Neo4j only if Stage 2 needs it"],
  ["LLM", "Model-agnostic adapter", "Cloud model for the prototype; open-weight option on government cloud for data sovereignty"],
  ["Classifier", "Rules engine", "LLM only extracts answers from free text; the category decision itself is deterministic"],
  ["Verifier", "Entailment check", "Each sentence checked against its cited chunk; unsupported sentences are dropped"],
  ["Language", "Bhashini + IndicTrans2 fallback", "Glossary lock on legal terms, back-translation check before display"],
  ["Trust", "Append-only audit table", "Consent records logged; formulation fields encrypted and excluded from logs"],
];

const STAGES = [
  { name: "Stage 1", detail: "Citation-grounded retrieval core: ~40 instruments, classify engine, claim checker, the screens in this build." },
  { name: "Stage 2", detail: "Knowledge graph over amendments and citations, agentic orchestration for multi-step questions." },
  { name: "Stage 3", detail: "Paid-source connectors (TKDL), voice pipeline end to end, WhatsApp bot on the same API." },
];

function useT() {
  const { lang } = useApp();
  return (k: string) => I18N[lang]?.[k] || I18N.en[k] || k;
}

export default function Blueprint() {
  const t = useT();
  const { go } = useApp();

  const grouped = useMemo(() => {
    const byScreen = new Map<string, [string, string][]>();
    for (const [req, how, screen] of COVERAGE) {
      if (!byScreen.has(screen)) byScreen.set(screen, []);
      byScreen.get(screen)!.push([req, how]);
    }
    const order = NAV.map(([k]) => k);
    return order.filter((k) => byScreen.has(k)).map((k) => ({ screen: k, items: byScreen.get(k)! }));
  }, []);

  return (
    <div className="py-10 sm:py-14">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
        <Reveal>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("bpH1")}</h1>
          <p className="mt-2 max-w-[66ch] text-[14.5px] text-ink-2">{t("bpLede")}</p>
        </Reveal>

        <Reveal delay={0.06} className="mt-8">
          <h2 className="text-[15px] font-bold text-ink">Architecture</h2>
          <div className="mt-3 divide-y divide-line rounded-lg border border-line bg-surface">
            {STACK.map(([layer, choice, note]) => (
              <div key={layer} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[110px,220px,1fr] sm:items-baseline sm:gap-4">
                <span className="text-[12px] font-bold uppercase tracking-wide text-brand-strong">{layer}</span>
                <span className="text-[13.5px] font-semibold text-ink">{choice}</span>
                <span className="text-[13px] text-ink-2">{note}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="mt-10">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <h2 className="text-[15px] font-bold text-ink">Staged delivery</h2>
          <p className="mt-1 text-[13px] text-ink-3">Scroll to pan through now, next and later.</p>
        </div>
        <div className="mt-4">
          <HorizontalPan
            items={STAGES.map((s) => (
              <div key={s.name} className="flex h-full flex-col justify-center rounded-lg border border-line bg-surface p-7 shadow-md">
                <p className="text-lg font-bold text-brand-strong">{s.name}</p>
                <p className="mt-2.5 text-[14px] leading-relaxed text-ink-2">{s.detail}</p>
              </div>
            ))}
          />
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
      <Reveal delay={0.14} className="mt-10">
        <h2 className="text-[15px] font-bold text-ink">Problem-statement coverage</h2>
        <p className="mt-1 text-[13px] text-ink-3">Seventeen requirements, grouped by the screen that proves each one.</p>
        <div className="mt-4 space-y-6">
          {grouped.map(({ screen, items }) => (
            <div key={screen}>
              <button
                type="button"
                onClick={() => go(screen as any)}
                className="text-[13px] font-bold uppercase tracking-wide text-brand-strong hover:underline"
              >
                {t(screen)}
              </button>
              <div className="mt-2 space-y-2">
                {items.map(([req, how]) => (
                  <div key={req} className="rounded-md border border-line bg-surface px-4 py-2.5">
                    <p className="text-[13.5px] font-medium text-ink">{req}</p>
                    <p className="text-[12.5px] text-ink-2">{how}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
      </div>
    </div>
  );
}
