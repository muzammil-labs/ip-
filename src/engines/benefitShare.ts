import type { Case } from "../state/case";

export type BenefitShareKind = "not-applicable" | "needs-input" | "nil" | "computed" | "unconfirmed";

export interface BenefitShareResult {
  kind: BenefitShareKind;
  /** Why "not-applicable" or "needs-input". */
  reason?: "imported" | "exempt-entity" | "no-turnover" | "no-source" | "no-entity";
  /** Set for "nil", "computed" and "unconfirmed" (the slab band the turnover falls in). */
  slabLabel?: string;
  /** 0 to 1, set only for "nil" and "computed". */
  rate?: number;
  /** In crore rupees, set only for "computed". */
  amountCr?: number;
  /** True once this result also needs the still-unconfirmed reporting threshold (MASTER-PLAN UI-6.3). */
  reportingThresholdPending: boolean;
}

/** BD (ABS) Regulations 2025 slabs, as given verbatim in MASTER-PLAN UI-6.3 (not this session's own
 * research): up to ₹5 cr nil, ₹5-50 cr 0.2%, ₹50-250 cr 0.4% of annual gross ex-factory sale price.
 * The slab above ₹250 cr, the high-value-resource percentage and the reporting threshold are explicitly
 * left unconfirmed by that same task text ("must be confirmed from the Gazette text before being
 * coded"), so this engine never invents a number for them; see docs/plan/QUESTIONS.md (Phase 6). This
 * also approximates "annual gross ex-factory sale price" with the Case's own turnover figure, since the
 * Case model does not collect ex-factory price separately. */
export function computeBenefitShare(kase: Case, highValueResource: boolean): BenefitShareResult {
  const src = kase.answers.src;
  const ent = kase.answers.ent;

  if (!src) return { kind: "needs-input", reason: "no-source", reportingThresholdPending: true };
  if (!ent) return { kind: "needs-input", reason: "no-entity", reportingThresholdPending: true };
  if (src === "imp") return { kind: "not-applicable", reason: "imported", reportingThresholdPending: false };
  if (ent === "grow" || ent === "prac") return { kind: "not-applicable", reason: "exempt-entity", reportingThresholdPending: false };

  const turnover = kase.turnoverCr;
  if (turnover === undefined) return { kind: "needs-input", reason: "no-turnover", reportingThresholdPending: true };

  if (highValueResource) return { kind: "unconfirmed", slabLabel: "highValue", reportingThresholdPending: true };
  if (turnover > 250) return { kind: "unconfirmed", slabLabel: "above250", reportingThresholdPending: true };

  if (turnover <= 5) return { kind: "nil", slabLabel: "upTo5", rate: 0, amountCr: 0, reportingThresholdPending: true };
  if (turnover <= 50) {
    const rate = 0.002;
    return { kind: "computed", slabLabel: "5to50", rate, amountCr: turnover * rate, reportingThresholdPending: true };
  }
  const rate = 0.004;
  return { kind: "computed", slabLabel: "50to250", rate, amountCr: turnover * rate, reportingThresholdPending: true };
}
