// Generate PWA icons (red rounded square + white HN) into public/icons at prebuild.
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "public", "icons");
fs.mkdirSync(outDir, { recursive: true });

function svg(size, padRatio = 0, radiusRatio = 0.22) {
  const pad = Math.round(size * padRatio);
  const inner = size - pad * 2;
  const r = Math.round(size * radiusRatio);
  const fontSize = Math.round(inner * 0.36);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <rect x="${pad}" y="${pad}" width="${inner}" height="${inner}" rx="${r}" fill="#ff2442"/>
  <text x="50%" y="50%" dy="0.36em" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-weight="bold" font-size="${fontSize}" fill="#ffffff">HN</text>
</svg>`;
}

const jobs = [
  ["icon-192.png", svg(192), 192],
  ["icon-512.png", svg(512), 512],
  ["maskable-512.png", svg(512, 0.1), 512],
  ["apple-touch-icon.png", svg(180, 0, 0), 180],
];
for (const [name, s, size] of jobs) {
  await sharp(Buffer.from(s)).resize(size, size).png().toFile(path.join(outDir, name));
}
console.log("icons generated:", jobs.map((j) => j[0]).join(", "));
