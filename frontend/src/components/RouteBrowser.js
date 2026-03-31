import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Star, X, Loader2, Map, Search } from "lucide-react";
import Navbar from "./Navbar";

// ─── Tier helpers ───────────────────────────────────────────────────────────
const BST_TIERS = [
  { min: 580, tier: "S" },
  { min: 500, tier: "A" },
  { min: 430, tier: "B" },
  { min: 360, tier: "C" },
  { min: 300, tier: "D" },
  { min: 0,   tier: "F" },
];

// Smogon-inspired manual overrides for well-known Pokémon
const SMOGON_OVERRIDES = {
  garchomp: "S", dragonite: "S", salamence: "S", metagross: "S", tyranitar: "S",
  gengar: "S", alakazam: "S", machamp: "A", starmie: "A", heracross: "A",
  gyarados: "A", lapras: "A", snorlax: "A", arcanine: "A", vaporeon: "A",
  jolteon: "A", exeggutor: "A", rhydon: "B", kangaskhan: "B", tauros: "B",
  nidoking: "B", nidoqueen: "B", cloyster: "B", electrode: "B", magneton: "B",
  raticate: "D", pidgeot: "D", fearow: "D", spearow: "F", rattata: "F",
  caterpie: "F", weedle: "F", metapod: "F", kakuna: "F", magikarp: "F",
};

function calcTier(pokemon, bst) {
  if (SMOGON_OVERRIDES[pokemon.toLowerCase()]) return SMOGON_OVERRIDES[pokemon.toLowerCase()];
  return BST_TIERS.find(t => bst >= t.min)?.tier || "F";
}

