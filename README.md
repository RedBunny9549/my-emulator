# Gavyn's Emulator — GB/GBC/GBA/SNES/NES/MD in Browser (Netlify Static)

Static frontend hosted on Netlify. No backend (pure static). EmulatorJS docs: https://emulatorjs.org/docs/systems/snes + https://emulatorjs.org/docs/systems/nes-famicom + https://emulatorjs.org/docs/systems/sega-mega-drive

- **Play** — Upload `.gb/.gbc/.gba/.smc/.sfc/.nes/.md/.zip` ROMs, EmulatorJS (mGBA/gambatte/snes9x/fceumm/genesis_plus_gx via `https://cdn.emulatorjs.org/stable/data/loader.js`)
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

Nuzlocke + Library scrapped, SNES/NES/MD added (snes9x/fceumm/genesis_plus_gx, no BIOS), Library tab removed.
Vercel removed, Netlify only. Quick wins: PWA (manifest+sw+icons), IndexedDB bookmarks (EJS_onSaveState), manual core override, GBA BIOS upload UI, React 18, TypeCoverageMap fix.

