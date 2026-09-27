import { Fragment, type ReactNode } from "react";
import { motion } from "motion/react";
import { Check, Circle, ArrowsLeftRight, Minus } from "@phosphor-icons/react";
import CiteChip from "./CiteChip";
import { StatusChip } from "./Chip";
import { shift, useMotionOK } from "./motion";
import { useT } from "../i18n/useT";
import type { EvidenceState, SourcePoint } from "../lib/types";

const MARK: Record<EvidenceState, { Icon: typeof Check; cls: string }> = {
  V: { Icon: Check, cls: "text-neem bg-neem-wash" },
  U: { Icon: Circle, cls: "text-ink-3 bg-wash" },
  C: { Icon: ArrowsLeftRight, cls: "text-kumkum bg-kumkum-wash" },
  R: { Icon: Minus, cls: "text-ink-3 bg-wash" },
};

export interface EvidenceRowProps {
  state: EvidenceState;
  children: ReactNode;
  cites?: string[];
  point?: SourcePoint | null;
  lawChanged?: boolean;
  /** Triggers the Shift highlight (background fades from haldi-wash) when this row just changed. */
  changed?: boolean;
}

export function EvidenceRow({ state, children, cites = [], point, lawChanged, changed }: EvidenceRowProps) {
  const t = useT();
  const motionOK = useMotionOK();
  const { Icon, cls } = MARK[state];
  const stateNameKey = { V: "stateVerified", U: "stateUncertain", C: "stateConflict", R: "stateUnresolved" }[state];

  return (
    <motion.div
      initial={false}
      animate={changed && motionOK ? "changed" : "idle"}
      variants={shift}
      className="flex items-start gap-2.5 px-1 py-3 text-body"
    >
      <span role="img" title={t(stateNameKey)} aria-label={t(stateNameKey)} className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-pill ${cls}`}>
        <Icon size={12} weight="bold" />
      </span>
      <span className="min-w-0 flex-1 text-ink-2">
        {children}
        {lawChanged && (
          <span className="ml-1.5 inline-block align-middle">
            <StatusChip tone="input">{t("lawChanged")}</StatusChip>
          </span>
        )}
        {cites.map((c) => (
          <Fragment key={c}>
            <CiteChip sourceId={c} point={point} />
          </Fragment>
        ))}
      </span>
    </motion.div>
  );
}

export function EvidenceList({ children }: { children: ReactNode }) {
  return <div className="divide-y divide-line">{children}</div>;
}
