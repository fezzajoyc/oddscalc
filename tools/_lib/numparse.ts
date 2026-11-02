/**
 * 智能数字解析:同时接受美式(1,234.56)与欧式(1.234,56)千分位格式。
 * 规则:分隔符只出现一次 → 它是小数符;出现多次 → 是千分位链(整除 3 位组合由使用者保证)。
 * 无分隔符或纯数字 → 直接 Number。无效返回 NaN,从不抛。
 */
export function parseLocaleNumber(s: string): number {
  const t = s.trim();
  if (!t) return NaN;
  const lastComma = t.lastIndexOf(",");
  const lastDot = t.lastIndexOf(".");
  if (lastComma > lastDot) {
    // 欧式候选:逗号是小数符(只允许一个逗号)。
    // 歧义判定:"1,234"(单逗号 + 恰好 3 位尾数)在财务输入里几乎总是千分位 → 按美式剥。
    // 逗号后非 3 位(如 "1,5")才视作欧式小数。
    const commas = (t.match(/,/g) || []).length;
    const afterComma = t.slice(lastComma + 1);
    if (commas === 1 && afterComma.length !== 3) {
      return Number(t.replace(/\./g, "").replace(",", "."));
    }
    return Number(t.replace(/[.,]/g, ""));
  }
  if (lastDot > lastComma) {
    // 美式候选:点是小数符(只允许一个点)
    const dots = (t.match(/\./g) || []).length;
    if (dots === 1) return Number(t.replace(/,/g, ""));
    return Number(t.replace(/[.,]/g, ""));
  }
  return Number(t);
}
