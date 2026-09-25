import { describe, it, expect } from "vitest";
import { objectionsFor } from "../../src/data/examinerRules";
import { emptyCase } from "../../src/state/case";
import type { Case } from "../../src/state/case";

function caseWith(overrides: Partial<Case>): Case {
  return { ...emptyCase(), ...overrides };
}

describe("objectionsFor", () => {
  it("returns nothing for an empty case (no category yet)", () => {
    expect(objectionsFor(emptyCase())).toHaveLength(0);
  });

  it("raises the 3(p) TK ground for a classical formulation and does not mark it answered", () => {
    const kase = caseWith({ answers: { use: "med", text: "exact" } });
    const rules = objectionsFor(kase);
    const g3p = rules.find((r) => r.id === "3p");
    expect(g3p).toBeDefined();
    expect(g3p!.objection(kase)).not.toBe("");
    expect(g3p!.cites(kase)).toContain("pa-3p");
    expect(g3p!.satisfiedBy(kase)).toBe(false);
  });

  it("does not raise the 3(p) TK ground for newasu, which cites pa-3d instead", () => {
    const kase = caseWith({ answers: { use: "med", text: "new", frac: "no" } });
    expect(objectionsFor(kase).some((r) => r.id === "3p")).toBe(false);
  });

  it("only raises the 3(d) efficacy ground for newasu/phyto, not classical", () => {
    const classical = caseWith({ answers: { use: "med", text: "exact" } });
    expect(objectionsFor(classical).some((r) => r.id === "3d")).toBe(false);

    const phyto = caseWith({ answers: { use: "med", text: "new", frac: "yes" } });
    const rules = objectionsFor(phyto);
    const g3d = rules.find((r) => r.id === "3d");
    expect(g3d).toBeDefined();
    expect(g3d!.satisfiedBy(phyto)).toBe(true);
  });

  it("3(e) and 3(i) never trigger: no reviewed objection text exists for them yet", () => {
    const kase = caseWith({ answers: { use: "med", text: "exact" } });
    expect(objectionsFor(kase).some((r) => r.id === "3e" || r.id === "3i")).toBe(false);
  });

  it("raises the disclosure/opposition ground once a formula item exists, satisfied once every plant has a botanical name", () => {
    const withFormula = caseWith({
      answers: { use: "med", text: "exact" },
      formula: [{ plant: { name: "Ashwagandha" }, part: "root" }],
    });
    const g = objectionsFor(withFormula).find((r) => r.id === "10-25")!;
    expect(g).toBeDefined();
    expect(g.satisfiedBy(withFormula)).toBe(false);

    const named = caseWith({
      answers: { use: "med", text: "exact" },
      formula: [{ plant: { name: "Ashwagandha", botanicalName: "Withania somnifera" }, part: "root" }],
    });
    expect(objectionsFor(named).find((r) => r.id === "10-25")!.satisfiedBy(named)).toBe(true);
  });
});
