import { STATE_NAME_KEY, STATE_MARK } from "../data/constants";
import { useT } from "../i18n/useT";
import type { EvidenceState } from "../lib/types";

const COLOR: Record<EvidenceState, string> = {
  V: "text-neem bg-neem-wash",
  U: "text-haldi bg-haldi-wash",
  C: "text-kumkum bg-kumkum-wash",
  R: "text-ink-3 bg-wash",
};

export default function EvidenceMark({ state }: { state: EvidenceState }) {
  const t = useT();
  const name = t(STATE_NAME_KEY[state]);
  return (
    <span
      title={name}
      aria-label={name}
      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${COLOR[state]}`}
    >
      {STATE_MARK[state]}
    </span>
  );
}
