// particles.js — Lightweight heart particle system
import { CONFIG } from './config.js';

const particles = [];

export function spawnHearts(x, y, count = 6) {
  for (let i = 0; i < count && particles.length < CONFIG.MAX_PARTICLES; i++) {
    particles.push({
      x: x + (Math.random() - 0.5) * 30,
      y: y + (Math.random() - 0.5) * 20,
      vx: (Math.random() - 0.5) * 2,
      vy: -(Math.random() * 2 + 1),
      size: 8 + Math.random() * 8,
      alpha: 1,
      rotation: Math.random() * Math.PI * 2,
      color: Math.random() > 0.5 ? CONFIG.COLOR_PINK : CONFIG.COLOR_AMBER,
    });
  }
}

export function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy -= 0.01; // float up
    p.alpha -= 0.015;
    p.rotation += 0.03;
    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }
}

export function drawParticles(ctx) {
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    drawHeart(ctx, 0, 0, p.size, p.color);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

function drawHeart(ctx, x, y, size, color) {
  const s = size / 2;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.3);
  ctx.bezierCurveTo(x, y - s * 0.5, x - s, y - s * 0.5, x - s, y + s * 0.1);
  ctx.bezierCurveTo(x - s, y + s * 0.6, x, y + s, x, y + s);
  ctx.bezierCurveTo(x, y + s, x + s, y + s * 0.6, x + s, y + s * 0.1);
  ctx.bezierCurveTo(x + s, y - s * 0.5, x, y - s * 0.5, x, y + s * 0.3);
  ctx.fill();
}

export function clearParticles() {
  particles.length = 0;
}
