import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, X, Loader2, Map, Search } from "lucide-react";
import Navbar from "./Navbar";

// ─── Fixed Tier Data ─────────────────────────────────────────────────────────
// Community-curated Nuzlocke tiers — not changeable by user

const FIXED_TIERS = {
  // S Tier — game-changing, near auto-win
  mewtwo:"S", mew:"S", rayquaza:"S", kyogre:"S", groudon:"S", lugia:"S", "ho-oh":"S",
  garchomp:"S", dragonite:"S", salamence:"S", metagross:"S", tyranitar:"S",
  gengar:"S", alakazam:"S", gyarados:"S", snorlax:"S", starmie:"S",
  espeon:"S", vaporeon:"S", zapdos:"S", moltres:"S", articuno:"S",
  heracross:"S", scizor:"S", machamp:"S",

  // A Tier — excellent, strong carries
  arcanine:"A", lapras:"A", tauros:"A", exeggutor:"A", jolteon:"A",
  flareon:"A", nidoking:"A", nidoqueen:"A", cloyster:"A", rhydon:"A",
  togekiss:"A", lucario:"A", garchomp:"S", aggron:"A", blaziken:"A",
  swampert:"A", gardevoir:"A", breloom:"A", flygon:"A", absol:"A",
  altaria:"A", milotic:"A", donphan:"A", lanturn:"A", ampharos:"A",
  heracross:"S", typhlosion:"A", feraligatr:"A", meganium:"B",

  // B Tier — good, reliable contributors
  venusaur:"B", charizard:"B", blastoise:"B", pikachu:"C", raichu:"B",
  sandslash:"B", clefable:"B", wigglytuff:"C", golem:"B", rapidash:"B",
  slowbro:"B", magneton:"B", dodrio:"B", dewgong:"B", muk:"C",
  hypno:"B", electrode:"B", starmie:"S", kangaskhan:"B", pinsir:"B",
  electabuzz:"B", magmar:"B", jynx:"B", aerodactyl:"B", omastar:"B",
  kabutops:"B", victreebel:"B", tentacruel:"B", graveler:"C",
  haunter:"B", growlithe:"A", vulpix:"B", ninetales:"B",
  quagsire:"B", umbreon:"B", politoed:"B", sunflora:"D", jumpluff:"C",
  aipom:"D", yanma:"C", girafarig:"C", dunsparce:"D", sneasel:"B",
  piloswine:"B", delibird:"F", qwilfish:"C", shuckle:"D", heracross:"S",
  granbull:"C", corsola:"D", remoraid:"C", octillery:"B", mantine:"C",
  skarmory:"A", houndoom:"A", kingdra:"A", phanpy:"C", donphan:"A",
  porygon2:"B", stantler:"C", smeargle:"D", tyrogue:"C", hitmontop:"B",
  smoochum:"C", elekid:"B", magby:"B", miltank:"A", blissey:"A",
  raikou:"A", entei:"A", suicune:"A",

  // C Tier — usable but unreliable or outclassed
  butterfree:"C", beedrill:"D", pidgeot:"C", raticate:"D", fearow:"C",
  arbok:"C", raichu:"C", clefairy:"C", jigglypuff:"D", zubat:"D",
  golbat:"C", oddish:"C", paras:"D", venonat:"D", diglett:"C",
  meowth:"D", psyduck:"C", mankey:"C", poliwag:"C", abra:"B",
  bellsprout:"C", tentacool:"C", ponyta:"B", slowpoke:"C",
  magnemite:"C", farfetchd:"D", shellder:"C", gastly:"B",
  onix:"D", drowzee:"C", krabby:"C", voltorb:"C", exeggcute:"C",
  cubone:"C", hitmonlee:"B", hitmonchan:"B", lickitung:"D",
  koffing:"C", weezing:"B", rhyhorn:"C", chansey:"B", tangela:"C",
  horsea:"B", seadra:"B", goldeen:"D", seaking:"C", staryu:"B",
  mr-mime:"C", scyther:"A", jynx:"C", pinsir:"B", magikarp:"F",
  eevee:"C", porygon:"C", omanyte:"B", kabuto:"B", dratini:"B",

  // D Tier — poor, situational at best
  caterpie:"F", metapod:"F", weedle:"F", kakuna:"F", pidgey:"D",
  rattata:"D", spearow:"D", ekans:"D", sandshrew:"D", nidoran:"D",
  clefairy:"D", vulpix:"C", meowth:"D", psyduck:"C", golduck:"B",
  growlithe:"B", seel:"D", shellder:"C", krabby:"D", kingler:"C",
  exeggcute:"D", lickitung:"D", koffing:"C", rhyhorn:"C",
  horsea:"C", seaking:"D", mr-mime:"D", tauros:"A",

  // F Tier — essentially useless in Nuzlocke
  magikarp:"F", sunkern:"F", unown:"F", wobbuffet:"F", delibird:"F",
  wurmple:"F", silcoon:"F", cascoon:"F", beautifly:"D", dustox:"D",
  zigzagoon:"D", whismur:"D", nincada:"D",
};

