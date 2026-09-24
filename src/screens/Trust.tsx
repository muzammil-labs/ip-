import { CheckCircle, ShieldCheck } from "@phosphor-icons/react";
import { useApp } from "../state/store";
import { I18N } from "../data/i18n";
import Reveal from "../components/Reveal";

const PIPELINE = [
  { step: "Classify first", desc: "A rules-based flow fixes the product's legal category before any IP or biodiversity question is answered." },
  { step: "Retrieve per clause", desc: "The corpus is chunked by statute clause, not by page, with jurisdiction, tier and effective dates as metadata." },
  { step: "Verify every sentence", desc: "A second pass checks each answer sentence against its cited chunk by entailment; unsupported sentences are removed before display." },
  { step: "Separate jurisdictions", desc: "India and international answers are generated and shown as separate columns, never blended into one paragraph." },
  { step: "Compute confidence", desc: "Authority, coverage and agreement are derived from the evidence itself. The model is never asked to grade its own answer." },
  { step: "Abstain on demand", desc: "Dosing, diagnosis and grant-prediction questions are declined by rule, with a route to a human facilitator." },
  { step: "Log, don't store formulations", desc: "Every action is appended to a session audit trail. Formulation details are never written to logs." },
];

const BENCH = [
  { metric: "Citation correctness", note: "Every cited clause actually supports its sentence" },
  { metric: "Answer accuracy per jurisdiction", note: "Scored separately for India and international" },
  { metric: "Abstention rate on adversarial set", note: "30 questions designed to require a decline" },
  { metric: "Classification accuracy", note: "Against 40 hand-labelled scenarios" },
  { metric: "Language fidelity", note: "Back-translation check, English, Hindi, Telugu" },
  { metric: "Jurisdiction leakage", note: "India and international content found mixed in one answer" },
];

export default function Trust() {
  const { lang, audit } = useApp();
  const t = (k: string) => I18N[lang]?.[k] || I18N.en[k] || k;

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 sm:py-14">
      <Reveal>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("trustH1")}</h1>
        <p className="mt-2 max-w-[64ch] text-[14.5px] text-ink-2">{t("trustLede")}</p>
      </Reveal>

      <Reveal delay={0.06} className="mt-8">
        <h2 className="text-[15px] font-bold text-ink">The guardrail pipeline</h2>
        <ol className="mt-3 space-y-3">
          {PIPELINE.map((p, i) => (
            <li key={p.step} className="flex gap-3 rounded-lg border border-line bg-surface p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[12px] font-bold text-brand-strong">{i + 1}</span>
              <div>
                <p className="text-[14px] font-semibold text-ink">{p.step}</p>
                <p className="text-[13px] text-ink-2">{p.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <h2 className="text-[15px] font-bold text-ink">AyurIP-Bench, evaluation targets</h2>
        <p className="mt-1 text-[13px] text-ink-2">150 questions co-written with AIYUSH/IP faculty. Numbers here are targets, not results; scores are never shown before the benchmark has actually run.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {BENCH.map((b) => (
            <div key={b.metric} className="flex items-start gap-2.5 rounded-lg border border-line bg-surface p-4">
              <CheckCircle size={17} weight="duotone" className="mt-0.5 shrink-0 text-brand" />
              <div>
                <p className="text-[13.5px] font-semibold text-ink">{b.metric}</p>
                <p className="text-[12.5px] text-ink-3">{b.note}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.14} className="mt-10 rounded-lg border border-line bg-brand-soft/40 p-5">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} weight="duotone" className="text-brand" />
          <h2 className="text-[15px] font-bold text-ink">DPDP Act, 2023</h2>
        </div>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-[13.5px] text-ink-2">
          <li>Formulation fields are encrypted and excluded from logs entirely.</li>
          <li>Escalation to a facilitator shares only the items you explicitly tick.</li>
          <li>Consent for paid-source queries (like TKDL) is logged in a revocable ledger.</li>
          <li>You can request deletion of your session data at any time.</li>
        </ul>
      </Reveal>

      <Reveal delay={0.18} className="mt-10">
        <h2 className="text-[15px] font-bold text-ink">Live audit trail, this session</h2>
        <p className="mt-1 text-[13px] text-ink-3">Real events from what you have done in this session, not scripted.</p>
        <div className="mt-3 max-h-[320px] overflow-y-auto rounded-lg border border-line">
          {audit.length === 0 ? (
            <p className="p-4 text-[13px] text-ink-3">Nothing logged yet. Ask a question or classify a product to see events here.</p>
          ) : (
            <table className="w-full text-[13px]">
              <tbody>
                {audit.map((a, i) => (
                  <tr key={i} className="border-b border-line last:border-0">
                    <td className="whitespace-nowrap px-3 py-2 font-mono text-[12px] text-ink-3">{a.time}</td>
                    <td className="px-3 py-2 font-medium text-ink">{a.ev}</td>
                    <td className="px-3 py-2 text-ink-2">{a.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Reveal>
    </div>
  );
}
