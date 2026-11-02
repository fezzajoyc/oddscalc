import { describe, expect, it } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "@/mcp/server";
import { MCP_TOOLS } from "@/mcp/tools";

async function connect() {
  const server = createServer();
  const client = new Client({ name: "test", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return client;
}

const textOf = (r: { content: { type: string; text: string }[] }) => r.content[0].text;

describe("oddscalc MCP server", () => {
  it("exposes exactly the four probability tools", async () => {
    const client = await connect();
    const { tools } = await client.listTools();
    expect(tools.length).toBe(MCP_TOOLS.length);
    const names = new Set(tools.map((t) => t.name));
    for (const expected of ["dice_probability", "coin_flip_stats", "lottery_odds", "birthday_paradox"]) {
      expect(names.has(expected), expected).toBe(true);
    }
    await client.close();
  });

  it("dice_probability: 2d6 has 36 outcomes, sum 7 is 6/36, sum 2 is 1/36", async () => {
    const client = await connect();
    const r = await client.callTool({ name: "dice_probability", arguments: { dice: 2, sides: 6, target_sum: 7 } });
    const parsed = JSON.parse(textOf(r as never));
    expect(parsed.notation).toBe("2d6");
    expect(parsed.total_outcomes).toBe(36);
    expect(parsed.expected_sum).toBe(7);
    expect(parsed.distribution.length).toBe(11);
    const seven = parsed.distribution.find((d: { sum: number }) => d.sum === 7);
    const two = parsed.distribution.find((d: { sum: number }) => d.sum === 2);
    expect(seven.ways).toBe(6);
    expect(seven.fraction).toBe("6/36");
    expect(two.ways).toBe(1);
    expect(parsed.target.p_sum_equals_k).toBeCloseTo(1 / 6, 10);
    expect(parsed.target.p_sum_at_least_k).toBeCloseTo(21 / 36, 10);
    expect(parsed.target.p_sum_at_most_k).toBeCloseTo(21 / 36, 10);
    await client.close();
  });

  it("dice_probability: distribution sums to 1 and rejects impossible exact counting", async () => {
    const client = await connect();
    const r = await client.callTool({ name: "dice_probability", arguments: { dice: 3, sides: 6 } });
    const parsed = JSON.parse(textOf(r as never));
    const total = parsed.distribution.reduce((a: number, d: { ways: number }) => a + d.ways, 0);
    expect(total).toBe(216);
    // 逻辑层:sides^count > 2^53 → isError,不 throw
    const bad = await client.callTool({ name: "dice_probability", arguments: { dice: 30, sides: 6 } });
    expect((bad as any).isError).toBe(true);
    expect(textOf(bad as never)).toContain("2^53");
    // schema 层:非整数骰子数被 zod 拒绝 → isError(不 throw)
    const schemaBad = await client.callTool({ name: "dice_probability", arguments: { dice: 2.5, sides: 6 } });
    expect((schemaBad as any).isError).toBe(true);
    expect(textOf(schemaBad as never)).toContain("-32602");
    // 逻辑层:target 超出可达和
    const badTarget = await client.callTool({ name: "dice_probability", arguments: { dice: 2, sides: 6, target_sum: 13 } });
    expect((badTarget as any).isError).toBe(true);
    await client.close();
  });

  it("coin_flip_stats: 3 flips 2 heads is exactly 3/8, at least 4/8, at most 7/8", async () => {
    const client = await connect();
    const r = await client.callTool({ name: "coin_flip_stats", arguments: { flips: 3, heads: 2 } });
    const parsed = JSON.parse(textOf(r as never));
    expect(parsed.total_outcomes).toBe(8);
    expect(parsed.p_exactly.fraction).toBe("3/8");
    expect(parsed.p_exactly.decimal).toBeCloseTo(0.375, 12);
    expect(parsed.p_at_least.decimal).toBeCloseTo(0.5, 12);
    expect(parsed.p_at_most.decimal).toBeCloseTo(0.875, 12);
    await client.close();
  });

  it("coin_flip_stats: rejects heads > flips at the logic layer", async () => {
    const client = await connect();
    const bad = await client.callTool({ name: "coin_flip_stats", arguments: { flips: 3, heads: 5 } });
    expect((bad as any).isError).toBe(true);
    expect(textOf(bad as never)).toContain("cannot exceed");
    await client.close();
  });

  it("lottery_odds: 6 from 49 jackpot is 1 in 13,983,816 and match 3 is 1 in 57", async () => {
    const client = await connect();
    const r = await client.callTool({ name: "lottery_odds", arguments: { pool: 49, picks: 6 } });
    const parsed = JSON.parse(textOf(r as never));
    expect(parsed.total_tickets).toBe(13983816);
    expect(parsed.jackpot.one_in).toBe(13983816);
    expect(parsed.jackpot.probability).toBeCloseTo(1 / 13983816, 15);
    const m3 = parsed.tiers.find((t: { match: number }) => t.match === 3);
    expect(m3.ways).toBe(246820);
    expect(m3.one_in).toBe(57);
    const m6 = parsed.tiers.find((t: { match: number }) => t.match === 6);
    expect(m6.ways).toBe(1);
    const sum = parsed.tiers.reduce((a: number, t: { probability: number }) => a + t.probability, 0);
    expect(sum).toBeCloseTo(1, 10);
    await client.close();
  });

  it("lottery_odds: min_match filters tiers and picks > pool is a logic error", async () => {
    const client = await connect();
    const r = await client.callTool({ name: "lottery_odds", arguments: { pool: 49, picks: 6, min_match: 5 } });
    const parsed = JSON.parse(textOf(r as never));
    expect(parsed.tiers.length).toBe(2);
    expect(parsed.tiers.map((t: { match: number }) => t.match).sort()).toEqual([5, 6]);
    const bad = await client.callTool({ name: "lottery_odds", arguments: { pool: 3, picks: 7 } });
    expect((bad as any).isError).toBe(true);
    expect(textOf(bad as never)).toContain("cannot exceed");
    await client.close();
  });

  it("birthday_paradox: 23 people ≈ 50.73%, 2 people = 1/365, 366+ people certain", async () => {
    const client = await connect();
    const r = await client.callTool({ name: "birthday_paradox", arguments: { people: 23 } });
    const parsed = JSON.parse(textOf(r as never));
    expect(parsed.days).toBe(365);
    expect(parsed.probability).toBeCloseTo(0.5072972343, 9);
    expect(parsed.percent).toBeCloseTo(50.72972343, 6);
    expect(parsed.fifty_percent_first_at).toBe(23);
    const two = JSON.parse(textOf(await client.callTool({ name: "birthday_paradox", arguments: { people: 2 } }) as never));
    expect(two.probability).toBeCloseTo(1 / 365, 14);
    const certain = JSON.parse(textOf(await client.callTool({ name: "birthday_paradox", arguments: { people: 400 } }) as never));
    expect(certain.probability).toBe(1);
    expect(certain.certainty_by_pigeonhole).toBe(true);
    await client.close();
  });

  it("birthday_paradox: schema layer rejects negative people", async () => {
    const client = await connect();
    const schemaBad = await client.callTool({ name: "birthday_paradox", arguments: { people: -5 } });
    expect((schemaBad as any).isError).toBe(true);
    expect(textOf(schemaBad as never)).toContain("-32602");
    await client.close();
  });
});
