# HN 红书 · 每日早报

把每天的 Hacker News 中文早报做成小红书式 PWA：双列瀑布流卡片（原文 og 封面图，没有就自动生成渐变文字卡）、点开看点评和评论区亮点。

- 线上：Vercel 部署，`content/days/*.json` 有新文件 push 后自动重新部署
- 数据：每日 08:48 由 Muse 的 HN 早报任务生成当天 JSON 并 push 进本仓库
- 技术栈：Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + Serwist (PWA)，全静态生成，无数据库

## 本地开发

```bash
npm install
npm run dev
```

## 数据格式

`content/days/YYYY-MM-DD.json`：

```json
{
  "date": "2026-11-03",
  "mood": "今日整体观感",
  "items": [{ "id": "50341174", "title": "英文原标题", "url": "原文链接", "hnUrl": "HN 讨论链接",
              "score": 1840, "comments": 577, "by": "作者", "note": "一句中文点评", "cover": "og 图片或 null" }],
  "highlights": [{ "by": "评论者", "from": "出自哪篇", "text": "评论转述/点评" }]
}
```

历史数据由 `scripts/build-data.mjs`（解析早报存档）+ `scripts/enrich-covers.mjs`（抓 og 封面）生成。
图标由 `scripts/gen-icons.mjs` 在 build 前自动生成。
