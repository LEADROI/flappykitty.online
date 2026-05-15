// ui.js — UI rendering on canvas
import { CONFIG } from './config.js';
import { t, getLang } from './i18n.js';
import { isSoundEnabled } from './audio.js';

// Button hit areas (logical coords) — set during draw, checked during input
export const buttons = {
  start: null,
  retry: null,
  home: null,
  resume: null,
  langToggle: null,
  soundToggle: null,
  pauseBtn: null,
};

function clearButtons() {
  for (const k in buttons) buttons[k] = null;
}

function setButton(name, x, y, w, h) {
  buttons[name] = { x, y, w, h };
}

export function hitTest(name, tx, ty) {
  const b = buttons[name];
  if (!b) return false;
  return tx >= b.x && tx <= b.x + b.w && ty >= b.y && ty <= b.y + b.h;
}

// Draw rounded rect
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawButton(ctx, text, x, y, w, h, color = CONFIG.COLOR_ROSE) {
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  roundRect(ctx, x + 2, y + 2, w, h, 8);
  ctx.fill();
  // Body
  ctx.fillStyle = color;
  roundRect(ctx, x, y, w, h, 8);
  ctx.fill();
  // Border
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, x, y, w, h, 8);
  ctx.stroke();
  // Text
  ctx.fillStyle = CONFIG.COLOR_WHITE;
  ctx.font = 'bold 16px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + w / 2, y + h / 2 + 1);
}

function drawSmallButton(ctx, text, x, y, w, h, color = 'rgba(255,255,255,0.15)') {
  ctx.fillStyle = color;
  roundRect(ctx, x, y, w, h, 6);
  ctx.fill();
  ctx.fillStyle = CONFIG.COLOR_CREAM;
  ctx.font = '12px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + w / 2, y + h / 2 + 1);
}

// Pixel art heart for decorative purposes
function drawPixelHeart(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, s, s);
  ctx.fillRect(x + s * 2, y, s, s);
  ctx.fillRect(x - s, y + s, s * 5, s);
  ctx.fillRect(x, y + s * 2, s * 3, s);
  ctx.fillRect(x + s, y + s * 3, s, s);
}

// ===================== SCREENS =====================

export function drawMenuScreen(ctx, mia, frameCount, bestScore) {
  clearButtons();
  const W = CONFIG.CANVAS_W;
  const H = CONFIG.CANVAS_H;

  // Semi-transparent overlay
  ctx.fillStyle = 'rgba(58, 28, 94, 0.3)';
  ctx.fillRect(0, 0, W, H);

  // Title shadow
  ctx.font = 'bold 42px Pacifico, cursive';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillText(t('title'), W / 2 + 2, 100 + 2);
  // Title
  ctx.fillStyle = CONFIG.COLOR_CREAM;
  ctx.fillText(t('title'), W / 2, 100);

  // Subtitle hearts
  drawPixelHeart(ctx, W / 2 - 60, 130, 3, CONFIG.COLOR_PINK);
  drawPixelHeart(ctx, W / 2 + 45, 130, 3, CONFIG.COLOR_PINK);

  // Mia menu sprite (bobbing)
  const bobOffset = Math.sin(frameCount * 0.04) * 5;
  mia.drawMenu(ctx, W / 2, 250, bobOffset);

  // Start button
  const btnW = 160, btnH = 48;
  const btnX = W / 2 - btnW / 2, btnY = 360;
  drawButton(ctx, t('btn_start'), btnX, btnY, btnW, btnH);
  setButton('start', btnX, btnY, btnW, btnH);

  // Tap hint (pulsing)
  ctx.font = '14px Nunito, sans-serif';
  ctx.textAlign = 'center';
  const alpha = 0.4 + 0.6 * Math.abs(Math.sin(frameCount * 0.05));
  ctx.globalAlpha = alpha;
  ctx.fillStyle = CONFIG.COLOR_LAVENDER;
  ctx.fillText(t('tip_control'), W / 2, 430);
  ctx.globalAlpha = 1;

  // Best score
  if (bestScore > 0) {
    ctx.fillStyle = CONFIG.COLOR_AMBER;
    ctx.font = 'bold 16px Nunito, sans-serif';
    ctx.fillText(`${t('best_label')}: ${bestScore}`, W / 2, 470);
  }

  // Language toggle (top right)
  const lX = W - 55, lY = 10, lW = 45, lH = 28;
  drawSmallButton(ctx, getLang().toUpperCase(), lX, lY, lW, lH);
  setButton('langToggle', lX, lY, lW, lH);

  // Sound toggle (top left)
  const sX = 10, sY = 10, sW = 28, sH = 28;
  drawSmallButton(ctx, isSoundEnabled() ? '♪' : '✕', sX, sY, sW, sH);
  setButton('soundToggle', sX, sY, sW, sH);
}

