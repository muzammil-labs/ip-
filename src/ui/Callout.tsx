import type { ReactNode } from "react";
import { Info, Warning, WarningOctagon } from "@phosphor-icons/react";

export type CalloutTone = "note" | "warn" | "risk";

const TONE: Record<CalloutTone, { bg: string; bar: string; iconCls: string; Icon: typeof Info }> = {
  note: { bg: "bg-wash", bar: "border-line-strong", iconCls: "text-ink-2", Icon: Info },
  warn: { bg: "bg-haldi-wash", bar: "border-haldi", iconCls: "text-haldi", Icon: Warning },
  risk: { bg: "bg-kumkum-wash", bar: "border-kumkum", iconCls: "text-kumkum", Icon: WarningOctagon },
};

export interface CalloutProps {
  tone: CalloutTone;
  title: string;
  children?: ReactNode;
}

export default function Callout({ tone, title, children }: CalloutProps) {
  const { bg, bar, iconCls, Icon } = TONE[tone];
  return (
    <div className={`flex gap-3 rounded-control border-l-[3px] ${bar} ${bg} px-4 py-3`}>
      <Icon size={18} weight="bold" className={`mt-0.5 shrink-0 ${iconCls}`} />
      <div>
        <p className="text-small font-semibold text-ink">{title}</p>
        {children && <p className="mt-1 text-small text-ink-2">{children}</p>}
      </div>
    </div>
  );
}
