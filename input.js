// input.js — Unified input handler
import { CONFIG } from './config.js';

let lastInputTime = 0;
let actionCallback = null;
let tapX = 0, tapY = 0;
let hasTap = false;
let scale = 1;
let canvasRect = null;

export function initInput(canvas, callback) {
  actionCallback = callback;

  function updateRect() {
    canvasRect = canvas.getBoundingClientRect();
    scale = CONFIG.CANVAS_W / canvasRect.width;
  }
  updateRect();
  window.addEventListener('resize', updateRect);

  function getLogicalPos(clientX, clientY) {
    return {
      x: (clientX - canvasRect.left) * scale,
      y: (clientY - canvasRect.top) * scale,
    };
  }

  function handleAction(clientX, clientY) {
    const now = Date.now();
    if (now - lastInputTime < CONFIG.INPUT_DEBOUNCE_MS) return;
    lastInputTime = now;
    const pos = getLogicalPos(clientX, clientY);
    tapX = pos.x;
    tapY = pos.y;
    hasTap = true;
    if (actionCallback) actionCallback(pos.x, pos.y);
  }

  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleAction(touch.clientX, touch.clientY);
  }, { passive: false });

  canvas.addEventListener('click', (e) => {
    handleAction(e.clientX, e.clientY);
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      handleAction(CONFIG.CANVAS_W / 2, CONFIG.CANVAS_H / 2);
    }
  });
}

export function getTap() {
  if (hasTap) {
    hasTap = false;
    return { x: tapX, y: tapY };
  }
  return null;
}
