import { useState, useEffect } from "react";
import { Search, Loader2, LayoutGrid, X } from "lucide-react";

// Tiers injected so the detail modal can reference them locally without breaking builds
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
  heracross: "Guts + Flame Orb makes it terrifyingly powerful. Moxie for clean sweeping. One of the best Bug/Fighting combos.",
  scizor: "Bullet Punch + Technician is iconic. Only one weakness (Fire). Swords Dance + Bullet Punch is a win condition late-game.",
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

function PokedexModal({ id, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(r=>r.json()).then(d=>setData(d)).catch(()=>{});
  }, [id]);

  if (!data) return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500 w-8 h-8" />
    </div>
  );

  const tier = FIXED_TIERS[data.name] || "?";
  const rec = RECOMMENDED_SETS[data.name];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#16161A] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl p-6" onClick={e=>e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-500 font-mono text-xs">#{String(data.id).padStart(3, '0')}</p>
            <h2 className="text-2xl font-bold text-white capitalize">{data.name.replace("-"," ")}</h2>
          </div>
          <button onClick={onClose}><X className="text-gray-500 hover:text-white" /></button>
        </div>

        <div className="flex gap-2 mb-4">
          {data.types.map(t => <span key={t.type.name} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs font-bold uppercase rounded">{t.type.name}</span>)}
        </div>

        <img src={data.sprites.other["official-artwork"].front_default || data.sprites.front_default} className="w-32 h-32 mx-auto drop-shadow-lg" alt={data.name} />

        <div className="bg-gray-900 border border-white/5 rounded-xl p-4 mt-4">
          <p className="text-xs font-bold text-emerald-500 mb-1 uppercase tracking-widest">Nuzlocke Tier: {tier}</p>
          {rec ? <p className="text-gray-400 text-xs leading-relaxed">{rec}</p> : <p className="text-gray-500 text-xs italic">No specific recommendations documented yet.</p>}
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-xs font-bold uppercase text-gray-600 mb-2">Base Stats</p>
          {data.stats.map(s => (
            <div key={s.stat.name} className="flex items-center text-xs">
              <span className="w-16 text-gray-500 uppercase">{s.stat.name.replace("special-","sp.")}</span>
              <div className="flex-1 h-2 bg-gray-800 rounded-full mx-2"><div className="h-full bg-emerald-500 rounded-full" style={{width:`${Math.min(100, s.base_stat)}%`}} /></div>
              <span className="w-8 text-right font-mono text-gray-300">{s.base_stat}</span>
            </div>
          ))}
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
          <p className="text-gray-500 text-sm">Classic Reference</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(GEN_RANGES).map(([key, info]) => (
            <button
              key={key}
              onClick={() => setGen(Number(key))}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all border ${
                gen === Number(key) 
                ? "bg-emerald-600 border-emerald-500 text-white" 
                : "bg-white/5 border-white/10 text-gray-500 hover:text-white"
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
          className="w-full bg-[#16161A] border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-emerald-500/50 text-white"
        />
      </div>

      {loading ? <Loader2 className="animate-spin mx-auto text-emerald-500 mt-20 w-8 h-8" /> : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {filtered.map(p => (
            <button key={p.id} onClick={() => setSelected(p.id)} className="bg-[#16161A] border border-white/5 p-4 rounded-2xl flex flex-col items-center hover:border-emerald-500/30 transition-all group cursor-pointer">
              <img src={p.sprite} className="w-16 h-16 group-hover:scale-110 transition-transform pixelated" alt={p.name} />
              <span className="text-[10px] font-mono text-gray-600 mt-2">#{String(p.id).padStart(3, '0')}</span>
              <span className="text-xs font-bold capitalize text-gray-300 mt-1">{p.name}</span>
            </button>
          ))}
        </div>
      )}
      {selected && <PokedexModal id={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