export function drawHUD(ctx, score, frameCount) {
  clearButtons();
  const W = CONFIG.CANVAS_W;

  // Score shadow
  ctx.font = 'bold 36px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillText(String(score), W / 2 + 2, 22);
  // Score
  ctx.fillStyle = CONFIG.COLOR_CREAM;
  ctx.fillText(String(score), W / 2, 20);

  // Pause button (top right)
  const pX = W - 42, pY = 10, pW = 32, pH = 32;
  drawSmallButton(ctx, '⏸', pX, pY, pW, pH);
  setButton('pauseBtn', pX, pY, pW, pH);
}

export function drawPauseScreen(ctx) {
  clearButtons();
  const W = CONFIG.CANVAS_W;
  const H = CONFIG.CANVAS_H;

  // Overlay
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, W, H);

  // Title
  ctx.fillStyle = CONFIG.COLOR_CREAM;
  ctx.font = 'bold 32px Pacifico, cursive';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(t('btn_pause'), W / 2, H / 2 - 60);

  // Resume button
  const btnW = 160, btnH = 44;
  drawButton(ctx, t('btn_resume'), W / 2 - btnW / 2, H / 2 - 10, btnW, btnH);
  setButton('resume', W / 2 - btnW / 2, H / 2 - 10, btnW, btnH);

  // Home button
  drawButton(ctx, t('btn_home'), W / 2 - btnW / 2, H / 2 + 50, btnW, btnH, '#6C3483');
  setButton('home', W / 2 - btnW / 2, H / 2 + 50, btnW, btnH);
}

export function drawGameOverScreen(ctx, score, bestScore, isNewRecord, frameCount, messageIndex) {
  clearButtons();
  const W = CONFIG.CANVAS_W;
  const H = CONFIG.CANVAS_H;

  // Overlay
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(0, 0, W, H);

  // Game over title
  ctx.fillStyle = CONFIG.COLOR_CREAM;
  ctx.font = 'bold 30px Pacifico, cursive';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(t('game_over'), W / 2, 140);

  // Score panel background
  ctx.fillStyle = 'rgba(58, 28, 94, 0.7)';
  roundRect(ctx, W / 2 - 100, 170, 200, 120, 12);
  ctx.fill();

  // Score
  ctx.fillStyle = CONFIG.COLOR_LAVENDER;
  ctx.font = '14px Nunito, sans-serif';
  ctx.fillText(t('score_label'), W / 2, 200);
  ctx.fillStyle = CONFIG.COLOR_CREAM;
  ctx.font = 'bold 36px Nunito, sans-serif';
  ctx.fillText(String(score), W / 2, 235);

  // Best
  ctx.fillStyle = CONFIG.COLOR_LAVENDER;
  ctx.font = '14px Nunito, sans-serif';
  ctx.fillText(t('best_label'), W / 2, 265);
  ctx.fillStyle = CONFIG.COLOR_AMBER;
  ctx.font = 'bold 20px Nunito, sans-serif';
  ctx.fillText(String(bestScore), W / 2, 285);

  // New record (pulsing)
  if (isNewRecord) {
    const pulse = 0.8 + 0.2 * Math.sin(frameCount * 0.1);
    ctx.globalAlpha = pulse;
    ctx.fillStyle = CONFIG.COLOR_AMBER;
    ctx.font = 'bold 20px Nunito, sans-serif';
    ctx.fillText(t('new_record'), W / 2, 320);
    ctx.globalAlpha = 1;
  }

  // Nastya message — uses fixed index so it doesn't change every frame
  const messages = t('msg_nastya');
  const idx = (typeof messageIndex === 'number') ? messageIndex % messages.length : 0;
  const msg = messages[idx];
  ctx.fillStyle = CONFIG.COLOR_PINK;
  ctx.font = '15px Nunito, sans-serif';
  ctx.fillText(msg, W / 2, 355);

  // Decorative hearts
  drawPixelHeart(ctx, W / 2 - 80, 375, 2, CONFIG.COLOR_PINK);
  drawPixelHeart(ctx, W / 2 + 68, 375, 2, CONFIG.COLOR_PINK);

  // Retry button
  const btnW = 160, btnH = 44;
  drawButton(ctx, t('btn_retry'), W / 2 - btnW / 2, 400, btnW, btnH);
  setButton('retry', W / 2 - btnW / 2, 400, btnW, btnH);

  // Home button
  drawButton(ctx, t('btn_home'), W / 2 - btnW / 2, 460, btnW, btnH, '#6C3483');
  setButton('home', W / 2 - btnW / 2, 460, btnW, btnH);
}

export function drawMilestoneToast(ctx, text, timer) {
  if (timer <= 0) return;
  const W = CONFIG.CANVAS_W;
  const alpha = Math.min(1, timer / 20);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = CONFIG.COLOR_AMBER;
  ctx.font = 'bold 18px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, W / 2, 80);
  ctx.globalAlpha = 1;
}
