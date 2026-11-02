"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { binomial, coinStats } from "../_lib/probability";
import {
  BigOut, ErrorNote, Field, NumIn, Note, ProbBar, ReducedNote, ScrollTable,
  Stats, fmtInt, fmtProb, parseNum, pick, reducedFraction,
} from "./prob-ui";

/**
 * 抛硬币引擎:n 次公平硬币、恰好/至少/至多 k 次正面(二项分布 C(n,k)/2^n)。
 * n ≤ 52 保证 2^n 与 C(n,k) 都在 2^53 内,所有分数精确。
 */

const S = {
  flips: { en: "Flips (n)", zh: "抛掷次数 (n)", ja: "投げる回数 (n)", es: "Lanzamientos (n)", pt: "Lançamentos (n)" },
  heads: { en: "Heads (k)", zh: "正面次数 (k)", ja: "表の回数 (k)", es: "Caras (k)", pt: "Caras (k)" },
  exactly: { en: "P(exactly k heads)", zh: "P(恰好 k 次正面)", ja: "P(ちょうど k 回表)", es: "P(exactamente k caras)", pt: "P(exatamente k caras)" },
  atLeast: { en: "P(at least k)", zh: "P(至少 k 次)", ja: "P(少なくとも k 回)", es: "P(al menos k)", pt: "P(no mínimo k)" },
  atMost: { en: "P(at most k)", zh: "P(至多 k 次)", ja: "P(たかだか k 回)", es: "P(como mucho k)", pt: "P(no máximo k)" },
  sequences: { en: "Sequences", zh: "序列数", ja: "列の数", es: "Secuencias", pt: "Sequências" },
  tableTitle: { en: "Every head count from 0 to n", zh: "从 0 到 n 的每种正面数", ja: "0 から n までの表の回数ごと", es: "Cada número de caras de 0 a n", pt: "Cada número de caras de 0 a n" },
  headsCol: { en: "Heads", zh: "正面", ja: "表", es: "Caras", pt: "Caras" },
  waysCol: { en: "Sequences C(n,k)", zh: "序列数 C(n,k)", ja: "列の数 C(n,k)", es: "Secuencias C(n,k)", pt: "Sequências C(n,k)" },
  empty: { en: "Enter the number of flips and the number of heads to ask about.", zh: "输入抛掷次数和想问的正面次数。", ja: "投げる回数と表の回数を入力してください。", es: "Indique el número de lanzamientos y de caras.", pt: "Informe o número de lançamentos e de caras." },
  errRange: {
    en: "Use 1–52 flips. Beyond 52 the denominator 2ⁿ stops being exact, and this site only shows exact fractions.",
    zh: "抛掷次数限 1–52:超过 52 次后分母 2ⁿ 不再精确,本站只展示精确分数。",
    ja: "投げる回数は 1〜52 回です。52 を超えると分母 2ⁿ が正確でなくなり、本サイトは正確な分数だけを表示します。",
    es: "Use de 1 a 52 lanzamientos: a partir de 52 el denominador 2ⁿ deja de ser exacto y este sitio solo muestra fracciones exactas.",
    pt: "Use de 1 a 52 lançamentos: acima de 52 o denominador 2ⁿ deixa de ser exato, e este site só mostra frações exatas.",
  },
  errHeads: {
    en: "The number of heads must be a whole number between 0 and the number of flips.",
    zh: "正面次数必须是 0 到抛掷次数之间的整数。",
    ja: "表の回数は 0 から投げた回数までの整数で指定してください。",
    es: "El número de caras debe ser un entero entre 0 y el número de lanzamientos.",
    pt: "O número de caras deve ser um inteiro entre 0 e o número de lançamentos.",
  },
  formulaNote: {
    en: "Binomial distribution, worked out by hand: P(exactly k) = C(n,k)/2ⁿ — the number of sequences with k heads divided by all 2ⁿ head/tail sequences. The at-least and at-most columns add the C(n,k) rows on each side of k.",
    zh: "二项分布,手算过程:P(恰好 k 次) = C(n,k)/2ⁿ——有 k 次正面的序列数除以全部 2ⁿ 种正反序列。“至少”“至多”就是把 k 两侧的 C(n,i) 加起来。",
    ja: "二項分布の手計算そのものです。P(ちょうど k 回) = C(n,k)/2ⁿ — k 回表になる列の数を全 2ⁿ 列で割ります。「以上」「以下」は k の両側の C(n,i) を足し合わせます。",
    es: "Distribución binomial a mano: P(exactamente k) = C(n,k)/2ⁿ — las secuencias con k caras divididas entre las 2ⁿ posibles. Los valores de «al menos» y «como mucho» suman las filas C(n,i) a cada lado de k.",
    pt: "Distribuição binomial no papel: P(exatamente k) = C(n,k)/2ⁿ — as sequências com k caras divididas por todas as 2ⁿ. «No mínimo» e «no máximo» somam as linhas C(n,i) dos dois lados de k.",
  },
};

