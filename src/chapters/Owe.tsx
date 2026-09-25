import Chapter from "../ui/Chapter";
import EmptyState from "../ui/EmptyState";
import { useT } from "../i18n/useT";

/** Case chapter 4: owe (B2). ABS duties text already exists (engines/classify.ts absOf); moving it into this chapter's own Finding/EvidenceList is Phase 4 work. */
export default function Owe() {
  const t = useT();
  return (
    <Chapter n={4} titleKey="chOweTitle" purposeKey="chOwePurpose">
      <EmptyState message={t("chOweBody")} />
    </Chapter>
  );
}
