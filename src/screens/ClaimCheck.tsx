import { useState } from "react";
import { motion } from "motion/react";
import { Warning } from "@phosphor-icons/react";
import { useApp } from "../state/store";
import { I18N } from "../data/i18n";
import { runClaims } from "../lib/claims";
import { shortCite } from "../lib/classify";
import Reveal from "../components/Reveal";

const CATEGORIES = [
  { key: "drug", labelKey: "catDrug" },
  { key: "aahara", labelKey: "catAahara" },
  { key: "cosmetic", labelKey: "catCosmetic" },
];

const SAMPLE = "Our churna permanently cures diabetes and high blood pressure with no side effects, clinically proven and 100% natural.";

export default function ClaimCheck() {
  const { lang, claimCat, setClaimCat, logEvent, openSource } = useApp();
  const t = (k: string) => I18N[lang]?.[k] || I18N.en[k] || k;
  const [text, setText] = useState("");
  const [report, setReport] = useState<ReturnType<typeof runClaims> | null>(null);

  function check(value?: string) {
    const src = value ?? text;
    const r = runClaims(src, claimCat);
    setReport(r);
    logEvent("Claim check run", `${r.bad} prohibited, ${r.warn} to substantiate, text not stored`);
  }

  return (
    <div className="mx-auto max-w-[900px] px-4 py-10 sm:px-6 sm:py-14">
      <Reveal>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("claimH1")}</h1>
        <p className="mt-2 max-w-[64ch] text-[14.5px] text-ink-2">{t("claimLede")}</p>
      </Reveal>

      <Reveal delay={0.06} className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setClaimCat(c.key)}
            className={`rounded-full px-3 py-1.5 text-[12.5px] font-medium ${claimCat === c.key ? "bg-brand-soft text-brand-strong" : "border border-line text-ink-2 hover:bg-sunk"}`}
          >
            {t(c.labelKey)}
          </button>
        ))}
      </Reveal>

      <Reveal delay={0.1} className="mt-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder={t("claimPlaceholder")}
          className="w-full resize-y rounded-lg border border-line bg-surface p-4 text-[14.5px] leading-relaxed text-ink outline-none focus:border-brand"
        />
        <div className="mt-2 flex items-center gap-3">
          <button type="button" onClick={() => check()} className="rounded-full bg-brand px-5 py-2.5 text-[13.5px] font-semibold text-white">
            {t("checkTextBtn")}
          </button>
          <button
            type="button"
            onClick={() => {
              setText(SAMPLE);
              check(SAMPLE);
            }}
            className="text-[12.5px] text-focus hover:underline"
          >
            {t("trySample")}
          </button>
        </div>
      </Reveal>

      {report && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          <h3 className="text-[14px] font-bold text-ink">
            {report.findings.length ? t("findingsSummary").replace("{bad}", String(report.bad)).replace("{warn}", String(report.warn)) : t("findingsHeading")}
          </h3>

          <div className="mt-3 rounded-lg border border-line bg-surface p-4 text-[14.5px] leading-relaxed">
            {report.segments.map((seg, i) =>
              seg.finding ? (
                <mark
                  key={i}
                  className={`rounded px-0.5 ${seg.finding.rule.lvl === "bad" ? "bg-kumkum-soft text-kumkum" : "bg-turmeric-soft text-turmeric"}`}
                >
                  {seg.text}
                </mark>
              ) : (
                <span key={i}>{seg.text}</span>
              )
            )}
            {!report.segments.length && <span className="text-ink-3">{t("nothingToCheck")}</span>}
          </div>

          <ul className="mt-4 space-y-2.5">
            {!report.findings.length && (
              <li className="rounded-md border-l-[3px] border-brand bg-brand-soft/40 px-4 py-3 text-[13.5px]">
                <b>{t("noProhibited")}</b>{" "}
                <span className="text-ink-3">{t("noProhibitedNote")}</span>
              </li>
            )}
            {report.findings.map((f, i) => (
              <li key={i} className={`rounded-md border-l-[3px] px-4 py-3 text-[13.5px] ${f.rule.lvl === "warn" ? "border-turmeric bg-turmeric-soft/40" : "border-kumkum bg-kumkum-soft/40"}`}>
                <b>{f.match}</b> — {f.rule.why(f.match)}{" "}
                <button type="button" onClick={() => openSource(f.rule.cite)} className="ml-1 rounded-full border border-focus/40 bg-focus-soft px-2 py-0.5 text-[11px] font-semibold text-focus">
                  {shortCite(f.rule.cite)}
                </button>
                <br />
                <span className="text-ink-3">{t("saferLabel")}{f.rule.fix}</span>
              </li>
            ))}
            {report.ruleFlagged && (
              <li className="rounded-md border-l-[3px] border-turmeric bg-turmeric-soft/40 px-4 py-3 text-[13.5px]">
                <div className="flex items-center gap-1.5 font-semibold text-ink"><Warning size={14} /> {t("priorApprovalTitle")}</div>
                <span className="text-ink-2">
                  {t("priorApprovalText")}
                </span>{" "}
                <button type="button" onClick={() => openSource("dr-170")} className="ml-1 rounded-full border border-focus/40 bg-focus-soft px-2 py-0.5 text-[11px] font-semibold text-focus">
                  R.170
                </button>
              </li>
            )}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
