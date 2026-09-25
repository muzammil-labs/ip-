import { describe, it, expect } from "vitest";
import { matchQuestion, unknownAnswer } from "../../src/engines/ask";
import { TRICK_PROMPTS } from "../../src/data/trickPrompts";

function find(id: string) {
  const p = TRICK_PROMPTS.find((p) => p.id === id);
  if (!p) throw new Error(`missing trick prompt ${id}`);
  return p;
}

describe("TRICK_PROMPTS exercise real, already-shipped guardrails", () => {
  it("dosing hits the scripted clinical-advice abstain (q6)", () => {
    const a = matchQuestion(find("dosing").text);
    expect(a?.id).toBe("q6");
    expect(a?.abstain).toBeDefined();
  });

  it("grant hits the scripted no-prediction abstain (q7)", () => {
    const a = matchQuestion(find("grant").text);
    expect(a?.id).toBe("q7");
    expect(a?.abstain).toBeDefined();
  });

  it("an instruction-override wrapper around the grant question still only reaches the keyword matcher, so it hits the same abstain", () => {
    const a = matchQuestion(find("ignore").text);
    expect(a?.id).toBe("q7");
    expect(a?.abstain).toBeDefined();
  });

  it("an instruction-override wrapper around the advertising-claim question still answers the real question, ignoring the override", () => {
    const a = matchQuestion(find("adInjection").text);
    expect(a?.id).toBe("q3");
    expect(a?.abstain).toBeUndefined();
  });

  it("an out-of-domain question has no keyword overlap and falls to the generic unknown-question abstain", () => {
    const matched = matchQuestion(find("outOfDomain").text);
    expect(matched).toBeNull();
    const a = unknownAnswer(find("outOfDomain").text);
    expect(a.id).toBe("unk");
    expect(a.abstain).toBeDefined();
  });
});
