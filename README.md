# mac — Development Projects

Two standalone projects in this repository.

---

## 1. KidQuest

**`kidquest/`** — AI-powered location-aware educational games for children ages 1–12.

### What it does

KidQuest generates short, interactive games tailored to a child's **age**, **skill tracks**, and **current location**. Games are created on-demand by Claude (claude-sonnet-4-6) and are designed to be played in 3–10 minutes using only things the child can actually see or touch at that location.

### Architecture

```
kidquest/
├── backend/          Node.js + Express API
│   ├── server.js     Entry point — CORS, rate limiting, routes
│   ├── routes/
│   │   ├── games.js      POST /api/games/generate
│   │   └── location.js   POST /api/location/resolve
│   ├── services/
│   │   ├── aiService.js      Calls Claude with 3-attempt retry (temp: 0.8 → 0.3 → 0.1)
│   │   ├── promptBuilder.js  Builds system + user prompts from profile & location context
│   │   └── locationService.js  Google Places API reverse geocoding
│   ├── middleware/
│   │   ├── rateLimiter.js    20 req/min global, 10 req/min for /generate
│   │   └── errorHandler.js
│   └── utils/
│       ├── gameValidator.js  Zod schema validation of AI-generated JSON
│       └── placeTypes.js
└── frontend/         React + Vite + Tailwind CSS
    └── src/
        ├── pages/
        │   ├── HomePage.jsx      Profile selection + "Start Adventure" button
        │   ├── LocationPage.jsx  GPS auto-detect or manual place picker
        │   ├── GamePage.jsx      Game rendering + scoring
        │   └── HistoryPage.jsx   Completed games log (localStorage)
        ├── components/
        │   ├── profiles/         ProfileCard, ProfileEditor, AgeSlider, SkillTrackSelector
        │   ├── game/             GameLoader, GameHeader, GameRenderer, GameComplete
        │   ├── game/game-types/  MultipleChoice, TapToSelect, MatchingGame, DragAndDrop, ObservationPrompt
        │   ├── location/         LocationDetector, ManualPlacePicker, LocationBadge
        │   ├── layout/           AppShell, BottomNav
        │   └── ui/               Button, Modal, Badge, Spinner
        ├── context/
        │   ├── ProfileContext.jsx  Child profiles persisted to localStorage
        │   └── GameContext.jsx     Active game state
        ├── hooks/
        │   ├── useProfiles.js
        │   ├── useGeolocation.js
        │   └── useLocationResolve.js
        └── utils/
            ├── skillTracks.js    Track definitions + sports list + avatar options
            ├── ageGroups.js
            └── placeTypes.js     14 place type definitions with descriptions
```

### API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/games/generate` | Generate a game from `{ profile, location, sessionId }` |
| POST | `/api/location/resolve` | Reverse-geocode `{ latitude, longitude, radius }` via Google Places |

### Game generation flow

1. Frontend sends child profile + location to `/api/games/generate`
2. `aiService` builds a structured prompt via `promptBuilder` (age band, skill track guidance, game type guidance, JSON schema)
3. Claude is called up to 3 times with descending temperatures (0.8 → 0.3 → 0.1) until valid JSON is returned
4. Response is validated against a Zod schema and returned with a UUID
5. Frontend renders the appropriate game-type component

### Game types

| Type | Best for |
|------|----------|
| **Multiple Choice** | Strategy questions, science concepts — all ages |
| **Tap to Select** | Color/shape/category hunts — best ages 1–6 |
| **Matching** | Vocabulary pairs, cause-effect — best ages 4–10 |
| **Observation** | Real-environment checklists — museums, nature, STEM (ages 5+) |
| **Drag & Drop** | Sorting and categorizing — best ages 5–10 |

### Skill tracks

| Track | Focus |
|-------|-------|
| **Sports & Movement** | Motor skills, coordination, spatial awareness, strategy. Sport-specific when a sport is selected (tennis, soccer, basketball, swimming, gymnastics, baseball, running) |
| **Science & Math** | Observation, hypothesis, counting, measurement, categorization |
| **Arts & Creativity** | Color recognition, pattern identification, storytelling, rhythm |
| **Social & Emotional** | Empathy, teamwork, communication, cooperative problem-solving |

