import type { ReactNode } from "react";
import { motion } from "motion/react";
import { stamp, useMotionOK } from "./motion";

export interface FindingProps {
  headline: string;
  verdict?: ReactNode;
  visual?: ReactNode;
  children?: ReactNode;
}

/** The single most important result on a chapter. Card, surface, rounded-container, shadow-1. Enters with Stamp. */
export default function Finding({ headline, verdict, visual, children }: FindingProps) {
  const motionOK = useMotionOK();
  return (
    <motion.div
      initial={motionOK ? "hidden" : false}
      animate="visible"
      variants={stamp}
      className="rounded-container border border-line bg-surface p-6 shadow-1"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-h3 text-ink">{headline}</h3>
        {verdict}
      </div>
      {visual && <div className="mt-4">{visual}</div>}
      {children && <div className="mt-3 text-body text-ink-2">{children}</div>}
    </motion.div>
  );
}
