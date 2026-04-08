import { useState, useEffect } from "react";
import { X, Loader2, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { api } from "../lib/pokemonClient";
import { TYPE_COLORS } from "../data/theme";

// Clickable Ability Row
function AbilityRow({ name, isHidden }) {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!open && !data) {
      setLoading(true);
      try {
        const res = await api.getAbilityByName(name);
        const effect = res.effect_entries.find(e => e.language.name === "en")?.short_effect || "No description available.";
        setData(effect);
      } catch (err) { setData("Failed to load data."); }
      setLoading(false);
    }
    setOpen(!open);
  };

  return (
    <div className="bg-black/40 border border-white/5 rounded-2xl mb-2 overflow-hidden text-left">
      <button onClick={toggle} className="w-full px-5 py-4 flex justify-between items-center hover:bg-white/5">
        <div className="flex items-center gap-3 text-left">
          <span className="text-white font-bold capitalize">{name.replace("-"," ")}</span>
          {isHidden && <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30 uppercase font-black">Hidden</span>}
        </div>
        {loading ? <Loader2 className="w-4 h-4 animate-spin text-emerald-500" /> : (open ? <ChevronUp className="text-emerald-500" /> : <ChevronDown className="text-gray-600" />)}
      </button>
      {open && data && <div className="px-5 pb-5 text-sm text-gray-400 italic border-t border-white/5 pt-3 leading-relaxed">{data}</div>}
    </div>
  );
}

// Clickable Move Row
function MoveRow({ moveName }) {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);

  const toggle = async () => {
    if (!open && !data) {
      const res = await api.getMoveByName(moveName);
      setData({
        type: res.type.name,
        power: res.power || "—",
        effect: res.effect_entries?.find(e => e.language.name === "en")?.short_effect.replace("$effect_chance", res.effect_chance) || "No effect."
      });
    }
    setOpen(!open);
  };

  return (
    <div className="bg-black/40 border border-white/5 rounded-2xl mb-2 overflow-hidden text-left">
      <button onClick={toggle} className="w-full px-5 py-4 flex justify-between items-center hover:bg-white/5">
        <span className="text-white font-bold capitalize">{moveName.replace("-"," ")}</span>
        <div className="flex items-center gap-3">
          {data && (
            <span style={{ backgroundColor: TYPE_COLORS[data.type] }} className="px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white shadow-sm">
              {data.type}
            </span>
          )}
          {open ? <ChevronUp className="text-emerald-500" /> : <ChevronDown className="text-gray-600" />}
        </div>
      </button>
      {open && data && (
        <div className="px-5 pb-5 border-t border-white/5 pt-3 bg-black/20 text-left">
          <div className="flex gap-6 mb-3">
            <div><p className="text-[10px] text-gray-500 uppercase font-black">Power</p><p className="text-white font-bold">{data.power}</p></div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed italic">{data.effect}</p>
        </div>
      )}
    </div>
  );
}

export default function PokemonDetailsModal({ id, onClose, onJump }) {
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evoChain, setEvoChain] = useState([]);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    async function load() {
      const p = await api.getPokemonByName(id);
      const s = await api.getPokemonSpeciesByName(id);
      setPokemon(p);
      setSpecies(s);
      
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
    }
    load();
  }, [id]);

  if (!pokemon) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#16161A] border border-white/10 rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <div className="flex gap-6 items-center">
                <img src={pokemon.sprites.other["official-artwork"].front_default} className="w-24 h-24 drop-shadow-2xl" alt={pokemon.name} />
                <div>
                    <h2 className="text-4xl font-black text-white capitalize tracking-tighter italic">{pokemon.name}</h2>
                    <div className="flex gap-2 mt-2">
                        {pokemon.types.map(t => (
                            <span key={t.type.name} style={{ backgroundColor: TYPE_COLORS[t.type.name] }} className="px-3 py-1 rounded-md text-xs font-black uppercase text-white shadow-xl">
                                {t.type.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <button onClick={onClose} className="p-3 bg-white/5 rounded-full text-gray-500 hover:text-white transition-all"><X /></button>
        </div>

        <div className="flex border-b border-white/5 bg-white/5">
            {['info', 'moves', 'stats'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === t ? 'text-emerald-400 bg-emerald-500/10 border-b-2 border-emerald-400' : 'text-gray-500'}`}>
                    {t}
                </button>
            ))}
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar">
          {activeTab === 'info' && (
            <div className="space-y-10">
                <div>
                    <h3 className="text-xs font-black text-gray-600 uppercase mb-4 tracking-widest">Evolution Path (Click to Jump)</h3>
                    <div className="flex items-center gap-4 flex-wrap justify-center bg-black/20 p-6 rounded-3xl border border-white/5">
                        {evoChain.map((evo, i) => (
                            <div key={evo.id} className="flex items-center gap-4">
                                <button 
                                  onClick={() => onJump(evo.id)} 
                                  className={`px-5 py-2.5 rounded-xl text-sm font-bold capitalize transition-all border ${evo.id == id ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}
                                >
                                    {evo.name}
                                </button>
                                {i < evoChain.length - 1 && <ArrowRight size={18} className="text-gray-800" />}
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-xs font-black text-gray-600 uppercase mb-4 tracking-widest">Abilities</h3>
                    {pokemon.abilities.map(a => <AbilityRow key={a.ability.name} name={a.ability.name} isHidden={a.is_hidden} />)}
                </div>
            </div>
          )}

          {activeTab === 'moves' && (
            <div className="space-y-2">
                {pokemon.moves.slice(0, 30).map(m => <MoveRow key={m.move.name} moveName={m.move.name} />)}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-5">
              {pokemon.stats.map(s => (
                <div key={s.stat.name}>
                  <div className="flex justify-between text-[11px] uppercase font-black text-gray-500 mb-2">
                    <span>{s.stat.name.replace("special-", "sp. ")}</span>
                    <span className="text-white">{s.base_stat}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${(s.base_stat/255)*100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}