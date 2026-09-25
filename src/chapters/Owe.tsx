import { useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import Chapter from "../ui/Chapter";
import Section from "../ui/Section";
import EmptyState from "../ui/EmptyState";
import Segmented from "../ui/Segmented";
import { EvidenceRow, EvidenceList } from "../ui/EvidenceRow";
import DiffMark from "../ui/DiffMark";
import { StatusChip } from "../ui/Chip";
import Callout from "../ui/Callout";
import BenefitFlow from "../panels/BenefitFlow";
import { useT } from "../i18n/useT";
import { useCase } from "../state/case";
import { classify } from "../engines/classify";
import { absDuties } from "../engines/absDuties";
import { computeBenefitShare } from "../engines/benefitShare";

const SOURCE_OPTIONS = ["cult", "wild", "imp"] as const;
const YES_NO = ["no", "yes"] as const;

export default function Owe() {
  const t = useT();
  const { case: kase, dispatch } = useCase();
  const result = useMemo(() => classify(kase), [kase]);
  const prevAbs = useRef<string | null>(null);
  const [absChanged, setAbsChanged] = useState(false);

  const [absText, absCites] = absDuties(kase);
  const benefitShare = useMemo(() => computeBenefitShare(kase, kase.highValueResource ?? false), [kase]);

  function setSource(src: string) {
    prevAbs.current = absText;
    dispatch({ type: "answer", k: "src", v: src });
    setAbsChanged(true);
  }

  function setHighValue(v: string) {
    dispatch({ type: "setField", field: "highValueResource", value: v === "yes" });
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
            {benefitShare.kind === "needs-input" ? (
              <EmptyState
                message={
                  benefitShare.reason === "no-source"
                    ? t("benefitShareNeedsSource")
                    : benefitShare.reason === "no-entity"
                      ? t("benefitShareNeedsEntity")
                      : t("benefitShareNeedsTurnover")
                }
              />
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-small font-medium text-ink">{t("benefitShareHighValueLabel")}</span>
                  <Segmented
                    label={t("benefitShareHighValueLabel")}
                    value={kase.highValueResource ? "yes" : "no"}
                    onChange={setHighValue}
                    options={YES_NO.map((v) => ({ value: v, label: t(`benefitShare${v === "yes" ? "Yes" : "No"}`) }))}
                  />
                </div>

                {benefitShare.kind === "not-applicable" && (
                  <Callout tone="note" title={benefitShare.reason === "imported" ? t("benefitShareNotApplicableImported") : t("benefitShareNotApplicableExempt")} />
                )}

                {benefitShare.kind === "nil" && (
                  <EvidenceList>
                    <EvidenceRow state="U" cites={[]}>
                      {t("benefitShareNilLabel")}
                      <span className="ml-1.5 inline-block align-middle">
                        <StatusChip tone="input">{t("benefitShareCitationPending")}</StatusChip>
                      </span>
                    </EvidenceRow>
                  </EvidenceList>
                )}

                {benefitShare.kind === "computed" && (
                  <EvidenceList>
                    <EvidenceRow state="U" cites={[]}>
                      {t("benefitShareComputedLabel")
                        .replace("{rate}", String((benefitShare.rate ?? 0) * 100))
                        .replace("{amount}", (benefitShare.amountCr ?? 0).toFixed(3))}
                      <span className="ml-1.5 inline-block align-middle">
                        <StatusChip tone="input">{t("benefitShareCitationPending")}</StatusChip>
                      </span>
                    </EvidenceRow>
                  </EvidenceList>
                )}

                {benefitShare.kind === "unconfirmed" && (
                  <EvidenceList>
                    <EvidenceRow state="U" cites={[]}>
                      {benefitShare.slabLabel === "highValue" ? t("benefitShareHighValueUnconfirmedLabel") : t("benefitShareAbove250Label")}
                      <span className="ml-1.5 inline-block align-middle">
                        <StatusChip tone="input">{t("benefitShareConfirmRegulation")}</StatusChip>
                      </span>
                    </EvidenceRow>
                  </EvidenceList>
                )}

                {benefitShare.kind !== "not-applicable" && (
                  <p className="text-small text-ink-3">
                    {t("benefitShareReportingNote")} <StatusChip tone="input">{t("benefitShareConfirmRegulation")}</StatusChip>
                  </p>
                )}

                {benefitShare.kind !== "not-applicable" && (
                  <BenefitFlow result={benefitShare} />
                )}
              </div>
            )}
          </Section>
        </>
      )}
    </Chapter>
  );
}
