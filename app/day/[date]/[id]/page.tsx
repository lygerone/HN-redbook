import Link from "next/link";
import { notFound } from "next/navigation";
import Cover from "@/components/Cover";
import { Footer } from "@/components/Chrome";
import { formatDateCN, getAllDays, getDay } from "@/lib/data";

export function generateStaticParams() {
  return getAllDays().flatMap((d) => d.items.map((i) => ({ date: d.date, id: i.id })));
}

export default async function ItemPage({ params }: { params: Promise<{ date: string; id: string }> }) {
  const { date, id } = await params;
  const day = getDay(date);
  const item = day?.items.find((i) => i.id === id);
  if (!day || !item) notFound();

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-20 flex h-12 items-center gap-3 border-b border-neutral-100 bg-white/95 px-4 backdrop-blur">
        <Link href={date === getAllDays()[0].date ? "/" : `/day/${date}`} className="text-xl leading-none text-neutral-700">‹</Link>
        <span className="text-sm font-semibold">{formatDateCN(date)} · HN 早报</span>
      </header>

      <main className="mx-auto max-w-2xl pb-10">
        <div className="overflow-hidden">
          <Cover item={item} />
        </div>
        <article className="px-4 pt-4">
          <h1 className="text-xl font-bold leading-snug">{item.title}</h1>
          <div className="mt-3 flex items-center justify-between text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                {(item.by ?? "H").slice(0, 1).toUpperCase()}
              </span>
              {item.by ?? "HN 用户"}
            </span>
            <span>💬 {item.comments} 评论 · <span className="text-[#ff2442]">♥ {item.score}</span></span>
          </div>
          <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-neutral-800">{item.note}</p>
          <div className="mt-6 flex gap-3">
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-full bg-[#ff2442] py-2.5 text-center text-sm font-semibold text-white"
            >
              阅读原文
            </a>
            <a
              href={item.hnUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-full bg-neutral-100 py-2.5 text-center text-sm font-medium text-neutral-700"
            >
              HN 讨论串
            </a>
          </div>
        </article>

        {day.highlights.length > 0 && (
          <section className="mt-8 border-t border-neutral-100 px-4 pt-5">
            <h2 className="text-[15px] font-bold">评论区亮点 · {day.highlights.length}</h2>
            <ul className="mt-4 space-y-5">
              {day.highlights.map((h, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-bold text-neutral-600">
                    {(h.by ?? "路").slice(0, 1).toUpperCase()}
                  </span>
                  <div>
                    <div className="text-xs text-neutral-400">
                      {h.by ?? "HN 网友"}
                      {h.from ? <span> · 出自《{h.from}》</span> : null}
                    </div>
                    <p className="mt-0.5 text-sm leading-relaxed text-neutral-800">{h.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
