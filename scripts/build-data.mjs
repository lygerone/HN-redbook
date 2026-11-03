// Parse archived digest markdown files into content/days/*.json
// Usage: node scripts/build-data.mjs [srcDir] [outDir]
import fs from "node:fs";
import path from "node:path";

const SRC = process.argv[2] ?? "/home/hatch/workspace/goals/hacker-news-top/hidden_files";
const OUT = process.argv[3] ?? path.join(process.cwd(), "content", "days");
fs.mkdirSync(OUT, { recursive: true });

const clean = (s) =>
  s.replace(/\*\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/`([^`]+)`/g, "$1").trim();

function parseHighlights(tail) {
  if (!tail) return [];
  const bullets = tail.replace(/\*\*/g, "").split(/\n\s*-\s+/).slice(1);
  return bullets
    .map((b) => {
      let text = b.replace(/\s+/g, " ").trim();
      if (!text || text.startsWith("---") || text.length < 8) return null;
      let from, by;
      const fromM = text.match(/出自《([^》]+)》/);
      if (fromM) from = fromM[1];
      const leadM = text.match(/^([A-Za-z0-9_\-]+)\s*[（(]出自\s*([^）)]+?)(?:帖)?[）)]/);
      if (leadM) { by = leadM[1]; if (!from) from = leadM[2]; }
      const byM =
        text.match(/评论者\s*[：:]?\s*([A-Za-z0-9_\-]+)/) ||
        text.match(/出自《[^》]+》[：:，,]?\s*([A-Za-z0-9_\-]+)/) ||
        text.match(/^\s*([A-Za-z0-9_\-]+)\s*[（(]/);
      if (byM) by = byM[1];
      text = text
        .replace(/^[A-Za-z0-9_\-]+\s*[（(]出自\s*[^）)]+[）)][：:]?\s*/, "")
        .replace(/^出自《[^》]+》[：:，,]?\s*/, "")
        .replace(/^评论者\s*[A-Za-z0-9_\-]+[：:]\s*/, "")
        .replace(/^出自[^，：:]+[，：:]\s*/, "");
      return { text, ...(from ? { from } : {}), ...(by ? { by } : {}) };
    })
    .filter(Boolean);
}

function parseDigest(md, date) {
  const moodM = md.match(/观感[:：]\s*\**\s*([^\n]+)/);
  let mood = moodM ? clean(moodM[1]).replace(/\*+$/, "") : "";
  if (!mood) {
    const para = md.split("\n").map((l) => l.trim()).find((l) => l.startsWith("今天") && l.length > 10 && !l.includes("分 ·"));
    if (para) mood = clean(para);
  }
  const [head, ...rest] = md.split(/评论区亮点/);
  const highlights = parseHighlights(rest.join("评论区亮点"));

  // split head into numbered chunks
  const chunks = head.split(/\n(?=\d+\.\s)/);
  const items = [];
  for (const chunk of chunks) {
    if (!/^\d+\.\s/.test(chunk.trim())) continue;
    const body = chunk.replace(/^\s*\d+\.\s*/, "");
    const urlM = body.match(/https?:\/\/[^\s)）」]+/);
    if (!urlM) continue;
    const url = urlM[0].replace(/[.,，。]+$/, "");
    const heatM = body.match(/(\d+)\s*分\s*·\s*(\d+)\s*评论/);
    const byM = body.match(/\bby\s+([A-Za-z0-9_\-]+)/);
    // title = first line up to url or heat or em dash
    let firstLine = body.split("\n")[0];
    let title = clean(firstLine.split(url)[0].replace(/\s*[—–-]{1,2}\s*$/, ""));
    title = title.replace(/\s*·\s*\d+\s*分\s*·\s*\d+\s*评论.*$/, "").replace(/\s*[·|]\s*$/, "").trim();
    if (!title) continue;
    // note = rest of chunk minus title/url/heat/by tokens
    let note = body
      .replace(firstLine, " ")
      .replace(url, " ")
      .replace(/\d+\s*分\s*·\s*\d+\s*评论/g, " ")
      .replace(/\bby\s+[A-Za-z0-9_\-]+/g, " ")
      .replace(/点评[:：]/g, " ")
      .replace(/^[\s\-—·。]+/, "");
    note = clean(note.replace(/\s+/g, " "));
    // if note empty, try inline text after heat on the title line (10-12 format)
    if (note.length < 4) {
      const inline = clean(firstLine.replace(title, "").replace(url, "").replace(/\d+\s*分\s*·\s*\d+\s*评论/g, "").replace(/^\s*[—–·.。]\s*/, ""));
      note = inline;
    }
    items.push({
      id: String(items.length + 1),
      title,
      url,
      hnUrl: `https://hn.algolia.com/?q=${encodeURIComponent(title)}`,
      score: heatM ? Number(heatM[1]) : 0,
      comments: heatM ? Number(heatM[2]) : 0,
      ...(byM ? { by: byM[1] } : {}),
      note,
      cover: null,
    });
  }
  return { date, mood, items, highlights };
}

for (const f of fs.readdirSync(SRC)) {
  const m = f.match(/^digest-(\d{4}-\d{2}-\d{2})\.md$/);
  if (!m) continue;
  const date = m[1];
  const out = path.join(OUT, date + ".json");
  if (fs.existsSync(out)) { console.log("skip (exists)", date); continue; }
  const day = parseDigest(fs.readFileSync(path.join(SRC, f), "utf8"), date);
  fs.writeFileSync(out, JSON.stringify(day, null, 2));
  console.log(date, "items:", day.items.length, "highlights:", day.highlights.length, "mood:", day.mood.slice(0, 30));
}
