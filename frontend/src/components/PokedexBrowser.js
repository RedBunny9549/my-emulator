import { useState, useEffect } from "react";
import { Search, Loader2, X, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";

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

function AbilityRow({ name, isHidden }) {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!open && !data) {
      setLoading(true);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/ability/${name}`);
        const json = await res.json();
        const effect = json.effect_entries.find(e => e.language.name === "en")?.short_effect || "No description available.";
        setData(effect);
      } catch (err) { setData("Failed to load ability data."); }
      setLoading(false);
    }
    setOpen(!open);
  };

  return (
    <div className="bg-[#0D0D10] border border-white/5 rounded-xl mb-2 overflow-hidden transition-all">
      <button onClick={toggle} className="w-full px-4 py-3 flex justify-between items-center hover:bg-white/5">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold capitalize text-sm">{name.replace("-"," ")}</span>
          {isHidden && <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 uppercase">Hidden</span>}
        </div>
        {loading ? <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" /> : open ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>
      {open && data && (
        <div className="px-4 pb-4 text-sm text-gray-400 border-t border-white/5 pt-3 bg-black/20 leading-relaxed">
          {data}
        </div>
      )}
    </div>
  );
}

function MoveRow({ moveName, level }) {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!open && !data) {
      setLoading(true);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`);
        const json = await res.json();
        setData({
          type: json.type.name,
          category: json.damage_class.name,
          power: json.power || "-",
          acc: json.accuracy || "-",
          pp: json.pp,
          effect: json.effect_entries.find(e => e.language.name === "en")?.short_effect.replace("$effect_chance", json.effect_chance) || "No effect."
        });
      } catch (err) { setData({ effect: "Failed to load move data." }); }
      setLoading(false);
    }
    setOpen(!open);
  };

  return (
    <div className="bg-[#0D0D10] border border-white/5 rounded-xl mb-2 overflow-hidden transition-all">
      <button onClick={toggle} className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5">
        <div className="flex items-center gap-3">
          <span className="w-10 text-center bg-gray-800 text-gray-400 text-[10px] font-mono py-1 rounded">Lv.{level}</span>
          <span className="text-gray-200 capitalize font-bold text-sm">{moveName.replace("-"," ")}</span>
        </div>
        <div className="flex items-center gap-3">
          {data && <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${data.category === 'status' ? 'bg-gray-500/20 text-gray-300 border-gray-500/30' : data.category === 'physical' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>{data.category}</span>}
          {loading ? <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" /> : open ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </div>
      </button>
      {open && data && (
        <div className="px-4 pb-4 pt-3 border-t border-white/5 bg-black/20">
          <div className="flex gap-4 mb-3">
            <div className="bg-gray-900 px-3 py-1.5 rounded-lg border border-white/5">
              <p className="text-[9px] text-gray-500 uppercase font-bold">Type</p>
              <p className="text-xs font-bold text-white uppercase">{data.type}</p>
            </div>
            <div className="bg-gray-900 px-3 py-1.5 rounded-lg border border-white/5">
              <p className="text-[9px] text-gray-500 uppercase font-bold">Power</p>
              <p className="text-xs font-bold text-white font-mono">{data.power}</p>
            </div>
            <div className="bg-gray-900 px-3 py-1.5 rounded-lg border border-white/5">
              <p className="text-[9px] text-gray-500 uppercase font-bold">Accuracy</p>
              <p className="text-xs font-bold text-white font-mono">{data.acc}</p>
            </div>
            <div className="bg-gray-900 px-3 py-1.5 rounded-lg border border-white/5">
              <p className="text-[9px] text-gray-500 uppercase font-bold">PP</p>
              <p className="text-xs font-bold text-white font-mono">{data.pp}</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed italic border-l-2 border-emerald-500/50 pl-3">{data.effect}</p>
        </div>
      )}
    </div>
  );
}

// --- Dynamic Evolution Chain Parser ---
function EvolutionChain({ url }) {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!url) return;
    setLoading(true);
    fetch(url).then(r=>r.json()).then(d => {
      const newPaths = [];
      const traverse = (node, prevName = null, condition = null) => {
        if (prevName) {
          newPaths.push({ from: prevName, to: node.species.name, condition });
        }
        node.evolves_to.forEach(evo => {
          let cond = "Evolve";
          const det = evo.evolution_details[0]; // grab primary evolution method
          if (det) {
            if (det.trigger.name === 'level-up') {
              cond = `Lv. ${det.min_level || 'Up'}`;
              if (det.min_happiness) cond = "High Friendship";
              if (det.known_move) cond = `Knows ${det.known_move.name.replace("-"," ")}`;
              if (det.location) cond = `At ${det.location.name.replace("-"," ")}`;
            } else if (det.trigger.name === 'use-item') {
              cond = `${det.item.name.replace("-"," ")}`;
            } else if (det.trigger.name === 'trade') {
              cond = `Trade`;
              if (det.held_item) cond += ` + ${det.held_item.name.replace("-"," ")}`;
            }
            if (det.time_of_day) cond += ` (${det.time_of_day})`;
          }
          traverse(evo, node.species.name, cond);
        });
      };
      traverse(d.chain);
      setPaths(newPaths);
      setLoading(false);
    }).catch(()=>{ setLoading(false); });
  }, [url]);

  if (loading) return <Loader2 className="animate-spin text-emerald-500 w-4 h-4" />;
  if (paths.length === 0) return <p className="text-gray-500 text-xs italic">Does not evolve.</p>;

  return (
    <div className="flex flex-col gap-2">
      {paths.map((p, i) => (
        <div key={i} className="flex items-center gap-3 bg-[#0D0D10] border border-white/5 px-4 py-2.5 rounded-xl">
          <span className="text-white font-bold capitalize text-sm w-24">{p.from.replace("-"," ")}</span>
          <div className="flex-1 flex flex-col items-center justify-center">
            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest text-center">{p.condition}</span>
            <ArrowRight className="w-4 h-4 text-gray-600" />
          </div>
          <span className="text-white font-bold capitalize text-sm w-24 text-right">{p.to.replace("-"," ")}</span>
        </div>
      ))}
    </div>
  );
}

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

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#16161A] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e=>e.stopPropagation()}>
        
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
          </div>
        </div>

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

        <div className="p-6 overflow-y-auto">
          {activeTab === "info" && (
            <div className="space-y-6">
              <img src={data.sprites.other["official-artwork"].front_default || data.sprites.front_default} className="w-40 h-40 mx-auto drop-shadow-xl pixelated" alt={data.name} />
              
              <div className="bg-[#0D0D10] p-4 rounded-xl border border-white/5">
                <p className="text-gray-300 text-sm leading-relaxed italic">"{flavorText}"</p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Evolution Chain</h3>
                <EvolutionChain url={species.evolution_chain?.url} />
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest mt-6">Abilities</h3>
                {data.abilities.map(a => <AbilityRow key={a.ability.name} name={a.ability.name} isHidden={a.is_hidden} />)}
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
              <div className="pt-4 mt-4 border-t border-white/5 flex justify-between items-center px-2">
                <span className="text-gray-400 uppercase font-bold text-xs tracking-wider">Base Stat Total</span>
                <span className="font-mono text-emerald-400 font-black text-lg">{data.stats.reduce((acc, s) => acc + s.base_stat, 0)}</span>
              </div>
            </div>
          )}

          {activeTab === "moves" && (
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-4 tracking-widest">Level-Up Moves</p>
              <div className="grid grid-cols-1">
                {data.moves
                  .filter(m => m.version_group_details[0].move_learn_method.name === "level-up")
                  .sort((a,b) => a.version_group_details[0].level_learned_at - b.version_group_details[0].level_learned_at)
                  .map(m => <MoveRow key={m.move.name} moveName={m.move.name} level={m.version_group_details[0].level_learned_at} />)}
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
        const entries = data.results.map((r, i) => {
          const id = min + i;
          const sprite = id >= 906 
            ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
            : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
          return { id, name: r.name, sprite };
        });
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
          <p className="text-gray-500 text-sm">Official Information Base</p>
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
          className="w-full bg-[#16161A] border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-emerald-500/50 text-white transition-colors"
        />
      </div>

      {loading ? <Loader2 className="animate-spin mx-auto text-emerald-500 mt-20 w-8 h-8" /> : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {filtered.map(p => (
            <button key={p.id} onClick={() => setSelected(p.id)} className="bg-[#16161A] border border-white/5 p-4 rounded-2xl flex flex-col items-center hover:border-emerald-500/50 transition-all group cursor-pointer shadow-lg">
              <img src={p.sprite} className="w-16 h-16 group-hover:scale-110 transition-transform pixelated" alt={p.name} />
              <span className="text-[10px] font-mono text-gray-600 mt-2">#{String(p.id).padStart(3, '0')}</span>
              <span className="text-xs font-bold capitalize text-gray-300 mt-1 truncate w-full text-center">{p.name.replace("-"," ")}</span>
            </button>
          ))}
        </div>
      )}
      {selected && <AdvancedPokedexModal id={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
