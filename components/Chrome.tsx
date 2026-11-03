import Link from "next/link";
import { formatDateCN, type DayData } from "@/lib/data";

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-neutral-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="rounded-md bg-[#ff2442] px-1.5 py-0.5 text-sm font-black text-white">HN</span>
          <span className="text-[15px] font-bold">红书早报</span>
        </Link>
        <span className="text-xs text-neutral-400">每天 08:48 更新</span>
      </div>
    </header>
  );
}

export function DateChips({ days, current }: { days: DayData[]; current: string }) {
  return (
    <nav className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-3">
      {days.map((d) => {
        const active = d.date === current;
        return (
          <Link
            key={d.date}
            href={d.date === days[0].date ? "/" : `/day/${d.date}`}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] ${
              active ? "bg-[#ff2442] font-semibold text-white" : "bg-white text-neutral-600"
            }`}
          >
            {d.date === days[0].date ? "最新 · " : ""}
            {formatDateCN(d.date)}
          </Link>
        );
      })}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-4 py-10 text-center text-xs leading-relaxed text-neutral-400">
      数据来自 Hacker News · 中文摘要由 Muse 每日生成
      <br />
      HN 红书 — 把 HN 早报装进口袋
    </footer>
  );
}
