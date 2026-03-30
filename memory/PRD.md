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
- **/** → redirects to /play (no promo/home page)
- **/play** — Emulator: EmulatorJS canvas, auto-loaded GBA BIOS, controls reference, BIOS override upload
- **/library** — ROM Library: recently played ROMs with play counts, date, platform stats
- **/nuzlocke** — Run list: create/delete runs, progress bar, encounter counts
- **/nuzlocke/:runId** — Run detail: Route Tracker + party with PokeAPI sprites + type badges + encounter table

### Key Components
- **Navbar**: Minimal 3-tab nav (Play / Library / Nuzlocke) + Load ROM button, no branding text
- **Emulator**: Auto-loads GBA BIOS from uploaded URL, suppresses cross-origin Script errors
- **RouteTracker**: Groups encounters by route, shows Cleared/Lost/Missed, + Missed Route quick-log
- **PokemonSprite**: PokeAPI sprites + 18-type color badges, module-level session cache

### Navbar
3 tabs: Play · Library · Nuzlocke + Load ROM button

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
