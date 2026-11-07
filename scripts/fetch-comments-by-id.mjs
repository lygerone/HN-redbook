#!/usr/bin/env node
// 按指定 HN 条目 id 抓每篇前 3 条热门评论（清洗成纯文本），供翻译回填
// 用法: node scripts/fetch-comments-by-id.mjs <day.json 路径> <输出路径>
import fs from "node:fs";

const [dayPath, outPath] = process.argv.slice(2);
const API = "https://hacker-news.firebaseio.com/v0";

async function get(path) {
  const r = await fetch(`${API}${path}`, { signal: AbortSignal.timeout(15000) });
  if (!r.ok) throw new Error(`HTTP ${r.status} ${path}`);
  return r.json();
}

function cleanText(html) {
  return (html || "")
    .replace(/<p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 600);
}

async function fetchComment(kid) {
  try {
    const c = await get(`/item/${kid}.json`);
    if (!c || !c.id || c.dead || c.deleted || !c.text) return null;
    return { by: c.by, text: cleanText(c.text) };
  } catch {
    return null;
  }
}

const day = JSON.parse(fs.readFileSync(dayPath, "utf8"));
const targets = day.items.filter((i) => /^\d{6,}$/.test(i.id));
const out = {};
let done = 0;
for (const item of targets) {
  try {
    const s = await get(`/item/${item.id}.json`);
    const kids = (s?.kids || []).slice(0, 5);
    const comments = (await Promise.all(kids.map(fetchComment))).filter(Boolean).slice(0, 3);
    out[item.id] = comments;
  } catch {
    out[item.id] = [];
  }
  done++;
  console.log(`${day.date} ${done}/${targets.length} id=${item.id} comments=${out[item.id].length}`);
}
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log("wrote", outPath);
