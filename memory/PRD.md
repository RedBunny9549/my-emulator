# NuzlockeStudio — PRD

## Problem Statement
Build a fully playable GBA emulator web app (ROM upload → play in browser) supporting GB, GBC, and GBA games. Design matches emerald-nuzlocke.vercel.app with a dark gaming theme. Must include a Nuzlocke run tracker.

## Architecture
- **Frontend**: React (CRA + craco), Tailwind CSS, EmulatorJS CDN for emulation
- **Backend**: FastAPI + MongoDB (Nuzlocke CRUD)
- **Emulation**: EmulatorJS stable CDN (`https://cdn.emulatorjs.org/stable/data/loader.js`) with mGBA core

## Target Users
Pokemon fans, Nuzlocke runners, retro gaming enthusiasts, Radical Red / ROM hack players

## Core Requirements (Static)
1. ROM upload (drag & drop or file picker) for .gb, .gbc, .gba files
2. EmulatorJS emulation in browser (GB, GBC, GBA)
3. Nuzlocke run management (create, list, update status)
4. Encounter logging with HP bar, status tracking
5. Party display (up to 6 alive Pokemon)

## What's Been Implemented (Feb 2026)

### Frontend Pages
- **/** — Landing page: hero ROM drop zone, platform cards (GB/GBC/GBA), feature cards, Nuzlocke CTA
- **/play** — Emulator page: EmulatorJS canvas, controls reference, BIOS upload (optional for GBA), Nuzlocke shortcut
- **/nuzlocke** — Run list: create/delete runs, progress bar, encounter counts
- **/nuzlocke/:runId** — Run detail: party display, encounter table, quick actions (faint/box/edit), run status management

### Backend APIs
- `GET /api/nuzlocke/runs` — List all runs with encounter counts
- `POST /api/nuzlocke/runs` — Create run
- `GET /api/nuzlocke/runs/{id}` — Get single run
- `PUT /api/nuzlocke/runs/{id}` — Update run (name/status)
- `DELETE /api/nuzlocke/runs/{id}` — Delete run + encounters
- `GET /api/nuzlocke/runs/{id}/encounters` — List encounters
- `POST /api/nuzlocke/runs/{id}/encounters` — Add encounter
- `PUT /api/nuzlocke/encounters/{id}` — Update encounter
- `DELETE /api/nuzlocke/encounters/{id}` — Delete encounter

### Design System
- Dark theme: `#0A0A0C` background, emerald green (#10B981) accents
- Fonts: Outfit (headings), IBM Plex Sans (body), JetBrains Mono (stats)
- HP bars: Green >50%, Yellow 20-50%, Red <20%
- Status badges: alive/dead/boxed/missed/escaped

## Prioritized Backlog

### P0 — Core (Done)
- [x] ROM upload + EmulatorJS playback
- [x] Nuzlocke run CRUD
- [x] Encounter logging with HP
- [x] Party display

### P1 — Enhancements
- [ ] ROM library (localStorage list of recently played)
- [ ] Mobile virtual gamepad improvement
- [ ] Encounter notes/type tracking
- [ ] Export run data as JSON/CSV

### P2 — Future
- [ ] Memory scanner for auto-detecting party data (requires Rust/WASM approach)
- [ ] User accounts / run sharing
- [ ] Sprite display (PokeAPI integration)
- [ ] GBC/GB color palette selector
- [ ] Cheat code manager via EmulatorJS
