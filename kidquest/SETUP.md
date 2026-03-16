# KidQuest — Setup Guide

## Prerequisites

You need **Node.js 18+** installed. Since it's not currently on this machine:

**Download:** https://nodejs.org/en/download
Choose the **LTS Windows Installer (.msi)** — run it, leave all defaults checked.
After install, open a **new** terminal/command prompt.

---

## Quick Start (after Node.js is installed)

### 1. Get your API keys

**Anthropic API key (required):**
- Sign up at https://console.anthropic.com
- Create an API key
- Cost: ~$0.003 per game generated (very cheap)

**Google Places API key (optional — for GPS auto-detect):**
- Go to https://console.cloud.google.com
- Enable "Places API"
- Create an API key
- Without this key, auto-detect won't work, but manual location selection works fine

### 2. Set your API keys

Edit `backend/.env`:
```
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
GOOGLE_PLACES_API_KEY=AIza-your-actual-key-here   ← optional
PORT=3001
FRONTEND_ORIGIN=http://localhost:5173
```

### 3. Install dependencies

Open a terminal in `C:\development\kidquest` and run:

```bash
npm install
npm run install:all
```

This installs everything for both backend and frontend.

### 4. Start the app

```bash
npm run dev
```

This starts both servers at once:
- Backend: http://localhost:3001
- Frontend: http://localhost:5173

Open http://localhost:5173 in your browser (or on your phone via your computer's local IP).

---

## Using on Mobile (Phone)

For the best experience (GPS works, touch interactions), open it on your phone:

1. Make sure your phone is on the same WiFi as your computer
2. Find your computer's local IP: run `ipconfig` in Command Prompt, look for "IPv4 Address" (e.g., 192.168.1.5)
3. Open `http://192.168.1.5:5173` on your phone's browser
4. Add to home screen for a full-screen app experience

---

## How to Use

1. **Create child profiles** — Tap "+" to add each child with their name, age, and skill tracks
   - For sports, select which sport (tennis, soccer, etc.) for sport-specific skill building

2. **Select a child** — Tap their card on the home screen, then tap "Start Adventure!"

3. **Choose your location** — The app tries to auto-detect via GPS. You can also pick manually from 14 place types

4. **Generate a game** — Tap "Generate Game!" — Claude AI creates a custom game in seconds

5. **Play!** — 5 interactive game types:
   - Multiple Choice — tap the right answer
   - Tap to Select — tap all matching items
   - Matching — pair left and right columns
   - Observation — checklist of things to find around you
   - Drag & Drop — sort items into categories

---

## Project Structure

```
kidquest/
├── backend/          Node.js + Express API server
│   ├── services/     AI prompt building, Claude API, Google Places
│   ├── routes/       /api/games/generate, /api/location/resolve
│   └── utils/        Zod validation, place type maps
└── frontend/         React + Vite + Tailwind CSS
    ├── src/
    │   ├── pages/    HomePage, LocationPage, GamePage, HistoryPage
    │   ├── components/  Profiles, Location, Game types, UI primitives
    │   ├── context/  ProfileContext (localStorage), GameContext
    │   └── hooks/    useGeolocation, useLocationResolve, useProfiles
    └── public/
```

---

## Skill Tracks

| Track | What it builds |
|-------|---------------|
| **Sports** | Motor skills, coordination, reaction time, spatial awareness, strategy (sport-specific when selected) |
| **STEM** | Observation, categorization, counting, measurement, scientific curiosity |
| **Arts** | Color recognition, pattern identification, creativity, storytelling, aesthetic awareness |
| **Social** | Empathy, teamwork, communication, reading emotions, cooperation |

---

## Troubleshooting

**"Could not generate a valid game"** — Claude failed to produce valid JSON after 3 tries. Tap "Try Again" — it almost always works on retry.

**GPS doesn't work** — Browser GPS requires HTTPS in some browsers. Use manual place selection instead, or access via localhost which counts as a secure context.

**Game takes long to load** — Claude API calls take 3-8 seconds. The loading screen shows while it generates.

**Port already in use** — Change `PORT=3002` in `backend/.env` and update `vite.config.js` proxy target to match.
