"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { lotteryOdds } from "../_lib/probability";
import {
  BigOut, ErrorNote, Field, NumIn, Note, ProbBar, ScrollTable,
  Stats, fmtInt, fmtProb, fmtPercent, parseNum, pick,
} from "./prob-ui";

/**
 * 彩票赔率引擎:从 n 个号里选 k 个(经典 6/49 型,无特别号)。
 * P(中 m 个) = C(k,m)·C(n−k,k−m) / C(n,k)——超几何分布,全部走精确 C(n,k)。
 */

const S = {
  pool: { en: "Numbers in the pool (n)", zh: "号码池大小 (n)", ja: "数字の総数 (n)", es: "Números en el bombo (n)", pt: "Números no universo (n)" },
  picks: { en: "Numbers you pick (k)", zh: "你选的号码数 (k)", ja: "選ぶ数字の数 (k)", es: "Números que elige (k)", pt: "Números que você escolhe (k)" },
  jackpot: { en: "Jackpot — match all", zh: "头奖——全中", ja: "ジャックポット(全的中)", es: "Bote — acertar todo", pt: "Bolão — acertar tudo" },
  tickets: { en: "Distinct tickets", zh: "不同组合数", ja: "組み合わせの総数", es: "Combinaciones distintas", pt: "Combinações distintas" },
  chance: { en: "Chance", zh: "中奖概率", ja: "的中確率", es: "Probabilidad", pt: "Probabilidade" },
  tableTitle: { en: "Every match tier", zh: "每个中奖档位", ja: "各等級ごとの当選確率", es: "Cada nivel de aciertos", pt: "Cada faixa de acertos" },
  matchCol: { en: "Matched", zh: "中几个", ja: "的中数", es: "Aciertos", pt: "Acertos" },
  waysCol: { en: "Ticket combinations", zh: "组合数", ja: "組み合わせ数", es: "Combinaciones", pt: "Combinações" },
  oneIn: { en: "1 in", zh: "分之一", ja: "に 1 回", es: "1 entre", pt: "1 em" },
  empty: { en: "Enter the pool size and how many numbers a ticket picks.", zh: "输入号码池大小和每注选择的号码数。", ja: "数字の総数と選ぶ数を入力してください。", es: "Indique el tamaño del bombo y cuántos números elige cada boleto.", pt: "Informe o tamanho do universo e quantos números cada bilhete escolhe." },
  errRange: {
    en: "Use a pool of 2–120 numbers and pick 1–20 of them. Combinations beyond 2⁵³ tickets are refused — this site only shows exact counts.",
    zh: "号码池 2–120,每注选 1–20 个。组合数超过 2⁵³ 会被拒绝——本站只展示精确计数。",
    ja: "数字の総数は 2〜120、選ぶ数は 1〜20 です。組み合わせが 2⁵³ を超える場合はお断りしています。本サイトは正確な数だけを表示します。",
    es: "Use un bombo de 2 a 120 números y elija de 1 a 20. Se rechazan las combinaciones de más de 2⁵³ boletos: este sitio solo muestra recuentos exactos.",
    pt: "Use um universo de 2 a 120 números e escolha de 1 a 20. Combinações acima de 2⁵³ bilhetes são recusadas: este site só mostra contagens exatas.",
  },
  formulaNote: {
    en: "Hypergeometric distribution, no bonus balls: P(match m) = C(k,m)·C(n−k,k−m) / C(n,k). The C(n,k) in the denominator is every distinct ticket; the numerator counts tickets that hit exactly m of the k drawn numbers. The jackpot row is C(n,k) ways to lose for every 1 that wins.",
    zh: "超几何分布(无特别号):P(中 m 个) = C(k,m)·C(n−k,k−m) / C(n,k)。分母 C(n,k) 是全部不同组合;分子是恰好命中 k 个开奖号中 m 个的组合数。头奖一行:每 1 注全中,就有 C(n,k) 注落空。",
    ja: "超幾何分布(ボーナス数字なし)。P(m 的中) = C(k,m)·C(n−k,k−m) / C(n,k)。分母の C(n,k) は全組み合わせ、分子は k 個の当選数字のうちちょうど m 個的中する組み合わせです。ジャックポット行は、1 口が当たるごとに C(n,k) 口が外れることを意味します。",
    es: "Distribución hipergeométrica, sin bola extra: P(acertar m) = C(k,m)·C(n−k,k−m) / C(n,k). El denominador C(n,k) son todos los boletos distintos; el numerador cuenta los que aciertan exactamente m de los k extraídos. En el bote, por cada boleto ganador hay C(n,k) perdedores.",
    pt: "Distribuição hipergeométrica, sem bola extra: P(acertar m) = C(k,m)·C(n−k,k−m) / C(n,k). O denominador C(n,k) são todos os bilhetes distintos; o numerador conta os que acertam exatamente m dos k sorteados. No bolão, para cada bilhete premiado há C(n,k) perdedores.",
  },
};

