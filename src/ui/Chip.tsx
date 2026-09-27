import type { ReactNode } from "react";
import { Check, PencilSimple, Warning, Info } from "@phosphor-icons/react";

export function Chip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex h-7 items-center gap-1.5 rounded-pill border border-line bg-surface px-2.5 text-small font-medium text-ink-2 ${className}`}>
      {children}
    </span>
  );
}

export type StatusTone = "done" | "input" | "risk" | "info";

const TONE: Record<StatusTone, { cls: string; Icon: typeof Check }> = {
  done: { cls: "bg-neem-wash text-neem-strong", Icon: Check },
  input: { cls: "bg-haldi-wash text-haldi", Icon: PencilSimple },
  risk: { cls: "bg-kumkum-wash text-kumkum", Icon: Warning },
  info: { cls: "bg-wash text-ink-2", Icon: Info },
};

/** Always icon plus text, never colour alone (accessibility: tone is never the only signal). */
export function StatusChip({ tone, children }: { tone: StatusTone; children: ReactNode }) {
  const { cls, Icon } = TONE[tone];
  return (
    <span className={`inline-flex h-7 items-center gap-1.5 rounded-pill px-2.5 text-small font-semibold ${cls}`}>
      <Icon size={13} weight="bold" />
      {children}
    </span>
  );
}
