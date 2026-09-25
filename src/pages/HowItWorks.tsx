import { Terminal } from "@phosphor-icons/react";
import Trust from "../screens/Trust";
import Blueprint from "../screens/Blueprint";
import Button from "../ui/Button";
import { useT } from "../i18n/useT";
import { openApiInspector } from "../app/ApiInspector";

/**
 * #/how (B2, B3). Trust and Blueprint stack on one route as a stopgap; the real
 * combined page (guardrails, live bench, architecture, API contract, PS coverage, one
 * layout per FINALS-STRATEGY §6) is built in Phase 4.
 */
export default function HowItWorks() {
  const t = useT();
  return (
    <div>
      <div className="mx-auto flex max-w-[1000px] justify-end px-4 pt-6 sm:px-6">
        <Button variant="secondary" icon={<Terminal size={16} />} onClick={openApiInspector}>
          {t("apiInspectorOpen")}
        </Button>
      </div>
      <Trust />
      <Blueprint />
    </div>
  );
}
