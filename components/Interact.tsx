"use client";
import { useState } from "react";
import { HeartIcon } from "./Icons";

export function LikeButton({ score, size = "sm" }: { score: number; size?: "sm" | "md" }) {
  const [liked, setLiked] = useState(false);
  return (
    <button
      type="button"
      aria-label="点赞"
      aria-pressed={liked}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setLiked((v) => !v);
      }}
      className={`flex shrink-0 cursor-pointer items-center gap-1 pl-2 transition-transform duration-150 active:scale-90 ${
        size === "sm" ? "text-[11px]" : "text-[13px]"
      } ${liked ? "text-[#ff2442]" : "text-neutral-500"}`}
    >
      <HeartIcon size={size === "sm" ? 14 : 19} filled={liked} />
      {score + (liked ? 1 : 0)}
    </button>
  );
}

export function CollectButton() {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      aria-label="收藏"
      aria-pressed={on}
      onClick={() => setOn((v) => !v)}
      className={`flex cursor-pointer items-center gap-1 text-[13px] transition-transform duration-150 active:scale-90 ${
        on ? "text-amber-500" : "text-neutral-600"
      }`}
    >
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill={on ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      {on ? "已收藏" : "收藏"}
    </button>
  );
}
