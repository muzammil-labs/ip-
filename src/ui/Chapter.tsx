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
  // UI-9.12: the header and body boxes must be structurally identical (same mx-auto, max-w and
  // horizontal padding on the same element), not just the same max-w value. Padding on an ancestor
  // of one but not the other only cancels out when max-w actually constrains the box; next to the
  // chapter rail (narrower than --w-shell), it doesn't, and the two edges drift apart. So the
  // horizontal padding for the header lives on the same element as its max-w (like the body), and
  // the wash band itself (the thing that needs to be full-bleed) carries none of its own.
  return (
    <div>
      <div className="bg-wash py-8">
        <motion.div
          className={`mx-auto flex ${maxW} items-start gap-4 px-4 sm:px-6`}
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
