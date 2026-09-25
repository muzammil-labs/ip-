import { describe, it, expect } from "vitest";
import { computeBenefitShare } from "../../src/engines/benefitShare";
import { emptyCase } from "../../src/state/case";
import type { Case } from "../../src/state/case";

function kase(overrides: Partial<Case> = {}, answers: Case["answers"] = {}): Case {
  return { ...emptyCase(), answers, ...overrides };
}

describe("computeBenefitShare: needs-input", () => {
  it("needs source and entity answered before anything else", () => {
    expect(computeBenefitShare(kase(), false).reason).toBe("no-source");
    expect(computeBenefitShare(kase({}, { src: "cult" }), false).reason).toBe("no-entity");
  });

  it("needs turnover once source and entity are answered", () => {
    const r = computeBenefitShare(kase({}, { src: "cult", ent: "in" }), false);
    expect(r.kind).toBe("needs-input");
    expect(r.reason).toBe("no-turnover");
  });
});

describe("computeBenefitShare: not applicable", () => {
  it("does not apply to imported material", () => {
    const r = computeBenefitShare(kase({ turnoverCr: 10 }, { src: "imp", ent: "in" }), false);
    expect(r).toEqual({ kind: "not-applicable", reason: "imported", reportingThresholdPending: false });
  });

  it("does not apply to growers or practitioners", () => {
    for (const ent of ["grow", "prac"] as const) {
      const r = computeBenefitShare(kase({ turnoverCr: 10 }, { src: "cult", ent }), false);
      expect(r.kind).toBe("not-applicable");
      expect(r.reason).toBe("exempt-entity");
    }
  });
});

describe("computeBenefitShare: slabs (MASTER-PLAN UI-6.3 figures)", () => {
  const base = { src: "cult", ent: "in" } as const;

  it("is nil at or under ₹5 cr", () => {
    const r = computeBenefitShare(kase({ turnoverCr: 5 }, base), false);
    expect(r.kind).toBe("nil");
    expect(r.rate).toBe(0);
    expect(r.amountCr).toBe(0);
  });

  it("is 0.2% between ₹5 cr and ₹50 cr", () => {
    const r = computeBenefitShare(kase({ turnoverCr: 20 }, base), false);
    expect(r.kind).toBe("computed");
    expect(r.rate).toBe(0.002);
    expect(r.amountCr).toBeCloseTo(0.04, 5);
  });

  it("is 0.4% between ₹50 cr and ₹250 cr", () => {
    const r = computeBenefitShare(kase({ turnoverCr: 100 }, base), false);
    expect(r.kind).toBe("computed");
    expect(r.rate).toBe(0.004);
    expect(r.amountCr).toBeCloseTo(0.4, 5);
  });

  it("is unconfirmed above ₹250 cr, with no invented rate or amount", () => {
    const r = computeBenefitShare(kase({ turnoverCr: 300 }, base), false);
    expect(r.kind).toBe("unconfirmed");
    expect(r.slabLabel).toBe("above250");
    expect(r.rate).toBeUndefined();
    expect(r.amountCr).toBeUndefined();
  });

  it("is unconfirmed for a high-value resource regardless of turnover, with no invented rate", () => {
    const r = computeBenefitShare(kase({ turnoverCr: 20 }, base), true);
    expect(r.kind).toBe("unconfirmed");
    expect(r.slabLabel).toBe("highValue");
    expect(r.rate).toBeUndefined();
  });
});
