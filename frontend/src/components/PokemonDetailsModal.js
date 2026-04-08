import { useState, useEffect } from "react";
import { X, Loader2, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { api } from "../lib/pokemonClient"; // Ensure this file exports a 'new PokemonClient()'
import { TYPE_COLORS } from "../data/theme";

function MoveRow({ moveName }) {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (open) {
      setOpen(false);
      return;
    }

    if (!data) {
      setLoading(true);
      try {
        // FIXED: Using the correct pokenode-ts method name
        const res = await api.move.getByName(moveName); 
        setData({
          type: res.type.name,
          power: res.power || "—",
          pp: res.pp || "—",
          accuracy: res.accuracy || "—",
          category: res.damage_class.name,
          effect: res.effect_entries?.find(e => e.language.name === "en")?.short_effect.replace("$effect_chance", res.effect_chance) || "No description."
        });
        setOpen(true);
      } catch (err) {
        console.error("Move Error:", err);
      } finally {
        setLoading(false);
      }
    } else {
      setOpen(true);
    }
  };

  return (
    <div className="mb-2 w-full">
      <button 
        onClick={(e) => { e.preventDefault(); toggle(); }}
        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 flex justify-between items-center hover:bg-white/10 transition-all text-left"
      >
        <span className="text-white font-bold capitalize text-xs tracking-wide">{moveName.replace("-"," ")}</span>
        <div className="flex items-center gap-3">
          {data && (
            <span style={{ backgroundColor: TYPE_COLORS[data.type] }} className="px-2 py-0.5 rounded text-[9px] font-black uppercase text-white shadow-sm">
              {data.type}
            </span>
          )}
          {loading ? <Loader2 size={14} className="animate-spin text-emerald-500" /> : (open ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
        </div>
      </button>
      
      {open && data && (
        <div className="mx-1 px-4 py-3 bg-black/40 border-x border-b border-white/5 rounded-b-xl text-[11px] text-gray-300 space-y-2">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <div className="flex gap-4">
              <span><strong className="text-gray-500 uppercase text-[9px]">Pwr:</strong> {data.power}</span>
              <span><strong className="text-gray-500 uppercase text-[9px]">PP:</strong> {data.pp}</span>
              <span><strong className="text-gray-500 uppercase text-[9px]">Acc:</strong> {data.accuracy}</span>
            </div>
            <span className={`uppercase font-black text-[9px] px-2 py-0.5 rounded ${data.category === 'physical' ? 'bg-orange-500/20 text-orange-400' : data.category === 'special' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
              {data.category}
            </span>
          </div>
          <p className="leading-relaxed text-gray-400 font-medium">{data.effect}</p>
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
        const p = await api.pokemon.getByName(id);
        const s = await api.pokemon.getPokemonSpeciesByName(id);
        setPokemon(p);

        const evoId = s.evolution_chain.url.split("/").filter(Boolean).pop();
        const res = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${evoId}`);
        const eco = await res.json();
        
        const chain = [];
        let curr = eco.chain;
        while(curr) {
          const pId = curr.species.url.split("/").filter(Boolean).pop();
          chain.push({ 
            name: curr.species.name, 
            id: pId,
            icon: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${pId}.png`
          });
          curr = curr.evolves_to[0];
        }
        setEvoChain(chain);
      } catch (e) { console.error("Load error:", e); }
    }
    load();
  }, [id]);

  if (!pokemon) return null;

  const bst = pokemon.stats.reduce((total, s) => total + s.base_stat, 0);
  const normalImg = pokemon.sprites.other["official-artwork"].front_default;
  const shinyImg = pokemon.sprites.other["official-artwork"].front_shiny || pokemon.sprites.front_shiny;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#0f0f11] border border-white/10 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
        
        <div className="p-6 border-b border-white/5 bg-white/5 relative">
            <div className="absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-20" style={{ backgroundColor: TYPE_COLORS[pokemon.types[0].type.name] }}></div>
            
            <div className="flex gap-5 items-center relative z-10">
                <img 
                  src={isShiny ? shinyImg : normalImg} 
                  className="w-24 h-24 drop-shadow-2xl cursor-pointer hover:scale-105 transition-transform" 
                  onClick={() => setIsShiny(!isShiny)}
                  alt={pokemon.name} 
                />
                <div>
                    <h2 className="text-3xl font-black text-white capitalize tracking-tighter">{pokemon.name}</h2>
                    <div className="flex gap-2 mt-2">
                        {pokemon.types.map(t => (
                            <span key={t.type.name} style={{ backgroundColor: TYPE_COLORS[t.type.name] }} className="px-3 py-1 rounded-md text-[9px] font-black uppercase text-white shadow-lg">
                                {t.type.name}
                            </span>
                        ))}
                    </div>
                    <button 
                      onClick={() => setIsShiny(!isShiny)}
                      className={`mt-3 text-[8px] font-black px-2 py-1 rounded border transition-all ${isShiny ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-500' : 'bg-white/5 border-white/10 text-gray-500'}`}
                    >
                      {isShiny ? "SHINY ACTIVE" : "VIEW SHINY"}
                    </button>
                </div>
            </div>
            <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full text-gray-500"><X size={20}/></button>
        </div>

        <div className="flex bg-black/20 border-b border-white/5">
            {['info', 'moves', 'stats'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'text-emerald-400 bg-emerald-500/5 border-b-2 border-emerald-400' : 'text-gray-500'}`}>
                    {t}
                </button>
            ))}
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {activeTab === 'info' && (
            <div className="space-y-8">
                <div>
                    <h3 className="text-[10px] font-black text-gray-600 uppercase mb-4 tracking-widest text-left">Evolution Chain</h3>
                    <div className="flex flex-col gap-2">
                        {evoChain.map((evo, i) => (
                            <div key={evo.id} className="flex flex-col items-center">
                                <button 
                                  onClick={() => onJump(evo.id)} 
                                  className={`w-full flex items-center gap-4 p-3 rounded-2xl border transition-all ${evo.id == id ? 'bg-emerald-600/10 border-emerald-500/50 text-white' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'}`}
                                >
                                    <img src={evo.icon} className="w-10 h-10 pixelated" alt={evo.name} />
                                    <span className="font-bold capitalize text-sm tracking-wide">{evo.name}</span>
                                    {evo.id == id && <span className="ml-auto text-[8px] bg-emerald-500 text-white px-2 py-1 rounded-full">ACTIVE</span>}
                                </button>
                                {i < evoChain.length - 1 && <div className="py-1"><ArrowRight size={14} className="text-gray-800 rotate-90" /></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          )}

          {activeTab === 'moves' && (
            <div className="flex flex-col">
                {pokemon.moves.slice(0, 40).map(m => (
                  <MoveRow key={m.move.name} moveName={m.move.name} />
                ))}
            </div>
          )}

          {activeTab === 'stats' && (
             <div className="space-y-4">
               {pokemon.stats.map(s => (
                 <div key={s.stat.name}>
                   <div className="flex justify-between text-[10px] uppercase font-black text-gray-500 mb-1.5 text-left">
                     <span>{s.stat.name.replace("special-", "sp. ")}</span>
                     <span className="text-white font-bold">{s.base_stat}</span>
                   </div>
                   <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500" style={{ width: `${(s.base_stat/255)*100}%` }} />
                   </div>
                 </div>
               ))}
               <div className="mt-8 pt-5 border-t border-white/10 flex justify-between items-end">
                 <div className="text-left">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Base Stat Total</p>
                    <p className="text-3xl font-black text-white leading-none">{bst}</p>
                 </div>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}