import Link from "next/link";
import Cover from "./Cover";
import { DateChips } from "./Chrome";
import { formatDateCN, type DayData, type HnItem } from "@/lib/data";

function FeedCard({ day, item }: { day: DayData; item: HnItem }) {
  return (
    <Link
      href={`/day/${day.date}/${item.id}`}
      className="mb-3 block break-inside-avoid overflow-hidden rounded-xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
    >
      <Cover item={item} />
      <div className="p-2.5">
        <h3 className="line-clamp-2 text-[13.5px] font-medium leading-snug text-neutral-900">{item.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-500">{item.note}</p>
        <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400">
          <span className="flex items-center gap-1">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white">
              {(item.by ?? "H").slice(0, 1).toUpperCase()}
            </span>
            <span className="max-w-[90px] truncate">{item.by ?? "HN"}</span>
          </span>
          <span className="flex items-center gap-2">
            <span>💬 {item.comments}</span>
            <span className="text-[#ff2442]">♥ {item.score}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Feed({ day, days }: { day: DayData; days: DayData[] }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-4">
      <DateChips days={days} current={day.date} />
      <section className="mb-4 rounded-2xl bg-gradient-to-br from-[#ff2442] to-[#ff7a59] p-4 text-white">
        <div className="text-xs text-white/80">{formatDateCN(day.date)} · {day.items.length} 条精选</div>
        <p className="mt-1.5 text-[15px] font-medium leading-relaxed">{day.mood}</p>
      </section>
      <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 xl:columns-5">
        {day.items.map((item) => (
          <FeedCard key={item.id} day={day} item={item} />
        ))}
      </div>
    </main>
  );
}
