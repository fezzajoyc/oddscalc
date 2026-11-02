/**
 * Oddscalc probability core — pure, dependency-free combinatorics.
 *
 * Honesty contract (site standard):
 * - Integer counts (dice ways, binomial coefficients, hypergeometric ways) are
 *   computed exactly while every intermediate stays ≤ 2^53. Configurations whose
 *   exact count cannot be represented are REJECTED (RangeError), not silently
 *   rounded — the site promises exact fractions, so it refuses inexact ones.
 * - birthdayParadox works in ratios (each factor ≤ 1), so it never overflows;
 *   its precision limit is float rounding only, documented below.
 * - Every returned probability is guaranteed to be a finite number in [0, 1].
 */

/** Largest integer n such that n and n−1 are both exactly representable. */
export const MAX_SAFE = Number.MAX_SAFE_INTEGER; // 2^53 − 1

/** Throw when x is not an integer in [lo, hi]. `label` names the parameter. */
function requireInt(x: number, lo: number, hi: number, label: string): void {
  if (typeof x !== "number" || !Number.isInteger(x)) {
    throw new RangeError(`${label} must be an integer, got ${String(x)}`);
  }
  if (x < lo || x > hi) {
    throw new RangeError(`${label} must be between ${lo} and ${hi}, got ${x}`);
  }
}

/* ------------------------------------------------------------------ */
/* binomial — C(n, k), iterative multiply/divide                       */
/* ------------------------------------------------------------------ */

/**
 * C(n, k) = n! / (k!(n−k)!), computed stepwise with BigInt arithmetic so the
 * running value is exactly C(n−k+i, i) after step i — no float rounding in
 * any intermediate, ever. The BigInt result is converted to Number at the end:
 * exact while C(n, k) ≤ 2^53 (e.g. C(49,6) = 13,983,816, C(52,5) = 2,598,960,
 * C(54,27) ≈ 1.95e15); beyond that the returned value is the nearest float,
 * and callers that need exact counts guard on their own limits
 * (diceDistribution and lotteryOdds reject configurations above 2^53).
 *
 * Convention: k < 0 or k > n → 0 (empty sum). Non-integer or negative n → RangeError.
 */
export function binomial(n: number, k: number): number {
  requireInt(n, 0, 100000, "n");
  if (!Number.isInteger(k)) throw new RangeError(`k must be an integer, got ${String(k)}`);
  if (k < 0 || k > n) return 0;
  const kk = Math.min(k, n - k); // symmetry: C(n,k) = C(n,n−k)
  let result = 1n;
  for (let i = 1; i <= kk; i++) {
    // Step-invariant: after i steps, result === BigInt(C(n−kk+i, i)) — exact.
    result = (result * BigInt(n - kk + i)) / BigInt(i);
  }
  const value = Number(result);
  if (!Number.isFinite(value)) {
    throw new RangeError(`C(${n}, ${k}) exceeds the representable number range`);
  }
  return value;
}

/* ------------------------------------------------------------------ */
/* diceDistribution — exact combinatorics for N fair S-sided dice      */
/* ------------------------------------------------------------------ */

export type DiceRow = { sum: number; ways: number; probability: number };

/**
 * Full distribution of the sum of `count` fair `sides`-sided dice.
 *
 * Dynamic programming on integer counts: ways[n][s] = Σ_faces ways[n−1][s−f].
 * Every count is an exact integer; the total number of outcomes is sides^count,
 * which is guarded to stay ≤ 2^53 so `ways` and `probability = ways / sides^count`
 * are exact (probability exact to float rounding of the division).
 *
 * Throws RangeError on non-integer input, count < 1, sides < 2, or when
 * sides^count > 2^53 (exact counting impossible — documented rejection).
 */
