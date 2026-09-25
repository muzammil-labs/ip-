import { useT } from "../i18n/useT";
import EmptyState from "../ui/EmptyState";

/** #/dossier/print (B2): the print-optimised dossier render. Needs the dossier engine (D2, Phase 6) and a Case with real content; placeholder until then. */
export default function DossierPrint() {
  const t = useT();
  return (
    <div className="mx-auto max-w-[var(--w-main)] px-4 py-10 sm:px-6">
      <EmptyState message={t("dossierComingSoon")} />
    </div>
  );
}
