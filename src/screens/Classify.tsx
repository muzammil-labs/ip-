import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../state/store";
import { useSession } from "../state/session";
import { useT } from "../i18n/useT";
import { CQ } from "../data/classifyQuestions";
import { CAT } from "../data/classifyCategories";
import { SNAPSHOT } from "../data/pathwaySnapshot";
import { SNAPLABEL, SNAPWORD_KEY, PRESETS } from "../data/constants";
import { buildResult, meterColor, shortCite, nextSteps } from "../lib/classify";
import Reveal from "../components/Reveal";
import type { ClassifyState } from "../lib/types";

function visibleQuestions(c: ClassifyState) {
  const applicable = CQ.filter((q) => !q.show || q.show(c));
  const out: typeof CQ = [];
  for (const q of applicable) {
    const priorAnswered = applicable.slice(0, applicable.indexOf(q)).every((x) => c[x.k]);
    if (!priorAnswered) break;
    out.push(q);
  }
  return { shown: out, total: applicable.length };
}

function PathwaySnapshot({ cat, t }: { cat: string; t: (k: string) => string }) {
  const snap = SNAPSHOT[cat];
  if (!snap) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Object.entries(snap).map(([k, lvl]) => {
        const [labelKey, pol] = SNAPLABEL[k];
        const color = meterColor(lvl, pol);
        return (
          <div key={k}>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-ink-2">{t(labelKey)}</span>
              <b style={{ color }}>{t(SNAPWORD_KEY[lvl])}</b>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-sunk">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${lvl * 33 + 1}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full"
                style={{ background: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Classify() {
  const app = useApp();
  const { cls, setCls, answerCls, prevRows, setPrevRows } = app;
  const { openClauseSheet } = useSession();
  const t = useT();

  const { shown, total } = visibleQuestions(cls);
  const answeredCount = Object.values(cls).filter(Boolean).length;

  const result = useMemo(() => buildResult(cls, prevRows), [cls, prevRows]);

  function handleAnswer(k: string, v: string) {
    const priorResult = buildResult(cls, prevRows);
    if (priorResult) {
      setPrevRows({ cat: priorResult.cat, rowsByKey: Object.fromEntries(priorResult.rows.map((r) => [r.key, r.text])) });
    }
    answerCls(k, v);
  }

  function applyWhatIf(patch: Partial<ClassifyState> | "phyto") {
    const priorResult = buildResult(cls, prevRows);
    if (priorResult) setPrevRows({ cat: priorResult.cat, rowsByKey: Object.fromEntries(priorResult.rows.map((r) => [r.key, r.text])) });
    if (patch === "phyto") setCls({ ...cls, text: "new", frac: "yes" });
    else setCls({ ...cls, ...patch });
  }

  function applyPreset(key: keyof typeof PRESETS) {
    setPrevRows(null);
    setCls({ ...PRESETS[key] });
  }

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 sm:py-14">
      <Reveal>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("clsH1")}</h1>
        <p className="mt-2 max-w-[62ch] text-[14.5px] text-ink-2">{t("clsLede")}</p>
      </Reveal>

      <Reveal delay={0.05} className="mt-5 flex flex-wrap gap-2">
        <span className="text-[12.5px] text-ink-3">{t("presetTry")}</span>
        {(Object.keys(PRESETS) as (keyof typeof PRESETS)[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => applyPreset(k)}
            className="rounded-full border border-line px-3 py-1 text-[12.5px] font-medium text-ink-2 hover:bg-sunk"
          >
            {t(k === "ashwa" ? "presetAshwa" : k === "chyawan" ? "presetChyawan" : "presetTea")}
          </button>
        ))}
      </Reveal>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-[12.5px] font-medium text-ink-3">{t("questionsAnswered").replace("{count}", String(answeredCount)).replace("{total}", String(total))}</p>
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {shown.map((q) => (
                <motion.div
                  key={q.k}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-lg border p-4 ${cls[q.k] ? "border-brand/30 bg-brand-soft/30" : "border-line bg-surface"}`}
                >
                  <h3 className="text-[14.5px] font-semibold text-ink">{q.q}</h3>
                  <p className="mt-0.5 text-[12.5px] text-ink-3">{q.why}</p>
                  <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={q.q}>
                    {q.o.map(([v, l]) => (
                      <button
                        key={v}
                        type="button"
                        aria-pressed={cls[q.k] === v}
                        onClick={() => handleAnswer(q.k, v)}
                        className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                          cls[q.k] === v ? "bg-brand text-white" : "border border-line text-ink-2 hover:bg-sunk"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div>
          {!result ? (
            <div className="flex h-full min-h-[200px] items-center justify-center rounded-lg border border-dashed border-line p-8 text-center text-[13.5px] text-ink-3">
              {t("classifyEmpty")}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border border-line bg-surface p-5">
              <p className="text-[12.5px] text-ink-3">{t("mostLikely")}</p>
              <h2 className="text-[19px] font-bold text-ink">{result.def.name}</h2>
              <p className="mt-1 text-[13.5px] text-ink-2">{result.def.sum}</p>

              <div className="mt-4 border-t border-line pt-4">
                <PathwaySnapshot cat={result.cat} t={t} />
              </div>

              <table className="mt-5 w-full border-t border-line text-[13px]">
                <tbody>
                  {result.rows.map((r) => (
                    <tr key={r.key} className={`border-b border-line align-top ${r.changedFrom ? "bg-turmeric-soft/40" : ""}`}>
                      <th scope="row" className="w-[38%] py-2.5 pr-3 text-left font-semibold text-ink-2">{r.label}</th>
                      <td className="py-2.5 text-ink-2">
                        {r.text}
                        {r.cites.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => openClauseSheet(c)}
                            className="ml-1.5 rounded-full border border-focus/40 bg-focus-soft px-2 py-0.5 text-[11px] font-semibold text-focus hover:scale-105"
                          >
                            {shortCite(c)}
                          </button>
                        ))}
                        {r.changedFrom && <span className="mt-1 block text-[11.5px] text-ink-3">{t("beforeLabel")}{r.changedFrom}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(result.changedLabels.length > 0 || result.categoryChanged) && (
                <div role="status" className="mt-3 rounded-md bg-turmeric-soft px-3 py-2 text-[12.5px] text-ink-2">
                  <b>{t("whatChanged")}</b>{" "}
                  {result.categoryChanged && t("categoryMoved").replace("{name}", result.def.name)}
                  {result.changedLabels.length ? t("areasNeedRecheck").replace("{n}", String(result.changedLabels.length)).replace("{list}", result.changedLabels.join(", ")) : t("nothingElseChanged")}
                </div>
              )}

              <div className="mt-5 border-t border-line pt-4">
                <h3 className="text-[14px] font-bold text-ink">{t("whatIfTitle")}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button type="button" onClick={() => applyWhatIf({ src: "wild" })} className="rounded-full border border-line px-3 py-1.5 text-[12.5px] text-ink-2 hover:bg-sunk">{t("whatIf1")}</button>
                  <button type="button" onClick={() => applyWhatIf({ ent: "fr" })} className="rounded-full border border-line px-3 py-1.5 text-[12.5px] text-ink-2 hover:bg-sunk">{t("whatIf2")}</button>
                  <button type="button" onClick={() => applyWhatIf("phyto")} className="rounded-full border border-line px-3 py-1.5 text-[12.5px] text-ink-2 hover:bg-sunk">{t("whatIf3")}</button>
                  <button type="button" onClick={() => applyWhatIf({ use: "food" })} className="rounded-full border border-line px-3 py-1.5 text-[12.5px] text-ink-2 hover:bg-sunk">{t("whatIf4")}</button>
                </div>
              </div>

              <div className="mt-5 border-t border-line pt-4">
                <h3 className="text-[14px] font-bold text-ink">{t("nextStepsTitle")}</h3>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-[13px] text-ink-2">
                  {nextSteps(result.cat, cls).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
                <button type="button" onClick={() => app.go("tk")} className="mt-4 rounded-full border border-line px-3.5 py-2 text-[13px] font-medium text-ink-2 hover:bg-sunk">
                  {t("searchPriorArt")}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
