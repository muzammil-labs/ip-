import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import Sheet from "./Sheet";
import ChapterRail from "./ChapterRail";
import { useT } from "../i18n/useT";
import { CHAPTER_ORDER, type ChapterSlug } from "../chapters/order";

const CHAPTER_TITLE_KEY: Record<ChapterSlug, string> = {
  describe: "chDescribeTitle",
  classify: "chClassifyTitle",
  protect: "chProtectTitle",
  owe: "chOweTitle",
  say: "chSayTitle",
  search: "chSearchTitle",
  dossier: "chDossierTitle",
};

export interface ChapterStepperProps {
  current: ChapterSlug;
}

/** The mobile Case stepper (UI-4.11): dots plus the current chapter name; tap opens the full rail as a Sheet. */
export default function ChapterStepper({ current }: ChapterStepperProps) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const currentIx = CHAPTER_ORDER.indexOf(current);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3 lg:hidden"
      >
        <span className="flex items-center gap-1.5" aria-hidden="true">
          {CHAPTER_ORDER.map((slug, i) => (
            <span key={slug} className={`h-1.5 w-1.5 rounded-pill ${i <= currentIx ? "bg-neem" : "bg-line"}`} />
          ))}
        </span>
        <span className="flex-1 truncate text-left text-small font-semibold text-ink">{t(CHAPTER_TITLE_KEY[current])}</span>
        <CaretDown size={14} className="shrink-0 text-ink-3" />
      </button>

      <Sheet open={open} onOpenChange={setOpen} title={t("chapterRailAria")}>
        <ChapterRail current={current} />
      </Sheet>
    </>
  );
}
