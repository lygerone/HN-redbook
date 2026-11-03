import fs from "node:fs";
import path from "node:path";

export interface HnItem {
  id: string;
  title: string;
  url: string;
  hnUrl: string;
  score: number;
  comments: number;
  by?: string;
  note: string;
  cover?: string | null;
}

export interface Highlight {
  text: string;
  from?: string;
  by?: string;
}

export interface DayData {
  date: string;
  mood: string;
  items: HnItem[];
  highlights: Highlight[];
}

const DAYS_DIR = path.join(process.cwd(), "content", "days");

export function getAllDays(): DayData[] {
  if (!fs.existsSync(DAYS_DIR)) return [];
  return fs
    .readdirSync(DAYS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(DAYS_DIR, f), "utf8")) as DayData)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getDay(date: string): DayData | undefined {
  return getAllDays().find((d) => d.date === date);
}

export function getLatestDay(): DayData | undefined {
  return getAllDays()[0];
}

export function formatDateCN(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const weekday = weekdays[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${m}月${d}日 ${weekday}`;
}
