// main.js — Entry point
import { initGame } from './game.js';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  initGame(canvas);
  handleResize(canvas);
  window.addEventListener('resize', () => handleResize(canvas));
});

function handleResize(canvas) {
  const W = 400, H = 600;
  const windowW = window.innerWidth;
  const windowH = window.innerHeight;
  const scale = Math.min(windowW / W, windowH / H);
  canvas.style.width = Math.floor(W * scale) + 'px';
  canvas.style.height = Math.floor(H * scale) + 'px';
}
