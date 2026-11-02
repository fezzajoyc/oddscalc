import { describe, expect, it } from "vitest";
import {
  binomial, birthdayParadox, coinStats, diceAtLeast, diceDistribution, diceExactly, lotteryOdds,
} from "@/tools/_lib/probability";

/**
 * Oddscalc probability core — matrix per the workspace standard: normal values
 * (exact, hand-computed), boundaries, invalid inputs, sum-to-1 identities and
 * closed-form cross-checks. The headline vectors are the classic ones:
 * C(49,6) = 13,983,816 · 2d6 sum-7 = 6/36 · 3 flips/2 heads = 3/8 · 23 people ≈ 50.73%.
 */

const inRange = (p: number) => Number.isFinite(p) && p >= 0 && p <= 1;

/* ------------------------------------------------------------------ */
/* binomial — exact iterative BigInt-backed coefficients               */
/* ------------------------------------------------------------------ */

describe("binomial: hand-computed values", () => {
  it("gives the base cases C(0,0)=1 and single-row unities", () => {
    expect(binomial(0, 0)).toBe(1);
    expect(binomial(1, 0)).toBe(1);
    expect(binomial(1, 1)).toBe(1);
    expect(binomial(10, 0)).toBe(1);
    expect(binomial(10, 10)).toBe(1);
  });

  it("matches the textbook rows: C(5,2)=10, C(10,3)=120", () => {
    expect(binomial(5, 2)).toBe(10);
    expect(binomial(5, 3)).toBe(10); // symmetry
    expect(binomial(10, 3)).toBe(120);
    expect(binomial(10, 7)).toBe(120); // symmetry
  });

  it("reproduces the famous lottery number C(49,6) = 13,983,816", () => {
    expect(binomial(49, 6)).toBe(13983816);
    expect(binomial(52, 5)).toBe(2598960);
  });

  it("stays exact at the top of the safe range: C(52,26) = 495,918,532,948,104", () => {
    expect(binomial(52, 26)).toBe(495918532948104);
    expect(Number.isInteger(binomial(52, 26))).toBe(true);
  });

  it("satisfies Pascal's identity against an independent triangle build", () => {
    // independent implementation: build Pascal's triangle by addition only
    const row: number[] = [1];
    for (let n = 1; n <= 40; n++) {
      const next = [1];
      for (let k = 1; k < n; k++) next.push(row[k - 1] + row[k]);
      next.push(1);
      for (let k = 0; k <= n; k++) expect(binomial(n, k)).toBe(next[k]);
      row.length = 0;
      row.push(...next);
    }
  });

  it("returns 0 for k out of [0, n] (empty-sum convention)", () => {
    expect(binomial(5, 6)).toBe(0);
    expect(binomial(5, -1)).toBe(0);
  });

  it("throws RangeError on non-integer or negative n", () => {
    expect(() => binomial(5.5, 2)).toThrow(RangeError);
    expect(() => binomial(-3, 1)).toThrow(RangeError);
    expect(() => binomial(NaN, 1)).toThrow(RangeError);
    expect(() => binomial(Infinity, 1)).toThrow(RangeError);
    expect(() => binomial(5, 2.5)).toThrow(RangeError);
  });
});

/* ------------------------------------------------------------------ */
/* diceDistribution — DP over integer counts                           */
/* ------------------------------------------------------------------ */

