import { useState, useEffect } from "react";
import { X, Loader2, ChevronDown, ChevronUp, ArrowRight, Sword } from "lucide-react";
import { api } from "../lib/pokemonClient";
import { TYPE_COLORS } from "../data/theme";

function MoveRow({ moveName }) {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!open && !data) {
      setLoading(true);
      try {
        const res = await api.getMoveByName(moveName);
        setData({
          type: res.type.name,
          power: res.power || "—",
          pp: res.pp || "—",
          accuracy: res.accuracy || "—",
          category: res.damage_class.name,
          effect: res.effect_entries?.find(e => e.language.name === "en")?.short_effect.replace("$effect_chance", res.effect_chance) || "No description."
        });
      } catch (err) { console.error(err); }
      setLoading(false);
    }
    setOpen(!open);
  };

  return (
    <div className="mb-1.5 w-full">
      <button onClick={toggle} className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 flex justify-between items-center hover:bg-white/10 transition-all">
        <span className="text-white font-bold capitalize text-xs">{moveName.replace("-"," ")}</span>
        <div className="flex items-center gap-3">
          {data && <span style={{ backgroundColor: TYPE_COLORS[data.type] }} className="px-2 py-0.5 rounded text-[9px] font-black uppercase text-white">{data.type}</span>}
          {loading ? <Loader2 size={14} className="animate-spin" /> : (open ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
        </div>
      </button>
      {open && data && (
        <div className="mx-1 px-4 py-3 bg-black/40 border-x border-b border-white/5 rounded-b-xl text-[11px] text-gray-300 space-y-2">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <div className="flex gap-4">
              <span><strong className="text-gray-500 uppercase text-[9px]">Pwr:</strong> {data.power}</span>
              <span><strong className="text-gray-500 uppercase text-[9px]">PP:</strong> {data.pp}</span>
            </div>
            <span className={`uppercase font-black text-[9px] px-1.5 py-0.5 rounded ${data.category === 'physical' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>{data.category}</span>
          </div>
          <p className="text-gray-400 leading-relaxed">{data.effect}</p>
        </div>
      )}
    </div>
  );
}

export default function PokemonDetailsModal({ id, onClose, onJump }) {
  const [pokemon, setPokemon] = useState(null);
  const [evoChain, setEvoChain] = useState([]);
  const [activeTab, setActiveTab] = useState("info");
  const [isShiny, setIsShiny] = useState(false);

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
  const bst = pokemon.stats.reduce((total, s) => total + s.base_stat, 0);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#0f0f11] border border-white/10 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header with Shiny Toggle */}
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/5">
            <div className="flex gap-4 items-center">
                <img 
                  src={isShiny ? pokemon.sprites.front_shiny : pokemon.sprites.other["official-artwork"].front_default} 
                  className="w-16 h-16 drop-shadow-xl cursor-pointer hover:scale-110 transition-transform" 
                  onClick={() => setIsShiny(!isShiny)}
                  alt={pokemon.name} 
                />
                <div>
                    <h2 className="text-2xl font-black text-white capitalize tracking-tighter">{pokemon.name}</h2>
                    <button onClick={() => setIsShiny(!isShiny)} className={`text-[9px] font-bold px-2 py-0.5 rounded border ${isShiny ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                      {isShiny ? "✨ SHINY MODE" : "✨ VIEW SHINY"}
                    </button>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-500"><X size={20}/></button>
        </div>

        {/* Tabs */}
        <div className="flex bg-black/40 border-b border-white/5">
            {['info', 'moves', 'stats', 'battle'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-500'}`}>
                    {t}
                </button>
            ))}
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto custom-scrollbar">
          {activeTab === 'info' && (
            <div className="space-y-6">
                <div>
                    <h3 className="text-[10px] font-black text-gray-600 uppercase mb-3 tracking-widest">Evolution Chain</h3>
                    <div className="flex items-center gap-2 flex-wrap bg-white/5 p-4 rounded-2xl border border-white/5 justify-center">
                        {evoChain.map((evo, i) => (
                            <div key={evo.id} className="flex items-center gap-2">
                                <button onClick={() => onJump(evo.id)} className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${evo.id == id ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}>{evo.name}</button>
                                {i < evoChain.length - 1 && <ArrowRight size={14} className="text-gray-800" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          )}

          {activeTab === 'battle' && (
            <div className="space-y-4">
              <div className="relative h-48 bg-emerald-900/20 rounded-2xl border border-emerald-500/20 flex flex-col justify-end p-4 overflow-hidden">
                <div className="absolute top-4 right-8 flex flex-col items-center">
                  <img src={pokemon.sprites.front_default} className="w-20 h-20 pixelated" alt="enemy" />
                  <div className="bg-black/60 px-2 py-0.5 rounded text-[8px] text-white border border-white/10 uppercase">Enemy {pokemon.name}</div>
                </div>
                <div className="flex flex-col items-start ml-4">
                  <img src={pokemon.sprites.back_default} className="w-24 h-24 pixelated scale-125" alt="yours" />
                  <div className="bg-emerald-600 px-2 py-0.5 rounded text-[8px] text-white font-bold uppercase tracking-wider">Level 50</div>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 text-center uppercase font-black">Sprite preview using PokeAPI/sprites</p>
            </div>
          )}

          {activeTab === 'moves' && (
            <div className="flex flex-col">{pokemon.moves.slice(0, 30).map(m => <MoveRow key={m.move.name} moveName={m.move.name} />)}</div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-4">
              {pokemon.stats.map(s => (
                <div key={s.stat.name}>
                  <div className="flex justify-between text-[10px] uppercase font-black text-gray-500 mb-1">
                    <span>{s.stat.name.replace("special-", "sp. ")}</span>
                    <span className="text-white">{s.base_stat}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${(s.base_stat/255)*100}%` }} />
                  </div>
                </div>
              ))}
              <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Base Stat Total</span>
                <span className="text-lg font-black text-emerald-400">{bst}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}