# 🐱 Flappy Kitty

A romantic Flappy Bird–style browser game starring **Mia the cat**, built with love for **Nastya** 💛

## Features

- 🎮 Classic one-tap gameplay with pixel-art visuals
- 🐱 Hand-crafted pixel art Mia character with multiple animations
- 🌆 Parallax sunset cityscape with twinkling stars
- 🏮 Romantic lantern-arch obstacles (not boring pipes!)
- 💕 Heart particle effects on milestones
- 🔊 Procedural audio — no external files needed
- 🌐 Dual language (RU/EN) with one-tap toggle
- 📱 Fully responsive — works on mobile and desktop
- 💾 Best score saved locally
- ⚡ Zero dependencies, zero build step — pure vanilla JS + Canvas

## Quick Start

1. Clone the repo
2. Open `index.html` in any browser (or use a local server for module support)
3. Play!

```bash
# Option A: Just open the file
open index.html

# Option B: Local server (for ES modules)
npx serve .
# or
python3 -m http.server 8000
```

## Deploy to Vercel

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Set custom domain to `flappy-kitty.app`
4. Done — zero config needed

## Controls

| Platform | Action |
|----------|--------|
| Desktop | Click or press Space / ↑ |
| Mobile | Tap anywhere |

## Project Structure

```
flappy-kitty/
├── index.html          # Entry point
├── src/
│   ├── main.js         # Init + responsive scaling
│   ├── game.js         # Game loop + scene management
│   ├── mia.js          # Mia sprite + physics
│   ├── obstacles.js    # Obstacle spawning + collision
│   ├── background.js   # Parallax background layers
│   ├── particles.js    # Heart particle system
│   ├── ui.js           # Menu, HUD, game-over screens
│   ├── audio.js        # Procedural sound (Web Audio API)
│   ├── input.js        # Unified input handler
│   ├── i18n.js         # RU/EN localization
│   ├── storage.js      # localStorage wrapper
│   └── config.js       # All tunable constants
└── README.md
```

## Tech Stack

- **Vanilla JavaScript** (ES Modules)
- **HTML5 Canvas** (all rendering)
- **Web Audio API** (procedural sounds)
- **Google Fonts** (Pacifico + Nunito)
- No frameworks, no build tools, no dependencies

## Made with 💛 for Nastya
