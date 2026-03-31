# NuzlockeStudio — PRD

## Problem Statement
Build a fully playable GBA emulator web app (ROM upload → play in browser) supporting GB, GBC, and GBA games. Target: Nuzlocke runners, especially Gen 3 (Emerald/FireRed) players.

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

## What's Been Implemented

### Feb 2026 — Session 1
- **/** → redirects to /play (no promo/home page)
- **/play** — Emulator: EmulatorJS canvas, auto-loaded GBA BIOS, controls reference
- **/library** — ROM Library: recently played ROMs with play counts, date, platform stats
- **/nuzlocke** — Run list: create/delete runs, progress bar, encounter counts
- **/nuzlocke/:runId** — Run detail: Route Tracker + party + encounter table

### Feb 2026 — Session 2
- **Smart HUD** (`PokemonDetailsModal.js`): tabbed modal (Stats/Weaknesses/Kill Calc)
  - Gen 3 STAB categorization (type-based Physical/Special)
  - Base stats bars from PokeAPI
  - Type effectiveness with **Gen 3 corrections** (no Fairy, Steel resists Dark/Ghost)
  - **Kill Range Calculator**: enter opponent name+level → PokeAPI fetches stats → Gen 3 damage formula → OHKO/2HKO verdict
  - **Move Tracker display**: logged moves shown with Gen 3 category badges
- **Boss Guide** (`/bosses`): 
  - Emerald + FireRed gym leaders, Elite Four, Champions
  - Full team data with sprites, levels, held items
  - Counter type recommendations + tactical tips
  - Click any boss Pokemon → opens Smart HUD
- **Encounter Suggestions** in Route Tracker: auto-suggests possible encounters per route based on game (Emerald/FireRed detection)
- **Move Tracker** in encounter form: 4 optional move slots per Pokemon, stored in MongoDB
- **Navbar**: 4 tabs (Play / Library / Nuzlocke / Bosses)

### Key Components
- **Navbar**: 4-tab nav (Play/Library/Nuzlocke/Bosses) + Load ROM button
- **Emulator**: Auto-loads GBA BIOS, suppresses cross-origin Script errors
- **RouteTracker**: Groups encounters by route, shows Cleared/Lost/Missed + encounter suggestions from hardcoded tables
- **PokemonSprite**: PokeAPI sprites + type color badges, module-level session cache
- **PokemonDetailsModal**: Tabbed Smart HUD with Stats/Weaknesses/Kill Calc; Gen 3 corrected type chart
- **BossGuide**: Game + section tabs, accordion boss cards with full team data

### Backend APIs
- `GET /api/nuzlocke/runs` — List all runs with encounter counts
- `POST /api/nuzlocke/runs` — Create run
- `GET /api/nuzlocke/runs/{id}` — Get single run
- `PUT /api/nuzlocke/runs/{id}` — Update run (name/status)
- `DELETE /api/nuzlocke/runs/{id}` — Delete run + encounters
- `GET /api/nuzlocke/runs/{id}/encounters` — List encounters
- `POST /api/nuzlocke/runs/{id}/encounters` — Add encounter (includes moves[] field)
- `PUT /api/nuzlocke/encounters/{id}` — Update encounter (includes moves[] field)
- `DELETE /api/nuzlocke/encounters/{id}` — Delete encounter

### Data Files
- `/app/frontend/src/data/encounterTables.js` — Emerald + FireRed encounter tables by route
- `/app/frontend/src/data/bossData.js` — All gym leaders + E4 + Champions for Emerald + FireRed

### Design System
- Dark theme: `#0A0A0C` background, emerald green (#10B981) accents
- Fonts: Outfit (headings), IBM Plex Sans (body), JetBrains Mono (stats)
- HP bars: Green >50%, Yellow 20-50%, Red <20%
- Status badges: alive/dead/boxed/missed/escaped

## Prioritized Backlog

### P0 — Done
- [x] ROM upload + EmulatorJS playback
- [x] Nuzlocke run CRUD
- [x] Encounter logging with HP
- [x] Party display
- [x] Smart HUD with Gen 3 mechanics
- [x] Boss Guide for Emerald + FireRed
- [x] Kill Range Calculator
- [x] Move Tracker (1-4 moves per Pokemon)
- [x] Encounter Suggestions based on route/game
- [x] Gen 3 type chart corrections (no Fairy, Steel resists Dark/Ghost)

### P1 — Upcoming
- [ ] ROM library (done but needs persistent backend sync)
- [ ] Mobile virtual gamepad improvement
- [ ] Export run data as JSON/CSV
- [ ] MBC1/MBC3 logic for GBC ROMs > 32KB

### P2 — Future
- [ ] Memory scanner for auto-detecting party data from emulator state
- [ ] User accounts / run sharing
- [ ] GBC/GB color palette selector
- [ ] Cheat code manager via EmulatorJS
- [ ] Radical Red / Unbound specific boss data
