"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { birthdayParadox } from "../_lib/probability";
import {
  BigOut, ErrorNote, Field, NumIn, Note, ProbBar, ScrollTable,
  Stats, fmtInt, fmtProb, fmtPercent, parseNum, pick,
} from "./prob-ui";

/**
 * 生日悖论引擎:房间里 N 个人,至少两人生日相同的概率。
 * 1 − 365!/(365^N × (365−N)!),迭代乘 (365−i)/365,永不溢出。365 天忽略闰日(如实披露)。
 */

const S = {
  people: { en: "People in the room", zh: "房间里的人数", ja: "部屋にいる人数", es: "Personas en la sala", pt: "Pessoas na sala" },
  days: { en: "Possible birthdays", zh: "可能的生日数", ja: "誕生日の候補数", es: "Cumpleaños posibles", pt: "Aniversários possíveis" },
  headline: { en: "P(at least two share a birthday)", zh: "P(至少两人生日相同)", ja: "P(少なくとも2人が同じ誕生日)", es: "P(al menos dos cumplen el mismo día)", pt: "P(pelo menos dois fazem anos no mesmo dia)" },
  chance: { en: "Chance", zh: "概率", ja: "確率", es: "Probabilidad", pt: "Probabilidade" },
  fiftyAt: { en: "50% first reached at", zh: "首次过 50% 在", ja: "初めて50%を超える人数", es: "El 50% se alcanza con", pt: "50% é atingido com" },
  oneIn: { en: "Odds", zh: "几率", ja: "オッズ", es: "Probabilidad de 1 entre", pt: "Chance de 1 em" },
  tableTitle: { en: "The classic curve, person by person", zh: "逐人看这条经典曲线", ja: "人数ごとの古典曲線", es: "La curva clásica, persona a persona", pt: "A curva clássica, pessoa a pessoa" },
  peopleCol: { en: "People", zh: "人数", ja: "人数", es: "Personas", pt: "Pessoas" },
  empty: { en: "Enter how many people are in the room.", zh: "输入房间里有多少人。", ja: "部屋にいる人数を入力してください。", es: "Indique cuántas personas hay en la sala.", pt: "Informe quantas pessoas há na sala." },
  errRange: {
    en: "Enter a whole number of people between 0 and 366 (past 366 a shared birthday is certain — pigeonhole).",
    zh: "请输入 0–366 的整数人数(超过 366 人必然有生日相同——鸽笼原理)。",
    ja: "人数は 0〜366 の整数で入力してください(366 人を超えると鳩の巣原理により必ず誰かが一致します)。",
    es: "Introduzca un número entero de personas entre 0 y 366 (más de 366: seguro por el principio del palomar).",
    pt: "Informe um número inteiro de pessoas entre 0 e 366 (acima de 366 é certo pelo princípio da casa dos pombos).",
  },
  daysNote: {
    en: "Assumes 365 equally likely birthdays — leap days (Feb 29) are ignored, the standard classroom model.",
    zh: "假设 365 个等可能生日——忽略闰日(2 月 29 日),这是课堂上的标准模型。",
    ja: "365 の等確率の誕生日を仮定します。うるう日(2月29日)は無視する、教科書の標準モデルです。",
    es: "Supone 365 cumpleaños equiprobables: ignora los bisiestos (29 de febrero), el modelo estándar de aula.",
    pt: "Supõe 365 aniversários equiprováveis — ignora os bissextos (29 de fevereiro), o modelo padrão de sala de aula.",
  },
  formulaNote: {
    en: "Computed the safe way: 1 − ∏(365−i)/365, multiplying one ratio per person. The product only ever shrinks toward zero, so nothing overflows even for hundreds of people — and 23 people already pass 50%, which is why it is called a paradox.",
    zh: "用稳妥的算法:1 − ∏(365−i)/365,每人乘一个比例。这个乘积只会单调缩小,几百人也不会溢出——而 23 人就过了 50%,这正是“悖论”之名的由来。",
    ja: "安全な算法で計算します:1 − ∏(365−i)/365、1人ごとに比率を掛けるだけです。積は単調に 0 に近づくだけで、数百人でもオーバーフローしません。23 人で早くも 50% を超える——だから「パラドックス」と呼ばれます。",
    es: "Cálculo seguro: 1 − ∏(365−i)/365, multiplicando una razón por persona. El producto solo decrece hacia cero, así que nada desborda ni con cientos de personas — y 23 personas ya superan el 50%, de ahí lo de «paradoja».",
    pt: "Cálculo seguro: 1 − ∏(365−i)/365, multiplicando uma razão por pessoa. O produto só diminui em direção a zero, então nada transborda nem com centenas de pessoas — e 23 pessoas já passam de 50%, daí o nome «paradoxo».",
  },
};