describe("diceDistribution: 2d6 classic", () => {
  const rows = diceDistribution(2, 6);

  it("produces 11 rows from sum 2 to sum 12", () => {
    expect(rows.map((r) => r.sum)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("sum 7 has 6 of 36 ways (1/6); snake eyes and boxcars have 1 way each", () => {
    expect(rows.find((r) => r.sum === 7)).toMatchObject({ ways: 6, probability: 1 / 6 });
    expect(rows.find((r) => r.sum === 2)).toMatchObject({ ways: 1, probability: 1 / 36 });
    expect(rows.find((r) => r.sum === 12)).toMatchObject({ ways: 1, probability: 1 / 36 });
  });

  it("total ways across all sums equal S^N = 36 (no outcome lost)", () => {
    expect(rows.reduce((a, r) => a + r.ways, 0)).toBe(36);
  });

  it("is a symmetric triangle: ways(s) = ways(14 − s)", () => {
    for (const r of rows) {
      const mirror = rows.find((x) => x.sum === 14 - r.sum);
      expect(mirror?.ways, `sum ${r.sum}`).toBe(r.ways);
    }
  });

  it("probabilities sum to exactly 1", () => {
    const total = rows.reduce((a, r) => a + r.probability, 0);
    expect(total).toBeCloseTo(1, 12);
    for (const p of rows.map((r) => r.probability)) expect(inRange(p)).toBe(true);
  });

  it("cross-checks against a direct convolution of two uniform dice", () => {
    // independent implementation: convolve [1..6] with itself by brute force
    const brute = new Map<number, number>();
    for (let a = 1; a <= 6; a++)
      for (let b = 1; b <= 6; b++)
        brute.set(a + b, (brute.get(a + b) ?? 0) + 1);
    for (const r of rows) expect(r.ways).toBe(brute.get(r.sum));
  });
});

describe("diceDistribution: other shapes and boundaries", () => {
  it("one die is uniform: every face 1 way, 1/6", () => {
    const rows = diceDistribution(1, 6);
    expect(rows.length).toBe(6);
    for (const r of rows) expect(r).toMatchObject({ ways: 1, probability: 1 / 6 });
  });

  it("3d6: sum 7 has 15 of 216 ways; extremes are 1/216", () => {
    const rows = diceDistribution(3, 6);
    expect(rows.reduce((a, r) => a + r.ways, 0)).toBe(216);
    expect(rows.find((r) => r.sum === 7)?.ways).toBe(15);
    expect(rows.find((r) => r.sum === 3)?.ways).toBe(1);
    expect(rows.find((r) => r.sum === 18)?.ways).toBe(1);
  });

  it("8d6 keeps the big counts exact: 6^8 = 1,679,616", () => {
    const rows = diceDistribution(8, 6);
    expect(rows.reduce((a, r) => a + r.ways, 0)).toBe(1679616);
    for (const r of rows) expect(Number.isInteger(r.ways)).toBe(true);
  });

  it("stays exact at 20d6 (6^20 ≈ 3.66e15 ≤ 2^53) and refuses 21d6", () => {
    const rows = diceDistribution(20, 6);
    expect(rows.reduce((a, r) => a + r.ways, 0)).toBe(3656158440062976);
    expect(() => diceDistribution(21, 6)).toThrow(/2\^53/);
    expect(() => diceDistribution(30, 6)).toThrow(RangeError);
  });

  it("mean matches the closed formula N(S+1)/2", () => {
    const rows = diceDistribution(2, 6);
    const mean = rows.reduce((a, r) => a + r.sum * r.probability, 0);
    expect(mean).toBeCloseTo(7, 12);
    const rows2 = diceDistribution(3, 20);
    const mean2 = rows2.reduce((a, r) => a + r.sum * r.probability, 0);
    expect(mean2).toBeCloseTo((3 * 21) / 2, 10);
  });

  it("diceAtLeast sums the tail: P(2d6 ≥ 10) = 6/36 = 1/6", () => {
    const rows = diceDistribution(2, 6);
    expect(diceAtLeast(rows, 10)).toBeCloseTo(6 / 36, 14);
    expect(diceAtLeast(rows, 2)).toBe(1);
    expect(diceAtLeast(rows, 13)).toBe(0);
    expect(diceExactly(rows, 7)).toBeCloseTo(1 / 6, 14);
    expect(diceExactly(rows, 1)).toBe(0);
  });

  it("rejects invalid inputs with RangeError", () => {
    expect(() => diceDistribution(0, 6)).toThrow(RangeError);
    expect(() => diceDistribution(2, 1)).toThrow(RangeError);
    expect(() => diceDistribution(2.5, 6)).toThrow(RangeError);
    expect(() => diceDistribution(2, 6.5)).toThrow(RangeError);
    expect(() => diceDistribution(-1, 6)).toThrow(RangeError);
    expect(() => diceDistribution(NaN, 6)).toThrow(RangeError);
  });
});

/* ------------------------------------------------------------------ */
/* coinStats — binomial heads/tails                                    */
/* ------------------------------------------------------------------ */

describe("coinStats: hand-computed vectors", () => {
  it("3 flips, 2 heads: exactly 3/8, at least 4/8, at most 7/8", () => {
    const s = coinStats(3, 2);
    expect(s.waysExactly).toBe(3);
    expect(s.totalOutcomes).toBe(8);
    expect(s.exactly).toBeCloseTo(3 / 8, 15);
    expect(s.atLeast).toBeCloseTo(4 / 8, 15);
    expect(s.atMost).toBeCloseTo(7 / 8, 15);
  });

  it("1 flip, 0 heads: exactly 1/2, at least 1, at most 1/2", () => {
    const s = coinStats(1, 0);
    expect(s.exactly).toBeCloseTo(0.5, 15);
    expect(s.atLeast).toBe(1);
    expect(s.atMost).toBeCloseTo(0.5, 15);
  });

  it("0 flips, 0 heads is the certain event (boundary)", () => {
    const s = coinStats(0, 0);
    expect(s.exactly).toBe(1);
    expect(s.atLeast).toBe(1);
    expect(s.atMost).toBe(1);
  });

  it("52 flips keeps C(n,k) exact against the known central coefficient", () => {
    const s = coinStats(52, 26);
    expect(s.waysExactly).toBe(495918532948104);
    expect(Number.isInteger(s.waysExactly)).toBe(true);
    expect(s.totalOutcomes).toBe(4503599627370496); // 2^52
    expect(inRange(s.exactly)).toBe(true);
  });

  it("the exactly column sums to 1 and atMost/atLeast are complementary", () => {
    const n = 12;
    let sum = 0;
    for (let k = 0; k <= n; k++) {
      const s = coinStats(n, k);
      sum += s.exactly;
      if (k < n) expect(s.atMost + coinStats(n, k + 1).atLeast).toBeCloseTo(1, 12);
      expect(inRange(s.atLeast)).toBe(true);
      expect(inRange(s.atMost)).toBe(true);
    }
    expect(sum).toBeCloseTo(1, 12);
  });

  it("atLeast is monotone non-increasing in k, atMost non-decreasing", () => {
    let prevLow = 0; // atMost starts at P(≤0) > 0
    let prevHigh = 1; // atLeast starts at P(≥0) = 1
    for (let k = 0; k <= 10; k++) {
      const s = coinStats(10, k);
      expect(s.atMost).toBeGreaterThanOrEqual(prevLow - 1e-12);
      expect(s.atLeast).toBeLessThanOrEqual(prevHigh + 1e-12);
      prevLow = s.atMost;
      prevHigh = s.atLeast;
    }
  });

  it("rejects invalid inputs with RangeError", () => {
    expect(() => coinStats(3, 5)).toThrow(RangeError);
    expect(() => coinStats(-1, 0)).toThrow(RangeError);
    expect(() => coinStats(3.5, 1)).toThrow(RangeError);
    expect(() => coinStats(3, -1)).toThrow(RangeError);
    expect(() => coinStats(NaN, 0)).toThrow(RangeError);
  });
});

/* ------------------------------------------------------------------ */
/* lotteryOdds — hypergeometric tiers                                  */
/* ------------------------------------------------------------------ */

describe("lotteryOdds: 6 from 49 (the classic)", () => {
  const odds = lotteryOdds(49, 6);

  it("has C(49,6) = 13,983,816 tickets and jackpot 1/13,983,816", () => {
    expect(odds.totalTickets).toBe(13983816);
    expect(odds.jackpotOneIn).toBe(13983816);
    expect(odds.jackpot).toBeCloseTo(1 / 13983816, 20);
  });

  it("lists 7 tiers from match 6 down to match 0", () => {
    expect(odds.tiers.map((t) => t.match)).toEqual([6, 5, 4, 3, 2, 1, 0]);
  });

  it("match tiers carry the hand-computed hypergeometric counts", () => {
    // m=6: C(6,6)·C(43,0) = 1
    // m=5: C(6,5)·C(43,1) = 6·43 = 258
    // m=4: C(6,4)·C(43,2) = 15·903 = 13,545
    // m=3: C(6,3)·C(43,3) = 20·12,341 = 246,820
    // m=0: C(6,0)·C(43,6) = 6,096,454
    const byMatch = (m: number) => odds.tiers.find((t) => t.match === m)!;
    expect(byMatch(6).ways).toBe(1);
    expect(byMatch(5).ways).toBe(258);
    expect(byMatch(4).ways).toBe(13545);
    expect(byMatch(3).ways).toBe(246820);
    expect(byMatch(0).ways).toBe(6096454);
  });

  it("match-3 is about 1 in 56.66 (the tier most prizes come from)", () => {
    const t3 = odds.tiers.find((t) => t.match === 3)!;
    expect(t3.probability).toBeCloseTo(246820 / 13983816, 15);
    expect(t3.oneIn).toBe(57); // round(13983816/246820) = round(56.66) = 57
  });

  it("tier probabilities sum to exactly 1 — no probability goes missing", () => {
    const sum = odds.tiers.reduce((a, t) => a + t.probability, 0);
    expect(sum).toBeCloseTo(1, 12);
    for (const t of odds.tiers) expect(inRange(t.probability)).toBe(true);
  });

  it("cross-checks the whole table by brute-force hypergeometric enumeration", () => {
    // independent implementation: count 6-subsets of 49 by direct combination walk
    const C = (n: number, k: number): number => {
      if (k < 0 || k > n) return 0;
      let r = 1;
      for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
      return Math.round(r);
    };
    for (let m = 0; m <= 6; m++) {
      const expect_ways = C(6, m) * C(43, 6 - m);
      expect(odds.tiers.find((t) => t.match === m)!.ways).toBe(expect_ways);
    }
  });

  it("small game sanity: pick 3 from 10 has 120 tickets, jackpot and match-3 coincide", () => {
    const o = lotteryOdds(10, 3);
    expect(o.totalTickets).toBe(120);
    expect(o.jackpot).toBeCloseTo(1 / 120, 15);
    expect(o.tiers.find((t) => t.match === 3)!.ways).toBe(1);
    expect(o.tiers.find((t) => t.match === 0)!.ways).toBe(35); // C(7,3)
  });

  it("rejects invalid or inexact-count configurations with RangeError", () => {
    expect(() => lotteryOdds(3, 7)).toThrow(RangeError);  // picks > pool
    expect(() => lotteryOdds(1, 1)).toThrow(RangeError);  // pool too small
    expect(() => lotteryOdds(49.5, 6)).toThrow(RangeError);
    expect(() => lotteryOdds(120, 20)).toThrow(/2\^53/);  // C(120,20) ≈ 2.9e22
  });
});

/* ------------------------------------------------------------------ */
/* birthdayParadox — iterative product of ratios                       */
/* ------------------------------------------------------------------ */

describe("birthdayParadox: the classic curve", () => {
  it("gives 0 for 0 and 1 people (no pair exists)", () => {
    expect(birthdayParadox(0)).toBe(0);
    expect(birthdayParadox(1)).toBe(0);
  });

  it("2 people: exactly 1/365", () => {
    expect(birthdayParadox(2)).toBeCloseTo(1 / 365, 15);
  });

  it("23 people ≈ 0.5073 — the number the paradox is named for", () => {
    expect(birthdayParadox(23)).toBeCloseTo(0.5072972343, 9);
  });

  it("75 people ≈ 0.9997", () => {
    expect(birthdayParadox(75)).toBeCloseTo(0.9997198781738114, 9);
  });

  it("reaches 1 by 366 people (pigeonhole); at 365 the true value differs from 1 by less than any float", () => {
    // P(365) = 1 − 365!/365^365, and 365!/365^365 ≈ 10^−777 — the no-collision
    // product underflows to 0, so the float result is exactly 1. That is honest:
    // the true value differs from 1 by less than 10^−700.
    expect(birthdayParadox(365)).toBeGreaterThanOrEqual(1 - 1e-15);
    expect(birthdayParadox(366)).toBe(1);
    expect(birthdayParadox(400)).toBe(1);
    expect(birthdayParadox(10000)).toBe(1);
  });

  it("is monotone non-decreasing across the whole range", () => {
    let prev = 0;
    for (let n = 1; n <= 100; n++) {
      const p = birthdayParadox(n);
      expect(p).toBeGreaterThanOrEqual(prev);
      expect(inRange(p)).toBe(true);
      prev = p;
    }
  });

  it("shrinks when the calendar grows: 366 days gives a smaller probability than 365", () => {
    expect(birthdayParadox(23, 366)).toBeLessThan(birthdayParadox(23, 365));
    expect(birthdayParadox(2, 30)).toBeCloseTo(1 / 30, 15);
    expect(birthdayParadox(31, 30)).toBe(1); // pigeonhole with a 30-day calendar
  });

  it("rejects invalid inputs with RangeError", () => {
    expect(() => birthdayParadox(-1)).toThrow(RangeError);
    expect(() => birthdayParadox(2.5)).toThrow(RangeError);
    expect(() => birthdayParadox(23, 0)).toThrow(RangeError);
    expect(() => birthdayParadox(23, 365.5)).toThrow(RangeError);
    expect(() => birthdayParadox(NaN)).toThrow(RangeError);
  });

  it("never returns a non-finite value even at extreme sizes", () => {
    expect(Number.isFinite(birthdayParadox(10000, 1000000))).toBe(true);
    expect(Number.isFinite(birthdayParadox(99999, 100000))).toBe(true);
  });
});
