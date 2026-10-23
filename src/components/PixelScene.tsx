"use client";

import { useEffect, useRef } from "react";

/**
 * Procedurally painted pixel-art hero: a sunlit garden with classical ruins.
 * Themed for RunwayX — the ruins are "growth columns" rising like a bar chart,
 * and the statue raises a golden coin. Rendered at low-res on a canvas and
 * upscaled with nearest-neighbour for a crisp pixel look.
 */
const W = 256;
const H = 112;

type RGB = [number, number, number];
const hex = (h: string): RGB => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];
const P = (...c: string[]) => c.map(hex);

const SKY = P("#2386cc", "#3a9ddb", "#5cb6e4", "#8fd0ec", "#bfe6f3");
const CLOUD = P("#ffffff", "#f1f7fa", "#d6e7f0", "#b5cfdf");
const LEAF = P("#b5d94a", "#7cbb3c", "#4a9a34", "#2c7430", "#1a5226", "#0e3519");
const LEAF_DARK = P("#3f8a33", "#2a6a2c", "#1b4d24", "#10331a", "#0a2212");
const STONE = P("#fbf7ec", "#e6dfcd", "#c4b9a1", "#958a74", "#615848");
const RUIN = P("#f2e1ae", "#dcc184", "#b89757", "#836636", "#4f3c1f");
const GOLD = P("#fff6c2", "#f6d257", "#d9a227", "#9c6d12");
const PATH = P("#f5dc7a", "#e7bf4e", "#c9982f", "#94681c");
const FLOWER = P("#ffcf5a", "#f59a3a", "#e4622b");

