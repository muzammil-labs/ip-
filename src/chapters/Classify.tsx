import { useMemo, useRef, useState } from "react";
import Chapter from "../ui/Chapter";
import Section from "../ui/Section";
import RadioCards from "../ui/RadioCards";
import Finding from "../ui/Finding";
import { StatusChip } from "../ui/Chip";
import { EvidenceRow, EvidenceList } from "../ui/EvidenceRow";
import DiffMark from "../ui/DiffMark";
import EmptyState from "../ui/EmptyState";
import Callout from "../ui/Callout";
import TkMatchCard from "../ui/TkMatchCard";
import { useT } from "../i18n/useT";
import { useCase } from "../state/case";
import { CQ } from "../data/classifyQuestions";
import { buildResult, type ClassifyResult } from "../engines/classify";
import { computeTkMatches } from "../engines/tkProximity";
import { FORMULATIONS } from "../data/formulations";
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

export default function Classify() {
  const t = useT();
  const { case: kase, dispatch } = useCase();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const prevResult = useRef<ClassifyResult | null>(null);

  const { shown, total } = visibleQuestions(kase.answers);
  const answeredCount = Object.values(kase.answers).filter(Boolean).length;

  const result = useMemo(() => {
    const r = buildResult(kase.answers, prevResult.current ? { cat: prevResult.current.cat, rowsByKey: Object.fromEntries(prevResult.current.rows.map((row) => [row.key, row.text])) } : null);
    return r;
  }, [kase.answers]);

  function handleAnswer(k: string, v: string) {
    prevResult.current = result;
    dispatch({ type: "answer", k, v });
    setEditingKey(null);
  }

  const tkMatches = useMemo(() => computeTkMatches(kase.formula), [kase.formula]);

  return (
    <Chapter n={2} titleKey="chClassifyTitle" purposeKey="chClassifyPurpose">
      <Section title={t("classifyQuestionsHeading")} lede={t("questionsAnswered").replace("{count}", String(answeredCount)).replace("{total}", String(total))}>
        <div className="flex flex-col gap-3">
          {shown.map((q) => {
            const answer = kase.answers[q.k];
            const isEditing = editingKey === q.k || !answer;
            if (!isEditing && answer) {
              const label = q.o.find(([v]) => v === answer)?.[1] ?? answer;
              return (
                <div key={q.k} className="flex items-center justify-between gap-3 rounded-container border border-line bg-surface px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-small text-ink-3">{q.q}</p>
                    <p className="truncate text-body font-semibold text-ink">{label}</p>
                  </div>
                  <button type="button" onClick={() => setEditingKey(q.k)} className="shrink-0 text-small font-semibold text-neem hover:text-neem-strong">
                    {t("classifyChange")}
                  </button>
                </div>
              );
            }
            return (
              <div key={q.k} className="rounded-container border border-line-strong bg-surface p-4">
                <h3 className="text-body font-semibold text-ink">{q.q}</h3>
                <p className="mt-0.5 text-small text-ink-3">{q.why}</p>
                <div className="mt-3">
                  <RadioCards
                    label={q.q}
                    value={answer}
                    onChange={(v) => handleAnswer(q.k, v)}
                    options={q.o.map(([v, l]) => ({ value: v, title: l, description: "" }))}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title={t("classifyResultHeading")}>
        {!result ? (
          <EmptyState message={t("classifyEmpty")} />
        ) : (
          <div className="flex flex-col gap-6">
            <Finding
              headline={result.def.name}
              verdict={<StatusChip tone="done">{t("classifyMostLikely")}</StatusChip>}
            >
              {result.def.sum}
            </Finding>

            <EvidenceList>
              {result.rows.map((r) => (
                <EvidenceRow key={r.key} state={r.cites.length ? "V" : "U"} cites={r.cites} changed={!!r.changedFrom}>
                  <span className="font-semibold text-ink">{r.label}:</span> {r.text}
                  {r.changedFrom && <DiffMark previous={r.changedFrom} />}
                </EvidenceRow>
              ))}
            </EvidenceList>
          </div>
        )}
      </Section>

      <Section title={t("classifyTkHeading")}>
        {tkMatches.length === 0 ? (
          <EmptyState message={t("tkNoFormula")} />
        ) : (
          <div className="flex flex-col gap-4">
            <Callout tone="note" title={t("tkCalloutTitle").replace("{n}", String(FORMULATIONS.length))}>
              {t("tkCalloutBody")}
            </Callout>
            {tkMatches.map((m) => (
              <TkMatchCard key={m.formulation.slug} match={m} />
            ))}
          </div>
        )}
      </Section>
    </Chapter>
  );
}