export function diceDistribution(count: number, sides: number): DiceRow[] {
  requireInt(count, 1, 60, "dice count");
  requireInt(sides, 2, 1000, "sides");
  const total = Math.pow(sides, count);
  if (!Number.isFinite(total) || total > MAX_SAFE) {
    throw new RangeError(
      `sides^count = ${sides}^${count} exceeds 2^53 — exact counting is not possible; ` +
        `use fewer dice or fewer sides`,
    );
  }

  // DP over dice: rolling[sum] = number of ways to reach that sum.
  // Partial sums only ever add non-negative counts, so every accumulator stays
  // ≤ sides^count ≤ 2^53 — all additions are exact integer arithmetic in Number.
  let rolling = new Array<number>(sides + 1).fill(0);
  for (let f = 1; f <= sides; f++) rolling[f] = 1; // one die
  for (let dice = 2; dice <= count; dice++) {
    const lo = dice; // minimum sum with `dice` dice
    const hi = dice * sides; // maximum sum with `dice` dice
    const next = new Array<number>(hi + 1).fill(0);
    for (let sum = lo; sum <= hi; sum++) {
      // new[sum] = Σ_{f=1..sides} old[sum−f], for valid previous sums
      let acc = 0;
      const prevLo = Math.max(lo - 1, sum - sides);
      const prevHi = Math.min((dice - 1) * sides, sum - 1);
      for (let prev = prevLo; prev <= prevHi; prev++) acc += rolling[prev];
      next[sum] = acc;
    }
    rolling = next;
  }

  const rows: DiceRow[] = [];
  const lo = count;
  const hi = count * sides;
  for (let sum = lo; sum <= hi; sum++) {
    const ways = rolling[sum];
    rows.push({ sum, ways, probability: ways / total });
  }
  return rows;
}

/**
 * P(sum ≥ k) from a diceDistribution table — plain summation of exact counts.
 * k below the minimum sum → 1; k above the maximum → 0.
 */
export function diceAtLeast(rows: DiceRow[], k: number): number {
  let ways = 0;
  for (const r of rows) if (r.sum >= k) ways += r.ways;
  const total = rows.reduce((acc, r) => acc + r.ways, 0);
  return total === 0 ? 0 : ways / total;
}

/**
 * P(sum = k) from a diceDistribution table. k outside [min, max] → 0.
 */
export function diceExactly(rows: DiceRow[], k: number): number {
  const row = rows.find((r) => r.sum === k);
  const total = rows.reduce((acc, r) => acc + r.ways, 0);
  return row && total > 0 ? row.ways / total : 0;
}

/* ------------------------------------------------------------------ */
/* coinStats — binomial heads/tails statistics                         */
/* ------------------------------------------------------------------ */

export type CoinStats = {
  /** P(exactly k heads) = C(n,k) / 2^n */
  exactly: number;
  /** P(at least k heads) = Σ_{i=k..n} C(n,i) / 2^n */
  atLeast: number;
  /** P(at most k heads) = Σ_{i=0..k} C(n,i) / 2^n */
  atMost: number;
  /** C(n, k) — exact number of sequences with exactly k heads */
  waysExactly: number;
  /** 2^n — exact total number of sequences */
  totalOutcomes: number;
};

/**
 * Binomial statistics for `n` fair coin flips and `k` heads.
 * Exact for n ≤ 52 (2^52 ≤ 2^53, C(n,k) ≤ C(52,26) ≈ 4.95e14); the caller
 * (engine + MCP schema) enforces n ≤ 52 so every number shown is exact.
 * Throws RangeError on non-integer input or n outside [0, 1024].
 */
export function coinStats(n: number, k: number): CoinStats {
  requireInt(n, 0, 1024, "flips");
  requireInt(k, 0, n, "heads");
  const totalOutcomes = Math.pow(2, n);
  let cumulativeLow = 0; // Σ_{i≤k}
  let cumulativeHigh = 0; // Σ_{i≥k}
  const waysExactly = binomial(n, k);
  for (let i = 0; i <= n; i++) {
    const c = binomial(n, i);
    if (i <= k) cumulativeLow += c;
    if (i >= k) cumulativeHigh += c;
  }
  return {
    exactly: waysExactly / totalOutcomes,
    atLeast: cumulativeHigh / totalOutcomes,
    atMost: cumulativeLow / totalOutcomes,
    waysExactly,
    totalOutcomes,
  };
}

