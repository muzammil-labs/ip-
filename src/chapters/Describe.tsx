import Chapter from "../ui/Chapter";
import EmptyState from "../ui/EmptyState";
import { useT } from "../i18n/useT";

/** Case chapter 1: describe (B2). Case intake (product, formula, markets) is built in Phase 4, on top of the Case model from UI-3.2. */
export default function Describe() {
  const t = useT();
  return (
    <Chapter n={1} titleKey="chDescribeTitle" purposeKey="chDescribePurpose">
      <EmptyState message={t("chDescribeBody")} />
    </Chapter>
  );
}
