import Link from "next/link";
import Cover from "./Cover";
import { BottomNav, DateChips } from "./Chrome";
import { LiveLike } from "./Live";
import { titleOf, type DayData, type HnItem } from "@/lib/shared";

export function FeedCard({ day, item }: { day: DayData; item: HnItem }) {
  return (
    <Link
      href={`/day/${day.date}/${item.id}`}
      className="mb-2 block break-inside-avoid overflow-hidden rounded-lg bg-white transition-opacity duration-150 active:opacity-90"
    >
      <Cover item={item} />
      <div className="px-2 pb-2 pt-1.5">
        <h3 className="line-clamp-2 text-[13px] font-medium leading-snug text-neutral-900">{titleOf(item)}</h3>
        <div className="mt-1.5 flex items-center justify-between text-[11px] text-neutral-500">
          <span className="flex min-w-0 items-center gap-1">
            <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white">
              {(item.by ?? "H").slice(0, 1).toUpperCase()}
            </span>
            <span className="truncate">{item.by ?? "HN"}</span>
          </span>
          <LiveLike id={item.id} score={item.score} />
        </div>
      </div>
    </Link>
  );
}

export default function Feed({ day, days }: { day: DayData; days: DayData[] }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-3 pb-20">
      <DateChips days={days} current={day.date} />
      {day.mood && (
        <p className="mb-3 mt-1 flex items-start gap-2 rounded-lg bg-[#fff5f6] px-3 py-2 text-[12.5px] leading-relaxed text-neutral-600">
          <span className="shrink-0 rounded bg-[#ff2442] px-1 py-px text-[10px] font-semibold text-white">
            今日观感
          </span>
          <span>{day.mood}</span>
        </p>
      )}
      <div className="columns-2 gap-2 sm:columns-3 lg:columns-4 xl:columns-5">
        {day.items.map((item) => (
          <FeedCard key={item.id} day={day} item={item} />
        ))}
      </div>
      <BottomNav />
    </main>
  );
}
