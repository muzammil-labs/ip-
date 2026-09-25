import { Link } from "wouter";
import Seal from "./Seal";
import { StatusChip } from "./Chip";
import VineRail from "./VineRail";
import { useT } from "../i18n/useT";
import { useCase } from "../state/case";
import { chapterStatus } from "../chapters/status";
import { evidenceSpine } from "../chapters/evidenceSpine";
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

export interface ChapterRailProps {
  current: ChapterSlug;
}

/**
 * The desktop Case sidebar (UI-4.11): seven chapters with Seal, verb and status, a
 * Thread line filling to the current chapter, and a thin evidence-spine column on the
 * right edge (one small Seal per unique clause cited by the Case so far).
 */
export default function ChapterRail({ current }: ChapterRailProps) {
  const t = useT();
  const { case: kase } = useCase();
  const status = chapterStatus(kase);
  const spine = evidenceSpine(kase);
  const currentIx = CHAPTER_ORDER.indexOf(current);
  const doneIx = CHAPTER_ORDER.map((slug, i) => (slug !== "dossier" && status[slug] ? i : -1)).filter((i) => i >= 0);

  return (
    <nav aria-label={t("chapterRailAria")} className="flex gap-3">
      <ol className="relative flex flex-col gap-1">
        <VineRail total={CHAPTER_ORDER.length} currentIx={currentIx} doneIx={doneIx} />
        {CHAPTER_ORDER.map((slug, i) => {
          const active = slug === current;
          return (
            <li key={slug}>
              <Link
                href={`/case/${slug}`}
                className={`relative flex items-center gap-3 rounded-control py-2 pl-2 pr-3 text-small ${
                  active ? "border-l-2 border-neem bg-neem-wash" : "border-l-2 border-transparent hover:bg-wash"
                }`}
              >
                <Seal size={32} variant="number" number={i + 1} className="shrink-0 bg-canvas" />
                <span className="min-w-0 flex-1">
                  <span className={`block font-semibold ${active ? "text-neem-strong" : "text-ink"}`}>{t(CHAPTER_TITLE_KEY[slug])}</span>
                </span>
                {slug !== "dossier" && (
                  <StatusChip tone={status[slug] ? "done" : "input"}>{t(status[slug] ? "dossierDone" : "dossierNeedsInput")}</StatusChip>
                )}
              </Link>
            </li>
          );
        })}
      </ol>

      <div role="group" className="flex w-12 flex-col items-center gap-1 border-l border-line pl-2" aria-label={t("evidenceSpineAria")}>
        {spine.slice(0, 12).map((id) => (
          <Seal key={id} size={16} variant="filled" />
        ))}
        {spine.length > 0 && (
          <span className="mt-1 text-center text-mono leading-tight text-ink-3">
            {t("evidenceSpineCount").replace("{n}", String(spine.length))}
          </span>
        )}
      </div>
    </nav>
  );
}