const TIER_STYLE = {
  S: "bg-red-500/20 text-red-300 border-red-500/30",
  A: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  B: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  C: "bg-green-500/20 text-green-300 border-green-500/30",
  D: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  F: "bg-gray-500/20 text-gray-400 border-gray-500/20",
  "?": "bg-gray-800/50 text-gray-600 border-gray-700/30",
};

const TYPE_STYLE = {
  fire:"bg-orange-500/20 text-orange-300", water:"bg-blue-500/20 text-blue-300",
  grass:"bg-green-500/20 text-green-300", electric:"bg-yellow-500/20 text-yellow-300",
  psychic:"bg-pink-500/20 text-pink-300", ice:"bg-cyan-500/20 text-cyan-300",
  dragon:"bg-indigo-500/20 text-indigo-300", dark:"bg-gray-700/50 text-gray-300",
  fighting:"bg-red-700/30 text-red-300", poison:"bg-purple-500/20 text-purple-300",
  ground:"bg-yellow-700/30 text-yellow-200", rock:"bg-yellow-600/20 text-yellow-400",
  bug:"bg-lime-500/20 text-lime-300", ghost:"bg-purple-700/30 text-purple-300",
  steel:"bg-slate-500/20 text-slate-300", normal:"bg-gray-500/20 text-gray-300",
  flying:"bg-sky-500/20 text-sky-300", fairy:"bg-pink-300/20 text-pink-200",
};

const NUZLOCKE_NOTES = {
  magikarp: "Useless until lv20 — only worth it if patient for Gyarados.",
  gyarados: "S-tier pickup. Dragon Dance is broken. Intimidate on switch.",
  snorlax: "Massive HP and SpDef. Thick Fat halves Fire and Ice. Auto-include.",
  gengar: "S-tier special attacker. Levitate for Ground immunity. Nasty Plot wins games.",
  alakazam: "Frail but hits incredibly hard. Magic Guard prevents chip damage.",
  heracross: "Guts + Megahorn is devastating. Must-have if available.",
  scizor: "Bullet Punch + Technician + 1 weakness. One of the best in the game.",
  garchomp: "Incredible speed and attack. Rough Skin punishes contact.",
  salamence: "Moxie snowballs after kills. Dragon Dance set is terrifying.",
  metagross: "Only 2 weaknesses. Clear Body prevents stat drops. Hammer Arm in TR.",
  tyranitar: "Sets sand automatically. Pursuit trapping was legendary.",
  togekiss: "60% flinch chance with Air Slash + Serene Grace. Infuriating to face.",
  blissey: "Enormous HP and SpDef. Natural Cure. Nearly unkillable special wall.",
  chansey: "Same as Blissey pre-evolution. Eviolite makes it even bulkier.",
  absol: "Super Luck + Scope Lens = 50% crit rate. Swords Dance hits hard.",
  milotic: "Marvel Scale with status. Recover keeps it healthy forever.",
  skarmory: "Only 2 weaknesses. Whirlwind phazes setups. Incredible defensive typing.",
  dragonite: "Multiscale at full HP. Dragon Dance sweeper. Only weakness is Ice.",
  lapras: "Rare and powerful. Water/Ice typing covers a lot. Excellent bulk.",
  zapdos: "Electric/Flying is fantastic typing. Discharge paralysis is clutch.",
};

