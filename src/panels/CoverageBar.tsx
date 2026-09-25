import Tooltip, { TooltipProvider } from "../ui/Tooltip";
import { useSession } from "../state/session";
import { useCoverage } from "../state/coverage";
import { useT } from "../i18n/useT";
import { COVERAGE } from "../data/coverage";

/** UI-7.5: presenter-mode-only 17-segment bar under the header, one segment per PS 26045
 * requirement in data/coverage.ts. Ticks green as `useCoverage().mark(id)` calls land from the
 * chapters and pages that satisfy each requirement (see each call site's own comment). */
export default function CoverageBar() {
  const { presenter } = useSession();
  const { marked } = useCoverage();
  const t = useT();

  if (!presenter) return null;

  return (
    <TooltipProvider>
      <div className="border-b border-line bg-wash px-4 py-2 sm:px-6 print:hidden" role="group" aria-label={t("coverageTrackerAria")}>
        <div className="mx-auto flex max-w-[var(--w-shell)] items-center gap-1">
          <span className="mr-1 shrink-0 text-mono font-mono text-ink-3">
            {marked.size}/{COVERAGE.length}
          </span>
          {COVERAGE.map(([req], i) => (
            <Tooltip key={i} content={req}>
              <span
                className={`h-2 flex-1 rounded-pill transition-colors ${marked.has(i) ? "bg-neem" : "bg-line-strong"}`}
                role="img"
                aria-label={`${req}: ${marked.has(i) ? t("coverageDone") : t("coverageNotYet")}`}
              />
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
