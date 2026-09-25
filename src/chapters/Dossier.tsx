import Chapter from "../ui/Chapter";
import EmptyState from "../ui/EmptyState";
import { useT } from "../i18n/useT";

/** Case chapter 7: dossier (B2). The dossier engine, "Copy link" share (UI-3.4) and export land here; UI-3.4 adds the share link action to this chapter directly. */
export default function Dossier() {
  const t = useT();
  return (
    <Chapter n={7} titleKey="chDossierTitle" purposeKey="chDossierPurpose">
      <EmptyState message={t("chDossierBody")} />
    </Chapter>
  );
}