// ─── Route Data ──────────────────────────────────────────────────────────────

const ROUTE_DATA = {
  "Pokemon Emerald": [
    { route:"Route 101", pokemon:["Poochyena","Zigzagoon","Wurmple"] },
    { route:"Route 102", pokemon:["Poochyena","Zigzagoon","Wurmple","Ralts","Seedot","Lotad"] },
    { route:"Route 103", pokemon:["Poochyena","Zigzagoon","Wingull"] },
    { route:"Route 104", pokemon:["Poochyena","Zigzagoon","Wingull","Marill"] },
    { route:"Petalburg Woods", pokemon:["Wurmple","Silcoon","Cascoon","Taillow","Shroomish","Slakoth"] },
    { route:"Route 110", pokemon:["Poochyena","Electrike","Plusle","Minun","Oddish","Wingull"] },
    { route:"Route 111", pokemon:["Sandshrew","Trapinch","Cacnea","Baltoy"] },
    { route:"Route 114", pokemon:["Lotad","Lombre","Seviper","Zangoose","Swablu"] },
    { route:"Route 115", pokemon:["Swablu","Jigglypuff","Taillow","Nosepass"] },
    { route:"Route 117", pokemon:["Poochyena","Roselia","Volbeat","Illumise","Marill"] },
    { route:"Route 119", pokemon:["Oddish","Gloom","Tropius","Zigzagoon","Kecleon"] },
    { route:"Route 120", pokemon:["Absol","Kecleon","Oddish","Marill"] },
    { route:"Route 121", pokemon:["Shuppet","Duskull","Kecleon","Oddish"] },
    { route:"Safari Zone", pokemon:["Pikachu","Geodude","Psyduck","Wobbuffet","Phanpy","Heracross"] },
    { route:"Victory Road", pokemon:["Golbat","Hariyama","Graveler","Machoke","Mightyena"] },
  ],
  "Pokemon FireRed": [
    { route:"Route 1", pokemon:["Pidgey","Rattata"] },
    { route:"Route 2", pokemon:["Pidgey","Rattata","Caterpie","Weedle"] },
    { route:"Route 3", pokemon:["Spearow","Jigglypuff","Mankey"] },
    { route:"Route 4", pokemon:["Spearow","Ekans","Sandshrew"] },
    { route:"Mt. Moon", pokemon:["Zubat","Geodude","Clefairy","Paras"] },
    { route:"Route 9", pokemon:["Rattata","Spearow","Ekans","Sandshrew"] },
    { route:"Route 10", pokemon:["Voltorb","Magnemite","Electabuzz"] },
    { route:"Rock Tunnel", pokemon:["Zubat","Geodude","Machop","Onix"] },
    { route:"Route 12", pokemon:["Snorlax","Pidgey","Ekans","Oddish"] },
    { route:"Route 15", pokemon:["Ditto","Jigglypuff","Gloom","Venomoth"] },
    { route:"Safari Zone", pokemon:["Nidoran♀","Nidoran♂","Paras","Venonat","Scyther","Pinsir","Tauros","Kangaskhan","Chansey"] },
    { route:"Route 21", pokemon:["Tangela","Rattata","Pidgey"] },
    { route:"Victory Road", pokemon:["Zubat","Geodude","Graveler","Machoke","Venomoth","Onix"] },
    { route:"Seafoam Islands", pokemon:["Zubat","Golbat","Dewgong","Slowpoke","Articuno"] },
    { route:"Power Plant", pokemon:["Voltorb","Magnemite","Electabuzz","Zapdos"] },
  ],
  "Pokemon Radical Red": [
    { route:"Route 1", pokemon:["Pidgey","Rattata","Sentret","Hoppip"] },
    { route:"Route 2", pokemon:["Pidgey","Rattata","Caterpie","Weedle","Nincada"] },
    { route:"Route 3", pokemon:["Spearow","Jigglypuff","Mankey","Meditite","Makuhita"] },
    { route:"Route 4", pokemon:["Spearow","Ekans","Sandshrew","Trapinch"] },
    { route:"Mt. Moon", pokemon:["Zubat","Geodude","Clefairy","Paras","Lunatone","Solrock"] },
    { route:"Route 9", pokemon:["Rattata","Spearow","Electrike","Magnemite"] },
    { route:"Route 10", pokemon:["Voltorb","Magnemite","Electabuzz","Jolteon"] },
    { route:"Rock Tunnel", pokemon:["Zubat","Geodude","Machop","Onix","Larvitar"] },
    { route:"Route 12", pokemon:["Snorlax","Pidgey","Oddish","Scyther"] },
    { route:"Safari Zone", pokemon:["Nidoran♀","Nidoran♂","Heracross","Tauros","Kangaskhan","Chansey","Larvitar","Bagon"] },
    { route:"Seafoam Islands", pokemon:["Swinub","Dewgong","Slowpoke","Sneasel","Articuno"] },
    { route:"Power Plant", pokemon:["Voltorb","Electrode","Magneton","Raichu","Zapdos"] },
    { route:"Victory Road", pokemon:["Golbat","Geodude","Graveler","Machoke","Onix","Gabite"] },
    { route:"Route 23", pokemon:["Ekans","Fearow","Ditto","Dragonair"] },
    { route:"Cerulean Cave", pokemon:["Golbat","Graveler","Ditto","Chansey","Mewtwo"] },
  ],
};

