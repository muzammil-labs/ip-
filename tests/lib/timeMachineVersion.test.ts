import { describe, it, expect } from "vitest";
import { hasVersions, findVersionedCite, versionStatusFor } from "../../src/lib/timeMachineVersion";

describe("hasVersions / findVersionedCite", () => {
  it("dr-170 has version history, pa-3p does not", () => {
    expect(hasVersions("dr-170")).toBe(true);
    expect(hasVersions("pa-3p")).toBe(false);
  });

  it("finds the first cite in a list that carries version history", () => {
    expect(findVersionedCite(["pa-3p", "dr-170"])).toBe("dr-170");
    expect(findVersionedCite(["pa-3p"])).toBeNull();
  });
});

describe("versionStatusFor", () => {
  it("returns null for a point with no versioned citation", () => {
    expect(versionStatusFor(["pa-3p"], null)).toBeNull();
  });

  it("returns today's status with changed: false when asOfDate is null", () => {
    const v = versionStatusFor(["dr-170"], null);
    expect(v).not.toBeNull();
    expect(v!.changed).toBe(false);
  });

  it("flags changed: true when the as-of date's status differs from today's", () => {
    const v = versionStatusFor(["dr-170"], "2020-01-01");
    expect(v).not.toBeNull();
    expect(v!.status).toBe("In force");
    expect(v!.changed).toBe(true);
  });
});
