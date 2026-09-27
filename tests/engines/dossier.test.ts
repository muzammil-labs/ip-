import { describe, it, expect } from "vitest";
import { allCitedSources, hashCase } from "../../src/engines/dossier";
import { emptyCase } from "../../src/state/case";
import type { Case } from "../../src/state/case";

function kase(overrides: Partial<Case> = {}): Case {
  return { ...emptyCase(), ...overrides };
}

describe("allCitedSources", () => {
  it("returns [] for a Case with nothing classified yet", () => {
    expect(allCitedSources(kase())).toEqual([]);
  });

  it("collects citations from classify, protect and ABS duties once the Case is classified", () => {
    const c = kase({ answers: { use: "med", text: "new", frac: "no", src: "cult", ent: "in" } });
    const cites = allCitedSources(c);
    expect(cites.length).toBeGreaterThan(0);
    // No duplicates.
    expect(new Set(cites).size).toBe(cites.length);
  });
});

describe("hashCase", () => {
  it("is deterministic for the same Case content", async () => {
    const c = kase({ product: { name: "Test", description: "A test product" } });
    const h1 = await hashCase(c);
    const h2 = await hashCase(c);
    expect(h1).toBe(h2);
    expect(h1).toMatch(/^[0-9a-f]{64}$/);
  });

  it("changes when the Case content changes", async () => {
    const a = await hashCase(kase({ product: { name: "A", description: "" } }));
    const b = await hashCase(kase({ product: { name: "B", description: "" } }));
    expect(a).not.toBe(b);
  });

  it("is not affected by audit or consent (personal-activity fields excluded, per shareLink)", async () => {
    const base = kase({ product: { name: "Same", description: "" } });
    const withAudit = { ...base, audit: [...base.audit, { time: "now", ev: "extra", detail: "" }] };
    const h1 = await hashCase(base);
    const h2 = await hashCase(withAudit);
    expect(h1).toBe(h2);
  });
});