const FIFTY = 0.5;

export function BirthdayEngine() {
  const { locale } = useI18n();
  const [people, setPeople] = useState("23");

  const n = parseNum(people);
  const ready = n !== null;
  const valid = ready && n! >= 0 && n! <= 366;

  // 50% 交叉点:经典答案 23。纯函数按 N 逐个算,曲线最长 366 行,开销可忽略。
  let fiftyAt = 0;
  if (valid) {
    for (let i = 1; i <= 366; i++) {
      if (birthdayParadox(i) >= FIFTY) {
        fiftyAt = i;
        break;
      }
    }
  }

  const p = valid ? birthdayParadox(n!) : 0;
  const tableRows = valid ? Math.min(n!, 100) : 0;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={pick(locale, S.people)}>
          <NumIn value={people} onChange={setPeople} aria={pick(locale, S.people)} min={0} max={366} invalid={ready && !valid} />
        </Field>
        <div className="flex items-end">
          <Note>{pick(locale, S.daysNote)}</Note>
        </div>
      </div>

      {!ready ? (
        <div className="mt-5">
          <Note>{pick(locale, S.empty)}</Note>
        </div>
      ) : !valid ? (
        <div className="mt-5">
          <ErrorNote>{pick(locale, S.errRange)}</ErrorNote>
        </div>
      ) : (
        <>
          <BigOut label={pick(locale, S.headline)}>
            <span className="inline-flex flex-wrap items-baseline gap-x-2">
              <span>{fmtPercent(p)}</span>
              <span className="text-[var(--color-sub)]">≈ {fmtProb(p)}</span>
            </span>
          </BigOut>

          <div className="mt-4">
            <Stats
              items={[
                { label: pick(locale, S.fiftyAt), value: fiftyAt > 0 ? `${fiftyAt} ${pick(locale, S.peopleCol).toLowerCase()}` : "—", tone: "accent" },
                { label: pick(locale, S.oneIn), value: p > 0 ? `1 in ${fmtInt(Math.round(1 / p), locale)}` : "—" },
              ]}
            />
          </div>

          <div className="mt-6">
            <h3 className="text-[15px] font-semibold">{pick(locale, S.tableTitle)}</h3>
            <ScrollTable>
              <table className="w-full text-[13px]">
                <thead className="sticky top-0 bg-[var(--color-card)] text-left text-[12px] text-[var(--color-sub)]">
                  <tr>
                    <th className="px-3 py-2 font-medium">{pick(locale, S.peopleCol)}</th>
                    <th className="w-[40%] px-3 py-2 font-medium">P</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: tableRows }, (_, idx) => {
                    const i = idx + 1;
                    const pi = birthdayParadox(i);
                    return (
                      <tr key={i} className={`border-t hairline ${i === n ? "bg-[rgba(5,150,105,0.08)]" : ""}`}>
                        <td className="mono px-3 py-1.5 font-semibold">{i}</td>
                        <td className="px-3 py-1.5">
                          <ProbBar label={fmtPercent(pi)} probability={pi} value="" highlight={i === fiftyAt} />
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
      )}
    </div>
  );
}
