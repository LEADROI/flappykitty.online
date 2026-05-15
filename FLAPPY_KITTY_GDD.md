# Flappy Kitty — Game Design Document
### Domain: `flappy-kitty.app` | Timeline: 1 Day | Format: GitHub Repo

---

## 3. Game Concept

### 3.1 High Concept
Flappy Kitty is a romantic casual browser game where cat Mia floats through a dreamy sunset cityscape filled with glowing lanterns and soft hearts. It's a personal love-letter game built for Nastya — every detail, from warm colors to gentle messages, is designed to make her smile. The "one more try" loop and personal best tracking keep her coming back.

### 3.2 Core Loop
- **Input:** Tap (mobile), click (desktop), or press Space/Up to make Mia flap upward.
- **Gravity:** Mia constantly falls; each tap gives an upward impulse.
- **Obstacles:** Pairs of vertical obstacles (romantic arches / lantern posts) scroll left with a gap for Mia to pass through.
- **Scoring:** +1 point for each obstacle pair cleared. Score displayed live, best score saved to `localStorage`.
- **Emotions:** Relief on each clear, tension as gaps narrow, delight from warm visual feedback (heart particles on milestones).

### 3.3 Difficulty & Progression
- **Base scroll speed:** 2 logical pixels/frame (at 60 FPS) on a 400×600 logical canvas.
- **Speed increase:** +0.15 px/frame every 10 points (caps at 4 px/frame).
- **Gap size:** Starts at 130 px, shrinks by 3 px every 10 points (min 90 px).
- **Obstacle frequency:** One pair every 220 px horizontal distance (constant).
- **Score milestones:**
  - 5 pts → small heart burst + encouraging message
  - 10 pts → "Mia loves you!" toast
  - 25 pts → golden glow around Mia
  - 50 pts → "Wow, Nastya! 💛" special screen flash
- **Best score** persisted in `localStorage`, displayed on game-over screen.

---

## 4. Character Mia

### 4.1 Visual Style Options (from real photos via AI stylization)

| # | Style | Tool/Method | Mood |
|---|-------|------------|------|
| 1 | **Soft 2D Cartoon** ⭐ RECOMMENDED | Stylize photo in Midjourney/DALL-E with prompt "cute cartoon cat, soft edges, pastel palette, chibi proportions" | Warm, approachable, clear silhouette at small sizes |
| 2 | **Pastel Watercolor** | "watercolor illustration of a cat, soft pastel, dreamy, paper texture" | Artistic, romantic, unique |
| 3 | **Pixel Art (16-bit)** | Manual pixel-over or AI pixel art conversion | Retro-game nostalgia, very lightweight |
| 4 | **Neon Dreamy** | "glowing neon outline cat on dark gradient, synthwave pastel" | Modern, striking night-city vibe |
| 5 | **Flat Vector** | Vectorize in AI then simplify to flat shapes | Clean, scalable to any resolution |

**Recommendation for 1-day deadline: Style 1 (Soft 2D Cartoon).** Fastest to generate, reads well at 48–64 px sprite size, and has the right emotional warmth.

### 4.2 Required Sprites / Poses

| Sprite | Description | Frames | Size (logical) |
|--------|-------------|--------|----------------|
| `mia_idle` | Wings/paws slightly out, neutral float | 2 frames (subtle bob) | 48×48 px |
| `mia_flap` | Wings/paws up, cheeks puffed | 2 frames (up stroke, down stroke) | 48×48 px |
| `mia_hit` | Surprised face, spiral eyes or starry eyes | 1 frame | 48×48 px |
| `mia_menu` | Sitting, tail swish, blinking | 3–4 frames | 96×96 px (larger for title screen) |

Total: **7–9 individual frames**, combined into a single **spritesheet** (recommended: 384×48 strip or 192×96 grid).

### 4.3 Sprite Recommendations
- **Resolution:** Author at 2× (96×96 per frame) for retina, display at 48×48 logical.
- **Palette:** Max 12 colors — warm oranges, cream, pink nose, dark brown outlines, white highlights.
- **Emotional vibe:** Big round eyes, soft smile on idle, visible blush marks (two small pink circles on cheeks).
- **File format:** PNG with transparency. Total spritesheet < 50 KB.
- **Hitbox:** Circular, radius = 18 px (smaller than visual sprite for forgiving collisions — critical for casual/romantic feel, not punishing).