// ─── PokeAPI mini-cache for types ─────────────────────────────────────────────
const typeCache = {};

function usePokemonType(name) {
  const [types, setTypes] = useState(null);
  const key = name.toLowerCase().replace(/[♀♂]/g, m => m==="♀"?"-f":"-m").replace(/\s+/g,"-");

  useEffect(() => {
    if (typeCache[key]) { setTypes(typeCache[key]); return; }
    fetch(`https://pokeapi.co/api/v2/pokemon/${key}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) {
          const t = d.types.map(t => t.type.name);
          typeCache[key] = t;
          setTypes(t);
        }
      }).catch(()=>{});
  }, [key]);

  return types;
}

// ─── Pokémon Card ─────────────────────────────────────────────────────────────

function PokemonCard({ name, onSelect }) {
  const types = usePokemonType(name);
  const tierKey = name.toLowerCase().replace(/[♀♂\s]/g,"-");
  const tier = FIXED_TIERS[tierKey] || FIXED_TIERS[name.toLowerCase()] || "?";

  return (
    <button
      onClick={() => onSelect(name)}
      className="flex items-center justify-between bg-[#0A0A0C] hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-lg px-3 py-2 transition-all group w-full"
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-gray-300 text-sm capitalize group-hover:text-white transition-colors truncate">{name}</span>
        {types && (
          <div className="flex gap-1 flex-shrink-0">
            {types.map(t => (
              <span key={t} className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${TYPE_STYLE[t]||"bg-gray-700 text-gray-300"}`}>{t.slice(0,3)}</span>
            ))}
          </div>
        )}
      </div>
      <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded border flex-shrink-0 ml-2 ${TIER_STYLE[tier]}`}>{tier}</span>
    </button>
  );
}

// ─── Pokemon Detail Panel ─────────────────────────────────────────────────────

function PokemonDetail({ name, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const key = name.toLowerCase().replace(/[♀♂]/g, m => m==="♀"?"-f":"-m").replace(/\s+/g,"-");
  const tier = FIXED_TIERS[name.toLowerCase().replace(/[♀♂\s]/g,"-")] || FIXED_TIERS[name.toLowerCase()] || "?";
  const note = NUZLOCKE_NOTES[name.toLowerCase()];

  useEffect(() => {
    setLoading(true); setData(null);
    Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${key}`).then(r=>r.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${key}`).then(r=>r.json()),
    ]).then(([p,s]) => { setData({p,s}); setLoading(false); })
    .catch(()=>setLoading(false));
  }, [key]);

  const bst = data ? data.p.stats.reduce((sum,s)=>sum+s.base_stat,0) : 0;
  const sprite = data?.p?.sprites?.other?.["official-artwork"]?.front_default || data?.p?.sprites?.front_default;
  const flavor = data?.s?.flavor_text_entries?.find(e=>e.language.name==="en")?.flavor_text?.replace(/\f/g," ");

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#141417] border border-white/10 rounded-xl w-full max-w-md shadow-2xl max-h-[85vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-7 h-7 text-emerald-400 animate-spin" /></div>
        ) : !data ? (
          <div className="p-8 text-center"><p className="text-gray-500">No data found.</p><button onClick={onClose} className="mt-3 text-emerald-400 text-sm">Close</button></div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start gap-4 p-5 border-b border-white/5">
              {sprite && <img src={sprite} alt={name} className="w-20 h-20 object-contain flex-shrink-0" style={{imageRendering:"pixelated"}} />}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-mono">#{String(data.p.id).padStart(3,"0")}</p>
                    <h2 className="text-xl font-bold text-white capitalize" style={{fontFamily:"Outfit"}}>{name}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold px-2 py-1 rounded border ${TIER_STYLE[tier]}`}>{tier}</span>
                    <button onClick={onClose} className="text-gray-600 hover:text-white p-1"><X className="w-5 h-5"/></button>
                  </div>
                </div>
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {data.p.types.map(t=>(
                    <span key={t.type.name} className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${TYPE_STYLE[t.type.name]||"bg-gray-700 text-gray-300"}`}>{t.type.name}</span>
                  ))}
                </div>
                <p className="text-gray-600 text-xs mt-1">BST <span className="text-gray-300 font-mono font-bold">{bst}</span></p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Tier explanation */}
              <div className={`rounded-lg px-3 py-2.5 border text-xs ${TIER_STYLE[tier]}`}>
                <p className="font-bold uppercase tracking-wider mb-1 opacity-70">Nuzlocke Tier: {tier}</p>
                <p className="opacity-80 leading-relaxed">
                  {tier==="S" && "Game-changing. Near auto-win if caught. Prioritize above all else."}
                  {tier==="A" && "Excellent contributor. Strong carry that will take you far."}
                  {tier==="B" && "Solid and reliable. Worth using if nothing better is available."}
                  {tier==="C" && "Usable but outclassed. Good for early game, replace when possible."}
                  {tier==="D" && "Poor. Only use if desperate or doing a challenge run."}
                  {tier==="F" && "Essentially useless. Avoid unless you enjoy pain."}
                  {tier==="?" && "Tier not yet rated for this Pokémon."}
                </p>
              </div>

              {/* Nuzlocke note */}
              {note && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                  <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">Nuzlocke Tip</p>
                  <p className="text-gray-300 text-xs leading-relaxed">{note}</p>
                </div>
              )}

              {/* Flavor */}
              {flavor && <p className="text-gray-500 text-xs italic leading-relaxed">{flavor}</p>}

              {/* Stats */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Base Stats</p>
                <div className="space-y-1.5">
                  {data.p.stats.map(s => {
                    const pct = Math.round((s.base_stat/255)*100);
                    const color = s.base_stat>=100?"#34d399":s.base_stat>=70?"#fbbf24":"#f87171";
                    return (
                      <div key={s.stat.name} className="flex items-center gap-2">
                        <span className="text-gray-600 text-xs w-8 capitalize">{s.stat.name.replace("special-","sp.").replace("attack","atk").replace("defense","def")}</span>
                        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div style={{width:`${pct}%`,background:color}} className="h-full rounded-full" />
                        </div>
                        <span className="text-gray-400 text-xs font-mono w-7 text-right">{s.base_stat}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Abilities */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Abilities</p>
                <div className="flex flex-wrap gap-2">
                  {data.p.abilities.map(a=>(
                    <span key={a.ability.name} className={`text-xs px-2 py-1 rounded border capitalize ${a.is_hidden?"border-purple-500/30 text-purple-400 bg-purple-500/10":"border-white/10 text-gray-300 bg-white/5"}`}>
                      {a.ability.name.replace(/-/g," ")}{a.is_hidden?" (HA)":""}
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

// ─── Main ────────────────────────────────────────────────────────────────────

export default function RouteBrowser() {
  const [game, setGame] = useState("Pokemon Emerald");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});
  const [selected, setSelected] = useState(null);

  const routes = ROUTE_DATA[game] || [];
  const filtered = routes.filter(r =>
    r.route.toLowerCase().includes(search.toLowerCase()) ||
    r.pokemon.some(p => p.toLowerCase().includes(search.toLowerCase()))
  );

  const toggle = (route) => setExpanded(e => ({ ...e, [route]: !e[route] }));

  // Tier legend counts
  const tierCounts = { S:0, A:0, B:0, C:0, D:0, F:0 };
  routes.forEach(r => r.pokemon.forEach(p => {
    const k = p.toLowerCase().replace(/[♀♂\s]/g,"-");
    const t = FIXED_TIERS[k] || FIXED_TIERS[p.toLowerCase()] || null;
    if (t && tierCounts[t] !== undefined) tierCounts[t]++;
  }));

  return (
    <div className="min-h-screen bg-[#0A0A0C]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white" style={{fontFamily:"Outfit"}}>Route Browser</h1>
          <p className="text-gray-500 text-sm mt-1">Click any Pokémon to see full info. Tiers are community-curated Nuzlocke ratings.</p>
        </div>

        {/* Tier legend */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(TIER_STYLE).filter(([t])=>t!=="?").map(([tier, style]) => (
            <div key={tier} className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded border ${style}`}>
              <span className="font-bold">{tier}</span>
              <span className="opacity-60 text-[10px]">
                {tier==="S"?"Must catch":tier==="A"?"Excellent":tier==="B"?"Solid":tier==="C"?"Usable":tier==="D"?"Poor":"Skip"}
              </span>
            </div>
          ))}
        </div>

        {/* Game selector */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {Object.keys(ROUTE_DATA).map(g => (
            <button key={g} onClick={() => { setGame(g); setExpanded({}); }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${game===g ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "border-white/5 text-gray-500 hover:text-gray-300 hover:border-white/10"}`}>
              {g}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search route or Pokémon..."
            className="w-full bg-[#141417] border border-white/5 focus:border-emerald-500/50 text-white placeholder-gray-600 text-sm pl-9 pr-4 py-2.5 rounded-lg outline-none transition-colors" />
          {search && <button onClick={()=>setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white"><X className="w-3.5 h-3.5"/></button>}
        </div>

        {/* Routes */}
        <div className="space-y-2">
          {filtered.map(({ route, pokemon }) => (
            <div key={route} className="bg-[#141417] border border-white/5 rounded-xl overflow-hidden">
              <button onClick={() => toggle(route)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-white font-medium text-sm" style={{fontFamily:"Outfit"}}>{route}</span>
                  <span className="text-gray-600 text-xs">{pokemon.length} encounters</span>
                </div>
                {expanded[route] ? <ChevronUp className="w-4 h-4 text-gray-600"/> : <ChevronDown className="w-4 h-4 text-gray-600"/>}
              </button>

              {expanded[route] && (
                <div className="px-3 pb-3 border-t border-white/5 pt-2 space-y-1">
                  {pokemon.map(p => (
                    <PokemonCard key={p} name={p} onSelect={setSelected} />
                  ))}
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center py-16 text-gray-600 text-sm">No results.</div>}
        </div>
      </div>

      {selected && <PokemonDetail name={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
