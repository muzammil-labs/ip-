import { useState } from "react";
import { Eye } from "@phosphor-icons/react";
import Button from "../ui/Button";
import { EvidenceList } from "../ui/EvidenceRow";
import { StatusChip } from "../ui/Chip";
import CiteChip from "../ui/CiteChip";
import { useT } from "../i18n/useT";
import { useCase } from "../state/case";
import { objectionsFor } from "../data/examinerRules";

/** UI-6.7: "See this as a patent examiner would." Toggle + the FER-order objection list. Shared between
 * Chapter 3 (Protect) and the Dossier so the same view appears wherever a Case is reviewed. */
export function useExaminerToggle() {
  const [open, setOpen] = useState(false);
  return { open, setOpen };
}

export function ExaminerToggleButton({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const t = useT();
  return (
    <Button variant={open ? "primary" : "secondary"} size="md" icon={<Eye size={16} />} onClick={() => setOpen(!open)} aria-pressed={open}>
      {t("examinerToggle")}
    </Button>
  );
}

export default function ExaminerView() {
  const t = useT();
  const { case: kase } = useCase();
  const rules = objectionsFor(kase);

  if (rules.length === 0) return null;

  return (
    <div className="rounded-container border border-line bg-surface p-5">
      <h2 className="text-h3 text-ink">{t("examinerHeading")}</h2>
      <p className="mt-1 text-small text-ink-3">{t("examinerLede")}</p>
      <div className="mt-4">
        <EvidenceList>
          {rules.map((r) => {
            const cites = r.cites(kase);
            const objection = r.objection(kase);
            const evidence = r.evidenceNeeded(kase);
            const pending = !objection;
            const done = !pending && r.satisfiedBy(kase);
            return (
              <div key={r.id} className="flex items-start gap-2.5 px-1 py-3 text-body">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-mono text-ink-3">{t(`examinerGround${r.id.replace("-", "")}`)}</span>
                    {pending ? (
                      <StatusChip tone="input">{t("tkCitationPending")}</StatusChip>
                    ) : done ? (
                      <StatusChip tone="done">{t("examinerAnswered")}</StatusChip>
                    ) : (
                      <StatusChip tone="risk">{t("examinerNotAnswered")}</StatusChip>
                    )}
                  </div>
                  {pending ? (
                    <p className="mt-1 text-ink-2">{t("examinerPendingNote")}</p>
                  ) : (
                    <>
                      <p className="mt-1 text-ink-2">
                        {objection}
                        {cites.map((c) => (
                          <CiteChip key={c} sourceId={c} />
                        ))}
                      </p>
                      {evidence.length > 0 && (
                        <ul className="mt-2 list-inside list-disc text-small text-ink-3">
                          {evidence.map((e) => (
                            <li key={e}>{e}</li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </EvidenceList>
      </div>
    </div>
  );
}
