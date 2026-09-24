import { AnimatePresence, motion } from "motion/react";
import { X, ArrowSquareOut } from "@phosphor-icons/react";
import { useSession } from "../state/session";
import { useT } from "../i18n/useT";
import { SOURCES } from "../data/sources";
import { TIER_NAME_KEY } from "../data/constants";
import EvidenceMark from "./EvidenceMark";

function SourceBlock({ id, t }: { id: string; t: (k: string) => string }) {
  const s = SOURCES[id];
  if (!s) return null;
  return (
    <div className="space-y-4">
      {s.excerpt ? (
        <blockquote className="rounded-md border border-line bg-sunk px-4 py-3 text-[14.5px] italic leading-relaxed text-ink-2">
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-3">{t("exactText")}</span>
          &ldquo;{s.excerpt}&rdquo;
        </blockquote>
      ) : (
        <div className="rounded-md border border-line bg-sunk px-4 py-3 text-[14.5px] leading-relaxed text-ink-2">
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-3">
            {t("summaryPlain")}
          </span>
          {s.summary}
        </div>
      )}
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[13.5px]">
        <dt className="text-ink-3">{t("authorityLabel")}</dt>
        <dd>{t("tierLabel").replace("{n}", String(s.tier))}, {t(TIER_NAME_KEY[s.tier])}</dd>
        <dt className="text-ink-3">{t("issuedByLabel")}</dt>
        <dd>{s.by}</dd>
        <dt className="text-ink-3">{t("jurisdictionLabel")}</dt>
        <dd>{s.jur}</dd>
        <dt className="text-ink-3">{t("statusLabel")}</dt>
        <dd>{s.status} {s.flux && <span className="ml-1 rounded-full bg-turmeric-soft px-2 py-0.5 text-[11px] font-semibold text-turmeric">{t("lawChanged")}</span>}</dd>
        <dt className="text-ink-3">{t("versionLabel")}</dt>
        <dd>{s.ver}</dd>
        <dt className="text-ink-3">{t("accessLabel")}</dt>
        <dd>{s.paid ? t("paidAccessNote") : t("freeAccessNote")}</dd>
      </dl>
      {s.note && <p className="text-[13.5px] text-ink-3">{s.note}</p>}
      <a href={s.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-focus hover:underline">
        {t("openOfficialRecord")} <ArrowSquareOut size={14} />
      </a>
    </div>
  );
}

export default function SourceDrawer() {
  const { clauseSheet, closeClauseSheet } = useSession();
  const t = useT();
  const isConflict = clauseSheet?.point?.s === "C";
  const s = clauseSheet ? SOURCES[clauseSheet.sourceId] : null;

  return (
    <AnimatePresence>
      {clauseSheet && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeClauseSheet}
            className="fixed inset-0 z-[40] bg-ink/30 backdrop-blur-[2px]"
            aria-hidden="true"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={t("sourceDetailAria")}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 z-[41] h-[100dvh] w-full max-w-[440px] overflow-y-auto bg-surface p-6 shadow-lg"
          >
            <button
              type="button"
              onClick={closeClauseSheet}
              aria-label={t("closeAria")}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-ink-2 hover:bg-sunk"
            >
              <X size={18} />
            </button>

            {isConflict && clauseSheet?.point ? (
              <>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-kumkum-soft px-2.5 py-1 text-[12px] font-semibold text-kumkum">
                  <EvidenceMark state="C" /> {t("sourcesConflict")}
                </span>
                <h2 className="mt-3 pr-8 text-[19px] font-bold leading-snug">{t("howDisagreementHandled")}</h2>
                <div className="mt-4 rounded-md border-l-[3px] border-kumkum bg-kumkum-soft/50 px-4 py-3 text-[14px]">
                  <b>{t("theSentenceLabel")}</b> {clauseSheet.point.t}
                </div>
                <p className="mt-4 text-[14.5px] leading-relaxed text-ink-2">
                  {t("disagreementExplain")}
                </p>
                <div className="mt-5 space-y-6">
                  {clauseSheet.point.c.map((c) => (
                    <div key={c}>
                      <h3 className="mb-2 text-[15px] font-semibold">{SOURCES[c]?.t}</h3>
                      <SourceBlock id={c} t={t} />
                    </div>
                  ))}
                </div>
              </>
            ) : s ? (
              <>
                <p className="pr-8 text-[12.5px] text-ink-3">{t("tierLabel").replace("{n}", String(s.tier))} · {s.jur}</p>
                <h2 className="mt-1 pr-8 text-[19px] font-bold leading-snug">{s.t}</h2>
                {clauseSheet?.point && (
                  <div className="mt-4 rounded-md border-l-[3px] border-brand bg-brand-soft/50 px-4 py-3 text-[14px]">
                    <b>{t("supportsSentenceLabel")}</b> {clauseSheet.point.t}
                  </div>
                )}
                <div className="mt-4">
                  <SourceBlock id={clauseSheet!.sourceId} t={t} />
                </div>
              </>
            ) : null}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
