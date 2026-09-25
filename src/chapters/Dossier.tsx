import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LinkSimple, Check, FilePdf, UsersThree } from "@phosphor-icons/react";
import Chapter from "../ui/Chapter";
import Section from "../ui/Section";
import Button from "../ui/Button";
import Sheet from "../ui/Sheet";
import Callout from "../ui/Callout";
import { StatusChip } from "../ui/Chip";
import ExaminerView, { ExaminerToggleButton, useExaminerToggle } from "../panels/ExaminerView";
import { useT } from "../i18n/useT";
import { useCase } from "../state/case";
import { shareLinkFor } from "../lib/shareLink";
import { chapterStatus, chapterGaps } from "./status";
import { CHAPTER_ORDER, type ChapterSlug } from "./order";
import { api } from "../api/client";

const CHAPTER_TITLE_KEY: Record<ChapterSlug, string> = {
  describe: "chDescribeTitle",
  classify: "chClassifyTitle",
  protect: "chProtectTitle",
  owe: "chOweTitle",
  say: "chSayTitle",
  search: "chSearchTitle",
  dossier: "chDossierTitle",
};

export default function Dossier() {
  const t = useT();
  const { case: kase } = useCase();
  const [, navigate] = useLocation();
  const [copied, setCopied] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [sending, setSending] = useState(false);

  const status = chapterStatus(kase);
  const gaps = chapterGaps(kase);
  const examiner = useExaminerToggle();

  async function copyLink() {
    const link = shareLinkFor(kase);
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // Clipboard API unavailable or denied; the link is still valid, just not auto-copied.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function sendToFacilitator() {
    if (!consentChecked) return;
    setSending(true);
    try {
      await api.escalate(kase.id, t("dossierFacilitatorScope"));
      setEscalated(true);
      setSheetOpen(false);
      setConsentChecked(false);
    } finally {
      setSending(false);
    }
  }

  return (
    <Chapter
      n={7}
      titleKey="chDossierTitle"
      purposeKey="chDossierPurpose"
      headerAction={<ExaminerToggleButton open={examiner.open} setOpen={examiner.setOpen} />}
    >
      {examiner.open && (
        <div className="mb-8">
          <ExaminerView />
        </div>
      )}
      <Section title={t("dossierStatusHeading")}>
        <ul className="divide-y divide-line rounded-container border border-line">
          {CHAPTER_ORDER.filter((slug) => slug !== "dossier").map((slug) => (
            <li key={slug} className="flex items-center justify-between gap-3 px-4 py-3">
              <span className="text-body text-ink">{t(CHAPTER_TITLE_KEY[slug])}</span>
              <StatusChip tone={status[slug] ? "done" : "input"}>{t(status[slug] ? "dossierDone" : "dossierNeedsInput")}</StatusChip>
            </li>
          ))}
        </ul>
      </Section>

      {gaps.length > 0 && (
        <Section title={t("dossierGapsHeading")}>
          <ul className="flex flex-col gap-2">
            {gaps.map((slug) => (
              <li key={slug}>
                <Link href={`/case/${slug}`} className="text-small font-semibold text-neem hover:text-neem-strong">
                  {t("dossierGapItem").replace("{chapter}", t(CHAPTER_TITLE_KEY[slug]))}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title={t("dossierActionsHeading")}>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" icon={copied ? <Check size={16} /> : <LinkSimple size={16} />} onClick={copyLink}>
            {copied ? t("linkCopied") : t("copyLink")}
          </Button>
          <Button variant="secondary" icon={<FilePdf size={16} />} onClick={() => navigate("/dossier/print")}>
            {t("dossierExportPdf")}
          </Button>
          {escalated ? (
            <span className="inline-flex items-center gap-1.5 text-small font-medium text-neem-strong">
              <Check size={16} weight="bold" /> {t("dossierEscalated")}
            </span>
          ) : (
            <Button variant="secondary" icon={<UsersThree size={16} />} onClick={() => setSheetOpen(true)}>
              {t("dossierSendToFacilitator")}
            </Button>
          )}
        </div>
      </Section>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen} title={t("dossierFacilitatorTitle")}>
        <p className="text-small text-ink-2">{t("dossierFacilitatorDesc")}</p>
        <Callout tone="note" title={t("dlShared")}>
          {t("dossierFacilitatorScope")}
        </Callout>
        <label className="mt-4 flex items-start gap-2 text-small text-ink-2">
          <input type="checkbox" checked={consentChecked} onChange={(e) => setConsentChecked(e.target.checked)} className="mt-0.5" />
          {t("consentLabel")}
        </label>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setSheetOpen(false)}>
            {t("dontAllow")}
          </Button>
          <Button onClick={sendToFacilitator} disabled={!consentChecked} loading={sending}>
            {t("allowAndLog")}
          </Button>
        </div>
      </Sheet>
    </Chapter>
  );
}
