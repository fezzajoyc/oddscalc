"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { diceAtLeast, diceDistribution, diceExactly } from "../_lib/probability";
import {
  BigOut, DieFace, ErrorNote, Field, NumIn, Note, ProbBar, ReducedNote, ScrollTable,
  Stats, fmtInt, fmtProb, parseNum, pick, reducedFraction,
} from "./prob-ui";

/**
 * 骰子概率引擎:N 个 S 面骰的和分布(精确组合计数)+ P(sum = k)、P(sum ≥ k)。
 * 计算全部走 tools/_lib/probability.ts;ways 是精确整数,分数 = ways / S^N 原样展示。
 */

const S = {
  dice: { en: "Number of dice", zh: "骰子数量", ja: "サイコロの個数", es: "Número de dados", pt: "Número de dados" },
  sides: { en: "Sides per die", zh: "每个骰子的面数", ja: "1個の面数", es: "Caras por dado", pt: "Faces por dado" },
  target: { en: "Target sum k", zh: "目标点数 k", ja: "目標の合計 k", es: "Suma objetivo k", pt: "Soma alvo k" },
  pEquals: { en: "P(sum = k)", zh: "P(和 = k)", ja: "P(合計 = k)", es: "P(suma = k)", pt: "P(soma = k)" },
  pAtLeast: { en: "P(sum ≥ k)", zh: "P(和 ≥ k)", ja: "P(合計 ≥ k)", es: "P(suma ≥ k)", pt: "P(soma ≥ k)" },
  outcomes: { en: "Total outcomes", zh: "总结果数", ja: "全出目の数", es: "Resultados totales", pt: "Resultados totais" },
  mean: { en: "Expected sum", zh: "期望点数", ja: "期待値", es: "Suma esperada", pt: "Soma esperada" },
  tableTitle: { en: "Every sum, every way to get it", zh: "每个和的构成方式", ja: "合計ごとの出方", es: "Cada suma y sus combinaciones", pt: "Cada soma e suas combinações" },
  sum: { en: "Sum", zh: "和", ja: "合計", es: "Suma", pt: "Soma" },
  ways: { en: "Ways", zh: "方式数", ja: "通り数", es: "Combinaciones", pt: "Combinações" },
  fraction: { en: "Exact", zh: "精确分数", ja: "精密値", es: "Exacta", pt: "Exata" },
  empty: { en: "Enter how many dice and how many sides to roll the distribution.", zh: "输入骰子数量和面数即可生成分布。", ja: "個数と面数を入力すると分布を計算します。", es: "Indique cuántos dados y cuántas caras para ver la distribución.", pt: "Informe quantos dados e quantas faces para ver a distribuição." },
  errRange: {
    en: "Use 1–20 dice with 2–120 sides each.",
    zh: "骰子数量 1–20,面数 2–120。",
    ja: "個数は 1〜20、面数は 2〜120 で指定してください。",
    es: "Use de 1 a 20 dados con 2 a 120 caras cada uno.",
    pt: "Use de 1 a 20 dados com 2 a 120 faces cada.",
  },
  errTarget: {
    en: "The target sum must be a whole number between the smallest and the largest possible sum.",
    zh: "目标点数必须是最小和与最大和之间的整数。",
    ja: "目標の合計は最小合計と最大合計の間の整数で指定してください。",
    es: "La suma objetivo debe ser un entero entre la suma mínima y la máxima posible.",
    pt: "A soma alvo deve ser um inteiro entre a soma mínima e a máxima possível.",
  },
  errExact: {
    en: "That combination has more than 2⁵³ outcomes — exact counting is impossible. Use fewer dice or fewer sides.",
    zh: "这个组合的结果数超过 2⁵³——无法精确计数。请减少骰子数量或面数。",
    ja: "この組み合わせは 2⁵³ を超えるため、正確な数え上げができません。個数か面数を減らしてください。",
    es: "Esa combinación supera 2⁵³ resultados: es imposible contarlos con exactitud. Use menos dados o menos caras.",
    pt: "Essa combinação ultrapassa 2⁵³ resultados: impossível contá-los com exatidão. Use menos dados ou menos faces.",
  },
  formulaNote: {
    en: "Each bar is the exact count of dice-face combinations that produce that sum, divided by all outcomes (sides^dice). No simulation, no rounding — the same numbers a probability textbook derives with generating functions.",
    zh: "每根条 = 能掷出该和的精确组合数 ÷ 总结果数(面数^骰子数)。不是模拟,也不舍入——与概率教科书用母函数推导出的数字一致。",
    ja: "各バーは、その合計になる正確な組み合わせ数を全出目(面数^個数)で割ったものです。シミュレーションでも丸めでもなく、確率論の教科書が生成関数で導くのと同じ数値です。",
    es: "Cada barra es el recuento exacto de combinaciones que producen esa suma, dividido entre todos los resultados (caras^dados). Sin simulación ni redondeo: los mismos números que deriva un libro de probabilidad con funciones generadoras.",
    pt: "Cada barra é a contagem exata de combinações que produzem aquela soma, dividida por todos os resultados (faces^dados). Sem simulação nem arredondamento: os mesmos números que um livro de probabilidade deriva com funções geradoras.",
  },
};

