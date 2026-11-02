import { z } from "zod";
import { binomial, birthdayParadox, coinStats, diceAtLeast, diceDistribution, diceExactly, lotteryOdds } from "../tools/_lib/probability";

/**
 * MCP 工具注册表:把 tools/_lib/probability.ts 的纯函数暴露为 AI 可执行工具。
 * 站上的同名工具在浏览器里跑(交互式),这里跑同一份经过测试的实现——
 * 人和 AI 用同一套逻辑,而不是两套各写各的。
 *
 * 取值范围与站上引擎一致:dice ≤ 2⁵³ 结果数、coins ≤ 52 次分母精确、
 * lottery ≤ 2⁵³ 张票、birthday 0–366 人。超出范围由 zod 拒绝(schema 层)
 * 或由 _lib 的 RangeError 走 isError(逻辑层)。
 */

const json = (v: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(v, null, 2) }] });
const text = (t: string) => ({ content: [{ type: "text" as const, text: t }] });
const pct = (p: number) => Math.round(p * 1e8) / 1e6; // 8 位精度转百分数

export type McpToolDef = {
  name: string;
  title: string;
  description: string;
  schema: Record<string, any>;
  run: (args: any) => { content: { type: "text"; text: string }[]; isError?: boolean };
};

export const MCP_TOOLS: McpToolDef[] = [
  {
    name: "dice_probability",
    title: "Dice probability distribution",
    description:
      "Exact probability distribution of the sum of N fair S-sided dice (combinatoric counting, not simulation). Returns every reachable sum with its exact number of ways and probability, the total outcome count S^N and the expected sum N(S+1)/2. Optional target k adds P(sum = k), P(sum ≥ k) and P(sum ≤ k). Exact while S^N ≤ 2^53.",
    schema: {
      dice: z.number().int().min(1).max(60).describe("number of dice"),
      sides: z.number().int().min(2).max(1000).describe("sides per die (d6 = 6)"),
      target_sum: z.number().int().optional().describe("optional target sum k for P(sum = k) / P(sum ≥ k)"),
    },
    run: (a) => {
      let rows;
      try {
        rows = diceDistribution(a.dice, a.sides);
      } catch (e) {
        return { content: [{ type: "text", text: (e as Error).message }], isError: true };
      }
      const totalOutcomes = Math.pow(a.sides, a.dice);
      const mean = (a.dice * (a.sides + 1)) / 2;
      const result: Record<string, unknown> = {
        notation: `${a.dice}d${a.sides}`,
        total_outcomes: totalOutcomes,
        expected_sum: mean,
        distribution: rows.map((r) => ({
          sum: r.sum,
          ways: r.ways,
          probability: Math.round(r.probability * 1e10) / 1e10,
          fraction: `${r.ways}/${totalOutcomes}`,
        })),
      };
      if (a.target_sum !== undefined) {
        const k = a.target_sum;
        if (k < a.dice || k > a.dice * a.sides) {
          return {
            content: [{ type: "text", text: `target_sum must be between ${a.dice} and ${a.dice * a.sides} for ${a.dice}d${a.sides}` }],
            isError: true,
          };
        }
        result.target = {
          k,
          p_sum_equals_k: diceExactly(rows, k),
          p_sum_at_least_k: diceAtLeast(rows, k),
          p_sum_at_most_k: 1 - diceAtLeast(rows, k + 1),
        };
      }
      return json(result);
    },
  },
  {
    name: "coin_flip_stats",
    title: "Coin flip binomial statistics",
    description:
      "Binomial statistics for n flips of a fair coin: P(exactly k heads), P(at least k), P(at most k), each as exact fraction C(n,k)/2^n and decimal. n ≤ 52 keeps the denominator 2^n exactly representable.",
    schema: {
      flips: z.number().int().min(1).max(52).describe("number of fair coin flips"),
      heads: z.number().int().min(0).max(52).describe("number of heads to ask about (0..flips)"),
    },
    run: (a) => {
      if (a.heads > a.flips) {
        return { content: [{ type: "text", text: `heads cannot exceed flips (${a.flips})` }], isError: true };
      }
      const s = coinStats(a.flips, a.heads);
      return json({
        flips: a.flips,
        heads: a.heads,
        total_outcomes: s.totalOutcomes,
        p_exactly: { fraction: `${s.waysExactly}/${s.totalOutcomes}`, decimal: s.exactly, percent: pct(s.exactly) },
        p_at_least: { decimal: s.atLeast, percent: pct(s.atLeast) },
        p_at_most: { decimal: s.atMost, percent: pct(s.atMost) },
      });
    },
  },
  {
    name: "lottery_odds",
    title: "Lottery odds by match tier",
    description:
      "Odds of a classic single-pool lottery: pick k numbers from n, k are drawn (6/49 style, no bonus ball). Returns the jackpot odds 1 in C(n,k) plus every match tier via the hypergeometric formula P(match m) = C(k,m)·C(n-k,k-m)/C(n,k). Example: 6 from 49 → jackpot 1 in 13,983,816; match 3 → 1 in 57. Does not model bonus balls or second pools.",
    schema: {
      pool: z.number().int().min(2).max(120).describe("numbers in the pool n"),
      picks: z.number().int().min(1).max(20).describe("numbers a ticket picks k (≤ pool)"),
      min_match: z.number().int().min(0).max(20).optional().describe("only report tiers with match ≥ min_match (default 0)"),
    },
    run: (a) => {
      if (a.picks > a.pool) {
        return { content: [{ type: "text", text: `picks cannot exceed pool (${a.pool})` }], isError: true };
      }
      let odds;
      try {
        odds = lotteryOdds(a.pool, a.picks);
      } catch (e) {
        return { content: [{ type: "text", text: (e as Error).message }], isError: true };
      }
      const minMatch = a.min_match ?? 0;
      return json({
        game: `pick ${a.picks} from ${a.pool}`,
        total_tickets: odds.totalTickets,
        jackpot: {
          one_in: odds.jackpotOneIn,
          probability: odds.jackpot,
          percent: pct(odds.jackpot),
        },
        tiers: odds.tiers
          .filter((t) => t.match >= minMatch)
          .map((t) => ({
            match: t.match,
            ways: t.ways,
            probability: t.probability,
            one_in: t.oneIn,
          })),
      });
    },
  },
  {
    name: "birthday_paradox",
    title: "Birthday paradox probability",
    description:
      "P(at least two of N people share a birthday) among `days` equally likely birthdays (default 365, leap days ignored). Computed as 1 − ∏(days−i)/days — numerically safe, never overflows. The classic answer: 23 people → 50.73%. people > days returns exactly 1 (pigeonhole).",
    schema: {
      people: z.number().int().min(0).max(10000).describe("people in the room"),
      days: z.number().int().min(1).max(1000000).default(365).describe("possible birthdays (365 ignores leap days)"),
    },
    run: (a) => {
      const p = birthdayParadox(a.people, a.days);
      // 50% 交叉点只在小日历上找——百万级 days 逐人扫是 O(days²),不做。
      const fiftyAt = a.days <= 1000
        ? Array.from({ length: a.days + 1 }, (_, i) => i + 1).find((i) => birthdayParadox(i, a.days) >= 0.5) ?? null
        : null;
      return json({
        people: a.people,
        days: a.days,
        probability: p,
        percent: pct(p),
        one_in: p > 0 ? Math.round(1 / p) : null,
        certainty_by_pigeonhole: a.people > a.days,
        fifty_percent_first_at: fiftyAt,
      });
    },
  },
];
