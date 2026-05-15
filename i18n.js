// i18n.js — Localization
const STRINGS = {
  ru: {
    title: 'Flappy Kitty',
    btn_start: 'Начать',
    btn_pause: 'Пауза',
    btn_resume: 'Продолжить',
    btn_retry: 'Ещё раз',
    btn_home: 'Домой',
    btn_sound_on: 'Звук вкл',
    btn_sound_off: 'Звук выкл',
    tip_control: 'Нажимай, чтобы Мия летела!',
    tip_goal: 'Проведи Мию через арки 💛',
    game_over: 'Игра окончена',
    new_record: 'Новый рекорд! 🏆',
    score_label: 'Счёт',
    best_label: 'Лучший',
    tap_to_start: 'Нажми, чтобы начать',
    msg_nastya: [
      'Настя, Мия верит в тебя! 💛',
      'Ты лучше всех, Настюш 🌸',
      'Мия летит к тебе с любовью ✨',
      'Каждый полёт — для тебя 🌙',
      'Ты — её любимый человек 💕',
    ],
    milestone_5: 'Отличное начало!',
    milestone_10: 'Мия тебя любит!',
    milestone_25: 'Ты невероятная, Настя!',
    milestone_50: 'Вау, Настя! 💛',
  },
  en: {
    title: 'Flappy Kitty',
    btn_start: 'Start',
    btn_pause: 'Pause',
    btn_resume: 'Resume',
    btn_retry: 'Retry',
    btn_home: 'Home',
    btn_sound_on: 'Sound On',
    btn_sound_off: 'Sound Off',
    tip_control: 'Tap to make Mia fly!',
    tip_goal: 'Guide Mia through the arches 💛',
    game_over: 'Game Over',
    new_record: 'New Record! 🏆',
    score_label: 'Score',
    best_label: 'Best',
    tap_to_start: 'Tap to start',
    msg_nastya: [
      'Nastya, Mia believes in you! 💛',
      "You're the best, Nastya 🌸",
      'Mia flies to you with love ✨',
      'Every flight is for you 🌙',
      "You're her favorite person 💕",
    ],
    milestone_5: 'Great start!',
    milestone_10: 'Mia loves you!',
    milestone_25: "You're amazing, Nastya!",
    milestone_50: 'Wow, Nastya! 💛',
  },
};

let currentLang = 'ru';

export function setLang(lang) {
  currentLang = lang;
}

export function getLang() {
  return currentLang;
}

export function t(key) {
  return STRINGS[currentLang][key] || STRINGS['en'][key] || key;
}

export function toggleLang() {
  currentLang = currentLang === 'ru' ? 'en' : 'ru';
  return currentLang;
}
