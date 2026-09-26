import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "motion/react";
import { LinkSimple, Check, FilePdf, UsersThree } from "@phosphor-icons/react";
import Chapter from "../ui/Chapter";
import Section from "../ui/Section";
import Button from "../ui/Button";
import Sheet from "../ui/Sheet";
import Callout from "../ui/Callout";
import Seal from "../ui/Seal";
import { StatusChip } from "../ui/Chip";
import { useMotionOK } from "../ui/motion";
import ExaminerView, { ExaminerToggleButton, useExaminerToggle } from "../panels/ExaminerView";
import { useT } from "../i18n/useT";
import { useCase } from "../state/case";
import { useSession } from "../state/session";
import { shareLinkFor } from "../lib/shareLink";
import { chapterStatus, chapterGaps } from "./status";
import { CHAPTER_ORDER, type ChapterSlug } from "./order";
import { api } from "../api/client";

/** UI-9.16: whether the stamp-in and ripple have already played once this session, tracked
 * outside React state (module scope, not persisted) since it must survive Dossier unmounting
 * and remounting as the visitor navigates away and back within the same session. */
let dossierSealPlayed = false;

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
  const motionOK = useMotionOK();
  const { celebrate } = useSession();

  const isComplete = CHAPTER_ORDER.filter((slug) => slug !== "dossier").every((slug) => status[slug]);
  const [playSealEntrance] = useState(() => isComplete && !dossierSealPlayed);

  useEffect(() => {
    if (!isComplete) return;
    dossierSealPlayed = true;
    celebrate("dossier");
  }, [isComplete, celebrate]);

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
      {isComplete && (
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="relative flex items-center justify-center">
            {playSealEntrance && motionOK && (
              <motion.span
                aria-hidden="true"
                className="absolute rounded-pill border-2 border-leaf-2"
                style={{ width: 96, height: 96 }}
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            )}
            <motion.span
              initial={playSealEntrance && motionOK ? { opacity: 0, scale: 1.4, y: -2 } : false}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
            >
              <Seal size={96} variant="filled" />
            </motion.span>
          </div>
          <p className="text-body-lg font-semibold text-ink">{t("dossierCompleteCaption")}</p>
        </div>
      )}

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