function hash(x: number, y: number) {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
function noise(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const u = (x - xi) ** 2 * (3 - 2 * (x - xi));
  const v = (y - yi) ** 2 * (3 - 2 * (y - yi));
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => v / 16);
const clamp = (t: number) => Math.max(0, Math.min(1, t));
function pick(pal: RGB[], t: number, x: number, y: number) {
  const f = clamp(t) * (pal.length - 1);
  const i = Math.floor(f);
  const step = f - i > BAYER[(y & 3) * 4 + (x & 3)] ? 1 : 0;
  return pal[Math.min(pal.length - 1, i + step)];
}

type Blob = { cx: number; cy: number; r: number; ry?: number; pal?: RGB[]; rough?: number };

function paint(buf: Uint8ClampedArray) {
  const set = (x: number, y: number, c: RGB) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = (y * W + x) * 4;
    buf[i] = c[0]; buf[i + 1] = c[1]; buf[i + 2] = c[2]; buf[i + 3] = 255;
  };
  const each = (fn: (x: number, y: number) => void) => {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) fn(x, y);
  };

  // Sky
  each((x, y) => set(x, y, pick(SKY, y / 78, x, y)));

  // Clouds with dissolving, speckled edges
  const clouds: Blob[] = [
    { cx: 20, cy: 12, r: 9 }, { cx: 34, cy: 8, r: 11 }, { cx: 50, cy: 14, r: 8 },
    { cx: 84, cy: 30, r: 9 }, { cx: 100, cy: 26, r: 12 }, { cx: 116, cy: 31, r: 8 },
    { cx: 156, cy: 34, r: 7 }, { cx: 168, cy: 30, r: 9 }, { cx: 180, cy: 36, r: 6 },
    { cx: 222, cy: 10, r: 8 }, { cx: 236, cy: 14, r: 7 },
  ];
  each((x, y) => {
    let best = 9;
    let top = 0;
    for (const c of clouds) {
      const d = Math.hypot(x - c.cx, (y - c.cy) * 1.5) / c.r;
      if (d < best) { best = d; top = (y - (c.cy - c.r / 1.5)) / (c.r * 1.3); }
    }
    best += (noise(x / 2.5, y / 2.5) - 0.5) * 0.45;
    if (best < 1 && !(best > 0.82 && hash(x, y) > 0.45)) set(x, y, pick(CLOUD, top, x, y));
  });

  // Birds
  [[64, 18], [140, 12], [196, 22], [206, 18], [118, 8]].forEach(([bx, by]) => {
    set(bx, by, [40, 60, 70]); set(bx - 1, by - 1, [40, 60, 70]); set(bx + 1, by - 1, [40, 60, 70]);
  });

  // Distant tree line
  each((x, y) => {
    const top = 56 + noise(x / 7, 3) * 12 + noise(x / 2, 9) * 3;
    if (y > top) set(x, y, pick(LEAF_DARK, 0.35 + (y - top) / 30 + (noise(x / 2, y / 2) - 0.5) * 0.5, x, y));
  });

  const blobs = (list: Blob[]) =>
    each((x, y) => {
      for (const b of list) {
        const ry = b.ry ?? 1;
        const dx = (x - b.cx) / b.r, dy = (y - b.cy) / (b.r * ry);
        const d = Math.hypot(dx, dy) + (noise(x / 2.2, y / 2.2) - 0.5) * (b.rough ?? 0.5);
        if (d < 1) {
          const t = 0.42 + (dx + dy) * 0.28 + (noise(x / 1.6 + 40, y / 1.6) - 0.5) * 0.7 + d * 0.15;
          set(x, y, pick(b.pal ?? LEAF, t, x, y));
        }
      }
    });

  // Back canopy
  blobs([
    { cx: 30, cy: 44, r: 22 }, { cx: 62, cy: 52, r: 20 }, { cx: 92, cy: 56, r: 16 },
    { cx: 112, cy: 50, r: 18 }, { cx: 150, cy: 52, r: 16 }, { cx: 196, cy: 46, r: 20 },
    { cx: 236, cy: 40, r: 22 },
  ]);

  // Left ruined column with capital
  each((x, y) => {
    if (x <= 22 && y >= 22 && y < 104) {
      const flute = (x % 4) / 3;
      set(x, y, pick(RUIN, 0.15 + flute * 0.45 + x / 50 + (noise(x, y / 3) - 0.5) * 0.3, x, y));
    }
    if (x <= 26 && y >= 14 && y < 22) set(x, y, pick(RUIN, (y - 14) / 10 + (x % 3 === 0 ? 0.25 : 0), x, y));
  });

  // Growth columns: a rising bar chart in stone
  const cols = [
    { x: 162, top: 80 }, { x: 172, top: 72 }, { x: 182, top: 64 }, { x: 192, top: 56 },
  ];
  each((x, y) => {
    for (const c of cols) {
      if (x >= c.x && x < c.x + 7 && y >= c.top && y < 102) {
        const t = 0.1 + ((x - c.x) % 3) * 0.18 + (x - c.x) / 14;
        set(x, y, pick(RUIN, t + (noise(x, y / 2) - 0.5) * 0.25, x, y));
        // Ivy creeping up
        if (noise(x / 1.5, y / 1.5 + c.x) > 0.68 && y > c.top + 4) set(x, y, pick(LEAF, 0.5 + hash(x, y) * 0.4, x, y));
      }
      if (x >= c.x - 1 && x < c.x + 8 && y >= c.top - 2 && y < c.top) set(x, y, pick(RUIN, 0.2 + (y - c.top + 2) * 0.3, x, y));
    }
  });
  // Gold coin crowning the tallest column
  each((x, y) => {
    const d = Math.hypot(x - 195.5, y - 50.5);
    if (d < 4.5) set(x, y, d > 3.6 ? GOLD[3] : x === 195 || x === 196 ? GOLD[2] : pick(GOLD, 0.15 + (x - 192 + y - 47) / 14, x, y));
  });

  // Tall cypress trees
  blobs([
    { cx: 214, cy: 52, r: 9, ry: 4.2, rough: 0.35 },
    { cx: 232, cy: 58, r: 8, ry: 4, rough: 0.35 },
    { cx: 248, cy: 54, r: 10, ry: 3.8, rough: 0.35 },
    { cx: 44, cy: 64, r: 9, ry: 2.6, rough: 0.4 },
  ]);

  // Statue: steps, pedestal, figure raising a coin
  const sx = 118;
  each((x, y) => {
    const steps = [
      { y0: 100, y1: 104, w: 18 },
      { y0: 96, y1: 100, w: 14 },
      { y0: 92, y1: 96, w: 10 },
    ];
    for (const s of steps)
      if (y >= s.y0 && y < s.y1 && Math.abs(x - sx) <= s.w)
        set(x, y, pick(STONE, 0.15 + (y - s.y0) * 0.22 + (x > sx + s.w - 3 ? 0.35 : 0), x, y));
    if (y >= 76 && y < 92 && Math.abs(x - sx) <= 6)
      set(x, y, pick(STONE, 0.2 + (x - sx + 6) / 16 + (y === 77 || y === 90 ? 0.4 : 0), x, y));
    // Figure
    const body = Math.hypot((x - sx) / 4.5, (y - 64) / 12);
    const head = Math.hypot(x - sx - 0.5, y - 49);
    const arm = Math.abs((x - sx - 3) * 1.6 + (y - 58)) < 1.4 && x >= sx + 2 && x <= sx + 9 && y >= 44 && y <= 59;
    if (body < 1 || head < 3 || arm) set(x, y, pick(STONE, 0.1 + (x - sx + 4) / 11 + (noise(x, y) - 0.5) * 0.3, x, y));
    const coin = Math.hypot(x - sx - 10, y - 41);
    if (coin < 3.6) set(x, y, coin > 2.8 ? GOLD[3] : pick(GOLD, (x - sx - 8 + y - 39) / 8, x, y));
  });
  // Coin glints
  [[sx + 14, 37], [sx + 6, 36], [sx + 15, 44], [199, 45], [190, 46]].forEach(([gx, gy]) => set(gx, gy, GOLD[0]));

  // Ground path
  each((x, y) => {
    if (y >= 101) set(x, y, pick(PATH, (y - 101) / 14 + (noise(x / 3, y) - 0.5) * 0.6, x, y));
  });

  // Foreground shrubs with flowers
  const shrubs: Blob[] = [
    { cx: 8, cy: 104, r: 14 }, { cx: 40, cy: 106, r: 12 }, { cx: 70, cy: 104, r: 9 },
    { cx: 92, cy: 108, r: 8 }, { cx: 150, cy: 108, r: 9 }, { cx: 178, cy: 106, r: 10 },
    { cx: 212, cy: 104, r: 13 }, { cx: 246, cy: 104, r: 14 },
  ];
  blobs(shrubs);
  each((x, y) => {
    if (y < 92) return;
    for (const b of shrubs) {
      if (Math.hypot(x - b.cx, y - b.cy) < b.r * 0.95 && hash(x * 3, y * 7) > 0.9)
        set(x, y, FLOWER[Math.floor(hash(x, y * 3) * 3)]);
    }
  });
}

export default function PixelScene({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    const img = ctx.createImageData(W, H);
    paint(img.data);
    ctx.putImageData(img, 0, 0);
  }, []);

  return (
    <canvas
      ref={ref}
      width={W}
      height={H}
      role="img"
      aria-label="Pixel-art garden with a statue raising a golden coin beside stone columns rising like a growth chart"
      className={className}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
