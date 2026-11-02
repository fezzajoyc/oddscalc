import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { MCP_TOOLS } from "./tools";

/**
 * Oddscalc MCP server(stdio):把站上概率计算器背后的纯函数逻辑
 * 暴露为 AI 可执行工具。人和 AI 用同一份经过测试的实现。
 *
 * 构建后运行:npx oddscalc-mcp(或 node mcp/dist/server.mjs)
 */

export function createServer() {
  const server = new McpServer(
    { name: "oddscalc", version: "1.0.0" },
    {
      instructions:
        "Oddscalc: exact probability calculators. These executable tools run the same tested logic as the website (https://oddscalc.app). All results are exact combinatorics (BigInt binomials, integer DP) shown with formulas — not simulations or estimates. Ranges are chosen so every count stays below 2^53; larger inputs are refused rather than rounded.",
    },
  );

  for (const tool of MCP_TOOLS) {
    server.registerTool(tool.name, {
      title: tool.title,
      description: tool.description,
      inputSchema: tool.schema,
    }, async (args) => {
      try {
        return tool.run(args ?? {});
      } catch (e) {
        return {
          content: [{ type: "text" as const, text: `error: ${(e as Error).message}` }],
          isError: true,
        };
      }
    });
  }
  return server;
}

export async function runStdio() {
  const server = createServer();
  await server.connect(new StdioServerTransport());
  // stdio 模式下保持进程存活;stderr 可写日志(stdout 是协议通道)
  console.error(`oddscalc MCP server: ${MCP_TOOLS.length} tools ready`);
}

if (process.argv[1] && process.argv[1].includes("server")) {
  void runStdio();
}
