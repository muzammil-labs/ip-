import { Fragment, useMemo } from "react";
import Callout from "../ui/Callout";
import CiteChip from "../ui/CiteChip";
import { useT } from "../i18n/useT";
import { useCase } from "../state/case";
import { changedClausesSince } from "../engines/lawChanged";

/** UI-6.9: "Law changed since you last opened this case." Shown at the top of every Case chapter
 * (mounted by CaseChapterRoute) whenever the corpus has moved on since this Case's own
 * `corpusVersion` and at least one clause it cites changed in that window. */
export default function LawChangedBanner() {
  const t = useT();
  const { case: kase } = useCase();
  const changed = useMemo(() => changedClausesSince(kase), [kase]);

  if (changed.length === 0) return null;

  return (
    <div className="mx-auto max-w-[var(--w-shell)] px-4 pt-6 sm:px-6">
      <Callout tone="warn" title={t("lawChangedBannerTitle")}>
        {t("lawChangedBannerBody")}
        {changed.map((c) => (
          <Fragment key={c.sourceId}>
            <CiteChip sourceId={c.sourceId} />
          </Fragment>
        ))}
      </Callout>
    </div>
  );
}
