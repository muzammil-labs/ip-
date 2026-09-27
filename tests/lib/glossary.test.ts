import { describe, it, expect } from "vitest";
import { GLOSSARY, expandQuery } from "../../src/data/glossary";

describe("GLOSSARY", () => {
  it("is built from answers.ts's own gloss fields, not invented here", () => {
    expect(GLOSSARY.length).toBeGreaterThan(0);
    expect(GLOSSARY).toContainEqual(["पेटेंट", "Patent"]);
  });
});

describe("expandQuery", () => {
  it("appends the English equivalent when a query contains a glossary term", () => {
    const expanded = expandQuery("मुझे पेटेंट कैसे मिलेगा?");
    expect(expanded).toContain("Patent");
  });

  it("leaves a query with no glossary term unchanged", () => {
    const q = "how do I patent this?";
    expect(expandQuery(q)).toBe(q);
  });

  it("does not duplicate an already-English query", () => {
    expect(expandQuery("Patent process")).toBe("Patent process");
  });
});
