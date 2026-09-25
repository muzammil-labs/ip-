import { useT } from "../i18n/useT";
import EmptyState from "../ui/EmptyState";

/** #/facilitator (B2): the SIPP facilitator console for escalated cases. Needs api.escalate consumers and a facilitator queue view, built in Phase 6. */
export default function Facilitator() {
  const t = useT();
  return (
    <div className="mx-auto max-w-[var(--w-main)] px-4 py-10 sm:px-6">
      <EmptyState message={t("facilitatorComingSoon")} />
    </div>
  );
}
