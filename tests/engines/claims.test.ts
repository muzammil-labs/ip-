import { describe, it, expect } from "vitest";
import { runClaims } from "../../src/lib/claims";

function citesOf(text: string, claimCat = "drug") {
  return runClaims(text, claimCat).findings.map((f) => f.rule.cite);
}

describe("runClaims: each CLAIM_RULES entry, one positive and one negative fixture", () => {
  it("flags a Schedule disease name (dmr-3, bad)", () => {
    const r = runClaims("This churna helps with diabetes.", "drug");
    expect(r.findings).toHaveLength(1);
    expect(r.findings[0].rule.cite).toBe("dmr-3");
    expect(r.findings[0].rule.lvl).toBe("bad");
    expect(r.bad).toBe(1);
  });
  it("does not flag ordinary wellness text for the disease rule", () => {
    expect(citesOf("This churna supports everyday digestion.")).not.toContain("dmr-3");
  });

  it("flags an absolute cure claim (dmr-4, bad)", () => {
    const r = runClaims("Our tonic cures joint pain.", "drug");
    expect(r.findings.some((f) => f.rule.cite === "dmr-4" && f.match.toLowerCase().includes("cure"))).toBe(true);
  });
  it("does not flag text that avoids cure language", () => {
    expect(citesOf("Our tonic supports joint comfort.")).not.toContain("dmr-4");
  });

  it("flags miracle/magic/wonder language (dmr-4, bad)", () => {
    const r = runClaims("A miracle remedy for tiredness.", "drug");
    expect(r.findings.some((f) => f.match.toLowerCase() === "miracle")).toBe(true);
  });
  it("does not flag text without miracle/magic/wonder", () => {
    const r = runClaims("A trusted formula for tiredness.", "drug");
    expect(r.findings.some((f) => f.match.toLowerCase() === "trusted")).toBe(false);
  });

  it("flags a guaranteed-results claim (ccpa, warn)", () => {
    const r = runClaims("Guaranteed results in 7 days.", "drug");
    expect(r.findings.some((f) => f.rule.cite === "ccpa" && f.rule.lvl === "warn")).toBe(true);
    expect(r.warn).toBeGreaterThan(0);
  });
  it("does not flag text with no promised outcome", () => {
    const r = runClaims("Results vary by individual.", "drug");
    expect(r.findings.some((f) => /guarantee/i.test(f.match))).toBe(false);
  });

  it('flags "no side effects" (ccpa, warn)', () => {
    const r = runClaims("Take daily with no side effects.", "drug");
    expect(r.findings.some((f) => /no\s+side[\s-]effects?/i.test(f.match))).toBe(true);
  });
  it("does not flag text that lists precautions instead", () => {
    const r = runClaims("Take daily; see precautions on the label.", "drug");
    expect(r.findings.some((f) => /side.effects?/i.test(f.match))).toBe(false);
  });

  it('flags "clinically proven/tested" (ccpa, warn)', () => {
    const r = runClaims("Clinically proven to help sleep.", "drug");
    expect(r.findings.some((f) => /clinically\s+(proven|tested)/i.test(f.match))).toBe(true);
  });
  it("does not flag text with no clinical claim", () => {
    const r = runClaims("Traditionally used to help sleep.", "drug");
    expect(r.findings.some((f) => /clinically/i.test(f.match))).toBe(false);
  });

  it('flags "doctor recommended" (ccpa, warn)', () => {
    const r = runClaims("Doctor recommended for daily use.", "drug");
    expect(r.findings.some((f) => /doctor[\s-]recommended/i.test(f.match))).toBe(true);
  });
  it("does not flag text with no endorsement claim", () => {
    const r = runClaims("Used by many households.", "drug");
    expect(r.findings.some((f) => /doctor/i.test(f.match))).toBe(false);
  });

  it('flags "100% herbal/natural" (ccpa, warn)', () => {
    const r = runClaims("A 100% herbal formulation.", "drug");
    expect(r.findings.some((f) => /100%\s+(herbal|natural)/i.test(f.match))).toBe(true);
  });
  it("does not flag a qualified herbal claim", () => {
    const r = runClaims("A herbal formulation with natural extracts.", "drug");
    expect(r.findings.some((f) => /100%/i.test(f.match))).toBe(false);
  });
});

describe("runClaims: category-specific rules (CAT_RULES)", () => {
  it("flags therapeutic language for an Ayurveda Aahara (food) product", () => {
    const r = runClaims("This drink treats indigestion.", "aahara");
    expect(r.findings.some((f) => f.rule.cite === "fssai-aa" && f.rule.lvl === "bad")).toBe(true);
  });
  it("does not flag food-appropriate wording for aahara", () => {
    const r = runClaims("Prepared per Ayurvedic tradition.", "aahara");
    expect(r.findings.some((f) => f.rule.cite === "fssai-aa")).toBe(false);
  });
  it("does not apply the aahara rule outside the aahara category", () => {
    const r = runClaims("This drink treats indigestion.", "drug");
    expect(r.findings.some((f) => f.rule.cite === "fssai-aa")).toBe(false);
  });

  it("flags a therapeutic claim on a cosmetic", () => {
    const r = runClaims("This cream heals eczema.", "cosmetic");
    expect(r.findings.some((f) => f.rule.cite === "cos-2020" && f.rule.lvl === "bad")).toBe(true);
  });
  it("does not flag appearance-only wording for a cosmetic", () => {
    const r = runClaims("This cream brightens the skin.", "cosmetic");
    expect(r.findings.some((f) => f.rule.cite === "cos-2020")).toBe(false);
  });
});

describe("runClaims: ruleFlagged and segment reconstruction", () => {
  it("sets ruleFlagged only for the drug category", () => {
    expect(runClaims("plain text", "drug").ruleFlagged).toBe(true);
    expect(runClaims("plain text", "aahara").ruleFlagged).toBe(false);
    expect(runClaims("plain text", "cosmetic").ruleFlagged).toBe(false);
  });

  it("segments reconstruct the original text in order", () => {
    const text = "This churna cures diabetes, guaranteed.";
    const r = runClaims(text, "drug");
    expect(r.segments.map((s) => s.text).join("")).toBe(text);
  });

  it("keeps the longer alternative whole rather than double-counting an overlap", () => {
    // The "permanent cure" alternative should win as one finding, not split into "permanent" + "cure".
    const r = runClaims("A permanent cure for tiredness.", "drug");
    const cureFindings = r.findings.filter((f) => /cure/i.test(f.match));
    expect(cureFindings).toHaveLength(1);
    expect(cureFindings[0].match.toLowerCase()).toBe("permanent cure");
  });
});
