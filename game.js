// game.js — Core game loop and scene management
import { CONFIG } from './config.js';
import { t, toggleLang, setLang, getLang } from './i18n.js';
import { saveBest, loadBest, saveLang, loadLang, saveSound, loadSound } from './storage.js';
import { initInput } from './input.js';
import { Mia, preRenderSprites } from './mia.js';
import { resetObstacles, updateObstacles, checkCollision, checkPassed, drawObstacles } from './obstacles.js';
import { initBackground, updateBackground, drawBackground, resetBackground } from './background.js';
import { spawnHearts, updateParticles, drawParticles, clearParticles } from './particles.js';
import {
  drawMenuScreen, drawHUD, drawPauseScreen, drawGameOverScreen,
  drawMilestoneToast, hitTest
} from './ui.js';
import {
  initAudio, setSoundEnabled, isSoundEnabled,
  playFlap, playScore, playHit, playRecord, playMilestone,
  startBGM, stopBGM
} from './audio.js';

// States
const STATE = { MENU: 0, PLAYING: 1, PAUSED: 2, GAME_OVER: 3 };

let canvas, ctx;
let state = STATE.MENU;
let mia;
let score = 0;
let bestScore = 0;
let isNewRecord = false;
let frameCount = 0;
let milestoneText = '';
let milestoneTimer = 0;
let shakeTimer = 0;
let shakeX = 0, shakeY = 0;
let gameOverMessageIndex = 0;
let lastMilestone = 0;

export function initGame(canvasEl) {
  canvas = canvasEl;
  ctx = canvas.getContext('2d');
  canvas.width = CONFIG.CANVAS_W;
  canvas.height = CONFIG.CANVAS_H;

  // Load prefs
  const savedLang = loadLang();
  setLang(savedLang);
  bestScore = loadBest();
  const savedSound = loadSound();
  setSoundEnabled(savedSound);

  // Pre-render pixel art sprites
  preRenderSprites();

  // Init subsystems
  mia = new Mia();
  initBackground(ctx);
  initAudio();

  // Input
  initInput(canvas, handleInput);

  // Start loop
  requestAnimationFrame(loop);
}

function handleInput(x, y) {
  switch (state) {
    case STATE.MENU:
      if (hitTest('langToggle', x, y)) {
        const newLang = toggleLang();
        saveLang(newLang);
        return;
      }
      if (hitTest('soundToggle', x, y)) {
        const newSound = !isSoundEnabled();
        setSoundEnabled(newSound);
        saveSound(newSound);
        if (newSound) startBGM();
        return;
      }
      // Any tap starts the game (besides toggle buttons)
      startGame();
      break;

    case STATE.PLAYING:
      if (hitTest('pauseBtn', x, y)) {
        state = STATE.PAUSED;
        stopBGM();
        return;
      }
      mia.flap();
      playFlap();
      break;

    case STATE.PAUSED:
      if (hitTest('resume', x, y)) {
        state = STATE.PLAYING;
        startBGM();
        return;
      }
      if (hitTest('home', x, y)) {
        goToMenu();
        return;
      }
      break;

    case STATE.GAME_OVER:
      if (hitTest('retry', x, y)) {
        startGame();
        return;
      }
      if (hitTest('home', x, y)) {
        goToMenu();
        return;
      }
      break;
  }
}

function startGame() {
  state = STATE.PLAYING;
  score = 0;
  isNewRecord = false;
  lastMilestone = 0;
  milestoneTimer = 0;
  shakeTimer = 0;
  mia.reset();
  resetObstacles();
  resetBackground();
  clearParticles();
  startBGM();
}

function goToMenu() {
  state = STATE.MENU;
  mia.reset();
  resetObstacles();
  resetBackground();
  clearParticles();
  stopBGM();
}

function gameOver() {
  state = STATE.GAME_OVER;
  mia.hit();
  playHit();
  stopBGM();
  shakeTimer = 12;
  // Pick a random message index ONCE at game over
  gameOverMessageIndex = Math.floor(Math.random() * 5);

  if (score > bestScore) {
    bestScore = score;
    isNewRecord = true;
    saveBest(bestScore);
    playRecord();
  }
}

function checkMilestones() {
  const milestones = [
    { pts: CONFIG.MILESTONE_50, key: 'milestone_50' },
    { pts: CONFIG.MILESTONE_25, key: 'milestone_25' },
    { pts: CONFIG.MILESTONE_10, key: 'milestone_10' },
    { pts: CONFIG.MILESTONE_5, key: 'milestone_5' },
  ];
  for (const m of milestones) {
    if (score >= m.pts && lastMilestone < m.pts) {
      lastMilestone = m.pts;
      milestoneText = t(m.key);
      milestoneTimer = 80;
      spawnHearts(mia.getCenterX(), mia.getCenterY(), 8);
      playMilestone();
      break;
    }
  }
}

function update() {
  frameCount++;

  if (state === STATE.PLAYING) {
    mia.update();
    const speed = updateObstacles(score);
    updateBackground(speed);
    updateParticles();

    // Check scoring
    const scored = checkPassed(mia);
    if (scored > 0) {
      score += scored;
      playScore();
      checkMilestones();
    }

    // Check collision
    if (checkCollision(mia)) {
      gameOver();
    }

    // Milestone timer
    if (milestoneTimer > 0) milestoneTimer--;
  }

  if (state === STATE.GAME_OVER) {
    mia.update();
    updateParticles();
    if (milestoneTimer > 0) milestoneTimer--;
  }

  // Screen shake
  if (shakeTimer > 0) {
    shakeTimer--;
    shakeX = (Math.random() - 0.5) * 6;
    shakeY = (Math.random() - 0.5) * 6;
  } else {
    shakeX = 0;
    shakeY = 0;
  }
}

function render() {
  ctx.save();
  ctx.translate(shakeX, shakeY);

  // Background always draws
  drawBackground(ctx, frameCount);

  if (state === STATE.MENU) {
    drawMenuScreen(ctx, mia, frameCount, bestScore);
    drawParticles(ctx);
  }

  if (state === STATE.PLAYING) {
    drawObstacles(ctx);
    mia.draw(ctx);
    drawParticles(ctx);
    drawHUD(ctx, score, frameCount);
    drawMilestoneToast(ctx, milestoneText, milestoneTimer);
  }

  if (state === STATE.PAUSED) {
    drawObstacles(ctx);
    mia.draw(ctx);
    drawHUD(ctx, score, frameCount);
    drawPauseScreen(ctx);
  }

  if (state === STATE.GAME_OVER) {
    drawObstacles(ctx);
    mia.draw(ctx);
    drawParticles(ctx);
    drawGameOverScreen(ctx, score, bestScore, isNewRecord, frameCount, gameOverMessageIndex);
  }

  ctx.restore();
}

function loop() {
  update();
  render();
  requestAnimationFrame(loop);
}
