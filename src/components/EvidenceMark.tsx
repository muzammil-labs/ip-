import { STATE_NAME_KEY, STATE_MARK } from "../data/constants";
import { I18N } from "../data/i18n";
import { useApp } from "../state/store";
import type { EvidenceState } from "../lib/types";

const COLOR: Record<EvidenceState, string> = {
  V: "text-brand bg-brand-soft",
  U: "text-turmeric bg-turmeric-soft",
  C: "text-kumkum bg-kumkum-soft",
  R: "text-ink-3 bg-sunk",
};

export default function EvidenceMark({ state }: { state: EvidenceState }) {
  const { lang } = useApp();
  const name = I18N[lang]?.[STATE_NAME_KEY[state]] || I18N.en[STATE_NAME_KEY[state]];
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
