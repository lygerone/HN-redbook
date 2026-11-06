import fs from "node:fs";
import path from "node:path";
import type { DayData } from "./shared";

export * from "./shared";

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
