import Chapter from "../ui/Chapter";
import EmptyState from "../ui/EmptyState";
import { useT } from "../i18n/useT";

/** Case chapter 3: protect (B2). Built in Phase 4 from the Case's classification (patent/trademark/design/copyright routes already computed by the classify engine's rows). */
export default function Protect() {
  const t = useT();
  return (
    <Chapter n={3} titleKey="chProtectTitle" purposeKey="chProtectPurpose">
      <EmptyState message={t("chProtectBody")} />
    </Chapter>
  );
}
