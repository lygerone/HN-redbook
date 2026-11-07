// 纯类型与纯函数（不碰 node:fs），客户端组件也可以安全 import
export interface ItemComment {
  by: string;
  text: string;
}

export interface HnItem {
  id: string;
  title: string;
  titleZh?: string;
  url: string;
  hnUrl: string;
  score: number;
  comments: number;
  by?: string;
  note: string;
  cover?: string | null;
  commentsList?: ItemComment[];
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

export function formatDateCN(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const weekday = weekdays[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${m}月${d}日 ${weekday}`;
}

export function titleOf(item: HnItem): string {
  return item.titleZh?.trim() ? item.titleZh : item.title;
}

// 评论亮点的 from 是英文帖子标题（可能被截断），映射回中文标题
export function zhFromTitle(day: DayData, from?: string): string | undefined {
  if (!from) return undefined;
  const hit = day.items.find((i) => i.title === from || i.title.startsWith(from) || from.startsWith(i.title));
  return hit ? titleOf(hit) : from;
}
