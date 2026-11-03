"use client";
import { useState } from "react";
import type { HnItem } from "@/lib/data";

const PALETTES: [string, string][] = [
  ["#ff5f6d", "#ffc371"],
  ["#ff2442", "#ff7a59"],
  ["#7b4397", "#dc2430"],
  ["#11998e", "#38ef7d"],
  ["#396afc", "#2948ff"],
  ["#f7971e", "#ffd200"],
  ["#834d9b", "#d04ed6"],
  ["#0f2027", "#2c5364"],
];

function paletteFor(seed: string): [string, string] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTES[h % PALETTES.length];
}

// 小红书式文字笔记封面：渐变底 + 中文点评做正文，不重复标题
export function TextCover({ item }: { item: HnItem }) {
  const [from, to] = paletteFor(item.title);
  const text = item.note?.trim() ? item.note : item.title;
  return (
    <div
      className="flex aspect-[3/4] w-full flex-col p-3.5"
      style={{ background: `linear-gradient(160deg, ${from}, ${to})` }}
    >
      <span className="self-start rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-medium text-white">
        文字笔记
      </span>
      <p className="mt-3 line-clamp-[9] text-[15px] font-bold leading-relaxed text-white drop-shadow-sm">
        {text}
      </p>
      <span className="mt-auto text-[10px] text-white/70">HN红书 · 每日早报</span>
    </div>
  );
}

export default function Cover({ item }: { item: HnItem }) {
  const [failed, setFailed] = useState(false);
  if (!item.cover || failed) return <TextCover item={item} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.cover}
      alt={item.title}
      loading="lazy"
      onError={() => setFailed(true)}
      className="aspect-[3/4] w-full object-cover"
    />
  );
}
