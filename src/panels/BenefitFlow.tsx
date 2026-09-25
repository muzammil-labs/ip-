import { motion } from "motion/react";
import Seal from "../ui/Seal";
import { StatusChip } from "../ui/Chip";
import { threadPath, useMotionOK } from "../ui/motion";
import { useT } from "../i18n/useT";
import type { BenefitShareResult } from "../engines/benefitShare";

const STOPS = ["company", "nba", "bmc", "community"] as const;

/** UI-6.8: company to NBA to BMC to community, the Regulation's own chain of custody for a
 * benefit-share payment (BD Act, 2002, ss. 21-24: the NBA collects and, through the State
 * Biodiversity Board, channels the amount to the Biodiversity Management Committee for the
 * benefit of the claimants/local community). Only the total the Case already computes is shown
 * as a confirmed amount; the split between NBA/BMC/community is not in the corpus (no reviewed
 * Gazette percentage exists), so that leg renders "Confirm in Regulation" rather than an invented
 * split, per UI-6.3's own rule for unconfirmed benefit-share figures. */
export default function BenefitFlow({ result }: { result: BenefitShareResult }) {
  const t = useT();
  const motionOK = useMotionOK();
  const hasAmount = result.kind === "nil" || result.kind === "computed";
  const amountLabel = hasAmount ? (result.amountCr ?? 0).toFixed(3) + " cr" : null;

  return (
    <div className="rounded-container border border-line bg-surface p-5">
      <h3 className="text-body font-semibold text-ink">{t("benefitFlowHeading")}</h3>
      <p className="mt-1 text-small text-ink-3">{t("benefitFlowLede")}</p>
      <div className="mt-5 flex items-center gap-1 overflow-x-auto">
        {STOPS.map((stop, i) => (
          <div key={stop} className="flex min-w-0 flex-1 items-center gap-1">
            {i > 0 && (
              <div className="flex min-w-[32px] flex-1 flex-col items-center gap-1">
                <svg width="100%" height="2" viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden="true" className="w-full">
                  <motion.line
                    x1="0"
                    x2="100"
                    y1="1"
                    y2="1"
                    stroke="var(--neem)"
                    strokeWidth={2}
                    initial={motionOK ? "hidden" : "visible"}
                    animate="visible"
                    variants={threadPath}
                  />
                </svg>
                {i === 1 ? (
                  hasAmount ? (
                    <span className="whitespace-nowrap font-mono text-mono text-ink-2">{"₹" + amountLabel}</span>
                  ) : (
                    <StatusChip tone="input">{t("benefitShareConfirmRegulation")}</StatusChip>
                  )
                ) : (
                  <StatusChip tone="input">{t("benefitShareConfirmRegulation")}</StatusChip>
                )}
              </div>
            )}
            <div className="flex shrink-0 flex-col items-center gap-1.5 text-center">
              <Seal size={32} variant="filled" />
              <span className="max-w-[80px] text-small font-medium text-ink">{t(`benefitFlowStop${stop}`)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
