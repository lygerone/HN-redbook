"use client";
import { useEffect, useState } from "react";
import type { Highlight, ItemComment } from "@/lib/shared";
import { useHnLive } from "./Live";

function ZhComments({ id, total, list }: { id: string; total: number; list: ItemComment[] }) {
  const live = useHnLive(id, 0, total);
  return (
    <section className="px-4 pt-4">
      <h2 className="text-[13px] text-neutral-500">评论 · 共 {live.comments} 条</h2>
      <ul className="mt-4 space-y-5">
        {list.map((c, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-bold text-neutral-600">
              {(c.by ?? "H").slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0">
              <div className="text-xs text-neutral-400">{c.by}</div>
              <p className="mt-0.5 whitespace-pre-line text-[14px] leading-relaxed text-neutral-800">{c.text}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[11px] text-neutral-400">仅显示热门评论前 {list.length} 条（中文翻译），全部评论点上方「HN 讨论串」</p>
    </section>
  );
}

// HN 评论原文是带标签的 HTML，转成纯文本展示（<p> 还原成段落）
function htmlToText(html: string): string {
  const s = html
    .replace(/<p>/g, "\n\n")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<[^>]+>/g, "");
  const ta = document.createElement("textarea");
  ta.innerHTML = s;
  return ta.value.trim();
}

function timeAgo(unixSec: number): string {
  const diff = Date.now() / 1000 - unixSec;
  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  return `${Math.floor(diff / 86400)}天前`;
}

type LiveComment = { by: string; text: string; time: number };
type State =
  | { kind: "loading" }
  | { kind: "live"; list: LiveComment[]; total: number }
  | { kind: "fallback" };

// 详情页评论区：优先展示早报数据里自带的中文翻译评论（每篇前 3 条热门评论）
// 没有中文评论时实时拉这篇的英文评论；回填旧数据再退回展示属于这篇的中文亮点
export default function ArticleComments({
  id,
  total,
  commentsList,
  fallback,
}: {
  id: string;
  total: number;
  commentsList?: ItemComment[];
  fallback: Highlight[];
}) {
  if (commentsList && commentsList.length > 0) {
    return <ZhComments id={id} total={total} list={commentsList} />;
  }
  return <LiveComments id={id} fallback={fallback} />;
}

function LiveComments({ id, fallback }: { id: string; fallback: Highlight[] }) {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    if (!/^\d{6,}$/.test(id)) {
      setState({ kind: "fallback" });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const item = await (await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)).json();
        const kids: number[] = Array.isArray(item?.kids) ? item.kids.slice(0, 12) : [];
        const total = typeof item?.descendants === "number" ? item.descendants : kids.length;
        const raw = await Promise.all(
          kids.map((k) =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${k}.json`)
              .then((r) => r.json())
              .catch(() => null),
          ),
        );
        if (cancelled) return;
        const list: LiveComment[] = raw
          .filter((j) => j && j.type === "comment" && !j.deleted && !j.dead && j.text)
          .slice(0, 8)
          .map((j) => ({ by: j.by ?? "HN 网友", text: htmlToText(j.text), time: j.time ?? 0 }));
        setState(list.length > 0 ? { kind: "live", list, total } : { kind: "fallback" });
      } catch {
        if (!cancelled) setState({ kind: "fallback" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state.kind === "live") {
    return (
      <section className="px-4 pt-4">
        <h2 className="text-[13px] text-neutral-500">评论 · 共 {state.total} 条</h2>
        <ul className="mt-4 space-y-5">
          {state.list.map((c, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-bold text-neutral-600">
                {c.by.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0">
                <div className="text-xs text-neutral-400">
                  {c.by}
                  {c.time > 0 && <span> · {timeAgo(c.time)}</span>}
                </div>
                <p className="mt-0.5 whitespace-pre-line text-[14px] leading-relaxed text-neutral-800">{c.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (state.kind === "fallback") {
    if (fallback.length === 0) return null;
    return (
      <section className="px-4 pt-4">
        <h2 className="text-[13px] text-neutral-500">本篇评论亮点 · 共 {fallback.length} 条</h2>
        <ul className="mt-4 space-y-5">
          {fallback.map((h, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-bold text-neutral-600">
                {(h.by ?? "路").slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0">
                <div className="text-xs text-neutral-400">{h.by ?? "HN 网友"}</div>
                <p className="mt-0.5 text-[14px] leading-relaxed text-neutral-800">{h.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="px-4 pt-4">
      <h2 className="text-[13px] text-neutral-500">评论加载中…</h2>
      <div className="mt-4 space-y-5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-2.5">
            <span className="h-9 w-9 shrink-0 rounded-full bg-neutral-100" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-3 w-20 rounded bg-neutral-100" />
              <div className="h-3 w-full rounded bg-neutral-100" />
              <div className="h-3 w-2/3 rounded bg-neutral-100" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
