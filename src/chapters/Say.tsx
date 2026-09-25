import { useState } from "react";
import Chapter from "../ui/Chapter";
import Section from "../ui/Section";
import { TextArea } from "../ui/Field";
import Button from "../ui/Button";
import { EvidenceRow, EvidenceList } from "../ui/EvidenceRow";
import EmptyState from "../ui/EmptyState";
import { useT } from "../i18n/useT";
import { useCase } from "../state/case";
import { claimsCheck, type ClaimReport } from "../engines/claims";

const SAMPLE = "Our churna permanently cures diabetes and high blood pressure with no side effects, clinically proven and 100% natural.";

export default function Say() {
  const t = useT();
  const { case: kase, dispatch } = useCase();
  const [text, setText] = useState(kase.claims[0]?.text ?? "");
  const [report, setReport] = useState<ClaimReport | null>(null);

  function check(value: string = text) {
    const r = claimsCheck(kase, value);
    setReport(r);
    dispatch({ type: "setClaims", claims: [{ text: value, medium: "label" }] });
  }

  return (
    <Chapter n={5} titleKey="chSayTitle" purposeKey="chSayPurpose">
      <Section title={t("sayInputHeading")}>
        <TextArea
          label={t("sayClaimLabel")}
          placeholder={t("claimPlaceholder")}
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button onClick={() => check()}>{t("checkTextBtn")}</Button>
          <button
            type="button"
            onClick={() => {
              setText(SAMPLE);
              check(SAMPLE);
            }}
            className="text-small font-semibold text-indigo hover:underline"
          >
            {t("trySample")}
          </button>
        </div>
      </Section>

      {report && (
        <>
          <Section title={t("sayHighlightedHeading")}>
            <div className="rounded-container border border-line bg-surface p-4 text-body leading-relaxed text-ink-2">
              {report.segments.length === 0 && <span className="text-ink-3">{t("nothingToCheck")}</span>}
              {report.segments.map((seg, i) =>
                seg.finding ? (
                  <mark
                    key={i}
                    className={`bg-transparent underline decoration-2 underline-offset-2 ${
                      seg.finding.rule.lvl === "bad" ? "text-kumkum decoration-kumkum" : "text-haldi decoration-haldi"
                    }`}
                  >
                    {seg.text}
                  </mark>
                ) : (
                  <span key={i}>{seg.text}</span>
                )
              )}
            </div>
          </Section>

          <Section title={t("findingsHeading")}>
            {report.findings.length === 0 ? (
              <EmptyState message={t("noProhibited")} />
            ) : (
              <EvidenceList>
                {report.findings.map((f, i) => (
                  <EvidenceRow key={i} state={f.rule.lvl === "bad" ? "C" : "U"} cites={[f.rule.cite]}>
                    <span className="font-semibold text-ink">{f.match}:</span> {f.rule.why(f.match)}
                    <br />
                    <span className="text-ink-3">{t("saferLabel")}{f.rule.fix}</span>
                  </EvidenceRow>
                ))}
              </EvidenceList>
            )}
          </Section>
        </>
      )}
    </Chapter>
  );
}
