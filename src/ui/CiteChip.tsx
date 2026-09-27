import { shortCite } from "../engines/classify";
import { useSession } from "../state/session";
import { useT } from "../i18n/useT";
import type { SourcePoint } from "../lib/types";

export interface CiteChipProps {
  sourceId: string;
  point?: SourcePoint | null;
  /** Footnote number shown when this chip sits inside an answer. */
  num?: number;
}

/**
 * The product's signature element: § plus a short cite, mono, pill, 24px. Must look
 * identical everywhere it appears (answers, evidence rows, source blocks). Clicking it
 * opens the ClauseSheet with the full source.
 */
export default function CiteChip({ sourceId, point, num }: CiteChipProps) {
  const { openClauseSheet } = useSession();
  const t = useT();
  return (
    <button
      type="button"
      onClick={() => openClauseSheet(sourceId, point ?? null)}
      aria-label={`${t("sourceDetailAria")} § ${shortCite(sourceId)}${num ? ` ${num}` : ""}`}
      className="ml-1 inline-flex h-6 items-center gap-0.5 rounded-pill border border-line-strong bg-surface px-2 font-mono text-mono text-ink-2 transition-colors hover:border-neem hover:text-neem-strong"
    >
      §&nbsp;{shortCite(sourceId)}
      {num !== undefined && <span className="ml-0.5 text-ink-3">{num}</span>}
    </button>
  );
}
