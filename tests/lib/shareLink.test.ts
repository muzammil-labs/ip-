import { describe, it, expect } from "vitest";
import { encodeCaseForShare, decodeSharedCase, shareLinkFor } from "../../src/lib/shareLink";
import { emptyCase } from "../../src/state/case";

function sampleCase() {
  const c = emptyCase();
  c.product = { name: "Ashwagandha root extract (CO2)", description: "A test product", form: "capsule" };
  c.formula = [{ plant: { name: "Ashwagandha", botanicalName: "Withania somnifera" }, part: "root" }];
  c.answers = { use: "med", text: "new", frac: "no", src: "cult", ent: "in" };
  c.persona = "startup";
  c.markets = ["IN", "US"];
  c.audit = [{ time: "t1", ev: "Case started", detail: "" }, { time: "t2", ev: "Product name set", detail: "" }];
  c.consent = [{ src: "tkdl", scope: "search", time: "t1", active: true }];
  return c;
}

describe("encodeCaseForShare / decodeSharedCase", () => {
  it("round-trips product, formula, answers, persona and markets", () => {
    const original = sampleCase();
    const encoded = encodeCaseForShare(original);
    const decoded = decodeSharedCase(encoded);
    expect(decoded).not.toBeNull();
    expect(decoded!.product).toEqual(original.product);
    expect(decoded!.formula).toEqual(original.formula);
    expect(decoded!.answers).toEqual(original.answers);
    expect(decoded!.persona).toBe(original.persona);
    expect(decoded!.markets).toEqual(original.markets);
  });

  it("strips the audit log and consent ledger from the encoded payload, per UI-3.4", () => {
    const original = sampleCase();
    const encoded = encodeCaseForShare(original);
    const decoded = decodeSharedCase(encoded);
    expect(decoded!.audit).toEqual([]);
    expect(decoded!.consent).toEqual([]);
  });

  it("returns null for garbage input instead of throwing", () => {
    expect(decodeSharedCase("not-valid-lz-string-data")).toBeNull();
    expect(decodeSharedCase("")).toBeNull();
  });

  it("returns null for a validly-encoded but non-Case payload", () => {
    const encoded = encodeCaseForShare({ ...sampleCase(), product: undefined as never });
    expect(decodeSharedCase(encoded)).toBeNull();
  });
});

describe("shareLinkFor", () => {
  it("builds a #/case/describe URL with the encoded case as the c param", () => {
    // shareLinkFor reads window.location; stub the minimum this test environment doesn't provide
    // (verified against a real browser during UI-3.4 development: the generated link opened and
    // decoded correctly end to end).
    (globalThis as { window?: unknown }).window = { location: { origin: "https://ip-sakti.example", pathname: "/" } };
    const link = shareLinkFor(sampleCase());
    expect(link).toContain("#/case/describe?c=");
    const encoded = link.split("c=")[1];
    const decoded = decodeSharedCase(encoded);
    expect(decoded!.product.name).toBe("Ashwagandha root extract (CO2)");
    delete (globalThis as { window?: unknown }).window;
  });
});
