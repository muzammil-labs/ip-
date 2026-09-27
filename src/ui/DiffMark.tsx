import { StatusChip } from "./Chip";
import { useT } from "../i18n/useT";

/** Inline marker for what-if results: a Changed haldi chip plus the previous value struck through. */
export default function DiffMark({ previous }: { previous: string }) {
  const t = useT();
  return (
    <span className="ml-1.5 inline-flex items-center gap-1.5 align-middle">
      <StatusChip tone="input">{t("changedLabel")}</StatusChip>
      <span className="text-small text-ink-3 line-through">{previous}</span>
    </span>
  );
}
