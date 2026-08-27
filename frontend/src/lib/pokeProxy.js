// Same-origin proxy helpers for school firewall bypass
// Netlify redirects in frontend/netlify.toml proxy to pokeapi.co, raw.githubusercontent, etc.
// Client only talks to braydenthingy.netlify.app, no external domain needed

export const POKEAPI = "/pokeapi";
export const poke = (path) => `${POKEAPI}${path.startsWith("/") ? path : `/${path}`}`;

// Sprite helpers — all same-origin, proxied via netlify.toml
export const sprite = {
  official: (id) => `/sprites/pokemon/other/official-artwork/${id}.png`, // proxied to raw.githubusercontent PokeAPI/sprites
  officialShiny: (id) => `/sprites/pokemon/other/official-artwork/shiny/${id}.png`,
  tiny: (id) => `/sprites/pokemon/${id}.png`,
  shinyTiny: (id) => `/sprites/pokemon/shiny/${id}.png`,
  back: (id) => `/sprites/pokemon/back/${id}.png`,
  backShiny: (id) => `/sprites/pokemon/back/shiny/${id}.png`,
  cdnOfficial: (id) => `/cdn-sprites/pokemon/other/official-artwork/${id}.png`,
  cdnShiny: (id) => `/cdn-sprites/pokemon/other/official-artwork/shiny/${id}.png`,
  // fallback to pokemondb via proxy
  pokemondb: (name) => `/pokemondb/sprites/emerald/normal/${name.toLowerCase()}.png`,
  showdownTrainer: (name) => `/showdown/sprites/trainers/${name}.png`,
  item: (name) => `/sprites/items/${name}.png`,
  iconGen8: (id) => `/sprites/pokemon/versions/generation-viii/icons/${id}.png`,
};

// Helper to fetch via proxy with fallback to direct (if proxy fails, try direct)
export async function fetchPoke(path, opts) {
  const url = poke(path);
  try {
    const r = await fetch(url, opts);
    if (!r.ok) throw new Error(`proxy ${r.status}`);
    return r;
  } catch (e) {
    // fallback to direct pokeapi.co (for local dev without netlify)
    const direct = `https://pokeapi.co/api/v2${path.startsWith("/") ? path : `/${path}`}`;
    return fetch(direct, opts);
  }
}

export function proxiedUrl(url) {
  if (!url) return url;
  return url
    .replace("https://pokeapi.co/api/v2", "/pokeapi")
    .replace("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites", "/sprites")
    .replace("https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites", "/cdn-sprites")
    .replace("https://img.pokemondb.net", "/pokemondb")
    .replace("https://play.pokemonshowdown.com", "/showdown");
}
