import { useMemo } from "react";
import { useLocation } from "wouter";
import { Terminal, CheckCircle } from "@phosphor-icons/react";
import { StatusChip } from "../ui/Chip";
import Section from "../ui/Section";
import Button from "../ui/Button";
import { useT } from "../i18n/useT";
import { COVERAGE } from "../data/coverage";
import { NAV } from "../data/constants";
import { SCREEN_ROUTE, type LegacyScreen } from "../lib/legacyRoutes";
import { openApiInspector } from "../app/ApiInspector";

const PIPELINE = [0, 1, 2, 3, 4, 5, 6].map((i) => ({ stepKey: `pipe${i}step`, descKey: `pipe${i}desc` }));

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

const API_ROUTES: { method: string; path: string; summaryKey: string }[] = [
  { method: "POST", path: "/v1/ask", summaryKey: "apiAskSummary" },
  { method: "POST", path: "/v1/classify", summaryKey: "apiClassifySummary" },
  { method: "POST", path: "/v1/claims/check", summaryKey: "apiClaimsSummary" },
  { method: "GET", path: "/v1/sources", summaryKey: "apiSourcesSummary" },
  { method: "POST", path: "/v1/escalations", summaryKey: "apiEscalationsSummary" },
  { method: "POST", path: "/v1/consent", summaryKey: "apiConsentGrantSummary" },
  { method: "DELETE", path: "/v1/consent", summaryKey: "apiConsentRevokeSummary" },
];

/** #/how (B2, B3): guardrail pipeline, architecture, PS coverage and the API contract, one page. */
export default function HowItWorks() {
  const t = useT();
  const [, navigate] = useLocation();

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
    <div className="mx-auto max-w-[var(--w-shell)] px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-h1 text-ink">{t("trustH1")}</h1>
          <p className="mt-2 max-w-[66ch] text-body-lg text-ink-2">{t("trustLede")}</p>
        </div>
        <Button variant="secondary" icon={<Terminal size={16} />} onClick={openApiInspector}>
          {t("apiInspectorOpen")}
        </Button>
      </div>

      <Section title={t("pipelineHeading")}>
        <ol className="divide-y divide-line rounded-container border border-line">
          {PIPELINE.map((p, i) => (
            <li key={p.stepKey} className="flex gap-3 px-4 py-3.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-pill bg-neem-wash text-small font-bold text-neem-strong">{i + 1}</span>
              <div>
                <p className="text-body font-semibold text-ink">{t(p.stepKey)}</p>
                <p className="text-small text-ink-2">{t(p.descKey)}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title={t("architectureHeading")}>
        <dl className="divide-y divide-line rounded-container border border-line">
          {STACK.map(([layer, choice, note]) => (
            <div key={layer} className="grid gap-1 px-4 py-3.5 sm:grid-cols-[1fr_2fr] sm:gap-4">
              <dt className="text-small font-semibold uppercase tracking-wide text-ink-3">{layer}</dt>
              <dd>
                <span className="block text-body font-semibold text-ink">{choice}</span>
                <span className="block text-small text-ink-2">{note}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title={t("coverageHeading")} lede={t("coverageLede")}>
        <div className="flex flex-col gap-6">
          {grouped.map(({ screen, items }) => (
            <div key={screen}>
              <button
                type="button"
                onClick={() => navigate(SCREEN_ROUTE[screen as LegacyScreen])}
                className="text-small font-bold uppercase tracking-wide text-neem hover:text-neem-strong hover:underline"
              >
                {t(screen)}
              </button>
              <div className="mt-2 flex flex-col gap-2">
                {items.map(([req, how]) => (
                  <div key={req} className="flex items-start gap-2.5 rounded-control border border-line bg-surface px-4 py-2.5">
                    <CheckCircle size={16} weight="fill" className="mt-0.5 shrink-0 text-neem" />
                    <div>
                      <p className="text-small font-semibold text-ink">{req}</p>
                      <p className="text-small text-ink-2">{how}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t("apiContractHeading")} lede={t("apiContractLede")}>
        <div className="overflow-x-auto rounded-container border border-line">
          <table className="w-full text-small">
            <thead className="bg-wash">
              <tr>
                <th className="px-4 py-2.5 text-left font-semibold text-ink-3">{t("apiColMethod")}</th>
                <th className="px-4 py-2.5 text-left font-semibold text-ink-3">{t("apiColPath")}</th>
                <th className="px-4 py-2.5 text-left font-semibold text-ink-3">{t("apiColSummary")}</th>
                <th className="px-4 py-2.5 text-left font-semibold text-ink-3">{t("apiColStatus")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {API_ROUTES.map((r) => (
                <tr key={`${r.method} ${r.path}`}>
                  <td className="px-4 py-2.5 font-mono text-mono text-ink-2">{r.method}</td>
                  <td className="px-4 py-2.5 font-mono text-mono text-ink-2">{r.path}</td>
                  <td className="px-4 py-2.5 text-ink-2">{t(r.summaryKey)}</td>
                  <td className="px-4 py-2.5">
                    <StatusChip tone="done">{t("apiLiveMocked")}</StatusChip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
