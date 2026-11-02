"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/lib/site";

/**
 * Oddscalc 引擎共用的轻量 UI 原语与取词助手(全部客户端组件)。
 * 赌客数学的视觉个性:概率条 = 简单 div 宽度百分比;骰子点数小方块;exact fraction 一律与小数并排。
 */

export const INTL_LOCALES: Record<Locale, string> = {
  en: "en-US",
  zh: "zh-CN",
  ja: "ja-JP",
  es: "es-ES",
  pt: "pt-BR",
  fr: "fr-FR",
  de: "de-DE",
  ru: "ru-RU",
  it: "it-IT",
  tr: "tr-TR",
  ko: "ko-KR",
  ar: "ar-SA",
  hi: "hi-IN",
  id: "id-ID",
  vi: "vi-VN",
};

/** 引擎内的每语言短文案:按 locale 取,缺省回退英文。 */
export function pick(locale: Locale, rec: Record<string, string>): string {
  return rec[locale] ?? rec.en;
}

/** 大整数十位分组(按 locale 习惯),非有限值显示 —。 */
export function fmtInt(n: number, locale: Locale): string {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat(INTL_LOCALES[locale] ?? "en-US", { maximumFractionDigits: 0 }).format(n);
}

/**
 * 概率小数:0/1 原样;≥ 1e-4 最多 6 位小数去尾零;更小用 3 位有效科学计数。
 * 计算器 mono 块内统一 "." 小数点(dir="ltr"),避免公式语境歧义。
 */
export function fmtProb(p: number): string {
  if (p === 0) return "0";
  if (p === 1) return "1";
  if (p >= 0.0001) {
    const s = p.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
    return s;
  }
  return p.toExponential(3);
}

/** 百分比显示:×100 后最多 4 位有效小数(23 人生日悖论 → 50.7297%)。 */
export function fmtPercent(p: number): string {
  const pct = p * 100;
  if (pct === 0) return "0%";
  if (pct >= 99.9999 || pct <= 0.0001) return `${pct.toPrecision(4)}%`;
  const s = pct.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
  return `${s}%`;
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y > 0) {
    const r = x % y;
    x = y;
    y = r;
  }
  return x || 1;
}

/** 约分后的分数:reduceFraction(6, 36) → "1/6"。分母 1 → 只有分子。 */
export function reducedFraction(num: number, den: number): string {
  if (den === 0) return "—";
  if (num === 0) return "0/1";
  const g = gcd(num, den);
  const n = num / g;
  const d = den / g;
  return d === 1 ? String(n) : `${n}/${d}`;
}

/** "= 1/6" 小注:分数可约分时显示约分结果,已是最简则不渲染。 */
export function ReducedNote({ num, den }: { num: number; den: number }) {
  const reduced = reducedFraction(num, den);
  const unreduced = `${num}/${den}`;
  if (den === 0 || num === 0 || reduced === unreduced || reduced === String(num)) return null;
  return <span className="text-[var(--color-sub)]">= {reduced}</span>;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <span className="block text-[13px] font-medium text-[var(--color-sub)]">{label}</span>
      {children}
    </div>
  );
}

/** 整数输入。空串原样上抛,由引擎解析。 */
export function NumIn({
  value,
  onChange,
  aria,
  invalid = false,
  min,
  max,
}: {
  value: string;
  onChange: (v: string) => void;
  aria: string;
  invalid?: boolean;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type="number"
      step="1"
      min={min}
      max={max}
      className={`field mono w-full ${invalid ? "border-[var(--color-bad)]" : ""}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={aria}
      inputMode="numeric"
    />
  );
}

/** 大号只读结果(主答案位)。 */
export function BigOut({ children, label }: { children: ReactNode; label: string }) {
  return (
    <output
      aria-live="polite"
      aria-label={label}
      className="mono mt-5 block rounded-xl border hairline bg-[var(--color-surface)] px-4 py-3.5 text-lg font-semibold"
      dir="ltr"
    >
      {children}
    </output>
  );
}

export function Stats({
  items,
  cols = "sm:grid-cols-2",
}: {
  items: { label: string; value: string; tone?: "good" | "accent" }[];
  cols?: string;
}) {
  const tone = (t?: string) =>
    t === "good" ? "text-[var(--color-good)]" : t === "accent" ? "text-[var(--color-accent-strong)]" : "text-[var(--color-ink)]";
  return (
    <div className={`grid grid-cols-2 gap-3 ${cols}`}>
      {items.map((it) => (
        <div key={it.label} className="rounded-xl border hairline px-3.5 py-3">
          <div className="text-[12.5px] font-medium text-[var(--color-sub)]">{it.label}</div>
          <div className={`mono mt-1 text-[17px] font-semibold leading-6 ${tone(it.tone)}`} aria-live="polite" dir="ltr">
            {it.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <p className="text-[13px] leading-5 text-[var(--color-sub)]">{children}</p>;
}

/** 错误提示行(与 Note 视觉区分)。 */
export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="error-bg text-[13px] leading-5 font-medium text-[var(--color-bad)] rounded-lg px-3 py-2">
      {children}
    </p>
  );
}

/**
 * 概率条:标签 + 按宽度百分比渲染的 emerald 条 + 右侧数值。
 * 宽度 = probability × 100,最小 1px 保证 0 概率之外的行都可见。
 */
export function ProbBar({
  label,
  probability,
  value,
  highlight = false,
}: {
  label: ReactNode;
  probability: number;
  value: ReactNode;
  highlight?: boolean;
}) {
  const pct = Math.max(0, Math.min(1, probability)) * 100;
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-1.5">
      <div className="mono w-14 text-right text-[13px] font-semibold" dir="ltr">
        {label}
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[var(--color-surface)]" role="presentation">
        <div
          className={`h-full rounded-full ${highlight ? "bg-[var(--color-accent-strong)]" : "bg-[var(--color-accent)] opacity-70"}`}
          style={{ width: `${pct}%`, minWidth: probability > 0 ? "2px" : "0" }}
        />
      </div>
      <div className="mono text-[13px] text-[var(--color-sub)]" dir="ltr">
        {value}
      </div>
    </div>
  );
}

/** 概率分布表的容器(max-height + 滚动)。 */
export function ScrollTable({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 max-h-96 overflow-y-auto rounded-xl border hairline" dir="ltr">
      {children}
    </div>
  );
}

export function parseNum(v: string): number | null {
  if (v.trim() === "") return null;
  const n = Number(v);
  return Number.isInteger(n) ? n : NaN;
}

/** 五点骰面(oddscalc 品牌记号):n 面骰在引擎里的迷你图标。 */
export function DieFace({ pips, size = 18 }: { pips: number; size?: number }) {
  const dots: Record<number, [number, number][]> = {
    1: [[50, 50]],
    2: [[28, 28], [72, 72]],
    3: [[26, 26], [50, 50], [74, 74]],
    4: [[28, 28], [72, 28], [28, 72], [72, 72]],
    5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
    6: [[28, 26], [72, 26], [28, 50], [72, 50], [28, 74], [72, 74]],
  };
  const pts = dots[Math.min(6, Math.max(1, pips))];
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" className="inline-block align-middle">
      <rect x="6" y="6" width="88" height="88" rx="18" fill="none" stroke="currentColor" strokeWidth="7" />
      {pts.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="9" fill="currentColor" />
      ))}
    </svg>
  );
}
