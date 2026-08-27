# Gavyn's Emulator — GB/GBC/GBA/SNES in Browser (Netlify Static)

Static frontend hosted on Netlify. No backend required. EmulatorJS docs: https://emulatorjs.org/docs/systems/snes (snes -> snes9x)

- **Play** — Upload `.gb/.gbc/.gba/.smc/.sfc/.snes/.fig/.zip` ROMs, EmulatorJS (mGBA/gambatte/snes9x via `https://cdn.emulatorjs.org/stable/data/loader.js`, `EJS_core = snes` defaults to snes9x)
- **Boss Guide / Routes / Pokedex / Coverage / Database** — Static Pokemon data + PokeAPI

## Deploy (Netlify)

Base dir: `frontend`
Build command: `CI=false yarn build`
Publish: `build`
Redirect: `/* -> /index.html 200` (in `frontend/netlify.toml`)

## Dev

```
cd frontend
yarn install
yarn start   # craco start, http://localhost:3000
```

## Legal

ROMs and GBA BIOS are copyrighted. Provide your own files. No ROMs/BIOS included. This is for educational/homebrew use.

## Removed

Nuzlocke Tracker + Library scrapped (deleted `NuzlockeList`, `NuzlockeRunPage`, `RouteTracker`, `RunTimeline`, `LibraryPage`, `levelCaps`, nuzlocke API).
Vercel config removed, Netlify only.
SNES added (snes9x, no BIOS, `EJS_core=snes` per https://emulatorjs.org/docs/systems/snes).
