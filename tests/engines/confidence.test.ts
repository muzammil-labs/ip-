import { describe, it, expect } from "vitest";
import { computeConfidence } from "../../src/lib/confidence";
import { ANSWERS } from "../../src/data/answers";
import type { Answer, Confidence } from "../../src/lib/types";

function byId(id: string): Answer {
  const a = ANSWERS.find((x) => x.id === id);
  if (!a) throw new Error(`fixture ${id} not found in src/data/answers.ts`);
  return a;
}

// Each expectation below was hand-derived from the current src/data/answers.ts and
// src/data/sources.ts content, tracing src/lib/confidence.ts's computeConfidence
// exactly. These freeze today's behaviour: if the underlying data or the engine
// changes, this test should be revisited deliberately, not silently.
const EXPECTED: Record<string, Confidence> = {
  q1: { auth: 3, cov: 3, agr: 2, overall: 2, strong: 11, ver: 10, conf: 1, n: 11 },
  q2: { auth: 3, cov: 2, agr: 3, overall: 2, strong: 7, ver: 6, conf: 0, n: 8 },
  q3: { auth: 3, cov: 3, agr: 3, overall: 3, strong: 6, ver: 6, conf: 0, n: 6 },
  q4: { auth: 3, cov: 2, agr: 3, overall: 2, strong: 5, ver: 3, conf: 0, n: 5 },
  q5: { auth: 3, cov: 2, agr: 2, overall: 2, strong: 4, ver: 3, conf: 1, n: 5 },
  q6: { auth: 1, cov: 1, agr: 3, overall: 1, strong: 0, ver: 0, conf: 0, n: 0 },
  q7: { auth: 1, cov: 1, agr: 3, overall: 1, strong: 0, ver: 0, conf: 0, n: 0 },
};

describe("computeConfidence: each scripted answer's computed levels", () => {
  for (const id of Object.keys(EXPECTED)) {
    it(`${id} computes the expected confidence`, () => {
      expect(computeConfidence(byId(id))).toEqual(EXPECTED[id]);
    });
  }

  it("overall is always the minimum of auth, cov and agr", () => {
    for (const a of ANSWERS) {
      const c = computeConfidence(a);
      expect(c.overall).toBe(Math.min(c.auth, c.cov, c.agr));
    }
  });

  it("an answer with no evidence points still returns a well-formed, non-crashing result", () => {
    const c = computeConfidence({ id: "empty", lang: "en", q: "" });
    expect(c).toEqual({ auth: 1, cov: 1, agr: 3, overall: 1, strong: 0, ver: 0, conf: 0, n: 0 });
  });
});