export function DiceEngine() {
  const { locale } = useI18n();
  const [dice, setDice] = useState("2");
  const [sides, setSides] = useState("6");
  const [target, setTarget] = useState("7");

  const n = parseNum(dice);
  const s = parseNum(sides);
  const k = parseNum(target);
  const ready = n !== null && s !== null;
  const inRange = ready && n! >= 1 && n! <= 20 && s! >= 2 && s! <= 120;

  let rows: ReturnType<typeof diceDistribution> = [];
  let exactError = false;
  if (inRange) {
    try {
      rows = diceDistribution(n!, s!);
    } catch {
      exactError = true;
    }
  }
  const minSum = inRange ? n! : 0;
  const maxSum = inRange ? n! * s! : 0;
  const targetValid = ready && k !== null && k >= minSum && k <= maxSum;

  const pExact = targetValid ? diceExactly(rows, k!) : 0;
  const pAtLeast = targetValid ? diceAtLeast(rows, k!) : 0;
  const total = inRange ? Math.pow(s!, n!) : 0;
  const mean = inRange ? (n! * (s! + 1)) / 2 : 0;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label={pick(locale, S.dice)}>
          <NumIn value={dice} onChange={setDice} aria={pick(locale, S.dice)} min={1} max={20} invalid={ready && !inRange} />
        </Field>
        <Field label={pick(locale, S.sides)}>
          <NumIn value={sides} onChange={setSides} aria={pick(locale, S.sides)} min={2} max={120} invalid={ready && !inRange} />
        </Field>
        <Field label={pick(locale, S.target)}>
          <NumIn value={target} onChange={setTarget} aria={pick(locale, S.target)} min={minSum || 1} max={maxSum || 1000} invalid={ready && !targetValid} />
        </Field>
      </div>

      {!ready ? (
        <div className="mt-5">
          <Note>{pick(locale, S.empty)}</Note>
        </div>
      ) : !inRange ? (
        <div className="mt-5">
          <ErrorNote>{pick(locale, S.errRange)}</ErrorNote>
        </div>
      ) : exactError ? (
        <div className="mt-5">
          <ErrorNote>{pick(locale, S.errExact)}</ErrorNote>
        </div>
      ) : !targetValid ? (
        <div className="mt-5">
          <ErrorNote>{pick(locale, S.errTarget)}</ErrorNote>
          <div className="mt-4">
            <Note>
              {pick(locale, S.formulaNote)}
            </Note>
          </div>
        </div>
      ) : (
        <>
          <BigOut label={pick(locale, S.pEquals)}>
            <span className="inline-flex flex-wrap items-baseline gap-x-2">
              <span>
                P({n}d{s} = {k}) = {fmtInt(pExact * total, locale)}/{fmtInt(total, locale)}
              </span>
              <ReducedNote num={pExact * total} den={total} />
              <span className="text-[var(--color-sub)]">≈ {fmtProb(pExact)}</span>
            </span>
          </BigOut>

          <div className="mt-4">
            <Stats
              items={[
                { label: pick(locale, S.pAtLeast), value: fmtProb(pAtLeast), tone: "accent" },
                { label: pick(locale, S.outcomes), value: `${fmtInt(s, locale)}^${n} = ${fmtInt(total, locale)}` },
                { label: pick(locale, S.mean), value: `${fmtInt(n, locale)}×(${fmtInt(s, locale)}+1)/2 = ${fmtProb(mean)}` },
              ]}
              cols="sm:grid-cols-3"
            />
          </div>

          <div className="mt-6">
            <h3 className="text-[15px] font-semibold">{pick(locale, S.tableTitle)}</h3>
            <ScrollTable>
              <table className="w-full text-[13px]">
                <thead className="sticky top-0 bg-[var(--color-card)] text-left text-[12px] text-[var(--color-sub)]">
                  <tr>
                    <th className="px-3 py-2 font-medium">{pick(locale, S.sum)}</th>
                    <th className="px-3 py-2 font-medium">{pick(locale, S.ways)}</th>
                    <th className="px-3 py-2 font-medium">{pick(locale, S.fraction)}</th>
                    <th className="w-[38%] px-3 py-2 font-medium">P</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.sum} className={`border-t hairline ${r.sum === k ? "bg-[rgba(5,150,105,0.08)]" : ""}`}>
                      <td className="mono px-3 py-1.5 font-semibold">
                        <span className="mr-2 inline-block align-middle text-[var(--color-accent-strong)]">
                          <DieFace pips={((r.sum - 1) % 6) + 1} size={14} />
                        </span>
                        {r.sum}
                      </td>
                      <td className="mono px-3 py-1.5">{fmtInt(r.ways, locale)}</td>
                      <td className="mono px-3 py-1.5">
                        {fmtInt(r.ways, locale)}/{fmtInt(total, locale)} = {reducedFraction(r.ways, total)}
                      </td>
                      <td className="px-3 py-1.5">
                        <ProbBar label={fmtProb(r.probability)} probability={r.probability} value="" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollTable>
            <div className="mt-3">
              <Note>{pick(locale, S.formulaNote)}</Note>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
