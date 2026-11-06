import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleComments from "@/components/Comments";
import Cover from "@/components/Cover";
import { ChevronLeftIcon } from "@/components/Icons";
import { FollowButton } from "@/components/Interact";
import { DetailBar, LiveCounts } from "@/components/Live";
import { formatDateCN, getAllDays, getDay, titleOf } from "@/lib/data";

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
          className="-ml-1 flex h-10 w-10 items-center justify-center text-neutral-700"
          aria-label="返回"
        >
          <ChevronLeftIcon />
        </Link>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-[13px] font-bold text-white">
          {author.slice(0, 1).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1 truncate text-[14px] font-medium">{author}</span>
        <FollowButton />
      </header>

      <main className="mx-auto max-w-2xl">
        <Cover item={item} variant="detail" />
        <article className="px-4 pt-3">
          <h1 className="text-[17px] font-bold leading-snug">{titleOf(item)}</h1>
          {item.titleZh && <p className="mt-1 text-xs leading-relaxed text-neutral-400">{item.title}</p>}
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
          <p className="mt-4 flex items-center gap-1.5 border-b border-neutral-100 pb-4 text-xs text-neutral-500">
            {formatDateCN(date)} ·
            <LiveCounts id={item.id} score={item.score} comments={item.comments} />
          </p>
        </article>

        <ArticleComments
          id={item.id}
          fallback={day.highlights.filter(
            (h) => h.from && (item.title === h.from || item.title.startsWith(h.from) || h.from.startsWith(item.title)),
          )}
        />
      </main>

      <DetailBar id={item.id} score={item.score} comments={item.comments} />
    </div>
  );
}
