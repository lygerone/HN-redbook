// Fetch og:image / twitter:image for each item URL and store into day JSONs.
// Usage: node scripts/enrich-covers.mjs [date ...]  (default: all days, only missing covers)
import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "content", "days");
const only = process.argv.slice(2);
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36";

async function fetchOg(url) {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 7000);
    const res = await fetch(url, { signal: ctl.signal, headers: { "user-agent": UA }, redirect: "follow" });
    clearTimeout(t);
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("text/html")) return null;
    const html = (await res.text()).slice(0, 300000);
    const pick = (re) => { const m = html.match(re); return m ? m[1].replace(/&amp;/g, "&") : null; };
    return (
      pick(/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i) ||
      pick(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
      pick(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
    );
  } catch { return null; }
}

for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith(".json")).sort()) {
  const date = f.replace(".json", "");
  if (only.length && !only.includes(date)) continue;
  const p = path.join(DIR, f);
  const day = JSON.parse(fs.readFileSync(p, "utf8"));
  let got = 0;
  const queue = day.items.filter((i) => !i.cover);
  for (let s = 0; s < queue.length; s += 5) {
    const batch = queue.slice(s, s + 5);
    const results = await Promise.all(batch.map((i) => fetchOg(i.url)));
    batch.forEach((item, idx) => { if (results[idx]) { item.cover = results[idx]; got++; } });
  }
  fs.writeFileSync(p, JSON.stringify(day, null, 2));
  console.log(date, `covers: ${day.items.filter((i) => i.cover).length}/${day.items.length} (+${got})`);
}
