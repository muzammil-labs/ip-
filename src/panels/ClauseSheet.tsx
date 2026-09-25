import { AnimatePresence, motion } from "motion/react";
import { X, ArrowSquareOut } from "@phosphor-icons/react";
import { useSession } from "../state/session";
import { useT } from "../i18n/useT";
import { SOURCES } from "../data/sources";
import { TIER_NAME_KEY } from "../data/constants";
import { StatusChip } from "../ui/Chip";
import { LAYER } from "../ui/layers";

function SourceBlock({ id, t }: { id: string; t: (k: string) => string }) {
  const s = SOURCES[id];
  if (!s) return null;
  return (
    <div className="flex flex-col gap-4">
      {s.excerpt ? (
        <blockquote className="rounded-control border border-line bg-wash px-4 py-3 text-small italic leading-relaxed text-ink-2">
          <span className="mb-1 block text-small font-semibold uppercase tracking-wide text-ink-3">{t("exactText")}</span>
          &ldquo;{s.excerpt}&rdquo;
        </blockquote>
      ) : (
        <div className="rounded-control border border-line bg-wash px-4 py-3 text-small leading-relaxed text-ink-2">
          <span className="mb-1 block text-small font-semibold uppercase tracking-wide text-ink-3">{t("summaryPlain")}</span>
          {s.summary}
        </div>
      )}
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-small">
        <dt className="text-ink-3">{t("authorityLabel")}</dt>
        <dd className="text-ink-2">
          {t("tierLabel").replace("{n}", String(s.tier))}, {t(TIER_NAME_KEY[s.tier])}
        </dd>
        <dt className="text-ink-3">{t("issuedByLabel")}</dt>
        <dd className="text-ink-2">{s.by}</dd>
        <dt className="text-ink-3">{t("jurisdictionLabel")}</dt>
        <dd className="text-ink-2">{s.jur}</dd>
        <dt className="text-ink-3">{t("statusLabel")}</dt>
        <dd className="flex items-center gap-1.5 text-ink-2">
          {s.status}
          {s.flux && <StatusChip tone="input">{t("lawChanged")}</StatusChip>}
        </dd>
        <dt className="text-ink-3">{t("versionLabel")}</dt>
        <dd className="text-ink-2">{s.ver}</dd>
        <dt className="text-ink-3">{t("accessLabel")}</dt>
        <dd className="text-ink-2">{s.paid ? t("paidAccessNote") : t("freeAccessNote")}</dd>
      </dl>
      {s.note && <p className="text-small text-ink-3">{s.note}</p>}
      <a href={s.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-small font-medium text-indigo hover:underline">
        {t("openOfficialRecord")} <ArrowSquareOut size={14} />
      </a>
    </div>
  );
}

/** UI-7.4: renamed from components/SourceDrawer.tsx to match D2's target structure, and migrated
 * off raw px font sizes, an untokened border radius and hand-set z-index values (a Part E
 * pre-flight violation left over from before the Phase 2 primitives existed): now uses the same
 * text-small/text-body/text-h3 scale, rounded-control, and LAYER.drawer (Sheet.tsx's own
 * convention: one z-index value shared by backdrop and panel, relying on DOM order) as every other
 * primitive. The conflict badge now reuses StatusChip instead of the bespoke EvidenceMark
 * component, which nothing else in the app used; EvidenceMark.tsx is removed with it. */
export default function ClauseSheet() {
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
            className="fixed inset-0 bg-ink/30 backdrop-blur-[2px]"
            style={{ zIndex: LAYER.drawer }}
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
            className="fixed right-0 top-0 h-[100dvh] w-full max-w-[440px] overflow-y-auto bg-surface p-6 shadow-2"
            style={{ zIndex: LAYER.drawer }}
          >
            <button
              type="button"
              onClick={closeClauseSheet}
              aria-label={t("closeAria")}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-pill text-ink-2 hover:bg-wash"
            >
              <X size={18} />
            </button>

            {isConflict && clauseSheet?.point ? (
              <>
                <StatusChip tone="risk">{t("sourcesConflict")}</StatusChip>
                <h2 className="mt-3 pr-8 text-h3 text-ink">{t("howDisagreementHandled")}</h2>
                <div className="mt-4 rounded-control border-l-[3px] border-kumkum bg-kumkum-wash px-4 py-3 text-small text-ink-2">
                  <b className="text-ink">{t("theSentenceLabel")}</b> {clauseSheet.point.t}
                </div>
                <p className="mt-4 text-small leading-relaxed text-ink-2">{t("disagreementExplain")}</p>
                <div className="mt-5 flex flex-col gap-6">
                  {clauseSheet.point.c.map((c) => (
                    <div key={c}>
                      <h3 className="mb-2 text-body font-semibold text-ink">
                        {SOURCES[c]?.act ?? SOURCES[c]?.t}
                        {SOURCES[c]?.section && <span className="block text-small font-normal text-ink-3">{SOURCES[c]?.section}</span>}
                      </h3>
                      <SourceBlock id={c} t={t} />
                    </div>
                  ))}
                </div>
              </>
            ) : s ? (
              <>
                <p className="pr-8 text-small text-ink-3">
                  {t("tierLabel").replace("{n}", String(s.tier))} · {s.jur}
                </p>
                <h2 className="mt-1 pr-8 text-h3 text-ink">{s.act ?? s.t}</h2>
                {s.section && <p className="pr-8 text-small text-ink-2">{s.section}</p>}
                {clauseSheet?.point && (
                  <div className="mt-4 rounded-control border-l-[3px] border-neem bg-neem-wash px-4 py-3 text-small text-ink-2">
                    <b className="text-ink">{t("supportsSentenceLabel")}</b> {clauseSheet.point.t}
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
