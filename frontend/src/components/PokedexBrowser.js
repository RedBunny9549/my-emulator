import { useState, useEffect } from "react";
import { Search, Loader2, X, Info } from "lucide-react";

// Nuzlocke Tiers
const FIXED_TIERS = {
  mewtwo:"S", rayquaza:"S", kyogre:"S", groudon:"S", lugia:"S", "ho-oh":"S",
  garchomp:"S", salamence:"S", metagross:"S", tyranitar:"S",
  gengar:"S", alakazam:"S", gyarados:"S", snorlax:"S", starmie:"S",
  zapdos:"S", moltres:"S", articuno:"S", heracross:"S", scizor:"S", machamp:"S",
  arcanine:"A", lapras:"A", tauros:"A", exeggutor:"A", jolteon:"A",
  togekiss:"A", lucario:"A", blaziken:"A", swampert:"A", gardevoir:"A", 
  breloom:"A", milotic:"A", skarmory:"A", miltank:"A", blissey:"A",
  venusaur:"B", charizard:"B", blastoise:"B", pikachu:"C", raichu:"B",
};

const RECOMMENDED_SETS = {
  gyarados: "Dragon Dance is incredibly broken. Intimidate on switch-in makes it a top-tier physical sweeper.",
  snorlax: "Massive HP and SpDef. Thick Fat halves Fire and Ice damage. Curse set turns it into an unstoppable tank.",
  gengar: "S-tier special attacker. Fast with Nasty Plot setup potential. Levitate (pre-Gen 6) gives Ground immunity.",
};

const GEN_RANGES = {
  1: { min:1, max:151, name:"Gen I" },
  2: { min:152, max:251, name:"Gen II" },
  3: { min:252, max:386, name:"Gen III" },
  4: { min:387, max:493, name:"Gen IV" },
  5: { min:494, max:649, name:"Gen V" },
  6: { min:650, max:721, name:"Gen VI" },
  7: { min:722, max:809, name:"Gen VII" },
  8: { min:810, max:905, name:"Gen VIII" },
  9: { min:906, max:1025, name:"Gen IX" },
  0: { min:1, max:1025, name:"All" }
};

