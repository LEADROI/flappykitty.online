// storage.js — localStorage wrapper
const PREFIX = 'fk_';

export function saveBest(score) {
  try {
    localStorage.setItem(PREFIX + 'best', String(score));
  } catch (e) {}
}

export function loadBest() {
  try {
    return parseInt(localStorage.getItem(PREFIX + 'best')) || 0;
  } catch (e) {
    return 0;
  }
}

export function saveLang(lang) {
  try {
    localStorage.setItem(PREFIX + 'lang', lang);
  } catch (e) {}
}

export function loadLang() {
  try {
    return localStorage.getItem(PREFIX + 'lang') || 'ru';
  } catch (e) {
    return 'ru';
  }
}

export function saveSound(on) {
  try {
    localStorage.setItem(PREFIX + 'sound', on ? '1' : '0');
  } catch (e) {}
}

export function loadSound() {
  try {
    const v = localStorage.getItem(PREFIX + 'sound');
    return v === null ? true : v === '1';
  } catch (e) {
    return true;
  }
}
