"use client";
import { useCallback, useEffect, useState } from "react";
import type { DayData } from "@/lib/shared";
import { FeedCard } from "./Feed";

const KEY = "hnrb-followed";
const EVENT = "hnrb-followed-changed";

function readFollowed(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

// 关注名单只存本机（作者名数组），同页内多个组件靠自定义事件同步
export function useFollowed() {
  const [followed, setFollowed] = useState<string[]>([]);
  useEffect(() => {
    setFollowed(readFollowed());
    const sync = () => setFollowed(readFollowed());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const toggle = useCallback((author: string) => {
    const cur = readFollowed();
    const next = cur.includes(author) ? cur.filter((a) => a !== author) : [...cur, author];
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return { followed, toggle };
}

export function FollowButton({ author }: { author: string }) {
  const { followed, toggle } = useFollowed();
  const on = followed.includes(author);
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => toggle(author)}
      className={`shrink-0 cursor-pointer rounded-full px-3.5 py-1 text-[12.5px] font-medium transition-colors duration-200 ${
        on ? "bg-neutral-100 text-neutral-500" : "border border-[#ff2442] text-[#ff2442]"
      }`}
    >
      {on ? "已关注" : "关注"}
    </button>
  );
}

// 「关注」页内容：按日期从新到旧，只列关注作者的帖子
export function FollowingFeed({ days }: { days: DayData[] }) {
  const { followed, toggle } = useFollowed();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  if (!ready) return <p className="py-16 text-center text-[13px] text-neutral-400">加载中…</p>;

  if (followed.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="text-[15px] font-medium text-neutral-800">你还没有关注任何作者</p>
        <p className="mt-2 text-[13px] leading-relaxed text-neutral-500">
          打开任意一篇文章，点作者旁边的「关注」
          <br />
          他之后的帖子就会汇集到这里
        </p>
      </div>
    );
  }

  const groups = days
    .map((d) => ({ day: d, items: d.items.filter((i) => i.by && followed.includes(i.by)) }))
    .filter((g) => g.items.length > 0);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 px-1 pb-1 pt-2">
        <span className="text-[12px] text-neutral-400">已关注</span>
        {followed.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => toggle(a)}
            className="cursor-pointer rounded-full bg-[#fff5f6] px-2.5 py-1 text-[12px] text-[#ff2442]"
            aria-label={`取消关注 ${a}`}
          >
            {a} ✕
          </button>
        ))}
      </div>
      {groups.length === 0 ? (
        <p className="px-6 py-16 text-center text-[13px] leading-relaxed text-neutral-500">
          你关注的作者最近还没上榜
          <br />
          等他们发新帖，这里就会出现
        </p>
      ) : (
        groups.map(({ day, items }) => (
          <section key={day.date} className="mt-3">
            <h2 className="px-1 pb-2 text-[13px] font-medium text-neutral-500">{day.date}</h2>
            <div className="columns-2 gap-2 sm:columns-3 lg:columns-4 xl:columns-5">
              {items.map((item) => (
                <FeedCard key={item.id} day={day} item={item} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
