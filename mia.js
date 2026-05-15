// mia.js — Mia the cat: physics, pixel-art rendering, animation
import { CONFIG } from './config.js';

// Pixel art sprite data for Mia (each sprite is a grid of colors)
// Colors: 0=transparent, 1=dark outline, 2=orange fur, 3=light orange, 4=cream/white, 5=pink, 6=green eyes
const PALETTE = {
  0: null,
  1: '#2D1B0E',   // dark brown outline
  2: '#E8862A',   // orange fur
  3: '#F5B041',   // light orange
  4: '#FFF8F0',   // cream white
  5: '#F1948A',   // pink (nose, blush)
  6: '#58D68D',   // green eyes
  7: '#1A1A1A',   // pupil
  8: '#D35400',   // darker orange
};

// 16x16 pixel grid for Mia idle frame 1
const MIA_IDLE_1 = [
  [0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
  [0,0,0,0,1,2,2,1,1,2,2,1,0,0,0,0],
  [0,0,0,1,2,3,2,2,2,2,3,2,1,0,0,0],
  [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
  [0,0,1,2,4,6,7,2,2,7,6,4,2,1,0,0],
  [0,0,1,2,4,6,7,2,2,7,6,4,2,1,0,0],
  [0,0,1,2,2,2,5,5,5,5,2,2,2,1,0,0],
  [0,0,1,2,2,5,2,4,4,2,5,2,2,1,0,0],
  [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
  [0,0,1,3,1,2,2,2,2,2,2,1,3,1,0,0],
  [0,1,3,3,3,1,2,2,2,2,1,3,3,3,1,0],
  [0,1,3,3,3,1,2,2,2,2,1,3,3,3,1,0],
  [0,0,1,1,1,2,2,2,2,2,2,1,1,1,0,0],
  [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
  [0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// Mia idle frame 2 (wings slightly down)
const MIA_IDLE_2 = [
  [0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
  [0,0,0,0,1,2,2,1,1,2,2,1,0,0,0,0],
  [0,0,0,1,2,3,2,2,2,2,3,2,1,0,0,0],
  [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
  [0,0,1,2,4,6,7,2,2,7,6,4,2,1,0,0],
  [0,0,1,2,4,6,7,2,2,7,6,4,2,1,0,0],
  [0,0,1,2,2,2,5,5,5,5,2,2,2,1,0,0],
  [0,0,1,2,2,5,2,4,4,2,5,2,2,1,0,0],
  [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
  [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
  [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
  [0,1,3,3,1,2,2,2,2,2,2,1,3,3,1,0],
  [0,0,1,3,1,2,2,2,2,2,2,1,3,1,0,0],
  [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
  [0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// Mia flap frame (wings up)
const MIA_FLAP = [
  [0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
  [0,0,0,0,1,2,2,1,1,2,2,1,0,0,0,0],
  [0,0,0,1,2,3,2,2,2,2,3,2,1,0,0,0],
  [0,1,0,1,2,2,2,2,2,2,2,2,1,0,1,0],
  [1,3,1,2,4,6,7,2,2,7,6,4,2,1,3,1],
  [1,3,1,2,4,6,7,2,2,7,6,4,2,1,3,1],
  [0,1,1,2,2,2,5,5,5,5,2,2,2,1,1,0],
  [0,0,1,2,2,5,2,4,4,2,5,2,2,1,0,0],
  [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
  [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
  [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
  [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
  [0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0],
  [0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0],
  [0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// Mia hit frame (X eyes, open mouth)
const MIA_HIT = [
  [0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
  [0,0,0,0,1,2,2,1,1,2,2,1,0,0,0,0],
  [0,0,0,1,2,3,2,2,2,2,3,2,1,0,0,0],
  [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
  [0,0,1,2,1,4,1,2,2,1,4,1,2,1,0,0],
  [0,0,1,2,4,1,4,2,2,4,1,4,2,1,0,0],
  [0,0,1,2,1,4,1,5,5,1,4,1,2,1,0,0],
  [0,0,1,2,2,2,1,4,4,1,2,2,2,1,0,0],
  [0,0,0,1,2,2,1,4,4,1,2,2,1,0,0,0],
  [0,0,0,1,2,2,2,1,1,2,2,2,1,0,0,0],
  [0,0,1,3,1,2,2,2,2,2,2,1,3,1,0,0],
  [0,0,1,3,1,2,2,2,2,2,2,1,3,1,0,0],
  [0,0,0,1,1,2,2,2,2,2,2,1,1,0,0,0],
  [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
  [0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// Menu Mia (bigger, 20x20, sitting)
const MIA_MENU = [
  [0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,1,2,2,1,0,0,1,2,2,1,0,0,0,0,0],
  [0,0,0,0,1,2,3,2,2,1,1,2,2,3,2,1,0,0,0,0],
  [0,0,0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0,0,0],
  [0,0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0,0,0],
  [0,0,0,1,2,4,6,7,2,2,2,2,7,6,4,2,1,0,0,0],
  [0,0,0,1,2,4,6,7,2,2,2,2,7,6,4,2,1,0,0,0],
  [0,0,0,1,2,2,2,2,5,5,5,5,2,2,2,2,1,0,0,0],
  [0,0,0,1,2,2,5,2,2,4,4,2,2,5,2,2,1,0,0,0],
  [0,0,0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0,0,0],
  [0,0,0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0,0,0],
  [0,0,0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0,0,0],
  [0,0,0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0,0,0],
  [0,0,0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0,0,0],
  [0,0,0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0,0,0],
  [0,0,0,0,0,1,1,2,2,2,2,2,2,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,1,2,2,1,1,2,2,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,0],
  [0,0,0,1,1,2,2,8,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
];

// Sprite cache
const spriteCanvasCache = {};

function renderSpriteToCache(name, data, pixelSize) {
  if (spriteCanvasCache[name]) return spriteCanvasCache[name];
  const rows = data.length;
  const cols = data[0].length;
  const c = document.createElement('canvas');
  c.width = cols * pixelSize;
  c.height = rows * pixelSize;
  const cx = c.getContext('2d');
  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < cols; col++) {
      const colorIdx = data[r][col];
      if (colorIdx === 0) continue;
      cx.fillStyle = PALETTE[colorIdx];
      cx.fillRect(col * pixelSize, r * pixelSize, pixelSize, pixelSize);
    }
  }
  spriteCanvasCache[name] = c;
  return c;
}

export function preRenderSprites() {
  renderSpriteToCache('idle1', MIA_IDLE_1, 3);
  renderSpriteToCache('idle2', MIA_IDLE_2, 3);
  renderSpriteToCache('flap', MIA_FLAP, 3);
  renderSpriteToCache('hit', MIA_HIT, 3);
  renderSpriteToCache('menu', MIA_MENU, 5);
}

export class Mia {
  constructor() {
    this.x = CONFIG.MIA_X;
    this.y = CONFIG.CANVAS_H / 2;
    this.vy = 0;
    this.rotation = 0;
    this.frame = 'idle1';
    this.flapTimer = 0;
    this.animTimer = 0;
    this.alive = true;
    this.hitTimer = 0;
  }

  reset() {
    this.x = CONFIG.MIA_X;
    this.y = CONFIG.CANVAS_H / 2;
    this.vy = 0;
    this.rotation = 0;
    this.frame = 'idle1';
    this.flapTimer = 0;
    this.animTimer = 0;
    this.alive = true;
    this.hitTimer = 0;
  }

  flap() {
    if (!this.alive) return;
    this.vy = CONFIG.FLAP_FORCE;
    this.flapTimer = 10;
    this.frame = 'flap';
  }

  hit() {
    this.alive = false;
    this.frame = 'hit';
    this.hitTimer = 20;
    this.vy = -4;
  }

  update() {
    if (this.alive) {
      this.vy += CONFIG.GRAVITY;
      if (this.vy > CONFIG.MAX_FALL_SPEED) this.vy = CONFIG.MAX_FALL_SPEED;
      this.y += this.vy;

      // Rotation
      if (this.vy < 0) {
        this.rotation = CONFIG.MIA_ROTATION_UP * (Math.PI / 180);
      } else {
        const t = Math.min(this.vy / CONFIG.MAX_FALL_SPEED, 1);
        this.rotation = t * CONFIG.MIA_ROTATION_DOWN * (Math.PI / 180);
      }

      // Animation
      this.flapTimer--;
      this.animTimer++;
      if (this.flapTimer > 0) {
        this.frame = 'flap';
      } else {
        this.frame = Math.floor(this.animTimer / 12) % 2 === 0 ? 'idle1' : 'idle2';
      }

      // Ceiling
      if (this.y < 0) {
        this.y = 0;
        this.vy = 0;
      }
    } else {
      // Falling after hit
      this.vy += CONFIG.GRAVITY;
      this.y += this.vy;
      this.rotation += 0.1;
      this.hitTimer--;
    }
  }

  draw(ctx) {
    const sprite = spriteCanvasCache[this.frame];
    if (!sprite) return;
    ctx.save();
    ctx.translate(this.x + CONFIG.MIA_W / 2, this.y + CONFIG.MIA_H / 2);
    ctx.rotate(this.rotation);
    ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
    ctx.restore();
  }

  drawMenu(ctx, x, y, bobOffset) {
    const sprite = spriteCanvasCache['menu'];
    if (!sprite) return;
    ctx.drawImage(sprite, x - sprite.width / 2, y - sprite.height / 2 + bobOffset);
  }

  getCenterX() { return this.x + CONFIG.MIA_W / 2; }
  getCenterY() { return this.y + CONFIG.MIA_H / 2; }
  getRadius() { return CONFIG.MIA_HITBOX_RADIUS; }
}
