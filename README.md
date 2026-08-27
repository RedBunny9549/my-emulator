# Gavyn's Emulator — GB/GBC/GBA in Browser (Netlify Static)

Static frontend hosted on Netlify. No backend required.

- **Play** — Upload `.gb/.gbc/.gba` ROMs, EmulatorJS (mGBA/gambatte) via `https://cdn.emulatorjs.org/stable/data/loader.js`
- **Library** — Recent ROMs (metadata in localStorage, re-upload required — browser cannot store ROM binaries)
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

Nuzlocke Tracker scrapped (deleted `NuzlockeList`, `NuzlockeRunPage`, `RouteTracker`, `RunTimeline`, `levelCaps`, nuzlocke API).
Vercel config removed, Netlify only.
