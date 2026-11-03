import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HN 红书 · 每日早报",
    short_name: "HN红书",
    description: "每天早上 8:48，Hacker News 热门帖子的小红书式中文摘要",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ff2442",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
