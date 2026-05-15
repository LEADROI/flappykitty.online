// obstacles.js — Obstacle spawner, rendering, collision
import { CONFIG } from './config.js';

const obstacles = [];
let spawnTimer = 0;

export function resetObstacles() {
  obstacles.length = 0;
  spawnTimer = 0;
}

export function getObstacles() {
  return obstacles;
}

function getGap(score) {
  const shrinks = Math.floor(score / 10);
  return Math.max(CONFIG.OBSTACLE_GAP_MIN, CONFIG.OBSTACLE_GAP - shrinks * CONFIG.OBSTACLE_GAP_SHRINK);
}

function getSpeed(score) {
  const increases = Math.floor(score / 10);
  return Math.min(CONFIG.OBSTACLE_SPEED_MAX, CONFIG.OBSTACLE_SPEED + increases * CONFIG.OBSTACLE_SPEED_INC);
}

export function spawnObstacle(score) {
  const gap = getGap(score);
  const minTop = CONFIG.OBSTACLE_MIN_TOP;
  const maxTop = CONFIG.CANVAS_H - 40 - gap - CONFIG.OBSTACLE_MIN_TOP; // 40 = ground height
  const topH = minTop + Math.random() * (maxTop - minTop);
  
  obstacles.push({
    x: CONFIG.CANVAS_W + 10,
    topH: topH,
    bottomY: topH + gap,
    passed: false,
    speed: getSpeed(score),
    gap: gap,
  });
}

export function updateObstacles(score) {
  const speed = getSpeed(score);
  
  // Spawn logic
  spawnTimer += speed;
  if (spawnTimer >= CONFIG.OBSTACLE_SPACING || obstacles.length === 0) {
    spawnObstacle(score);
    spawnTimer = 0;
  }

  // Move and cull
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= speed;
    if (obstacles[i].x < -CONFIG.OBSTACLE_W - 10) {
      obstacles.splice(i, 1);
    }
  }

  return speed; // return current speed for background sync
}

export function checkCollision(mia) {
  const cx = mia.getCenterX();
  const cy = mia.getCenterY();
  const r = mia.getRadius();

  // Ground collision
  if (cy + r >= CONFIG.CANVAS_H - 40) return true;

  for (const obs of obstacles) {
    // Check if Mia's circle overlaps the obstacle rectangles
    // Top obstacle: rect(obs.x, 0, OBSTACLE_W, obs.topH)
    // Bottom obstacle: rect(obs.x, obs.bottomY, OBSTACLE_W, CANVAS_H - obs.bottomY)
    if (circleRectCollision(cx, cy, r, obs.x, 0, CONFIG.OBSTACLE_W, obs.topH)) return true;
    if (circleRectCollision(cx, cy, r, obs.x, obs.bottomY, CONFIG.OBSTACLE_W, CONFIG.CANVAS_H - obs.bottomY)) return true;
  }
  return false;
}

function circleRectCollision(cx, cy, r, rx, ry, rw, rh) {
  const closestX = Math.max(rx, Math.min(cx, rx + rw));
  const closestY = Math.max(ry, Math.min(cy, ry + rh));
  const dx = cx - closestX;
  const dy = cy - closestY;
  return (dx * dx + dy * dy) < (r * r);
}

export function checkPassed(mia) {
  let scored = 0;
  for (const obs of obstacles) {
    if (!obs.passed && obs.x + CONFIG.OBSTACLE_W < mia.getCenterX()) {
      obs.passed = true;
      scored++;
    }
  }
  return scored;
}

// Draw obstacles as romantic lantern arches (pixel art style)
export function drawObstacles(ctx) {
  const W = CONFIG.OBSTACLE_W;
  const px = 4; // pixel size for blocky look

  for (const obs of obstacles) {
    const x = Math.floor(obs.x);

    // --- Top obstacle: Hanging lantern chain ---
    // Column
    ctx.fillStyle = '#4A235A';
    ctx.fillRect(x, 0, W, obs.topH);
    
    // Border details (pixel art edges)
    ctx.fillStyle = '#6C3483';
    ctx.fillRect(x, 0, px, obs.topH);
    ctx.fillRect(x + W - px, 0, px, obs.topH);
    
    // Bottom cap (ornamental)
    ctx.fillStyle = '#F5B041';
    ctx.fillRect(x - 4, obs.topH - px * 2, W + 8, px * 2);
    ctx.fillRect(x, obs.topH - px * 3, W, px);
    
    // Hanging lantern
    const lanternX = x + W / 2;
    const lanternY = obs.topH - px;
    // Glow
    ctx.fillStyle = 'rgba(245, 176, 65, 0.15)';
    ctx.beginPath();
    ctx.arc(lanternX, lanternY + 4, 18, 0, Math.PI * 2);
    ctx.fill();
    // Lantern body
    ctx.fillStyle = '#F5B041';
    ctx.fillRect(lanternX - 4, lanternY - 2, 8, px);
    ctx.fillStyle = '#F39C12';
    ctx.fillRect(lanternX - 6, lanternY + 2, 12, 8);
    ctx.fillStyle = '#FFF8F0';
    ctx.fillRect(lanternX - 3, lanternY + 4, 6, 4);

    // --- Bottom obstacle: Column with ivy/hearts ---
    const botTop = obs.bottomY;
    const botH = CONFIG.CANVAS_H - botTop;
    
    // Column
    ctx.fillStyle = '#4A235A';
    ctx.fillRect(x, botTop, W, botH);
    
    // Border
    ctx.fillStyle = '#6C3483';
    ctx.fillRect(x, botTop, px, botH);
    ctx.fillRect(x + W - px, botTop, px, botH);
    
    // Top cap
    ctx.fillStyle = '#F5B041';
    ctx.fillRect(x - 4, botTop, W + 8, px * 2);
    ctx.fillRect(x, botTop + px * 2, W, px);

    // Small pixel hearts on column
    ctx.fillStyle = '#F1948A';
    drawObstaclePixelHeart(ctx, x + 8, botTop + 20, 2);
    drawObstaclePixelHeart(ctx, x + W - 16, botTop + 40, 2);
    drawObstaclePixelHeart(ctx, x + 12, botTop + 60, 2);
    
    // Ivy dots
    ctx.fillStyle = '#27AE60';
    for (let iy = botTop + 15; iy < Math.min(botTop + botH, botTop + 100); iy += 12) {
      ctx.fillRect(x + 2, iy, px, px);
      ctx.fillRect(x + W - px - 2, iy + 6, px, px);
    }
  }
}

function drawObstaclePixelHeart(ctx, x, y, s) {
  ctx.fillRect(x, y, s, s);
  ctx.fillRect(x + s * 2, y, s, s);
  ctx.fillRect(x - s, y + s, s * 5, s);
  ctx.fillRect(x, y + s * 2, s * 3, s);
  ctx.fillRect(x + s, y + s * 3, s, s);
}