export function CoinEngine() {
  const { locale } = useI18n();
  const [flips, setFlips] = useState("3");
  const [heads, setHeads] = useState("2");

  const n = parseNum(flips);
  const k = parseNum(heads);
  const ready = n !== null && k !== null;
  const nValid = ready && n! >= 1 && n! <= 52;
  const kValid = ready && k! >= 0 && n !== null && k! <= n!;

  const stats = nValid && kValid ? coinStats(n!, k!) : null;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={pick(locale, S.flips)}>
          <NumIn value={flips} onChange={setFlips} aria={pick(locale, S.flips)} min={1} max={52} invalid={ready && !nValid} />
        </Field>
        <Field label={pick(locale, S.heads)}>
          <NumIn value={heads} onChange={setHeads} aria={pick(locale, S.heads)} min={0} max={n || 52} invalid={ready && !kValid} />
        </Field>
      </div>

      {!ready ? (
        <div className="mt-5">
          <Note>{pick(locale, S.empty)}</Note>
        </div>
      ) : !nValid ? (
        <div className="mt-5">
          <ErrorNote>{pick(locale, S.errRange)}</ErrorNote>
        </div>
      ) : !kValid ? (
        <div className="mt-5">
          <ErrorNote>{pick(locale, S.errHeads)}</ErrorNote>
        </div>
      ) : stats ? (
        <>
          <BigOut label={pick(locale, S.exactly)}>
            <span className="inline-flex flex-wrap items-baseline gap-x-2">
              <span>
                {fmtInt(stats.waysExactly, locale)}/{fmtInt(stats.totalOutcomes, locale)}
              </span>
              <ReducedNote num={stats.waysExactly} den={stats.totalOutcomes} />
              <span className="text-[var(--color-sub)]">≈ {fmtProb(stats.exactly)}</span>
            </span>
          </BigOut>

          <div className="mt-4">
            <Stats
              items={[
                { label: pick(locale, S.exactly), value: `${reducedFraction(stats.waysExactly, stats.totalOutcomes)} ≈ ${fmtProb(stats.exactly)}`, tone: "accent" },
                { label: pick(locale, S.sequences), value: `2^${n} = ${fmtInt(stats.totalOutcomes, locale)}` },
                { label: pick(locale, S.atLeast), value: fmtProb(stats.atLeast) },
                { label: pick(locale, S.atMost), value: fmtProb(stats.atMost) },
              ]}
            />
          </div>

          <div className="mt-6">
            <h3 className="text-[15px] font-semibold">{pick(locale, S.tableTitle)}</h3>
            <ScrollTable>
              <table className="w-full text-[13px]">
                <thead className="sticky top-0 bg-[var(--color-card)] text-left text-[12px] text-[var(--color-sub)]">
                  <tr>
                    <th className="px-3 py-2 font-medium">{pick(locale, S.headsCol)}</th>
                    <th className="px-3 py-2 font-medium">{pick(locale, S.waysCol)}</th>
                    <th className="w-[38%] px-3 py-2 font-medium">P</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: n + 1 }, (_, i) => {
                    const ways = binomial(n!, i);
                    return (
                      <tr key={i} className={`border-t hairline ${i === k ? "bg-[rgba(5,150,105,0.08)]" : ""}`}>
                        <td className="mono px-3 py-1.5 font-semibold">{i}</td>
                        <td className="mono px-3 py-1.5">{fmtInt(ways, locale)}</td>
                        <td className="px-3 py-1.5">
                          <ProbBar label={fmtProb(ways / stats.totalOutcomes)} probability={ways / stats.totalOutcomes} value="" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </ScrollTable>
            <div className="mt-3">
              <Note>{pick(locale, S.formulaNote)}</Note>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