function AdvancedPokedexModal({ id, onClose }) {
  const [data, setData] = useState(null);
  const [species, setSpecies] = useState(null);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(r=>r.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(r=>r.json())
    ]).then(([p, s]) => {
      setData(p);
      setSpecies(s);
    }).catch(()=>{});
  }, [id]);

  if (!data || !species) return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500 w-8 h-8" />
    </div>
  );

  const flavorText = species.flavor_text_entries.find(f => f.language.name === "en")?.flavor_text.replace(/\f/g, " ");
  const tier = FIXED_TIERS[data.name] || "Unranked";
  const rec = RECOMMENDED_SETS[data.name];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#16161A] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e=>e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 font-mono text-xs">#{String(data.id).padStart(3, '0')}</p>
              <h2 className="text-3xl font-black text-white capitalize">{data.name.replace("-"," ")}</h2>
            </div>
            <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10"><X className="text-gray-400 w-5 h-5" /></button>
          </div>
          <div className="flex gap-2 mb-4">
            {data.types.map(t => <span key={t.type.name} className="px-3 py-1 bg-gray-800 text-white text-xs font-bold uppercase rounded border border-gray-600">{t.type.name}</span>)}
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase rounded ml-auto">Tier: {tier}</span>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="flex border-b border-white/10 px-6">
          {["info", "stats", "moves"].map(t => (
            <button 
              key={t} 
              onClick={() => setActiveTab(t)} 
              className={`py-3 mr-6 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === t ? "border-emerald-500 text-emerald-400" : "border-transparent text-gray-500 hover:text-white"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Scrollable Area */}
        <div className="p-6 overflow-y-auto">
          {activeTab === "info" && (
            <div className="space-y-6">
              <img src={data.sprites.other["official-artwork"].front_default || data.sprites.front_default} className="w-40 h-40 mx-auto drop-shadow-xl pixelated" alt={data.name} />
              <div className="bg-[#0D0D10] p-4 rounded-xl border border-white/5">
                <p className="text-gray-300 text-sm leading-relaxed italic">"{flavorText}"</p>
              </div>
              {rec && (
                <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-2"><Info className="w-4 h-4 text-emerald-400" /><span className="font-bold text-emerald-400 text-xs uppercase">Nuzlocke Strategy</span></div>
                  <p className="text-emerald-100/70 text-sm leading-relaxed">{rec}</p>
                </div>
              )}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Abilities</h3>
                {data.abilities.map(a => (
                  <div key={a.ability.name} className="bg-gray-800 px-3 py-2 rounded mb-2 flex justify-between">
                    <span className="text-white capitalize font-bold text-sm">{a.ability.name.replace("-"," ")}</span>
                    {a.is_hidden && <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 uppercase">Hidden</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="space-y-4 pt-2">
              {data.stats.map(s => (
                <div key={s.stat.name} className="flex items-center text-sm">
                  <span className="w-20 text-gray-400 uppercase font-bold text-xs tracking-wider">{s.stat.name.replace("special-","sp.")}</span>
                  <span className="w-10 text-right font-mono text-white font-bold">{s.base_stat}</span>
                  <div className="flex-1 h-3 bg-[#0D0D10] rounded-full mx-4 border border-white/5 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{width:`${Math.min(100, (s.base_stat / 255) * 100)}%`}} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "moves" && (
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-4">Level-Up Moves (Most Recent Gen)</p>
              <div className="grid grid-cols-1 gap-2">
                {data.moves
                  .filter(m => m.version_group_details[0].move_learn_method.name === "level-up")
                  .sort((a,b) => a.version_group_details[0].level_learned_at - b.version_group_details[0].level_learned_at)
                  .map(m => (
                    <div key={m.move.name} className="flex items-center justify-between bg-[#0D0D10] p-3 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="w-10 text-center bg-gray-800 text-gray-400 text-[10px] font-mono py-1 rounded">Lv.{m.version_group_details[0].level_learned_at}</span>
                        <span className="text-gray-200 capitalize font-bold text-sm">{m.move.name.replace("-"," ")}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function PokedexBrowser() {
  const [gen, setGen] = useState(3);
  const [allEntries, setAllEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    const { min, max } = GEN_RANGES[gen];
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${max - min + 1}&offset=${min - 1}`)
      .then(r => r.json())
      .then(data => {
        const entries = data.results.map((r, i) => ({
          id: min + i,
          name: r.name,
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${min + i}.png`
        }));
        setAllEntries(entries);
        setLoading(false);
      });
  }, [gen]);

  const filtered = allEntries.filter(p => p.name.includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-emerald-500">Pokédex</h1>
          <p className="text-gray-500 text-sm">Advanced Reference Database</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(GEN_RANGES).map(([key, info]) => (
            <button
              key={key}
              onClick={() => setGen(Number(key))}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all border ${
                gen === Number(key) 
                ? "bg-emerald-600 border-emerald-500 text-white" 
                : "bg-[#16161A] border-white/5 text-gray-500 hover:text-white"
              }`}
            >
              {info.name}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input 
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search Pokémon..." 
          className="w-full bg-[#16161A] border border-white/5 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-emerald-500/50 text-white transition-colors"
        />
      </div>

      {loading ? <Loader2 className="animate-spin mx-auto text-emerald-500 mt-20 w-8 h-8" /> : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {filtered.map(p => (
            <button key={p.id} onClick={() => setSelected(p.id)} className="bg-[#16161A] border border-white/5 p-4 rounded-2xl flex flex-col items-center hover:border-emerald-500/50 transition-all group cursor-pointer shadow-lg">
              <img src={p.sprite} className="w-16 h-16 group-hover:scale-110 transition-transform pixelated" alt={p.name} />
              <span className="text-[10px] font-mono text-gray-600 mt-2">#{String(p.id).padStart(3, '0')}</span>
              <span className="text-xs font-bold capitalize text-gray-300 mt-1">{p.name}</span>
            </button>
          ))}
        </div>
      )}
      {selected && <AdvancedPokedexModal id={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
