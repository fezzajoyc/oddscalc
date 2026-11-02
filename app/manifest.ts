import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Oddscalc — probability calculators",
    short_name: "Oddscalc",
    description:
      "Exact probability calculators for dice, coins, lotteries and birthdays — all in your browser.",
    start_url: "/en",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#059669",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
