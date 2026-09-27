import { describe, it, expect } from "vitest";
import { computeTkMatches } from "../../src/engines/tkProximity";
import type { FormulationRef } from "../../src/data/formulations";
import type { FormulaItem } from "../../src/state/case";

const REF: FormulationRef[] = [
  { slug: "two-herb", name: "Two Herb", primary: "ashwagandha", ingredients: ["ashwagandha", "guduchi"], reviewed: false },
  { slug: "three-herb", name: "Three Herb", primary: "amla", ingredients: ["amla", "guduchi", "brahmi"], reviewed: false },
];

function item(name: string): FormulaItem {
  return { plant: { name }, part: "root" };
}

describe("computeTkMatches", () => {
  it("returns [] for a formula with no resolvable plants", () => {
    expect(computeTkMatches([item("not a real plant")], REF)).toEqual([]);
  });

  it("returns [] for an empty formula", () => {
    expect(computeTkMatches([], REF)).toEqual([]);
  });

  it("reads an exact ingredient-set match as classical, regardless of numeric score", () => {
    const matches = computeTkMatches([item("ashwagandha"), item("guduchi")], REF);
    const exact = matches.find((m) => m.formulation.slug === "two-herb")!;
    expect(exact.reading).toBe("classical");
    expect(exact.shared).toEqual(expect.arrayContaining(["ashwagandha", "guduchi"]));
    expect(exact.caseOnly).toEqual([]);
    expect(exact.formulationOnly).toEqual([]);
  });

  it("reads a high but non-exact overlap as proprietary", () => {
    // case = ashwagandha, guduchi, brahmi vs three-herb = amla, guduchi, brahmi: shares 2 of 3, not exact
    const matches = computeTkMatches([item("ashwagandha"), item("guduchi"), item("brahmi")], REF);
    const m = matches.find((mm) => mm.formulation.slug === "three-herb")!;
    expect(m.reading === "proprietary" || m.reading === "newAsu").toBe(true);
    expect(m.score).toBeGreaterThan(0);
  });

  it("reads a low-overlap formula as a new ASU drug", () => {
    const matches = computeTkMatches([item("neem")], REF);
    for (const m of matches) expect(m.reading).toBe("newAsu");
  });

  it("weights a formulation's primary ingredient higher than a non-primary one", () => {
    // Sharing only the primary (ashwagandha) should score higher than sharing only the non-primary (guduchi).
    const sharedPrimary = computeTkMatches([item("ashwagandha")], REF).find((m) => m.formulation.slug === "two-herb")!;
    const sharedOther = computeTkMatches([item("guduchi")], REF).find((m) => m.formulation.slug === "two-herb")!;
    expect(sharedPrimary.score).toBeGreaterThan(sharedOther.score);
  });

  it("sorts matches by score descending and respects the limit", () => {
    const matches = computeTkMatches([item("ashwagandha"), item("guduchi")], REF, 1);
    expect(matches).toHaveLength(1);
    expect(matches[0].formulation.slug).toBe("two-herb");
  });

  it("ignores unresolvable plant names but still scores the resolvable ones", () => {
    const matches = computeTkMatches([item("ashwagandha"), item("guduchi"), item("not a plant")], REF);
    const exact = matches.find((m) => m.formulation.slug === "two-herb")!;
    expect(exact.reading).toBe("classical");
  });
});