export function LotteryEngine() {
  const { locale } = useI18n();
  const [pool, setPool] = useState("49");
  const [picks, setPicks] = useState("6");

  const n = parseNum(pool);
  const k = parseNum(picks);
  const ready = n !== null && k !== null;
  const valid = ready && n! >= 2 && n! <= 120 && k! >= 1 && k! <= n! && k! <= 20;

  let odds: ReturnType<typeof lotteryOdds> | null = null;
  let exactError = false;
  if (valid) {
    try {
      odds = lotteryOdds(n!, k!);
    } catch {
      exactError = true;
    }
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={pick(locale, S.pool)}>
          <NumIn value={pool} onChange={setPool} aria={pick(locale, S.pool)} min={2} max={120} invalid={ready && !valid} />
        </Field>
        <Field label={pick(locale, S.picks)}>
          <NumIn value={picks} onChange={setPicks} aria={pick(locale, S.picks)} min={1} max={Math.min(20, n || 20)} invalid={ready && !valid} />
        </Field>
      </div>

      {!ready ? (
        <div className="mt-5">
          <Note>{pick(locale, S.empty)}</Note>
        </div>
      ) : !valid ? (
        <div className="mt-5">
          <ErrorNote>{pick(locale, S.errRange)}</ErrorNote>
        </div>
      ) : exactError || !odds ? (
        <div className="mt-5">
          <ErrorNote>{pick(locale, S.errRange)}</ErrorNote>
        </div>
      ) : (
        <>
          <BigOut label={pick(locale, S.jackpot)}>
            <span className="inline-flex flex-wrap items-baseline gap-x-2">
              <span>
                1 / {fmtInt(odds.jackpotOneIn, locale)}
              </span>
              <span className="text-[var(--color-sub)]">≈ {fmtProb(odds.jackpot)}</span>
            </span>
          </BigOut>

          <div className="mt-4">
            <Stats
              items={[
                { label: pick(locale, S.tickets), value: `C(${n},${k}) = ${fmtInt(odds.totalTickets, locale)}` },
                { label: pick(locale, S.chance), value: fmtPercent(odds.jackpot), tone: "accent" },
              ]}
            />
          </div>

          <div className="mt-6">
            <h3 className="text-[15px] font-semibold">{pick(locale, S.tableTitle)}</h3>
            <ScrollTable>
              <table className="w-full text-[13px]">
                <thead className="sticky top-0 bg-[var(--color-card)] text-left text-[12px] text-[var(--color-sub)]">
                  <tr>
                    <th className="px-3 py-2 font-medium">{pick(locale, S.matchCol)}</th>
                    <th className="px-3 py-2 font-medium">{pick(locale, S.waysCol)}</th>
                    <th className="px-3 py-2 font-medium">{pick(locale, S.oneIn)}</th>
                    <th className="w-[30%] px-3 py-2 font-medium">P</th>
                  </tr>
                </thead>
                <tbody>
                  {odds.tiers.map((t) => (
                    <tr key={t.match} className={`border-t hairline ${t.match === k ? "bg-[rgba(5,150,105,0.08)]" : ""}`}>
                      <td className="mono px-3 py-1.5 font-semibold">
                        {t.match} / {k}
                      </td>
                      <td className="mono px-3 py-1.5">{fmtInt(t.ways, locale)}</td>
                      <td className="mono px-3 py-1.5">{t.oneIn > 0 ? `1 in ${fmtInt(t.oneIn, locale)}` : "—"}</td>
                      <td className="px-3 py-1.5">
                        <ProbBar label={fmtProb(t.probability)} probability={t.probability} value="" highlight={t.match === k} />
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
