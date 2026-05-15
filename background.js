// background.js — Parallax background renderer (all procedural, pixel-art style)
import { CONFIG } from './config.js';

let skyGradient = null;
let stars = [];
let cityBuildings = [];
let cloudShapes = [];
let groundOffset = 0;
let cloudOffset = 0;
let cityOffset = 0;

export function initBackground(ctx) {
  // Pre-generate sky gradient
  skyGradient = ctx.createLinearGradient(0, 0, 0, CONFIG.CANVAS_H);
  skyGradient.addColorStop(0, '#FF7E5F');
  skyGradient.addColorStop(0.35, '#FEB47B');
  skyGradient.addColorStop(0.65, '#C9B8E8');
  skyGradient.addColorStop(1, '#7EC8E3');

  // Generate stars
  stars = [];
  for (let i = 0; i < 40; i++) {
    stars.push({
      x: Math.random() * CONFIG.CANVAS_W,
      y: Math.random() * CONFIG.CANVAS_H * 0.45,
      size: Math.random() > 0.7 ? 2 : 1,
      twinkleSpeed: 0.015 + Math.random() * 0.03,
      twinkleOffset: Math.random() * Math.PI * 2,
    });
  }

  // Generate city silhouette buildings
  cityBuildings = [];
  let bx = 0;
  while (bx < CONFIG.CANVAS_W * 2 + 100) {
    const w = 18 + Math.random() * 38;
    const h = 35 + Math.random() * 110;
    // Pre-generate window pattern (baked, no per-frame randomness)
    const windows = [];
    const winSize = 3;
    const winGap = 8;
    for (let wy = 8; wy < h - 8; wy += winGap) {
      for (let wx = 5; wx < w - 5; wx += winGap) {
        if (Math.random() > 0.25) {
          windows.push({
            ox: wx,
            oy: wy,
            color: Math.random() > 0.8 ? '#F1948A' : '#F5B041',
          });
        }
      }
    }
    cityBuildings.push({ x: bx, w, h, windows });
    bx += w + 2 + Math.random() * 8;
  }

  // Generate cloud shapes
  cloudShapes = [];
  for (let i = 0; i < 5; i++) {
    cloudShapes.push({
      x: Math.random() * CONFIG.CANVAS_W * 2,
      y: 40 + Math.random() * 140,
      w: 40 + Math.random() * 55,
      h: 12 + Math.random() * 14,
    });
  }
}

export function updateBackground(speed) {
  cloudOffset += speed * CONFIG.BG_LAYER1_SPEED;
  cityOffset += speed * CONFIG.BG_LAYER2_SPEED;
  groundOffset += speed;
}

export function drawBackground(ctx, frameCount) {
  const W = CONFIG.CANVAS_W;
  const H = CONFIG.CANVAS_H;

  // Layer 0: Sky gradient
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, W, H);

  // Stars with twinkle
  for (const s of stars) {
    const alpha = 0.25 + 0.75 * Math.abs(Math.sin(s.twinkleOffset + frameCount * s.twinkleSpeed));
    ctx.fillStyle = `rgba(255,255,240,${alpha.toFixed(2)})`;
    ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
  }

  // Layer 1: Clouds (parallax, pixel-art style)
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  for (const c of cloudShapes) {
    let cx = c.x - cloudOffset;
    // Wrap around
    const totalW = W * 2;
    cx = ((cx % totalW) + totalW) % totalW - c.w;
    if (cx > W + 10) continue;
    // Pixel cloud: rows of rects
    const px = 4;
    for (let r = 0; r < c.h; r += px) {
      const inset = (r < px || r >= c.h - px) ? px * 2 : 0;
      ctx.fillRect(Math.floor(cx + inset), Math.floor(c.y + r), Math.max(0, c.w - inset * 2), px);
    }
  }

  // Layer 2: City silhouette (parallax)
  const baseY = H - 80;
  const totalCityW = cityBuildings.length > 0 ? cityBuildings[cityBuildings.length - 1].x + cityBuildings[cityBuildings.length - 1].w + 10 : W * 2;
  
  for (const b of cityBuildings) {
    let bx = b.x - cityOffset;
    // Wrap
    bx = ((bx % totalCityW) + totalCityW) % totalCityW - 50;
    if (bx > W + 10 || bx + b.w < -10) continue;

    const drawX = Math.floor(bx);
    const drawY = baseY - b.h;

    // Building body
    ctx.fillStyle = '#2D1B4E';
    ctx.fillRect(drawX, drawY, Math.floor(b.w), b.h);

    // Building edge highlight
    ctx.fillStyle = '#3D2560';
    ctx.fillRect(drawX, drawY, 2, b.h);

    // Windows (pre-baked pattern)
    const winSize = 3;
    for (const win of b.windows) {
      ctx.fillStyle = win.color;
      ctx.fillRect(drawX + win.ox, drawY + win.oy, winSize, winSize);
    }
  }

  // Ground strip
  ctx.fillStyle = '#2D1B4E';
  ctx.fillRect(0, H - 40, W, 40);

  // Ground top line
  ctx.fillStyle = '#F1948A';
  ctx.fillRect(0, H - 40, W, 2);

  // Ground decorative pixel hearts
  const heartSpacing = 32;
  const px = 3;
  ctx.fillStyle = '#3A1C5E';
  for (let i = 0; i < Math.ceil(W / heartSpacing) + 2; i++) {
    const hx = Math.floor(((i * heartSpacing - groundOffset % heartSpacing) + W + heartSpacing) % (W + heartSpacing) - heartSpacing / 2);
    const hy = H - 28;
    // Tiny pixel heart
    ctx.fillRect(hx, hy, px, px);
    ctx.fillRect(hx + px * 2, hy, px, px);
    ctx.fillRect(hx - px, hy + px, px * 5, px);
    ctx.fillRect(hx, hy + px * 2, px * 3, px);
    ctx.fillRect(hx + px, hy + px * 3, px, px);
  }
}

export function resetBackground() {
  groundOffset = 0;
  cloudOffset = 0;
  cityOffset = 0;
}
