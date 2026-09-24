import { describe, it, expect } from "vitest";
import { categoryOf, absOf } from "../../src/lib/classify";
import type { ClassifyState } from "../../src/lib/types";

describe("categoryOf: every use/text/frac combination", () => {
  it("returns null with no answers", () => {
    expect(categoryOf({})).toBeNull();
  });

  it("food always maps to aahara, regardless of text/frac", () => {
    expect(categoryOf({ use: "food" })).toBe("aahara");
    expect(categoryOf({ use: "food", text: "exact" })).toBe("aahara");
    expect(categoryOf({ use: "food", text: "new", frac: "yes" })).toBe("aahara");
  });

  it("cos always maps to cosmetic, regardless of text/frac", () => {
    expect(categoryOf({ use: "cos" })).toBe("cosmetic");
    expect(categoryOf({ use: "cos", text: "ingr" })).toBe("cosmetic");
  });

  it("med with no text answered returns null", () => {
    expect(categoryOf({ use: "med" })).toBeNull();
  });

  it("med + exact maps to classical", () => {
    expect(categoryOf({ use: "med", text: "exact" })).toBe("classical");
  });

  it("med + ingr maps to pp", () => {
    expect(categoryOf({ use: "med", text: "ingr" })).toBe("pp");
  });

  it("med + new with no frac answered returns null", () => {
    expect(categoryOf({ use: "med", text: "new" })).toBeNull();
  });

  it("med + new + frac yes maps to phyto", () => {
    expect(categoryOf({ use: "med", text: "new", frac: "yes" })).toBe("phyto");
  });

  it("med + new + frac no maps to newasu", () => {
    expect(categoryOf({ use: "med", text: "new", frac: "no" })).toBe("newasu");
  });

  it("med with an unrecognised text value returns null", () => {
    expect(categoryOf({ use: "med", text: "bogus" })).toBeNull();
  });
});

describe("absOf: missing answers", () => {
  it("asks for src and ent when either is missing", () => {
    expect(absOf({}, null)).toEqual(["Answer the last two questions to see your duties.", []]);
    expect(absOf({ src: "cult" }, null)).toEqual(["Answer the last two questions to see your duties.", []]);
    expect(absOf({ ent: "in" }, null)).toEqual(["Answer the last two questions to see your duties.", []]);
  });
});

const SRC = ["cult", "wild", "imp", "mic"] as const;
const ENT = ["in", "fr", "grow", "prac"] as const;

describe("absOf: every src x ent combination (cat = null)", () => {
  for (const src of SRC) {
    for (const ent of ENT) {
      it(`src=${src} ent=${ent}`, () => {
        const [text, cs] = absOf({ src, ent }, null);
        expect(typeof text).toBe("string");
        expect(text.length).toBeGreaterThan(0);

        if (src === "imp") {
          // Imported material short-circuits to the Nagoya note regardless of who is commercialising it.
          expect(cs).toEqual(["nagoya"]);
          expect(text).toMatch(/Nagoya Protocol/);
          return;
        }

        if (ent === "fr") {
          expect(text).toMatch(/Prior NBA approval/);
          expect(cs).toEqual(src === "mic" ? ["bda-6", "budapest"] : ["bda-6"]);
        } else if (ent === "grow") {
          expect(text).toMatch(/Growers and local communities are exempt/);
          expect(cs).toEqual(src === "mic" ? ["bda-7", "budapest"] : ["bda-7"]);
        } else if (ent === "prac") {
          expect(text).toMatch(/Registered practitioners practising/);
          expect(cs).toEqual(src === "mic" ? ["bda-7", "budapest"] : ["bda-7"]);
        } else if (src === "cult") {
          expect(text).toMatch(/Cultivated medicinal plants are exempt/);
          expect(cs).toEqual(["bda-7", "bda-6"]);
        } else {
          // ent === "in" and src is "wild" or "mic": the default prior-intimation duty.
          expect(text).toMatch(/Give prior intimation to the State Biodiversity Board/);
          expect(cs).toEqual(src === "mic" ? ["bda-7", "bda-6", "budapest"] : ["bda-7", "bda-6"]);
        }

        if (src === "mic") {
          expect(text).toMatch(/Budapest Treaty/);
        }
      });
    }
  }
});

describe("absOf: classical-category exemption prefix", () => {
  it("prepends the codified-TK exemption when cat is classical and ent is not foreign", () => {
    const c: ClassifyState = { src: "cult", ent: "in" };
    const [text] = absOf(c, "classical");
    expect(text).toMatch(/^Codified traditional knowledge from the First Schedule books is itself exempt\./);
  });

  it("does not prepend the exemption when ent is foreign, even for cat classical", () => {
    const c: ClassifyState = { src: "cult", ent: "fr" };
    const [text] = absOf(c, "classical");
    expect(text).not.toMatch(/^Codified traditional knowledge/);
    expect(text).toMatch(/^Prior NBA approval/);
  });

  it("does not prepend the exemption for a non-classical category", () => {
    const c: ClassifyState = { src: "cult", ent: "in" };
    const [text] = absOf(c, "pp");
    expect(text).not.toMatch(/^Codified traditional knowledge/);
  });
});
