# Gavyn's Emulator Frontend — Netlify Static

React 18 + Craco + Tailwind, EmulatorJS CDN.

## Scripts (in `frontend/`)

```
yarn install --frozen-lockfile
yarn start   # dev, http://localhost:3000
yarn build   # prod, CI=false
```

## Routes

`/` -> `/play` , `/play` , `/library` , `/bosses` , `/routes` , `/pokedex` , `/coverage` , `/database`

## Netlify

See `netlify.toml` — `CI=false yarn build` -> `build/` + `/* -> /index.html`

## Notes

- Nuzlocke removed.
- PostHog removed (add via `REACT_APP_POSTHOG_KEY` if needed).
- `visual-edits` craco plugin removed.
