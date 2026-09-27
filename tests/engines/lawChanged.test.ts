import { describe, it, expect } from "vitest";
import { changedClausesSince, changedSourceIdSet } from "../../src/engines/lawChanged";
import { wildHarvestPreAmendmentExample } from "../../src/data/examples";
import { emptyCase, CORPUS_VERSION } from "../../src/state/case";

describe("changedClausesSince", () => {
  it("returns nothing for a case saved against the current corpus", () => {
    expect(changedClausesSince(emptyCase())).toHaveLength(0);
  });

  it("finds bda-6/bda-7 changed for a case saved before the 2023 amendment took effect", () => {
    const kase = wildHarvestPreAmendmentExample();
    expect(kase.corpusVersion).not.toBe(CORPUS_VERSION);
    const changed = changedClausesSince(kase);
    const ids = changed.map((c) => c.sourceId);
    expect(ids).toContain("bda-6");
    expect(ids).toContain("bda-7");
    for (const c of changed) {
      expect(c.fromStatus).not.toBe(c.toStatus);
    }
  });

  it("changedSourceIdSet matches changedClausesSince", () => {
    const kase = wildHarvestPreAmendmentExample();
    const set = changedSourceIdSet(kase);
    expect(set.has("bda-6")).toBe(true);
    expect(set.has("bda-7")).toBe(true);
  });
});
