import { useState, useEffect } from "react";
import { X, Loader2, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { api } from "../lib/pokemonClient";
import { TYPE_COLORS } from "../data/theme";

// Fixed Clickable Move Row
function MoveRow({ moveName }) {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = async (e) => {
    e.preventDefault(); // Prevents any weird bubbling
    if (!open && !data) {
      setLoading(true);
      try {
        const res = await api.getMoveByName(moveName);
        setData({
          type: res.type.name,
          power: res.power || "—",
          effect: res.effect_entries?.find(e => e.language.name === "en")?.short_effect.replace("$effect_chance", res.effect_chance) || "No effect info."
        });
      } catch (err) { console.error("Move fetch error:", err); }
      setLoading(false);
    }
    setOpen(!open);
  };

  return (
    <div className="mb-1 w-full">
      <button 
        onClick={toggle}
        type="button"
        className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 flex justify-between items-center hover:bg-white/10 transition-all active:scale-[0.98]"
      >
        <span className="text-white font-bold capitalize text-[11px] tracking-tight">{moveName.replace("-"," ")}</span>
        <div className="flex items-center gap-2">
          {data && (
            <span style={{ backgroundColor: TYPE_COLORS[data.type] }} className="px-1.5 py-0.5 rounded text-[7px] font-black uppercase text-white">
              {data.type}
            </span>
          )}
          {loading ? <Loader2 size={10} className="animate-spin text-emerald-500" /> : (open ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
        </div>
      </button>
      {open && data && (
        <div className="px-3 py-2 bg-black/40 border-x border-b border-white/5 rounded-b-lg text-[10px] text-gray-400">
          <p className="mb-1"><span className="text-gray-500 font-bold uppercase mr-1">Power:</span> <span className="text-white">{data.power}</span></p>
          <p className="italic leading-snug">{data.effect}</p>
        </div>
      )}
    </div>
  );
}

function AbilityRow({ name, isHidden }) {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!open && !data) {
      setLoading(true);
      try {
        const res = await api.getAbilityByName(name);
        const effect = res.effect_entries.find(e => e.language.name === "en")?.short_effect || "No description.";
        setData(effect);
      } catch (err) { setData("Error loading."); }
      setLoading(false);
    }
    setOpen(!open);
  };

  return (
    <div className="mb-1">
      <button onClick={toggle} className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 flex justify-between items-center hover:bg-white/10 transition-all active:scale-[0.98]">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold capitalize text-xs">{name.replace("-"," ")}</span>
          {isHidden && <span className="text-[7px] border border-purple-500/50 text-purple-400 px-1 rounded uppercase font-black">Hidden</span>}
        </div>
        {loading ? <Loader2 size={12} className="animate-spin" /> : (open ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
      </button>
      {open && data && <div className="px-3 py-2 text-[10px] text-gray-400 italic bg-black/20 border-x border-b border-white/5 rounded-b-lg">{data}</div>}
    </div>
  );
}

export default function PokemonDetailsModal({ id, onClose, onJump }) {
  const [pokemon, setPokemon] = useState(null);
  const [evoChain, setEvoChain] = useState([]);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    async function load() {
      try {
        const p = await api.getPokemonByName(id);
        const s = await api.getPokemonSpeciesByName(id);
        setPokemon(p);
        
        const evoId = s.evolution_chain.url.split("/").filter(Boolean).pop();
        const res = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${evoId}`);
        const eco = await res.json();
        
        const chain = [];
        let curr = eco.chain;
        while(curr) {
          chain.push({ name: curr.species.name, id: curr.species.url.split("/").filter(Boolean).pop() });
          curr = curr.evolves_to[0];
        }
        setEvoChain(chain);
      } catch (e) { console.error(e); }
    }
    load();
  }, [id]);

  if (!pokemon) return null;

  // Calculate Base Stat Total (BST)
  const bst = pokemon.stats.reduce((total, s) => total + s.base_stat, 0);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[200] flex items-center justify-center p-2" onClick={onClose}>
      <div className="bg-[#0f0f11] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
        
        {/* Compact Header */}
        <div className="p-3 border-b border-white/5 flex justify-between items-center bg-white/5">
            <div className="flex gap-3 items-center">
                <img src={pokemon.sprites.other["official-artwork"].front_default} className="w-12 h-12" alt={pokemon.name} />
                <div>
                    <h2 className="text-lg font-black text-white capitalize tracking-tighter italic">{pokemon.name}</h2>
                    <div className="flex gap-1 mt-0.5">
                        {pokemon.types.map(t => (
                            <span key={t.type.name} style={{ backgroundColor: TYPE_COLORS[t.type.name] }} className="px-1.5 py-0.5 rounded text-[7px] font-black uppercase text-white">
                                {t.type.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full text-gray-500"><X size={18}/></button>
        </div>

        {/* Slim Tabs */}
        <div className="flex bg-black/40 border-b border-white/5">
            {['info', 'moves', 'stats'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-500'}`}>
                    {t}
                </button>
            ))}
        </div>

        {/* Compact Body */}
        <div className="p-3 overflow-y-auto custom-scrollbar">
          {activeTab === 'info' && (
            <div className="space-y-4">
                <div>
                    <h3 className="text-[8px] font-black text-gray-600 uppercase mb-2 tracking-widest">Evolution</h3>
                    <div className="flex items-center gap-1.5 flex-wrap bg-white/5 p-2 rounded-lg border border-white/5">
                        {evoChain.map((evo, i) => (
                            <div key={evo.id} className="flex items-center gap-1.5">
                                <button 
                                  onClick={() => onJump(evo.id)} 
                                  className={`px-2 py-1 rounded text-[10px] font-bold capitalize transition-all border ${evo.id == id ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}
                                >
                                    {evo.name}
                                </button>
                                {i < evoChain.length - 1 && <ArrowRight size={10} className="text-gray-700" />}
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-[8px] font-black text-gray-600 uppercase mb-2 tracking-widest">Abilities</h3>
                    {pokemon.abilities.map(a => <AbilityRow key={a.ability.name} name={a.ability.name} isHidden={a.is_hidden} />)}
                </div>
            </div>
          )}

          {activeTab === 'moves' && (
            <div className="flex flex-col gap-1">
                {pokemon.moves.slice(0, 30).map(m => <MoveRow key={m.move.name} moveName={m.move.name} />)}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-3">
              <div className="space-y-2">
                {pokemon.stats.map(s => (
                  <div key={s.stat.name}>
                    <div className="flex justify-between text-[8px] uppercase font-black text-gray-500 mb-0.5">
                      <span>{s.stat.name.replace("special-", "sp. ")}</span>
                      <span className="text-white">{s.base_stat}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${(s.base_stat/255)*100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Stat Total Box */}
              <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Base Stat Total</span>
                <span className="text-sm font-black text-emerald-400">{bst}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}