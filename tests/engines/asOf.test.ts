import { describe, it, expect } from "vitest";
import { versionAtId, isInForceAt, eventsFor, fractionBetween } from "../../src/engines/asOf";

describe("versionAtId / isInForceAt: Rule 170 (dr-170)", () => {
  it("is in force before the July 2024 omission", () => {
    expect(isInForceAt("dr-170", new Date(2020, 0, 1))).toBe(true);
    expect(versionAtId("dr-170", new Date(2020, 0, 1))?.status).toBe("In force");
  });

  it("is omitted right after the 1 July 2024 notification", () => {
    expect(isInForceAt("dr-170", new Date(2024, 6, 15))).toBe(false);
    expect(versionAtId("dr-170", new Date(2024, 6, 15))?.status).toBe("Omitted");
  });

  it("reads as its own distinct status between 27 Aug 2024 and Aug 2025, once the omission is stayed", () => {
    expect(versionAtId("dr-170", new Date(2025, 0, 1))?.status).toBe("Omission stayed");
  });

  it("is omitted again today, after the Aug 2025 stay was vacated", () => {
    expect(isInForceAt("dr-170", new Date())).toBe(false);
  });

  it("returns null for a source with no version history", () => {
    expect(versionAtId("pa-3p", new Date())).toBeNull();
  });

  it("falls back to the first version, not the last, for a date before the version history begins", () => {
    // dr-170's first version starts 2018-12; 1 Jan 2018 predates it.
    expect(versionAtId("dr-170", new Date(2018, 0, 1))?.status).toBe("In force");
  });
});

describe("versionAtId: BD Act amendment (bda-6)", () => {
  it("reads pre-amendment before 1 Apr 2024 and in-force after", () => {
    expect(versionAtId("bda-6", new Date(2023, 0, 1))?.status).toBe("Pre-amendment");
    expect(versionAtId("bda-6", new Date(2024, 3, 1))?.status).toBe("In force");
  });
});

describe("eventsFor", () => {
  it("merges and sorts events from multiple sources oldest first", () => {
    const events = eventsFor(["dr-170", "bda-6"]);
    expect(events.length).toBeGreaterThanOrEqual(5);
    for (let i = 1; i < events.length; i++) {
      expect(events[i - 1].date <= events[i].date).toBe(true);
    }
  });

  it("returns [] for a source with no events", () => {
    expect(eventsFor(["pa-3p"])).toEqual([]);
  });
});

describe("fractionBetween", () => {
  it("clamps to 0 and 1 outside the range", () => {
    const start = new Date(2018, 0, 1);
    const end = new Date(2026, 0, 1);
    expect(fractionBetween(new Date(2010, 0, 1), start, end)).toBe(0);
    expect(fractionBetween(new Date(2030, 0, 1), start, end)).toBe(1);
  });

  it("is 0.5 at the midpoint", () => {
    const start = new Date(2020, 0, 1);
    const end = new Date(2022, 0, 1);
    expect(fractionBetween(new Date(2021, 0, 1), start, end)).toBeCloseTo(0.5, 1);
  });
});
