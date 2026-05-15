// audio.js — Audio manager (generates all sounds programmatically)
let audioCtx = null;
let soundEnabled = true;
let bgmPlaying = false;
let bgmOsc = null;
let bgmGain = null;

function ensureCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setSoundEnabled(on) {
  soundEnabled = on;
  if (!on) stopBGM();
}

export function isSoundEnabled() {
  return soundEnabled;
}

function playTone(freq, duration, type = 'sine', vol = 0.15) {
  if (!soundEnabled) return;
  const ctx = ensureCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

export function playFlap() {
  playTone(580, 0.08, 'sine', 0.12);
  setTimeout(() => playTone(720, 0.06, 'sine', 0.08), 30);
}

export function playScore() {
  playTone(880, 0.1, 'sine', 0.15);
  setTimeout(() => playTone(1100, 0.12, 'sine', 0.12), 60);
}

export function playHit() {
  playTone(180, 0.25, 'sawtooth', 0.12);
  playTone(120, 0.3, 'square', 0.06);
}

export function playRecord() {
  const notes = [660, 880, 1100, 1320];
  notes.forEach((f, i) => {
    setTimeout(() => playTone(f, 0.2, 'sine', 0.12), i * 100);
  });
}

export function playMilestone() {
  playTone(700, 0.15, 'sine', 0.1);
  setTimeout(() => playTone(900, 0.15, 'sine', 0.1), 80);
  setTimeout(() => playTone(1100, 0.2, 'sine', 0.12), 160);
}

// Simple ambient BGM — soft arpeggiated tones
let bgmInterval = null;

export function startBGM() {
  if (!soundEnabled || bgmPlaying) return;
  bgmPlaying = true;
  const notes = [330, 392, 440, 494, 523, 494, 440, 392];
  let idx = 0;
  bgmInterval = setInterval(() => {
    if (!soundEnabled) { stopBGM(); return; }
    playTone(notes[idx % notes.length], 0.35, 'sine', 0.04);
    playTone(notes[idx % notes.length] / 2, 0.4, 'triangle', 0.025);
    idx++;
  }, 450);
}

export function stopBGM() {
  bgmPlaying = false;
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
}

export function initAudio() {
  // Will be initialized on first user gesture
}