---

## 5. Visual Style & UI

### 5.1 Background Scenes
- **Layer 0 (sky):** Vertical gradient — warm coral (#FF7E5F) → soft lavender (#7EC8E3). Static or very slow scroll.
- **Layer 1 (clouds/stars):** Soft blurred cloud shapes or tiny star dots. Parallax at 0.3× obstacle speed.
- **Layer 2 (city silhouette):** Dark purple (#3A1C5E) low-poly city skyline. Parallax at 0.6× obstacle speed.
- **Layer 3 (ground):** Optional decorative ground strip with hearts/flowers pattern. Scrolls at 1× speed.
- **Total layers:** 3–4. All pre-rendered as wide PNGs (tileable, 800×600 each, < 80 KB per layer).
- **Time of day:** Perpetual golden-hour sunset. No day/night cycle (scope).

### 5.2 Obstacle Style
- **NOT pipes.** Instead: **Romantic arch columns / lantern posts**.
- Top obstacle: Hanging lantern chain with a glowing lantern at the bottom edge.
- Bottom obstacle: Stone column with ivy/flowers growing up, small heart ornament at the top edge.
- Gap between them: Clearly open space, soft particle glow at gap edges to guide the eye.
- **Color:** Dark mauve (#5B2C6F) columns with warm amber (#F5B041) lantern glow.
- **Width:** 52 px logical. Consistent.
- **Readability:** High contrast against the coral/lavender sky. Tested: obstacle color has >4.5:1 ratio against lightest background.

### 5.3 Key UI Screens & Elements

**Screen 1 — Title / Start**
- Large "Flappy Kitty" logo (custom lettered or styled font)
- Mia sitting animation (mia_menu sprite)
- "Tap to Start" / "Нажми, чтобы начать" pulsing text
- Language toggle button (RU/EN) — small flag icons, top-right
- Best score display (small, bottom)
- Sound on/off toggle — top-left

**Screen 2 — In-Game HUD**
- Current score — large number, top-center, with subtle drop shadow
- Pause button — top-right corner (‖ icon)

**Screen 3 — Pause Overlay**
- Semi-transparent dark overlay (rgba 0,0,0,0.5)
- "Paused" / "Пауза" text
- Resume button, Retry button, Home button (icons + text)

**Screen 4 — Game Over / Results**
- "Game Over" / "Игра окончена" header
- Score and Best Score (with 🏆 icon if new record)
- "New Record!" / "Новый рекорд!" animated text if applicable
- One warm message for Nastya (random from pool)
- Retry button (prominent), Home button (secondary)
- Share button (optional v2) — not for day-1

### 5.4 Color Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary BG (warm) | Coral sunset | `#FF7E5F` | Sky top, warm accents |
| Primary BG (cool) | Soft sky blue | `#7EC8E3` | Sky bottom, calm areas |
| Accent 1 | Golden amber | `#F5B041` | Score, highlights, lantern glow |
| Accent 2 | Soft pink | `#F1948A` | Hearts, Mia's blush, love messages |
| Dark base | Deep plum | `#3A1C5E` | Obstacles, city silhouette, text shadows |
| Text primary | Cream white | `#FFF8F0` | All main text |
| Text secondary | Light lavender | `#D7BDE2` | Subtitles, secondary info |
| UI buttons | Warm rose | `#E74C6F` | Button backgrounds |
| UI button text | White | `#FFFFFF` | Button labels |

**Contrast rules:**
- All text on dark overlays: minimum 7:1 contrast ratio (WCAG AAA).
- Score on gameplay: white with 2px dark drop shadow for readability over any background.
- Buttons: minimum 48×48 px touch target on mobile.

---

## 6. In-Game Texts (RU/EN)

| Key | Russian (RU) | English (EN) |
|-----|-------------|--------------|
| `title` | Flappy Kitty | Flappy Kitty |
| `btn_start` | Начать | Start |
| `btn_pause` | Пауза | Pause |
| `btn_resume` | Продолжить | Resume |
| `btn_retry` | Ещё раз | Retry |
| `btn_settings` | Настройки | Settings |
| `btn_language` | EN / RU | RU / EN |
| `btn_sound_on` | Звук вкл | Sound On |
| `btn_sound_off` | Звук выкл | Sound Off |
| `tip_control` | Нажимай, чтобы Мия летела! | Tap to make Mia fly! |
| `tip_goal` | Проведи Мию через арки 💛 | Guide Mia through the arches 💛 |
| `game_over` | Игра окончена | Game Over |
| `new_record` | Новый рекорд! 🏆 | New Record! 🏆 |
| `score_label` | Счёт | Score |
| `best_label` | Лучший | Best |
| `msg_nastya_1` | Настя, Мия верит в тебя! 💛 | Nastya, Mia believes in you! 💛 |
| `msg_nastya_2` | Ты лучше всех, Настюш 🌸 | You're the best, Nastya 🌸 |
| `msg_nastya_3` | Мия летит к тебе с любовью ✨ | Mia flies to you with love ✨ |
| `msg_nastya_4` | Каждый полёт — для тебя 🌙 | Every flight is for you 🌙 |
| `msg_nastya_5` | Ты — её любимый человек 💕 | You're her favorite person 💕 |
| `milestone_5` | Отличное начало! | Great start! |
| `milestone_10` | Мия тебя любит! | Mia loves you! |
| `milestone_25` | Ты невероятная, Настя! | You're amazing, Nastya! |
| `milestone_50` | Вау, Настя! 💛 | Wow, Nastya! 💛 |

---

## 7. Fonts & Typography

### 7.1 Font Assignments

| Role | Font | Fallback | Why |
|------|------|----------|-----|
| **Logo / Headings** | `Pacifico` (Google Fonts) | `cursive` | Playful, romantic script feel; reads well at large sizes |
| **UI Text / Buttons** | `Nunito` (Google Fonts) | `sans-serif` | Rounded, friendly, excellent readability at small sizes; supports Cyrillic |
| **Score Display** | `Nunito Black (900)` | `sans-serif` | Bold, clear at a glance during gameplay |

### 7.2 Sizing & Adaptation

| Element | Desktop | Mobile (≤480px) | Weight |
|---------|---------|-----------------|--------|
| Logo | 48px | 36px | 400 (Pacifico default) |
| Score (in-game) | 40px | 32px | 900 |
| Button text | 20px | 18px | 700 |
| Tips / messages | 16px | 14px | 400 |
| Min readable size | 14px | 12px | — |

**Adaptation principle:** All font sizes defined in logical canvas units relative to 400×600 base. The canvas CSS scaling handles the rest. No media queries needed for in-canvas text. HTML overlay elements (if any) use `clamp()` for fluid sizing.

**Loading:** Embed both fonts via `<link>` in `index.html` head with `display=swap`. Total font payload ≈ 40 KB (subset to Latin + Cyrillic).

---

## 8. Animations & Effects

### 8.1 Required Animations

| Animation | Description | Duration / Speed |
|-----------|-------------|-----------------|
| Mia idle bob | Gentle sine-wave vertical oscillation on menu | 1.5s cycle, ±4 px |
| Mia flap | Switch to flap sprite + upward velocity + slight rotation (-20°) | Instant on input, ease-out 200ms |
| Mia fall rotation | Rotate Mia clockwise as she falls (max +70°) | Proportional to downward velocity |
| Mia hit | Flash red tint, slight shake, freeze frame | 300ms |
| Obstacle scroll | Smooth left movement at game speed | Continuous |
| Background parallax | Layer 1 at 0.3×, Layer 2 at 0.6× scroll speed | Continuous |
| Score pop | Scale up to 1.3× then back to 1× on point gain | 150ms ease-out |
| New record glow | Golden pulse around best-score text | 1s infinite |
| Heart burst | 5–8 small heart particles float upward on milestones | 800ms, fade out |
| Screen transitions | Fade-in/fade-out between screens | 300ms |
| Button hover/press | Scale to 0.95× on press, subtle glow on hover | 100ms |
| Tap indicator | Pulsing hand/tap icon on start screen | 1s infinite |

### 8.2 Implementation Layers

**CSS/JS (HTML overlay — minimal, only for non-gameplay UI):**
- Screen fade transitions (CSS `opacity` transition)
- Button hover/press micro-animations (CSS `transform`)
- Language toggle switch state

**Canvas (all gameplay rendering):**
- Mia sprite animation (frame cycling + rotation + position)
- Background layer parallax scrolling
- Obstacle rendering and movement
- Score text rendering (fillText with shadow)
- Heart particle system (lightweight: array of 5–8 objects with x, y, opacity, velocity — no heavy physics)
- Screen-shake on collision (offset canvas draw by ±3px for 5 frames)
- Flash overlay on hit (semi-transparent red rect, 2 frames)

### 8.3 Performance Guardrails
- **Target:** 60 FPS on mid-range mobile (2019+ devices).
- **Max simultaneous particles:** 12 (hearts + any ambient).
- **Sprite draw calls per frame:** ≤ 15 (3–4 BG layers + 2 obstacles visible + Mia + score + UI icons).
- **No runtime image generation.** All assets pre-rendered.
- **Use `requestAnimationFrame`**, never `setInterval`.
- **Off-screen obstacles** removed from array immediately when x < -60 px.
- **Asset budget:** Total < 500 KB (images + audio + fonts + code).

---

## 9. Technical Architecture

### 9.1 Stack Options

| Criteria | Option A: Vanilla Canvas + JS | Option B: Phaser 3 |
|----------|------------------------------|---------------------|
| Bundle size | ~20 KB (own code) | +250 KB (Phaser min) |
| Control | Full, no abstraction overhead | Managed scenes, built-in physics |
| Learning curve | Low for this scope | Overkill for a single-mechanic game |
| Mobile perf | Excellent (nothing wasted) | Good but heavier |
| Dev speed (1 day) | Faster for this simple game | Slower setup, faster if you already know Phaser |
| **Recommendation** | **⭐ RECOMMENDED** | Better for a more complex game |

**Verdict: Option A.** For a 1-day build of a single-mechanic game, vanilla Canvas + JS is faster, lighter, and gives full control.

### 9.2 Project Structure (GitHub Repo)

```
flappy-kitty/
├── index.html              # Single entry point, canvas + font links + inline critical CSS
├── style.css               # Minimal: body reset, canvas centering, overlay styles
├── manifest.json           # PWA manifest (optional, for "Add to Home Screen")
├── favicon.ico             # Mia icon
│
├── assets/
│   ├── sprites/
│   │   ├── mia-spritesheet.png      # All Mia frames
│   │   ├── obstacle-top.png         # Lantern/chain obstacle
│   │   ├── obstacle-bottom.png      # Column/ivy obstacle
│   │   └── heart-particle.png       # Small heart (16×16)
│   ├── backgrounds/
│   │   ├── bg-sky.png               # Gradient sky (tileable)
│   │   ├── bg-clouds.png            # Cloud layer (tileable, transparent)
│   │   └── bg-city.png              # City silhouette (tileable, transparent)
│   ├── ui/
│   │   ├── btn-play.png             # Play button icon
│   │   ├── btn-pause.png            # Pause icon
│   │   ├── btn-retry.png            # Retry icon
│   │   ├── btn-home.png             # Home icon
│   │   ├── btn-sound-on.png         # Speaker icon
│   │   ├── btn-sound-off.png        # Muted speaker icon
│   │   ├── flag-ru.png              # RU flag/icon
│   │   └── flag-en.png              # EN flag/icon
│   ├── audio/
│   │   ├── bgm.mp3                  # Background music loop (romantic lo-fi, ~30s loop, <200 KB)
│   │   ├── sfx-flap.mp3             # Wing flap (~5 KB)
│   │   ├── sfx-score.mp3            # Point scored chime (~5 KB)
│   │   ├── sfx-hit.mp3              # Collision thud (~8 KB)
│   │   └── sfx-record.mp3           # New record jingle (~10 KB)
│   └── fonts/                       # (Optional local fallback copies)
│
├── src/
│   ├── main.js              # Entry: init canvas, load assets, start game loop
│   ├── game.js              # Core game loop: update() + render() via rAF
│   ├── mia.js               # Mia entity: physics (gravity, flap impulse), sprite animation, hitbox
│   ├── obstacles.js         # Obstacle spawner: pool, gap randomization, collision detection
│   ├── background.js        # Parallax background layer manager
│   ├── particles.js         # Lightweight heart particle system
│   ├── scenes.js            # Scene/state manager: MENU → PLAYING → PAUSED → GAME_OVER
│   ├── input.js             # Unified input: click, touch, keyboard → single "action" event
│   ├── audio.js             # Audio manager: BGM loop, SFX triggers, mute toggle
│   ├── ui.js                # Draw UI overlays on canvas (scores, buttons, text)
│   ├── i18n.js              # Localization: { ru: {…}, en: {…} }, current lang, getText(key)
│   ├── storage.js           # localStorage wrapper: best score, language pref, sound pref
│   └── config.js            # All tunable constants: gravity, flap force, speeds, gap sizes, colors
│
├── README.md                # Project overview, setup instructions, credits
├── LICENSE                   # MIT or similar
└── .gitignore               # node_modules, .DS_Store, etc.
```

No build step required. All `<script type="module">` imports in `index.html`, or a single bundled `game.min.js` via a quick esbuild/rollup step (optional).

### 9.3 Responsive Behavior

```
Logical canvas: 400 × 600 (portrait base)

On load and on resize:
1. Read window.innerWidth and window.innerHeight
2. Calculate scale = min(windowW / 400, windowH / 600)
3. Set canvas.style.width = 400 * scale + "px"
   Set canvas.style.height = 600 * scale + "px"
4. Canvas element width/height stay at 400/600 (or 800/1200 for retina: 
   use window.devicePixelRatio, cap at 2×)
5. Center canvas in viewport with flexbox on body

All game logic uses logical coordinates (0–400, 0–600).
No coordinate conversion needed in game code.
Touch/click events: divide by scale to get logical position.
```

**Landscape on desktop:** The 400×600 canvas will be pillarboxed (black/themed bars on sides). This is standard for portrait mobile games on desktop. The background color of `<body>` matches the dark plum (#3A1C5E) so it feels intentional.

### 9.4 Input Handling

| Input | Event | Action |
|-------|-------|--------|
| Mouse click | `canvas.addEventListener('click')` | Flap / UI button press |
| Spacebar / Up Arrow | `document.addEventListener('keydown')` | Flap (only during PLAYING state) |
| Touch tap | `canvas.addEventListener('touchstart')` with `e.preventDefault()` | Flap / UI button press |
| Touch drag | Ignored | — |

**Key rules:**
- `touchstart` prevents ghost `click` via `e.preventDefault()`.
- Input is debounced: ignore inputs within 50ms of each other to prevent double-flap.
- During MENU state, input triggers "start game."
- During GAME_OVER state, detect tap location to check Retry/Home button hitboxes.

---

## 10. Roadmap (1-Day Sprint)

Given the **1-day deadline**, here's a compressed but realistic plan:

### Stage 1: Setup & Assets (Hours 0–2)

| Task | Outcome | Risks |
|------|---------|-------|
| Create GitHub repo with folder structure | Empty scaffold pushed to `main` | None |
| Generate Mia sprites from photos using AI (Midjourney/DALL-E) | Spritesheet PNG ready | ⚠️ AI output may need 2–3 iterations to get right proportions |
| Create/source background layers (AI-generated or free assets) | 3 tileable BG PNGs | ⚠️ Tiling seams; fix by hand if needed |
| Create obstacle art (can be simple geometric + glow) | 2 obstacle PNGs | Low risk |
| Source audio: royalty-free lo-fi BGM + generate SFX (jsfxr.app) | 5 audio files | ⚠️ BGM licensing — use CC0 source (e.g., Pixabay) |

### Stage 2: Core Loop Prototype (Hours 2–5)

| Task | Outcome | Risks |
|------|---------|-------|
| `main.js` + `game.js`: canvas init, game loop (rAF), delta time | Blank canvas with running loop | None |
| `mia.js`: gravity, flap, sprite rendering, rotation | Mia flies and falls on screen | ⚠️ Tuning gravity/flap feel — use config.js constants |
| `obstacles.js`: spawn, scroll, recycle, collision detection | Obstacles appear and scroll | ⚠️ Hitbox too tight = frustrating. Use forgiving circle hitbox |
| `input.js`: unified click/touch/key handler | Can play the core game | ⚠️ iOS Safari touch quirks — test early |
| `config.js`: all tunables in one place | Easy to adjust difficulty | None |
| Basic scoring in `game.js` | Score increments on pass | None |

**Milestone: Playable prototype with placeholder/real art.**

### Stage 3: Visual & Audio Polish (Hours 5–7)

| Task | Outcome | Risks |
|------|---------|-------|
| `background.js`: parallax 3-layer scrolling | Beautiful scrolling background | Low risk |
| `particles.js`: heart bursts on milestones | Emotional delight moments | ⚠️ Keep particle count ≤ 12 |
| `audio.js`: BGM loop, SFX on flap/score/hit | Full audio experience | ⚠️ Mobile autoplay policy — require user gesture before playing audio |
| `ui.js`: score display with shadow, milestone toasts | Polished HUD | None |
| Apply final Mia spritesheet + obstacle art + BGs | Visually complete | ⚠️ Sprite alignment offsets may need tweaking |

### Stage 4: Screens, i18n & Final Polish (Hours 7–9)

| Task | Outcome | Risks |
|------|---------|-------|
| `scenes.js`: MENU → PLAYING → PAUSED → GAME_OVER state machine | Complete game flow | None |
| `i18n.js` + `storage.js`: RU/EN toggle, persisted prefs, best score | Dual-language, persistent data | Low risk |
| UI buttons (play, pause, retry, home, sound, lang) | Full interactive UI | ⚠️ Button hitboxes on mobile — test touch targets |
| Game-over screen with Nastya messages + record detection | Emotional, personal game-over | None |
| Responsive scaling + test on mobile viewport | Works on phone + desktop | ⚠️ Test on real device, not just DevTools |

### Stage 5: Deploy (Hours 9–10)

| Task | Outcome | Risks |
|------|---------|-------|
| Final commit + push to GitHub `main` | Complete repo | None |
| Connect GitHub repo to Vercel | Live at `flappy-kitty.app` | ⚠️ DNS propagation if custom domain — can use Vercel subdomain as fallback |
| Smoke test on mobile + desktop browsers | Confirmed working | ⚠️ iOS Safari audio, Android Chrome touch — quick fix window |
| Share with Nastya 💛 | Mission accomplished | No risk. Only love. |

---

## 11. User Instructions

1. **Paste this GDD** into your working context (Arena Agent Mode or hand to a developer/AI coder agent).
2. **Provide Mia's photos** to the AI image tool (Midjourney, DALL-E, or similar) with the prompts from §4.1.
3. **Choose visual style** from §4.1 (recommended: Soft 2D Cartoon for speed).
4. **Approve the stack:** Vanilla Canvas + JS (Option A recommended — see §9.1).
5. **The coding agent** follows the project structure (§9.2), implements modules in order (§10 stages), uses config values from §3.3 and §9.3.
6. **You review** at each stage milestone and approve before moving to the next.
7. **Deploy** via Vercel from GitHub (§12).

---

## 12. Tool Hookup

| Stage | Tool | Why |
|-------|------|-----|
| Asset generation (Mia sprites) | Midjourney / DALL-E / Stable Diffusion | Stylize real cat photos into game sprites |
| SFX creation | jsfxr.app (browser tool) | Generate retro-cute flap/score/hit sounds in seconds |
| BGM sourcing | Pixabay / Uppbeat (CC0/free) | Royalty-free romantic lo-fi loops |
| Quick prototype & testing | Replit (HTML/CSS/JS) or local browser | Instant preview, no build step |
| Version control | GitHub (`main` branch, feature branches if time allows) | Standard, connects directly to Vercel |
| Deployment | Vercel (static site from GitHub) | Zero-config deploy, custom domain support for `flappy-kitty.app` |
| Backend (v2, NOT day-1) | Railway | Global leaderboards, analytics — out of scope for 1-day sprint |

---

## Quick Reference: Asset Budget

| Category | Target Size | Files |
|----------|-------------|-------|
| Mia spritesheet | < 50 KB | 1 PNG |
| Obstacles | < 20 KB | 2 PNGs |
| Backgrounds (3 layers) | < 80 KB total | 3 PNGs |
| UI icons | < 15 KB total | 8 small PNGs |
| Heart particle | < 2 KB | 1 PNG |
| BGM | < 200 KB | 1 MP3 (30s loop) |
| SFX | < 30 KB total | 4 MP3s |
| Fonts (loaded via Google) | ~40 KB | 2 fonts |
| JS code | < 30 KB | ~12 files |
| **Total** | **< 470 KB** | — |

---

*Document prepared for Flappy Kitty — a game with love, built in a day. 💛*
