import type { ReactNode } from "react";
import { motion } from "motion/react";
import Seal from "./Seal";
import { StatusChip, type StatusTone } from "./Chip";
import { fadeUp, useMotionOK } from "./motion";
import { useT } from "../i18n/useT";

export interface ChapterStatus {
  tone: StatusTone;
  labelKey: string;
}

export interface ChapterProps {
  n: number;
  titleKey: string;
  purposeKey: string;
  status?: ChapterStatus;
  /** UI-6.7: an optional control (e.g. the examiner's-view toggle) shown at the right of the header row. */
  headerAction?: ReactNode;
  /** UI-9.9: widens the header and body to --w-shell instead of --w-main, for a chapter that needs
   * a second column (Describe's summary sidebar). Header and body share the same max-width so their
   * left edges always line up. */
  wide?: boolean;
  children?: ReactNode;
}

/** Chapter header (Seal with number, h1 title, body-lg purpose, optional StatusChip) in a full-width wash band, then children. */
export default function Chapter({ n, titleKey, purposeKey, status, headerAction, wide = false, children }: ChapterProps) {
  const t = useT();
  const motionOK = useMotionOK();
  const maxW = wide ? "max-w-[var(--w-shell)]" : "max-w-[var(--w-main)]";
  return (
    <div>
      <div className="bg-wash px-4 py-8 sm:px-6">
        <motion.div
          className={`mx-auto flex ${maxW} items-start gap-4`}
          initial={motionOK ? "hidden" : false}
          animate="visible"
          variants={fadeUp}
        >
          <Seal size={48} variant="number" number={n} animate />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-h1 text-ink">{t(titleKey)}</h1>
                {status && <StatusChip tone={status.tone}>{t(status.labelKey)}</StatusChip>}
              </div>
              {headerAction}
            </div>
            <p className="mt-2 text-body-lg text-ink-2">{t(purposeKey)}</p>
          </div>
        </motion.div>
      </div>
      <div className={`mx-auto ${maxW} px-4 py-8 sm:px-6`}>{children}</div>
    </div>
  );
}
