import { describe, expect, it } from "vitest";
import { jsonToTs, jsonDiff, jsonQuery } from "@/tools/_lib/jsontool";
import { toFullWidth, toHalfWidth } from "@/tools/_lib/transforms";

describe("jsonToTs", () => {
  it("generates a flat interface from a simple object", () => {
    const r = jsonToTs({ name: "Ada", age: 36 }, "User");
    expect("error" in r).toBe(false);
    if (!("error" in r)) {
      expect(r.interfaces).toBe(1);
      expect(r.code).toContain("export interface User {");
      expect(r.code).toContain("name: string;");
      expect(r.code).toContain("age: number;");
    }
  });

  it("generates named interfaces for nested objects", () => {
    const r = jsonToTs({ user: { name: "Ada" } }, "Root");
    if (!("error" in r)) {
      expect(r.interfaces).toBe(2);
      expect(r.code).toContain("user: User;");
      expect(r.code).toContain("export interface User {");
    }
  });

  it("merges array-of-objects element keys into one interface", () => {
    const r = jsonToTs({ items: [{ id: 1, name: "a" }, { id: 2, name: "b", extra: true }] }, "Root");
    if (!("error" in r)) {
      expect(r.code).toContain("extra: boolean;");
      expect(r.code).toContain("id: number;");
    }
  });

  it("makes mixed arrays a union and empty arrays unknown[]", () => {
    const r = jsonToTs({ mixed: [1, "a"], empty: [] }, "Root");
    if (!("error" in r)) {
      expect(r.code).toContain("(number | string)[]");
      expect(r.code).toContain("unknown[]");
    }
  });

  it("handles non-object roots with an error", () => {
    const r = jsonToTs([1, 2]);
    expect("error" in r).toBe(true);
  });
});

describe("jsonDiff", () => {
  it("reports added, removed and changed keys with paths", () => {
    const d = jsonDiff({ a: 1, b: 2, c: 3 }, { a: 1, b: 9, d: 4 });
    const types = Object.fromEntries(d.map((e) => [e.path, e.type]));
    expect(types["$.b"]).toBe("changed");
    expect(types["$.c"]).toBe("removed");
    expect(types["$.d"]).toBe("added");
  });

  it("walks nested objects with full paths", () => {
    const d = jsonDiff({ user: { name: "Ada" } }, { user: { name: "Lovelace" } });
    expect(d.length).toBe(1);
    expect(d[0].path).toBe("$.user.name");
    expect(d[0].type).toBe("changed");
  });

  it("compares arrays by index", () => {
    const d = jsonDiff({ items: [1, 2, 3] }, { items: [1, 9] });
    expect(d.some((e) => e.path === "$.items[1]" && e.type === "changed")).toBe(true);
    expect(d.some((e) => e.path === "$.items[2]" && e.type === "removed")).toBe(true);
  });

  it("returns empty for identical documents including key order", () => {
    expect(jsonDiff({ a: 1, b: 2 }, { b: 2, a: 1 })).toEqual([]);
  });
});

describe("jsonQuery", () => {
  const doc = { user: { name: "Ada", tags: ["x", "y"] }, list: [{ id: 7 }] };

  it("resolves dot notation", () => {
    expect(jsonQuery(doc, "$.user.name")).toEqual({ found: true, value: "Ada" });
  });

  it("resolves array indexes and chained paths", () => {
    expect(jsonQuery(doc, "$.user.tags[1]")).toEqual({ found: true, value: "y" });
    expect(jsonQuery(doc, "$.list[0].id")).toEqual({ found: true, value: 7 });
  });

  it("resolves quoted keys", () => {
    expect(jsonQuery({ "odd key": 5 }, "$['odd key']")).toEqual({ found: true, value: 5 });
  });

  it("returns found:false with reasons, never throwing", () => {
    expect(jsonQuery(doc, "$.user.missing").found).toBe(false);
    expect(jsonQuery(doc, "$.user.tags[9]").error).toContain("out of range");
    expect(jsonQuery(doc, "$.user.name.deeper").found).toBe(false);
    expect(jsonQuery(doc, "invalid path!!").error).toContain("invalid path");
  });

  it("empty path returns the root", () => {
    expect(jsonQuery(doc, "$")).toEqual({ found: true, value: doc });
  });
});

describe("full/half width (CJK case feature)", () => {
  it("converts ASCII to full-width and space to ideographic space", () => {
    expect(toFullWidth("abc 123")).toBe("ａｂｃ\u3000１２３");
  });

  it("converts full-width back with roundtrip identity", () => {
    const original = "Hello, World! 42";
    expect(toHalfWidth(toFullWidth(original))).toBe(original);
  });

  it("leaves CJK and emoji untouched", () => {
    expect(toFullWidth("中文🚀")).toBe("中文🚀");
    expect(toHalfWidth("中文🚀")).toBe("中文🚀");
  });

  it("handles empty and already-converted strings", () => {
    expect(toFullWidth("")).toBe("");
    expect(toHalfWidth("")).toBe("");
  });
});
