import { useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import Chapter from "../ui/Chapter";
import Section from "../ui/Section";
import EmptyState from "../ui/EmptyState";
import Segmented from "../ui/Segmented";
import { EvidenceRow, EvidenceList } from "../ui/EvidenceRow";
import DiffMark from "../ui/DiffMark";
import { useT } from "../i18n/useT";
import { useCase } from "../state/case";
import { classify } from "../engines/classify";
import { absDuties } from "../engines/absDuties";

const SOURCE_OPTIONS = ["cult", "wild", "imp"] as const;

export default function Owe() {
  const t = useT();
  const { case: kase, dispatch } = useCase();
  const result = useMemo(() => classify(kase), [kase]);
  const prevAbs = useRef<string | null>(null);
  const [absChanged, setAbsChanged] = useState(false);

  const [absText, absCites] = absDuties(kase);

  function setSource(src: string) {
    prevAbs.current = absText;
    dispatch({ type: "answer", k: "src", v: src });
    setAbsChanged(true);
  }

  return (
    <Chapter n={4} titleKey="chOweTitle" purposeKey="chOwePurpose">
      {!result ? (
        <EmptyState
          message={t("oweNeedsClassify")}
          action={
            <Link href="/case/classify" className="text-small font-semibold text-neem hover:text-neem-strong">
              {t("oweGoToClassify")}
            </Link>
          }
        />
      ) : (
        <>
          <Section title={t("oweRouteHeading")}>
            <EvidenceList>
              <EvidenceRow state="V" cites={result.def.rows.route[1]}>
                {result.def.rows.route[0]}
              </EvidenceRow>
              <EvidenceRow state="V" cites={result.def.rows.evidence[1]}>
                {result.def.rows.evidence[0]}
              </EvidenceRow>
            </EvidenceList>
          </Section>

          <Section title={t("oweAbsHeading")}>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="text-small font-medium text-ink">{t("oweWhatIfLabel")}</span>
              <Segmented
                label={t("oweWhatIfLabel")}
                value={kase.answers.src ?? "cult"}
                onChange={setSource}
                options={SOURCE_OPTIONS.map((v) => ({ value: v, label: t(`source${v}`) }))}
              />
            </div>
            <EvidenceList>
              <EvidenceRow state={absCites.length ? "V" : "U"} cites={absCites} changed={absChanged}>
                {absText}
                {absChanged && prevAbs.current && <DiffMark previous={prevAbs.current} />}
              </EvidenceRow>
            </EvidenceList>
          </Section>

          <Section title={t("oweBenefitShareHeading")}>
            <EmptyState message={t("oweBenefitShareComingSoon")} />
          </Section>
        </>
      )}
    </Chapter>
  );
}
