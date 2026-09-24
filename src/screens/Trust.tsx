import { CheckCircle, ShieldCheck } from "@phosphor-icons/react";
import { useApp } from "../state/store";
import { useT } from "../i18n/useT";
import Reveal from "../components/Reveal";

const PIPELINE = [0, 1, 2, 3, 4, 5, 6].map((i) => ({ stepKey: `pipe${i}step`, descKey: `pipe${i}desc` }));
const BENCH = [0, 1, 2, 3, 4, 5].map((i) => ({ mKey: `bench${i}m`, nKey: `bench${i}n` }));
const DPDP_ITEMS = ["dpdp0", "dpdp1", "dpdp2", "dpdp3"];

export default function Trust() {
  const { audit } = useApp();
  const t = useT();

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 sm:py-14">
      <Reveal>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("trustH1")}</h1>
        <p className="mt-2 max-w-[64ch] text-[14.5px] text-ink-2">{t("trustLede")}</p>
      </Reveal>

      <Reveal delay={0.06} className="mt-8">
        <h2 className="text-[15px] font-bold text-ink">{t("pipelineHeading")}</h2>
        <ol className="mt-3 space-y-3">
          {PIPELINE.map((p, i) => (
            <li key={p.stepKey} className="flex gap-3 rounded-lg border border-line bg-surface p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[12px] font-bold text-brand-strong">{i + 1}</span>
              <div>
                <p className="text-[14px] font-semibold text-ink">{t(p.stepKey)}</p>
                <p className="text-[13px] text-ink-2">{t(p.descKey)}</p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <h2 className="text-[15px] font-bold text-ink">{t("benchHeading")}</h2>
        <p className="mt-1 text-[13px] text-ink-2">{t("benchNote")}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {BENCH.map((b) => (
            <div key={b.mKey} className="flex items-start gap-2.5 rounded-lg border border-line bg-surface p-4">
              <CheckCircle size={17} weight="duotone" className="mt-0.5 shrink-0 text-brand" />
              <div>
                <p className="text-[13.5px] font-semibold text-ink">{t(b.mKey)}</p>
                <p className="text-[12.5px] text-ink-3">{t(b.nKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.14} className="mt-10 rounded-lg border border-line bg-brand-soft/40 p-5">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} weight="duotone" className="text-brand" />
          <h2 className="text-[15px] font-bold text-ink">{t("dpdpHeading")}</h2>
        </div>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-[13.5px] text-ink-2">
          {DPDP_ITEMS.map((k) => (
            <li key={k}>{t(k)}</li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.18} className="mt-10">
        <h2 className="text-[15px] font-bold text-ink">{t("auditHeading")}</h2>
        <p className="mt-1 text-[13px] text-ink-3">{t("auditLede")}</p>
        <div className="mt-3 max-h-[320px] overflow-y-auto rounded-lg border border-line">
          {audit.length === 0 ? (
            <p className="p-4 text-[13px] text-ink-3">{t("auditEmpty")}</p>
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
