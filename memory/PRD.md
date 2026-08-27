# NuzlockeStudio — PRD (Netlify static, Nuzlocke scrapped)

## Problem Statement
Build a fully playable GBA emulator web app (ROM upload → play in browser) supporting GB, GBC, and GBA games. Hosted on Netlify only (static frontend).

## Architecture
- **Frontend**: React (CRA + craco), Tailwind CSS, EmulatorJS CDN for emulation — hosted on Netlify
- **Backend**: None (Netlify static). Optional local `backend/server.py` health check only.
- **Emulation**: EmulatorJS stable CDN (`https://cdn.emulatorjs.org/stable/data/loader.js`) with mGBA core

## Target Users
Pokemon fans, retro gaming enthusiasts, ROM hack players

## Core Requirements (Static)
1. ROM upload (drag & drop or file picker) for .gb, .gbc, .gba files
2. EmulatorJS emulation in browser (GB, GBC, GBA)
3. Save states (localStorage/IndexedDB)
4. Boss Guide, Route Browser, Pokedex, Type Coverage, Database Browser

## What's Been Implemented

### Feb 2026 — Session 1
- **/** → redirects to /play
- **/play** — Emulator: EmulatorJS canvas, auto-loaded GBA BIOS, auto-fire toggle
- **/library** — ROM Library: recently played ROMs

### Feb 2026 — Session 2
- **Smart HUD** (`PokemonDetailsModal.js`): tabbed modal (Stats/Moves/Battle)
- **Boss Guide** (`/bosses`): Emerald + FireRed + Crystal gym leaders, Elite Four, Champions
- **Route Browser** (`/routes`): Encounter tables by game
- **Pokedex** (`/pokedex`), **Type Coverage** (`/coverage`), **Database** (`/database`)
- **Navbar**: 7 tabs (Play/Library/Routes/Pokedex/Coverage/Bosses/Database) + Load ROM
- **HomePage**: Hero + drop zone + platforms + library CTA (Nuzlocke removed)

### Scrapped
- Nuzlocke Tracker removed: `NuzlockeList.js`, `NuzlockeRunPage.js`, `RouteTracker.js`, `RunTimeline.js`, `HpBar.js`, `levelCaps.js`, backend Nuzlocke APIs
- Vercel config removed, Netlify only (`frontend/netlify.toml`, `/* -> /index.html`)

### Key Components
- **Navbar**: Play/Library/Routes/Pokedex/Coverage/Bosses/Database + Load ROM
- **Emulator**: Auto-loads GBA BIOS, suppresses cross-origin Script errors
- **PokemonSprite**: PokeAPI sprites + type color badges
- **PokemonDetailsModal**: Tabbed Smart HUD
- **BossGuide**: Game + section tabs, full team data

### Backend APIs (Netlify static — none, local dev only)
- `GET /` — Hello
- `GET /api/health` — ok

### Data Files
- `/app/frontend/src/data/encounterTables.js` — Emerald + FireRed + Crystal encounter tables
- `/app/frontend/src/data/bossData.js` — All gym leaders + E4 + Champions

### Design System
- Dark theme: `#0A0A0C` background, emerald green (#10B981) accents
- Fonts: Outfit (headings), IBM Plex Sans (body), JetBrains Mono (stats)

## Backlog (Netlify)

### P0 — Done
- [x] ROM upload + EmulatorJS playback
- [x] Boss Guide for Emerald + FireRed + Crystal
- [x] Route Browser, Pokedex, Type Coverage, Database
- [x] Netlify deploy (`netlify.toml`)

### P1 — Upcoming
- [ ] SaveStateManager promotion to /saves with IndexedDB
- [ ] Mobile virtual gamepad
- [ ] GBC/GB color palette selector

### P2 — Future
- [ ] Cheat code manager via EmulatorJS
- [ ] Radical Red / Unbound boss data
