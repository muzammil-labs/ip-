import { useApp } from "../state/store";
import { I18N } from "../data/i18n";
import type { SourcePoint } from "../lib/types";

export default function CiteChip({ num, sourceId, point }: { num: number; sourceId: string; point?: SourcePoint | null }) {
  const { openSource, lang } = useApp();
  const t = (k: string) => I18N[lang]?.[k] || I18N.en[k] || k;
  return (
    <button
      type="button"
      onClick={() => openSource(sourceId, point ?? null)}
      aria-label={t("sourceDetailAria") + " " + num}
      className="ml-1 inline-flex h-[19px] min-w-[19px] items-center justify-center rounded-full border border-focus/40 bg-focus-soft px-1 text-[11px] font-semibold text-focus transition-transform hover:scale-110 active:scale-95"
    >
      {num}
    </button>
  );
}
