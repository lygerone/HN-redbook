import Link from "next/link";
import { formatDateCN, type DayData } from "@/lib/data";

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 bg-white">
      <div className="mx-auto flex h-11 max-w-6xl items-center gap-3 px-3">
        <Link href="/" className="shrink-0 text-[17px] font-black tracking-tight text-[#ff2442]">
          HN红书
        </Link>
        <div className="flex h-8 flex-1 items-center gap-1.5 rounded-full bg-[#f6f6f6] px-3 text-[13px] text-neutral-400">
          <span aria-hidden>🔍</span>
          <span className="truncate">搜你感兴趣的 HN 热帖</span>
        </div>
        <span className="shrink-0 text-lg leading-none text-neutral-600" aria-hidden>
          ☰
        </span>
      </div>
    </header>
  );
}

export function DateChips({ days, current }: { days: DayData[]; current: string }) {
  return (
    <nav className="no-scrollbar -mx-3 flex items-end gap-5 overflow-x-auto bg-white px-4">
      {days.map((d) => {
        const active = d.date === current;
        return (
          <Link
            key={d.date}
            href={d.date === days[0].date ? "/" : `/day/${d.date}`}
            className={`relative shrink-0 pb-2 pt-1 text-[14px] ${
              active ? "font-bold text-neutral-900" : "text-neutral-500"
            }`}
          >
            {d.date === days[0].date ? "最新" : formatDateCN(d.date)}
            {active && <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-[#ff2442]" />}
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
      HN红书 — 把 HN 早报装进口袋
    </footer>
  );
}
