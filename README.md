# MotionScript

Single-file browser app for turning voiceover scripts or audio recordings into animated kinetic-text presentations.

### What it does

Paste a script (or upload audio), and MotionScript parses it into typed scenes and animates them with cinematic transitions — ready to play back or export. No server required; everything runs client-side.

Open `motionscript.html` directly in any modern browser. No build step, no install.

---

## Modes

**Script Mode** — Text-in, animation-out:
1. Paste a voiceover script into the text area
2. Use markers: `[PAUSE]` / `[BEAT]` for dramatic pauses, `[SHIFT]` for a palette change
3. Click **Parse & Preview** — the script is segmented and each segment is auto-classified into a scene type
4. Play back in the canvas, scrub with the timeline slider, or step through scenes manually

**Media Sync Mode** — Audio/video-in, animation-out:
1. Upload an audio file (MP3, WAV, M4A) or video (MP4, WebM)
2. Either upload an `.srt` subtitle file for precise timing, or paste a plain-text transcript for approximate sync
3. Optionally click **Auto-Transcribe with Whisper AI** to transcribe the audio directly in-browser using the `@xenova/transformers` Whisper model — no server needed
4. Click **Parse & Sync** — scenes are timed to the audio

---

## Scene types (auto-detected)

| Type | Detection rule | Visual style |
|------|---------------|--------------|
| **default** | Everything else | Large body text, word-by-word fade-in |
| **statistic** | Contains `%`, `$`, or approximate numeric language | Giant bold number + label |
| **brand** | ≤3–4 words, title-case / all-caps, no `?` | Centered large name + animated underline |
| **timeline** | Starts with month+day or `In YYYY,` | Monospace date + progress bar + text |
| **quote** | Starts with `"` | Quotation mark + italic text + attribution |
| **list** | ≥2 commas with short fragments, or starts with ordinals | Bullet items that slide in sequentially |
| **location** | "City, State. Year" pattern | Monospace location label + name + line |
| **question** | Ends with `?` | Bold question text + animated underline |
| **transition** | `[PAUSE]`, `[BEAT]`, or `[SHIFT]` | Near-black fade cut |

Each scene's type can also be **manually overridden** via a dropdown in the Scene List panel.

---

## Playback controls

- Play / Pause, step forward/back, restart
- Timeline scrubber
- Scene counter
- Waveform visualiser (shown when audio is loaded)
- Playback speed: 0.25× – 3×

---

## Theming

- **Dark / Light** toggle
- **Accent colour**: Warm (amber), Cool (blue), Purple, Green

---

## Export

| Option | Output |
|--------|--------|
| **Export HTML (no audio)** | Self-contained HTML with all animations embedded |
| **Export HTML + Audio** | Same, with audio base64-encoded inline |
| **Export Scene PNGs** | Each scene captured as a PNG via html2canvas |

---

## Dependencies (CDN — no install)

- [GSAP 3.12](https://gsap.com/) — scene animations
- [html2canvas 1.4](https://html2canvas.hertzen.com/) — PNG export
- Inter + JetBrains Mono (Google Fonts)
- `@xenova/transformers` — loaded at runtime for Whisper transcription only
