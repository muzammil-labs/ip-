import { useMemo } from "react";
import { Link } from "wouter";
import Chapter from "../ui/Chapter";
import Section from "../ui/Section";
import EmptyState from "../ui/EmptyState";
import { EvidenceRow, EvidenceList } from "../ui/EvidenceRow";
import ExaminerView, { ExaminerToggleButton, useExaminerToggle } from "../panels/ExaminerView";
import { useT } from "../i18n/useT";
import { useCase } from "../state/case";
import { classify } from "../engines/classify";
import { protectionRows, type ProtectionRow, type ProtectionStrength } from "../data/protectionRows";

const GROUPS: { strength: ProtectionStrength; headingKey: string; state: "V" | "U" | "R" }[] = [
  { strength: "strong", headingKey: "protectStrongHeading", state: "V" },
  { strength: "limited", headingKey: "protectLimitedHeading", state: "U" },
  { strength: "none", headingKey: "protectNoneHeading", state: "R" },
];

export default function Protect() {
  const t = useT();
  const { case: kase } = useCase();
  const result = useMemo(() => classify(kase), [kase]);
  const examiner = useExaminerToggle();

  return (
    <Chapter
      n={3}
      titleKey="chProtectTitle"
      purposeKey="chProtectPurpose"
      headerAction={result ? <ExaminerToggleButton open={examiner.open} setOpen={examiner.setOpen} /> : undefined}
    >
      {result && examiner.open && (
        <div className="mb-8">
          <ExaminerView />
        </div>
      )}
      {!result ? (
        <EmptyState
          message={t("protectNeedsClassify")}
          action={
            <Link href="/case/classify" className="text-small font-semibold text-neem hover:text-neem-strong">
              {t("protectGoToClassify")}
            </Link>
          }
        />
      ) : (
        GROUPS.map((g) => {
          const rows = protectionRows(result.cat).filter((r: ProtectionRow) => r.strength === g.strength);
          if (rows.length === 0) return null;
          return (
            <Section key={g.strength} title={t(g.headingKey)}>
              <EvidenceList>
                {rows.map((r) => (
                  <EvidenceRow key={r.ip} state={g.state} cites={r.cites}>
                    <span className="font-semibold text-ink">{t(`ip${r.ip}`)}:</span> {r.text}
                  </EvidenceRow>
                ))}
              </EvidenceList>
            </Section>
          );
        })
      )}
    </Chapter>
  );
}
