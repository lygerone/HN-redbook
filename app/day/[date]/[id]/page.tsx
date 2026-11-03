import Link from "next/link";
import { notFound } from "next/navigation";
import Cover from "@/components/Cover";
import { formatDateCN, getAllDays, getDay } from "@/lib/data";

export function generateStaticParams() {
  return getAllDays().flatMap((d) => d.items.map((i) => ({ date: d.date, id: i.id })));
}

export default async function ItemPage({ params }: { params: Promise<{ date: string; id: string }> }) {
  const { date, id } = await params;
  const day = getDay(date);
  const item = day?.items.find((i) => i.id === id);
  if (!day || !item) notFound();
  const author = item.by ?? "HN 用户";

  return (
    <div className="min-h-screen bg-white pb-16">
      <header className="sticky top-0 z-20 flex h-12 items-center gap-2 border-b border-neutral-100 bg-white/95 px-3 backdrop-blur">
        <Link
          href={date === getAllDays()[0].date ? "/" : `/day/${date}`}
          className="px-1 text-[22px] leading-none text-neutral-700"
          aria-label="返回"
        >
          ‹
        </Link>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-[13px] font-bold text-white">
          {author.slice(0, 1).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1 truncate text-[14px] font-medium">{author}</span>
        <span className="shrink-0 rounded-full border border-[#ff2442] px-3.5 py-1 text-[12.5px] font-medium text-[#ff2442]">
          关注
        </span>
      </header>

      <main className="mx-auto max-w-2xl">
        <Cover item={item} />
        <article className="px-4 pt-3">
          <h1 className="text-[17px] font-bold leading-snug">{item.title}</h1>
          <p className="mt-2.5 whitespace-pre-line text-[15px] leading-relaxed text-neutral-800">{item.note}</p>
          <p className="mt-3 text-[13px] leading-relaxed text-[#4a6a9c]">
            #HackerNews <span className="ml-1">#每日早报</span> <span className="ml-1">#HN热帖</span>
          </p>
          <div className="mt-4 flex gap-2.5">
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-full bg-[#ff2442] py-2 text-center text-[13.5px] font-semibold text-white"
            >
              阅读原文
            </a>
            <a
              href={item.hnUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-full bg-neutral-100 py-2 text-center text-[13.5px] font-medium text-neutral-700"
            >
              HN 讨论串
            </a>
          </div>
          <p className="mt-4 border-b border-neutral-100 pb-4 text-xs text-neutral-400">
            {formatDateCN(date)} · ♥ {item.score} · 💬 {item.comments} 条评论
          </p>
        </article>

        {day.highlights.length > 0 && (
          <section className="px-4 pt-4">
            <h2 className="text-[13px] text-neutral-500">评论区亮点 · 共 {day.highlights.length} 条</h2>
            <ul className="mt-4 space-y-5">
              {day.highlights.map((h, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-bold text-neutral-600">
                    {(h.by ?? "路").slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs text-neutral-400">
                      {h.by ?? "HN 网友"}
                      {h.from ? <span> · 出自《{h.from}》</span> : null}
                    </div>
                    <p className="mt-0.5 text-[14px] leading-relaxed text-neutral-800">{h.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-neutral-100 bg-white">
        <div className="mx-auto flex h-[52px] max-w-2xl items-center gap-4 px-4">
          <span className="flex h-8 flex-1 items-center rounded-full bg-[#f6f6f6] px-3 text-[13px] text-neutral-400">
            说点什么…
          </span>
          <span className="flex items-center gap-1 text-[13px] text-neutral-600">
            <span className="text-lg leading-none">♡</span>
            {item.score}
          </span>
          <span className="flex items-center gap-1 text-[13px] text-neutral-600">
            <span className="text-lg leading-none">☆</span>
            收藏
          </span>
          <span className="flex items-center gap-1 text-[13px] text-neutral-600">
            <span className="text-lg leading-none">💬</span>
            {item.comments}
          </span>
        </div>
      </div>
    </div>
  );
}
