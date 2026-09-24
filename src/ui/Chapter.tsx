import type { ReactNode } from "react";
import Seal from "./Seal";
import { StatusChip, type StatusTone } from "./Chip";
import { useT } from "../i18n/useT";

export interface ChapterStatus {
  tone: StatusTone;
  labelKey: string;
}

export interface ChapterProps {
  n: number;
  titleKey: string;
  purposeKey: string;
  status?: ChapterStatus;
  children?: ReactNode;
}

/** Chapter header (Seal with number, h1 title, body-lg purpose, optional StatusChip) in a full-width wash band, then children. */
export default function Chapter({ n, titleKey, purposeKey, status, children }: ChapterProps) {
  const t = useT();
  return (
    <div>
      <div className="bg-wash px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-[var(--w-main)] items-start gap-4">
          <Seal size={48} variant="number" number={n} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-h1 text-ink">{t(titleKey)}</h1>
              {status && <StatusChip tone={status.tone}>{t(status.labelKey)}</StatusChip>}
            </div>
            <p className="mt-2 text-body-lg text-ink-2">{t(purposeKey)}</p>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[var(--w-main)] px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
