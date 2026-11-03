"use client";
import { useState } from "react";

export function LikeButton({ score, size = "sm" }: { score: number; size?: "sm" | "md" }) {
  const [liked, setLiked] = useState(false);
  return (
    <button
      type="button"
      aria-label="点赞"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setLiked((v) => !v);
      }}
      className={`flex shrink-0 items-center gap-0.5 pl-2 ${size === "sm" ? "text-[11px]" : "text-[13px]"} ${
        liked ? "text-[#ff2442]" : "text-neutral-400"
      }`}
    >
      <span className={`${size === "sm" ? "text-[13px]" : "text-lg"} leading-none`}>{liked ? "♥" : "♡"}</span>
      {score + (liked ? 1 : 0)}
    </button>
  );
}

export function FollowButton() {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className={`shrink-0 rounded-full px-3.5 py-1 text-[12.5px] font-medium ${
        on ? "bg-neutral-100 text-neutral-500" : "border border-[#ff2442] text-[#ff2442]"
      }`}
    >
      {on ? "已关注" : "关注"}
    </button>
  );
}