const TIER_STYLE = {
  S: "bg-red-500/20 text-red-400 border-red-500/30",
  A: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  B: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  C: "bg-green-500/20 text-green-400 border-green-500/30",
  D: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  F: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const TYPE_STYLE = {
  fire: "bg-orange-500/20 text-orange-300",
  water: "bg-blue-500/20 text-blue-300",
  grass: "bg-green-500/20 text-green-300",
  electric: "bg-yellow-500/20 text-yellow-300",
  psychic: "bg-pink-500/20 text-pink-300",
  ice: "bg-cyan-500/20 text-cyan-300",
  dragon: "bg-indigo-500/20 text-indigo-300",
  dark: "bg-gray-700/50 text-gray-300",
  fighting: "bg-red-700/30 text-red-300",
  poison: "bg-purple-500/20 text-purple-300",
  ground: "bg-yellow-700/30 text-yellow-200",
  rock: "bg-yellow-600/20 text-yellow-400",
  bug: "bg-lime-500/20 text-lime-300",
  ghost: "bg-purple-700/30 text-purple-300",
  steel: "bg-slate-500/20 text-slate-300",
  normal: "bg-gray-500/20 text-gray-300",
  flying: "bg-sky-500/20 text-sky-300",
  fairy: "bg-pink-300/20 text-pink-200",
};

// ─── Route Data ─────────────────────────────────────────────────────────────
const ROUTE_DATA = {
  "Pokemon Emerald": [
    { route: "Route 101", pokemon: ["Poochyena", "Zigzagoon", "Wurmple"] },
    { route: "Route 102", pokemon: ["Poochyena", "Zigzagoon", "Wurmple", "Ralts", "Seedot", "Lotad"] },
    { route: "Route 103", pokemon: ["Poochyena", "Zigzagoon", "Wingull"] },
    { route: "Route 104", pokemon: ["Poochyena", "Zigzagoon", "Wingull", "Marill"] },
    { route: "Petalburg Woods", pokemon: ["Wurmple", "Silcoon", "Cascoon", "Taillow", "Shroomish", "Slakoth"] },
    { route: "Route 110", pokemon: ["Poochyena", "Electrike", "Plusle", "Minun", "Oddish", "Wingull"] },
    { route: "Route 111", pokemon: ["Sandshrew", "Trapinch", "Cacnea", "Baltoy"] },
    { route: "Route 114", pokemon: ["Lotad", "Lombre", "Seviper", "Zangoose", "Swablu"] },
    { route: "Route 115", pokemon: ["Swablu", "Jigglypuff", "Taillow", "Nosepass"] },
    { route: "Route 117", pokemon: ["Poochyena", "Roselia", "Volbeat", "Illumise", "Marill"] },
    { route: "Route 119", pokemon: ["Oddish", "Gloom", "Tropius", "Zigzagoon", "Kecleon"] },
    { route: "Route 120", pokemon: ["Absol", "Kecleon", "Oddish", "Marill"] },
    { route: "Route 121", pokemon: ["Shuppet", "Duskull", "Kecleon", "Oddish"] },
    { route: "Safari Zone", pokemon: ["Pikachu", "Geodude", "Psyduck", "Wobbuffet", "Phanpy", "Heracross"] },
    { route: "Victory Road", pokemon: ["Golbat", "Hariyama", "Graveler", "Machoke", "Mightyena"] },
  ],
  "Pokemon FireRed": [
    { route: "Route 1", pokemon: ["Pidgey", "Rattata"] },
    { route: "Route 2", pokemon: ["Pidgey", "Rattata", "Caterpie", "Weedle"] },
    { route: "Route 3", pokemon: ["Spearow", "Jigglypuff", "Mankey"] },
    { route: "Route 4", pokemon: ["Spearow", "Ekans", "Sandshrew"] },
    { route: "Mt. Moon", pokemon: ["Zubat", "Geodude", "Clefairy", "Paras"] },
    { route: "Route 9", pokemon: ["Rattata", "Spearow", "Ekans", "Sandshrew"] },
    { route: "Route 10", pokemon: ["Voltorb", "Magnemite", "Electabuzz"] },
    { route: "Rock Tunnel", pokemon: ["Zubat", "Geodude", "Machop", "Onix"] },
    { route: "Route 12", pokemon: ["Snorlax", "Pidgey", "Ekans", "Oddish"] },
    { route: "Route 15", pokemon: ["Ditto", "Jiggypuff", "Gloom", "Venomoth"] },
    { route: "Safari Zone", pokemon: ["Nidoran♀", "Nidoran♂", "Paras", "Venonat", "Scyther", "Pinsir", "Tauros", "Kangaskhan", "Chansey"] },
    { route: "Route 21", pokemon: ["Tangela", "Rattata", "Pidgey"] },
    { route: "Victory Road", pokemon: ["Zubat", "Geodude", "Graveler", "Machoke", "Venomoth", "Onix"] },
    { route: "Seafoam Islands", pokemon: ["Zubat", "Golbat", "Dewgong", "Slowpoke", "Articuno"] },
    { route: "Power Plant", pokemon: ["Voltorb", "Magnemite", "Electabuzz", "Zapdos"] },
  ],
  "Pokemon Radical Red": [
    { route: "Route 1", pokemon: ["Pidgey", "Rattata", "Sentret", "Hoppip"] },
    { route: "Route 2", pokemon: ["Pidgey", "Rattata", "Caterpie", "Weedle", "Nincada"] },
    { route: "Route 3", pokemon: ["Spearow", "Jigglypuff", "Mankey", "Meditite", "Makuhita"] },
    { route: "Route 4", pokemon: ["Spearow", "Ekans", "Sandshrew", "Trapinch"] },
    { route: "Mt. Moon", pokemon: ["Zubat", "Geodude", "Clefairy", "Paras", "Lunatone", "Solrock"] },
    { route: "Route 9", pokemon: ["Rattata", "Spearow", "Electrike", "Magnemite"] },
    { route: "Route 10", pokemon: ["Voltorb", "Magnemite", "Electabuzz", "Jolteon"] },
    { route: "Rock Tunnel", pokemon: ["Zubat", "Geodude", "Machop", "Onix", "Larvitar"] },
    { route: "Route 12", pokemon: ["Snorlax", "Pidgey", "Oddish", "Scyther"] },
    { route: "Safari Zone", pokemon: ["Nidoran♀", "Nidoran♂", "Heracross", "Tauros", "Kangaskhan", "Chansey", "Larvitar", "Bagon"] },
    { route: "Seafoam Islands", pokemon: ["Swinub", "Dewgong", "Slowpoke", "Sneasel", "Articuno"] },
    { route: "Power Plant", pokemon: ["Voltorb", "Electrode", "Magneton", "Raichu", "Zapdos"] },
    { route: "Victory Road", pokemon: ["Golbat", "Geodude", "Graveler", "Machoke", "Onix", "Gabite"] },
    { route: "Route 23", pokemon: ["Ekans", "Fearow", "Ditto", "Dragonair"] },
    { route: "Cerulean Cave", pokemon: ["Golbat", "Graveler", "Ditto", "Chansey", "Mewtwo"] },
  ],
};

const NUZLOCKE_NOTES = {
  magikarp: "Useless until lv20 — only worth it if you have patience for Gyarados.",
  gyarados: "One of the best water types. Intimidate + great moveset. S-tier pickup.",
  snorlax: "Incredible wall. Thick Fat + huge HP. Must catch if possible.",
  geodude: "Great early game, becomes Graveler/Golem. Sturdy is clutch.",
  zubat: "Annoying encounter but Crobat is actually solid late game.",
  golbat: "Evolves into Crobat with friendship. Worth grinding.",
  gastly: "Gengar is S-tier. Prioritize catching if you see one.",
  ralts: "Gardevoir/Gallade are both excellent. High priority catch.",
  larvitar: "Tyranitar is top tier. Worth the wait to evolve.",
  bagon: "Salamence is S-tier. Extremely high value catch.",
  dratini: "Dragonite payoff is worth it. Protect it early.",
  mewtwo: "Obviously S-tier legendary. Auto-include.",
  chansey: "Blissey wall is incredible for tank runs.",
  heracross: "Guts + Megahorn is devastating. A-tier minimum.",
  scyther: "Fast with high attack. Scizor (if available) is even better.",
  tauros: "Surprisingly good normal type. High speed + attack.",
  kangaskhan: "Scrappy ability ignores ghost immunity. Very solid.",
  abra: "Alakazam is S-tier. Catch immediately, it teleports away fast.",
  machop: "Machamp with No Guard + Dynamic Punch is a monster.",
  clefairy: "Magic Guard Clefable is incredible. Highly underrated.",
};

// ─── Pokemon Modal ───────────────────────────────────────────────────────────
function PokemonModal({ name, onClose, userTiers, onTierChange }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const key = name.toLowerCase().replace(/[♀♂]/g, m => m === "♀" ? "-f" : "-m").replace(/\s+/g, "-");
    fetch(`https://pokeapi.co/api/v2/pokemon/${key}`)
      .then(r => r.ok ? r.json() : Promise.reject("Not found"))
      .then(async d => {
        const specRes = await fetch(d.species.url);
        const spec = await specRes.json();
        setData({ ...d, species: spec });
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [name]);

  const bst = data ? data.stats.reduce((s, st) => s + st.base_stat, 0) : 0;
  const tier = userTiers[name] || (data ? calcTier(name, bst) : "?");
  const note = NUZLOCKE_NOTES[name.toLowerCase()];
  const flavorText = data?.species.flavor_text_entries
    .find(e => e.language.name === "en")?.flavor_text.replace(/\f/g, " ");

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#141417] border border-white/10 rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-gray-500">
            <p>Couldn't load data for <span className="text-white">{name}</span></p>
            <button onClick={onClose} className="mt-4 text-emerald-400 text-sm">Close</button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-white/5">
              <div className="flex items-center gap-4">
                <img
                  src={data.sprites.other["official-artwork"].front_default || data.sprites.front_default}
                  alt={name}
                  className="w-20 h-20 object-contain"
                />
                <div>
                  <h2 className="text-xl font-bold text-white capitalize" style={{ fontFamily: "Outfit" }}>{name}</h2>
                  <p className="text-gray-500 text-xs">#{String(data.id).padStart(3, "0")} · BST {bst}</p>
                  <div className="flex gap-1 mt-1.5">
                    {data.types.map(t => (
                      <span key={t.type.name} className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${TYPE_STYLE[t.type.name] || "bg-gray-700 text-gray-300"}`}>
                        {t.type.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Tier */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Nuzlocke Tier</p>
                <div className="flex gap-2">
                  {["S","A","B","C","D","F"].map(t => (
                    <button
                      key={t}
                      onClick={() => onTierChange(name, t)}
                      className={`w-9 h-9 rounded-lg border font-bold text-sm transition-all ${
                        tier === t ? TIER_STYLE[t] : "border-white/5 text-gray-600 hover:border-white/20"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nuzlocke note */}
              {note && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-1">Nuzlocke Tip</p>
                  <p className="text-gray-300 text-sm">{note}</p>
                </div>
              )}

              {/* Flavor text */}
              {flavorText && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Pokédex</p>
                  <p className="text-gray-400 text-sm italic">{flavorText}</p>
                </div>
              )}

              {/* Base Stats */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Base Stats</p>
                <div className="space-y-1.5">
                  {data.stats.map(s => {
                    const pct = Math.round((s.base_stat / 255) * 100);
                    const color = s.base_stat >= 100 ? "bg-emerald-500" : s.base_stat >= 70 ? "bg-yellow-500" : "bg-red-500";
                    return (
                      <div key={s.stat.name} className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs w-20 capitalize">{s.stat.name.replace("-", " ")}</span>
                        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-gray-400 text-xs font-mono w-8 text-right">{s.base_stat}</span>
                      </div>
                    );
                  })}
                  <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                    <span className="text-gray-400 text-xs w-20 font-bold">Total</span>
                    <div className="flex-1" />
                    <span className="text-white text-xs font-mono font-bold w-8 text-right">{bst}</span>
                  </div>
                </div>
              </div>

              {/* Abilities */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Abilities</p>
                <div className="flex flex-wrap gap-2">
                  {data.abilities.map(a => (
                    <span key={a.ability.name} className={`text-xs px-2 py-1 rounded border capitalize ${a.is_hidden ? "border-purple-500/30 text-purple-400 bg-purple-500/10" : "border-white/10 text-gray-300 bg-white/5"}`}>
                      {a.ability.name.replace("-", " ")}{a.is_hidden ? " (HA)" : ""}
                    </span>
                  ))}
                </div>
              </div>

              {/* Moves sample */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Level-up Moves (sample)</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.moves
                    .filter(m => m.version_group_details.some(v => v.move_learn_method.name === "level-up"))
                    .slice(0, 12)
                    .map(m => (
                      <span key={m.move.name} className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-400 capitalize">
                        {m.move.name.replace("-", " ")}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function RouteBrowser() {
  const [game, setGame] = useState("Pokemon Emerald");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});
  const [selected, setSelected] = useState(null);
  const [userTiers, setUserTiers] = useState({});

  const routes = ROUTE_DATA[game] || [];
  const filtered = routes.filter(r =>
    r.route.toLowerCase().includes(search.toLowerCase()) ||
    r.pokemon.some(p => p.toLowerCase().includes(search.toLowerCase()))
  );

  const toggle = (route) => setExpanded(e => ({ ...e, [route]: !e[route] }));
  const handleTierChange = (name, tier) => setUserTiers(t => ({ ...t, [name]: tier }));

  return (
    <div className="min-h-screen bg-[#0A0A0C]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "Outfit" }}>Route Browser</h1>
          <p className="text-gray-500 text-sm mt-1">Browse encounter Pokémon by route. Click any Pokémon for full info & tier.</p>
        </div>

        {/* Game selector */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {Object.keys(ROUTE_DATA).map(g => (
            <button
              key={g}
              onClick={() => { setGame(g); setExpanded({}); }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                game === g
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "border-white/5 text-gray-500 hover:text-gray-300 hover:border-white/10"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search route or Pokémon..."
            className="w-full bg-[#141417] border border-white/5 focus:border-emerald-500/50 text-white placeholder-gray-600 text-sm pl-9 pr-4 py-2.5 rounded-lg outline-none transition-colors"
          />
        </div>

        {/* Routes */}
        <div className="space-y-2">
          {filtered.map(({ route, pokemon }) => (
            <div key={route} className="bg-[#141417] border border-white/5 rounded-xl overflow-hidden">
              <button
                onClick={() => toggle(route)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/2 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-emerald-500" />
                  <span className="text-white font-medium text-sm" style={{ fontFamily: "Outfit" }}>{route}</span>
                  <span className="text-gray-600 text-xs">{pokemon.length} encounters</span>
                </div>
                {expanded[route] ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
              </button>

              {expanded[route] && (
                <div className="px-4 pb-4 grid grid-cols-2 sm:grid-cols-3 gap-2 border-t border-white/5 pt-3">
                  {pokemon.map(p => {
                    const tier = userTiers[p];
                    return (
                      <button
                        key={p}
                        onClick={() => setSelected(p)}
                        className="flex items-center justify-between bg-[#0A0A0C] hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-lg px-3 py-2 transition-all group"
                      >
                        <span className="text-gray-300 text-sm capitalize group-hover:text-white transition-colors">{p}</span>
                        {tier && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${TIER_STYLE[tier]}`}>{tier}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-600 text-sm">No routes or Pokémon match your search.</div>
          )}
        </div>
      </div>

      {selected && (
        <PokemonModal
          name={selected}
          onClose={() => setSelected(null)}
          userTiers={userTiers}
          onTierChange={handleTierChange}
        />
      )}
    </div>
  );
}
