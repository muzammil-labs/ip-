import Trust from "../screens/Trust";
import Blueprint from "../screens/Blueprint";

/**
 * #/how (B2, B3). Trust and Blueprint stack on one route as a stopgap; the real
 * combined page (guardrails, live bench, architecture, API contract, PS coverage, one
 * layout per FINALS-STRATEGY §6) is built in Phase 4.
 */
export default function HowItWorks() {
  return (
    <div>
      <Trust />
      <Blueprint />
    </div>
  );
}
