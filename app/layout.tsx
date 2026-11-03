import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HN 红书 · 每日早报",
  description: "每天早上 8:48，Hacker News 热门帖子的小红书式中文摘要：瀑布流卡片 + 评论区亮点",
  appleWebApp: { capable: true, title: "HN红书", statusBarStyle: "default" },
  icons: { apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = { themeColor: "#ff2442" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-[#f7f7f8] text-neutral-900 antialiased">{children}</body>
    </html>
  );
}
