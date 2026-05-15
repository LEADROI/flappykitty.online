// config.js — All tunable constants
export const CONFIG = {
  // Logical canvas size
  CANVAS_W: 400,
  CANVAS_H: 600,

  // Physics
  GRAVITY: 0.45,
  FLAP_FORCE: -7.5,
  MAX_FALL_SPEED: 10,
  MIA_ROTATION_UP: -25, // degrees on flap
  MIA_ROTATION_DOWN: 70, // degrees max falling

  // Mia
  MIA_X: 80,
  MIA_W: 40,
  MIA_H: 40,
  MIA_HITBOX_RADIUS: 15, // forgiving

  // Obstacles
  OBSTACLE_W: 52,
  OBSTACLE_GAP: 135,
  OBSTACLE_GAP_MIN: 92,
  OBSTACLE_GAP_SHRINK: 3, // per 10 pts
  OBSTACLE_SPACING: 220,
  OBSTACLE_SPEED: 2.2,
  OBSTACLE_SPEED_INC: 0.15, // per 10 pts
  OBSTACLE_SPEED_MAX: 4.0,
  OBSTACLE_MIN_TOP: 60,
  OBSTACLE_MAX_TOP: 360,

  // Background parallax speeds (multiplier of obstacle speed)
  BG_LAYER0_SPEED: 0,
  BG_LAYER1_SPEED: 0.3,
  BG_LAYER2_SPEED: 0.6,

  // Colors
  COLOR_SKY_TOP: '#FF7E5F',
  COLOR_SKY_BOTTOM: '#7EC8E3',
  COLOR_PLUM: '#3A1C5E',
  COLOR_AMBER: '#F5B041',
  COLOR_PINK: '#F1948A',
  COLOR_CREAM: '#FFF8F0',
  COLOR_LAVENDER: '#D7BDE2',
  COLOR_ROSE: '#E74C6F',
  COLOR_WHITE: '#FFFFFF',

  // Scoring
  MILESTONE_5: 5,
  MILESTONE_10: 10,
  MILESTONE_25: 25,
  MILESTONE_50: 50,

  // Input debounce
  INPUT_DEBOUNCE_MS: 80,

  // Particles
  MAX_PARTICLES: 12,

  // Animation
  SCREEN_FADE_MS: 300,
  SCORE_POP_MS: 150,
};