### Location types (14)

Grocery Store, Park, Museum, Library, Restaurant, Zoo, Beach, Playground, Sports Field, Home, School, Shopping Mall, Airport, Doctor's Office.

Location is resolved via browser GPS + Google Places API, or selected manually.

### Profile features

- Name, age (1–12), avatar (10 emoji options)
- One or more skill tracks
- Optional sport selection when Sports track is chosen
- Profiles persist in localStorage; multiple children supported

### Game history

Completed games are saved to localStorage with: child name, date, location, game title, skill track, and score (correct answers / total rounds).

### Setup

See `kidquest/SETUP.md` for full instructions. Quick summary:

```bash
# 1. Configure backend/.env
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_PLACES_API_KEY=AIza-...   # optional
PORT=3001
FRONTEND_ORIGIN=http://localhost:5173

# 2. Install
npm install && npm run install:all

# 3. Run (starts both servers)
npm run dev
# Backend: http://localhost:3001
# Frontend: http://localhost:5173
```

**Requires:** Node.js 18+, Anthropic API key (~$0.003/game)

---

## 2. MotionScript

**`motionscript.html`** — Single-file browser app for turning voiceover scripts or audio recordings into animated kinetic-text presentations.

### What it does

Paste a script (or upload audio), and MotionScript parses it into typed scenes and animates them with cinematic transitions — ready to play back or export. No server required; everything runs client-side.

### Modes

**Script Mode** — Text-in, animation-out:
1. Paste a voiceover script into the text area
2. Use markers: `[PAUSE]` / `[BEAT]` for dramatic pauses, `[SHIFT]` for palette change
3. Click **Parse & Preview** — script is segmented and each segment is auto-classified
4. Play back in the canvas, scrub with the timeline slider, or step through scenes

**Media Sync Mode** — Audio/video-in, animation-out:
1. Upload an audio file (MP3, WAV, M4A) or video (MP4, WebM)
2. Either upload an `.srt` subtitle file for precise timing, or paste a plain-text transcript for approximate sync
3. Optionally click **Auto-Transcribe with Whisper AI** to transcribe the audio directly in-browser using the `@xenova/transformers` Whisper model (no server needed)
4. Click **Parse & Sync** — scenes are timed to the audio

### Scene types (auto-detected)

| Type | Detection rule | Visual style |
|------|---------------|--------------|
| **default** | Everything else | Large body text, word-by-word fade-in |
| **statistic** | Contains `%`, `$`, or approx. numeric language | Giant bold number + label |
| **brand** | ≤3–4 words, title-case / all-caps, no `?` | Centered large name + animated underline |
| **timeline** | Starts with month+day or `In YYYY,` | Monospace date + progress bar + text |
| **quote** | Starts with `"` | Quotation mark + italic text + attribution |
| **list** | ≥2 commas with short fragments, or starts with ordinals | Bullet items that slide in sequentially |
| **location** | "City, State. Year" pattern | Monospace location label + name + line |
| **question** | Ends with `?` | Bold question text + animated underline |
| **transition** | `[PAUSE]`, `[BEAT]`, or `[SHIFT]` | Near-black fade cut |

Each scene can also have its type **manually overridden** via a dropdown in the Scene List panel.

### Playback controls

- Play / Pause, step forward/back, restart, scrubber
- Scene counter display
- Waveform visualiser shown when audio is loaded

### Theming

- **Dark / Light** toggle
- **Accent colour**: Warm (amber), Cool (blue), Purple, Green

### Export options

| Export | Contents |
|--------|----------|
| **Export HTML (no audio)** | Self-contained HTML file with all animations embedded |
| **Export HTML + Audio** | Same, with audio base64-encoded inline |
| **Export Scene PNGs** | Captures each scene as a PNG via html2canvas |

### Dependencies (CDN, no install)

- [GSAP 3.12](https://gsap.com/) — scene animations
- [html2canvas 1.4](https://html2canvas.hertzen.com/) — PNG export
- Inter + JetBrains Mono (Google Fonts)
- `@xenova/transformers` (loaded at runtime for Whisper transcription only)

### Usage

Open `motionscript.html` directly in any modern browser. No build step, no server.
