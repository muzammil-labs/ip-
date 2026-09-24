import { STATE_NAME, STATE_MARK } from "../data/constants";
import type { EvidenceState } from "../lib/types";

const COLOR: Record<EvidenceState, string> = {
  V: "text-brand bg-brand-soft",
  U: "text-turmeric bg-turmeric-soft",
  C: "text-kumkum bg-kumkum-soft",
  R: "text-ink-3 bg-sunk",
};

export default function EvidenceMark({ state }: { state: EvidenceState }) {
  return (
    <span
      title={STATE_NAME[state]}
      aria-label={STATE_NAME[state]}
      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${COLOR[state]}`}
    >
      {STATE_MARK[state]}
    </span>
  );
}
