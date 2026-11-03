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

export function TextCover({ item, tall = false }: { item: HnItem; tall?: boolean }) {
  const [from, to] = paletteFor(item.title);
  return (
    <div
      className={`flex w-full flex-col justify-between p-3 ${tall ? "aspect-[4/5]" : "aspect-[3/4]"}`}
      style={{ background: `linear-gradient(150deg, ${from}, ${to})` }}
    >
      <span className="text-[10px] font-bold tracking-widest text-white/80">HACKER NEWS</span>
      <span className="line-clamp-5 text-[15px] font-bold leading-snug text-white drop-shadow-sm">
        {item.title}
      </span>
      <span className="text-[10px] text-white/70">HN 红书 · 每日早报</span>
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
      className="w-full object-cover"
    />
  );
}
