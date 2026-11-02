import { describe, expect, it } from "vitest";
import { parseLocaleNumber } from "@/tools/_lib/numparse";

describe("parseLocaleNumber (thousand-separator tolerance)", () => {
  it("parses US format with comma thousands", () => {
    expect(parseLocaleNumber("1,234.56")).toBe(1234.56);
    expect(parseLocaleNumber("1,000,000")).toBe(1000000);
  });

  it("parses European format with dot thousands", () => {
    expect(parseLocaleNumber("1.234,56")).toBe(1234.56);
    expect(parseLocaleNumber("1.000.000")).toBe(1000000);
  });

  it("disambiguates by last separator position", () => {
    // 1,234 → 美式(逗号在前)→ 1234
    expect(parseLocaleNumber("1,234")).toBe(1234);
    // 1.234 → 单点按美式小数 → 1.234
    expect(parseLocaleNumber("1.234")).toBe(1.234);
  });

  it("handles plain numbers and negatives", () => {
    expect(parseLocaleNumber("57.39")).toBe(57.39);
    expect(parseLocaleNumber("-1,500")).toBe(-1500);
    expect(parseLocaleNumber("42")).toBe(42);
  });

  it("empty/invalid → NaN, never throws", () => {
    expect(Number.isNaN(parseLocaleNumber(""))).toBe(true);
    expect(Number.isNaN(parseLocaleNumber("   "))).toBe(true);
    expect(Number.isNaN(parseLocaleNumber("abc"))).toBe(true);
  });
});