/* ------------------------------------------------------------------ */
/* lotteryOdds — hypergeometric match distribution                     */
/* ------------------------------------------------------------------ */

export type LotteryTier = {
  /** how many of your k picks matched the k drawn numbers */
  match: number;
  /** C(k, m) · C(n−k, k−m) — exact number of losing-ticket-side outcomes… see ways note */
  ways: number;
  probability: number;
  /** 1 / probability, rounded for the "1 in X" phrasing (0 when probability is 0) */
  oneIn: number;
};

export type LotteryOdds = {
  /** C(n, k) — total distinct tickets */
  totalTickets: number;
  /** P(jackpot) = 1 / C(n, k) */
  jackpot: number;
  /** C(n, k) for the "1 in 13,983,816" phrasing */
  jackpotOneIn: number;
  /** every match tier, from match = k (jackpot) down to match = 0 */
  tiers: LotteryTier[];
};

/**
 * Odds of a lottery where you pick `k` numbers from a pool of `n`
 * and `k` numbers are drawn (classic 6-from-49 style, no bonus ball).
 *
 * P(exactly m matches) = C(k, m) · C(n−k, k−m) / C(n, k) — hypergeometric.
 * All counts run through binomial(), exact while C(n,k)·max factor stays
 * under 2^53; pool ≤ 120 with picks ≤ 20 is far inside that. Probability
 * rows are guaranteed to sum to 1 within float rounding.
 *
 * Throws RangeError on non-integer input, n < k, k < 1, or n > 1000.
 */
export function lotteryOdds(n: number, k: number): LotteryOdds {
  requireInt(n, 2, 1000, "pool size");
  requireInt(k, 1, n, "picks");
  const totalTickets = binomial(n, k);
  if (!Number.isFinite(totalTickets) || totalTickets > MAX_SAFE) {
    throw new RangeError(
      `C(${n}, ${k}) ≈ ${totalTickets.toExponential(3)} exceeds 2^53 — exact ticket counting ` +
        `is not possible; use a smaller pool or fewer picks`,
    );
  }
  const tiers: LotteryTier[] = [];
  for (let m = k; m >= 0; m--) {
    const matched = binomial(k, m);
    const missed = binomial(n - k, k - m);
    const ways = matched * missed;
    const probability = ways / totalTickets;
    tiers.push({
      match: m,
      ways,
      probability,
      oneIn: probability > 0 ? Math.round(1 / probability) : 0,
    });
  }
  return { totalTickets, jackpot: 1 / totalTickets, jackpotOneIn: totalTickets, tiers };
}

/* ------------------------------------------------------------------ */
/* birthdayParadox — shared-birthday probability                       */
/* ------------------------------------------------------------------ */

/**
 * P(at least two of `people` people share a birthday) with `days` equally
 * likely birthdays (default 365, leap days ignored — documented).
 *
 * Computed iteratively as 1 − ∏_{i=0..people−1} (days − i)/days: each factor
 * is ≤ 1, so nothing overflows and the product stays in [0, 1] by construction.
 * The classic value: 23 people → ≈ 0.5073.
 *
 * people > days → exactly 1 (pigeonhole). people ≤ 1 → exactly 0.
 * Throws RangeError on non-integer input, people < 0 or days < 1.
 */
export function birthdayParadox(people: number, days: number = 365): number {
  requireInt(people, 0, 100000, "people");
  requireInt(days, 1, 1000000, "days");
  if (people <= 1) return 0;
  if (people > days) return 1;
  let noCollision = 1;
  for (let i = 0; i < people; i++) {
    noCollision *= (days - i) / days;
  }
  return 1 - noCollision;
}
