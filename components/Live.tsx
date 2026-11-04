"use client";
import { useEffect, useState } from "react";
import { CollectButton, LikeButton } from "./Interact";
import { HeartIcon, MessageIcon } from "./Icons";

// 从 HN 官方 Firebase API 实时拉分数和评论数（早报数据是早上 8:48 的快照）
export function useHnLive(id: string, score: number, comments: number) {
  const [live, setLive] = useState({ score, comments });
  useEffect(() => {
    if (!/^\d{6,}$/.test(id)) return; // 回填的旧数据没有真实 HN id，跳过
    let cancelled = false;
    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      .then((r) => r.json())
      .then((j) => {
        if (cancelled || !j) return;
        setLive({
          score: typeof j.score === "number" ? j.score : score,
          comments: typeof j.descendants === "number" ? j.descendants : comments,
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [id, score, comments]);
  return live;
}

export function LiveLike({ id, score }: { id: string; score: number }) {
  const live = useHnLive(id, score, 0);
  return <LikeButton score={live.score} />;
}

export function LiveCounts({ id, score, comments }: { id: string; score: number; comments: number }) {
  const live = useHnLive(id, score, comments);
  return (
    <>
      <span className="flex items-center gap-1">
        <HeartIcon size={13} /> {live.score}
      </span>
      ·
      <span className="flex items-center gap-1">
        <MessageIcon size={13} /> {live.comments} 条评论
      </span>
    </>
  );
}

export function DetailBar({ id, score, comments }: { id: string; score: number; comments: number }) {
  const live = useHnLive(id, score, comments);
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-neutral-100 bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex h-[52px] max-w-2xl items-center gap-4 px-4">
        <span className="flex h-8 flex-1 items-center rounded-full bg-[#f6f6f6] px-3 text-[13px] text-neutral-500">
          说点什么…
        </span>
        <LikeButton score={live.score} size="md" />
        <CollectButton />
        <span className="flex items-center gap-1 text-[13px] text-neutral-600">
          <MessageIcon size={19} />
          {live.comments}
        </span>
      </div>
    </div>
  );
}
