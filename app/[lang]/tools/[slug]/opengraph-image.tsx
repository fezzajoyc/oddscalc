import { ImageResponse } from "next/og";
import { LOCALES, SITE, isCategory, isLocale } from "@/lib/site";
import { ALL_TOOLS, TOOL_BY_SLUG } from "@/tools/registry";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";
export const alt = "Oddscalc";

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => ALL_TOOLS.map((tool) => ({ lang, slug: tool.slug })));
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const tool = TOOL_BY_SLUG.get(slug);
  // OG 图固定英文:视觉资产统一品牌声线,且免去 CJK 字体的运行时拉取
  const c = tool ? tool.copy.en : { name: "Oddscalc", h1: "Oddscalc", tagline: SITE.tagline };
  const categoryName = tool && isCategory(tool.category) ? tool.category.toUpperCase() : "";
  const tagline = c.tagline.length > 110 ? `${c.tagline.slice(0, 107)}…` : c.tagline;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #ffffff 0%, #f5f5f7 60%, #ecf9f3 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* 顶栏:品牌 */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#059669",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="30" height="30" viewBox="0 0 64 64">
              <rect x="16" y="16" width="32" height="32" rx="8" fill="none" stroke="#fff" strokeWidth="3" />
              {[[24,24],[40,24],[32,32],[24,40],[40,40]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="3.4" fill="#fff" />)}
            </svg>
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, color: "#1d1d1f", letterSpacing: -1 }}>
            {SITE.name}
          </div>
        </div>

        {/* 主体:工具名 + 卖点 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: categoryName ? 40 : 0,
              color: "#047857",
              fontWeight: 600,
              display: "flex",
              letterSpacing: 2,
            }}
          >
            {categoryName}
          </div>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              color: "#1d1d1f",
              letterSpacing: -3,
              lineHeight: 1.05,
              display: "flex",
            }}
          >
            {c.h1 ?? c.name}
          </div>
          <div style={{ fontSize: 32, color: "#6e6e73", lineHeight: 1.4, display: "flex" }}>
            {tagline}
          </div>
        </div>

        {/* 底栏:域名 + 卖点 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 26, color: "#6e6e73" }}>{SITE.domain.replace("https://", "")}</div>
          <div
            style={{
              display: "flex",
              padding: "12px 26px",
              borderRadius: 999,
              background: "rgba(26,127,55,0.12)",
              color: "#1a7f37",
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            100% local
          </div>
        </div>
      </div>
    ),
    size,
  );
}
