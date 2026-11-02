/**
 * JSON 深度工具纯逻辑:TypeScript 类型生成 / 结构 diff / path 查询。
 * 全部不抛异常:无效输入返回结构化错误结果。
 */

export type TsTypeResult = { code: string; interfaces: number };
export type JsonDiffEntry = { path: string; type: "added" | "removed" | "changed"; from?: string; to?: string };
export type JsonQueryResult = { found: boolean; value?: unknown; error?: string };

const pascal = (key: string): string => {
  const cleaned = key.replace(/[^a-zA-Z0-9_$]+(.)?/g, (_, c: string | undefined) => (c ? c.toUpperCase() : ""));
  const name = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return /^[A-Za-z_$]/.test(name) ? name : `P${name}`;
};

const tsTypeOf = (value: unknown, defs: Map<string, string>, named: (base: string) => string, keyName = "Item"): string => {
  if (value === null) return "null";
  switch (typeof value) {
    case "string": return "string";
    case "number": return Number.isInteger(value) ? "number" : "number";
    case "boolean": return "boolean";
    default: break;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    const kinds = new Set(value.map((v) => tsTypeOf(v, defs, named, keyName.replace(/s$/, ""))));
    if (kinds.size === 1) return `${[...kinds][0]}[]`;
    return `(${[...kinds].sort().join(" | ")})[]`;
  }
  // object:命名 interface(用键名推导,更可读)
  const base = named(/^[A-Za-z]/.test(keyName) ? keyName.charAt(0).toUpperCase() + keyName.slice(1) : "Item");
  emitInterface(value as Record<string, unknown>, base, defs, named);
  return base;
};

const emitInterface = (
  obj: Record<string, unknown>,
  name: string,
  defs: Map<string, string>,
  named: (base: string) => string,
) => {
  if (defs.has(name)) return;
  // 占位防止递归爆栈
  defs.set(name, "");
  const lines: string[] = [];
  for (const [key, val] of Object.entries(obj)) {
    const safeKey = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
    lines.push(`  ${safeKey}: ${tsTypeOf(val, defs, named, key)};`);
  }
  defs.set(name, `export interface ${name} {\n${lines.join("\n")}\n}`);
};

/** JSON → TypeScript interfaces(对象键名生成嵌套 interface,数组同形合并)。 */
export function jsonToTs(json: unknown, rootName = "Root"): TsTypeResult | { error: string } {
  if (typeof json !== "object" || json === null || Array.isArray(json)) {
    return { error: "root must be a JSON object" };
  }
  const defs = new Map<string, string>();
  let counter = 0;
  const named = (base: string): string => {
    let name = base;
    while (defs.has(name)) name = `${base}${++counter}`;
    return name;
  };
  emitInterface(json as Record<string, unknown>, rootName, defs, named);
  const code = [...defs.values()].filter(Boolean).join("\n\n");
  return { code, interfaces: [...defs.values()].filter(Boolean).length };
}

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const fmt = (v: unknown): string => {
  const s = JSON.stringify(v);
  return s !== undefined && s.length > 60 ? `${s.slice(0, 57)}…` : s ?? String(v);
};

/** JSON 结构 diff:按路径报告 added/removed/changed(数组按索引)。 */
export function jsonDiff(a: unknown, b: unknown, prefix = "$"): JsonDiffEntry[] {
  const out: JsonDiffEntry[] = [];
  if (JSON.stringify(a) === JSON.stringify(b)) return out;

  const aObj = isPlainObject(a);
  const bObj = isPlainObject(b);
  if (aObj && bObj) {
    const keys = new Set([...Object.keys(a as object), ...Object.keys(b as object)]);
    for (const key of keys) {
      const path = `${prefix}.${key}`;
      const va = (a as Record<string, unknown>)[key];
      const vb = (b as Record<string, unknown>)[key];
      if (!(key in (a as object))) out.push({ path, type: "added", to: fmt(vb) });
      else if (!(key in (b as object))) out.push({ path, type: "removed", from: fmt(va) });
      else if (JSON.stringify(va) !== JSON.stringify(vb)) {
        if ((isPlainObject(va) && isPlainObject(vb)) || (Array.isArray(va) && Array.isArray(vb))) {
          out.push(...jsonDiff(va, vb, path));
        } else {
          out.push({ path, type: "changed", from: fmt(va), to: fmt(vb) });
        }
      }
    }
    return out;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    const max = Math.max(a.length, b.length);
    for (let i = 0; i < max; i++) {
      const path = `${prefix}[${i}]`;
      if (i >= b.length) out.push({ path, type: "removed", from: fmt(a[i]) });
      else if (i >= a.length) out.push({ path, type: "added", to: fmt(b[i]) });
      else if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) {
        if ((isPlainObject(a[i]) && isPlainObject(b[i])) || (Array.isArray(a[i]) && Array.isArray(b[i]))) {
          out.push(...jsonDiff(a[i], b[i], path));
        } else {
          out.push({ path, type: "changed", from: fmt(a[i]), to: fmt(b[i]) });
        }
      }
    }
    return out;
  }
  out.push({ path: prefix, type: "changed", from: fmt(a), to: fmt(b) });
  return out;
}

/** JSON path 查询:支持 a.b、a[0]、a.0.b、a['b']。找不到返回 found:false,永不抛。 */
export function jsonQuery(obj: unknown, path: string): JsonQueryResult {
  const trimmed = path.trim().replace(/^\$/, "");
  if (!trimmed) return { found: true, value: obj };
  const tokens = trimmed
    .replace(/\['([^']+)'\]/g, ".$1")
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);
  let cur: unknown = obj;
  for (const token of tokens) {
    if (Array.isArray(cur)) {
      const idx = Number(token);
      if (!Number.isInteger(idx) || idx < 0 || idx >= cur.length) {
        return { found: false, error: `index ${token} out of range` };
      }
      cur = cur[idx];
    } else if (isPlainObject(cur)) {
      if (!(token in cur)) return { found: false, error: `key "${token}" not found` };
      cur = cur[token];
    } else {
      return { found: false, error: `cannot descend into ${JSON.stringify(cur)?.slice(0, 30)}` };
    }
  }
  return { found: true, value: cur };
}
