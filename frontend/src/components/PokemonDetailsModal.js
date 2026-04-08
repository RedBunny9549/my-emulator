import { useState, useEffect } from "react";
import { X, Loader2, ChevronDown, ChevronUp, ArrowRight, Sword } from "lucide-react";
import { TYPE_COLORS } from "../data/theme";

function MoveRow({ moveName }) {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (open) { setOpen(false); return; }
    if (!data) {
      setLoading(true);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`).then(r => r.json());
        setData({
          type: res.type.name,
          power: res.power || "—",
          pp: res.pp || "—",
          accuracy: res.accuracy || "—",
          category: res.damage_class.name,
          effect: res.effect_entries?.find(e => e.language.name === "en")?.short_effect.replace("$effect_chance", res.effect_chance) || "No description."
        });
        setOpen(true);
      } catch (err) { console.error(err); }
      setLoading(false);
    } else { setOpen(true); }
  };

  return (
    <div className="mb-2 w-full">
      <button onClick={(e) => { e.preventDefault(); toggle(); }} className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 flex justify-between items-center hover:bg-white/10 transition-all text-left">
        <span className="text-white font-bold capitalize text-xs tracking-wide">{moveName.replace("-"," ")}</span>
        <div className="flex items-center gap-3">
          {data && <span style={{ backgroundColor: TYPE_COLORS[data.type] }} className="px-2 py-0.5 rounded text-[9px] font-black uppercase text-white shadow-sm">{data.type}</span>}
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
            <span className={`uppercase font-black text-[9px] px-2 py-0.5 rounded ${data.category === 'physical' ? 'bg-orange-500/20 text-orange-400' : data.category === 'special' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>{data.category}</span>
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
        const p = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(r => r.json());
        const s = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(r => r.json());
        setPokemon(p);
        const evoId = s.evolution_chain.url.split("/").filter(Boolean).pop();
        const eco = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${evoId}`).then(r => r.json());
        const chain = [];
        let curr = eco.chain;
        while(curr) {
          const pId = curr.species.url.split("/").filter(Boolean).pop();
          chain.push({ 
            name: curr.species.name, 
            id: pId, 
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pId}.png` 
          });
          curr = curr.evolves_to[0];
        }
        setEvoChain(chain);
      } catch (e) { console.error(e); }
    }
    load();
  }, [id]);

  if (!pokemon) return null;

  const bst = pokemon.stats.reduce((total, s) => total + s.base_stat, 0);
  // HIGH RES ARTWORK
  const normalImg = pokemon.sprites.other["official-artwork"].front_default;
  const shinyImg = pokemon.sprites.other["official-artwork"].front_shiny;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#0c0c0e] border border-white/10 rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header - Fixed Large Shiny/Normal Toggle */}
        <div className="p-6 border-b border-white/5 bg-white/5 relative">
            <div className="absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-20" style={{ backgroundColor: TYPE_COLORS[pokemon.types[0].type.name] }}></div>
            <div className="flex gap-5 items-center relative z-10">
                <img 
                  src={isShiny ? shinyImg : normalImg} 
                  className="w-28 h-28 drop-shadow-2xl cursor-pointer hover:scale-110 transition-transform" 
                  onClick={() => setIsShiny(!isShiny)}
                  alt={pokemon.name} 
                />
                <div className="text-left">
                    <h2 className="text-3xl font-black text-white capitalize tracking-tighter leading-tight">{pokemon.name}</h2>
                    <div className="flex gap-2 mt-2">
                        {pokemon.types.map(t => (
                            <span key={t.type.name} style={{ backgroundColor: TYPE_COLORS[t.type.name] }} className="px-3 py-1 rounded-lg text-[10px] font-black uppercase text-white shadow-lg">{t.type.name}</span>
                        ))}
                    </div>
                    <button onClick={() => setIsShiny(!isShiny)} className={`mt-3 text-[9px] font-black px-2 py-1 rounded border transition-all ${isShiny ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 'bg-white/10 border-white/10 text-gray-400'}`}>
                      {isShiny ? "✨ SHINY FORM" : "✨ VIEW SHINY"}
                    </button>
                </div>
            </div>
            <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full text-gray-500"><X size={20}/></button>
        </div>

        {/* Tabs - Added Battle Back */}
        <div className="flex bg-black/40 border-b border-white/5">
            {['info', 'moves', 'stats', 'battle'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'text-emerald-400 bg-emerald-500/5 border-b-2 border-emerald-400' : 'text-gray-500'}`}>
                    {t}
                </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {activeTab === 'info' && (
            <div className="space-y-8 text-left">
                <div>
                    <h3 className="text-[10px] font-black text-gray-600 uppercase mb-4 tracking-widest">Evolution Line</h3>
                    <div className="flex flex-col gap-3">
                        {evoChain.map((evo, i) => (
                            <div key={evo.id} className="flex flex-col items-center">
                                <button onClick={() => onJump(evo.id)} className={`w-full flex items-center gap-4 p-4 rounded-3xl border transition-all ${evo.id == id ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'}`}>
                                    {/* BIGGER EVO SPRITES */}
                                    <img src={evo.sprite} className="w-16 h-16 pixelated drop-shadow-md" alt={evo.name} />
                                    <span className="font-black capitalize text-base tracking-tight">{evo.name}</span>
                                    {evo.id == id && <span className="ml-auto text-[9px] bg-emerald-500 text-white px-3 py-1 rounded-full font-black">ACTIVE</span>}
                                </button>
                                {i < evoChain.length - 1 && <div className="py-2"><ArrowRight size={20} className="text-gray-800 rotate-90" /></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          )}

          {activeTab === 'battle' && (
            <div className="space-y-4">
              <div className="relative h-56 bg-[#1a1a1c] rounded-[2rem] border border-white/5 flex flex-col justify-end p-6 overflow-hidden">
                <div className="absolute top-6 right-10 flex flex-col items-center">
                  <div className="w-20 h-3 bg-black/40 rounded-full blur-sm mb-[-12px]"></div>
                  <img src={isShiny ? pokemon.sprites.front_shiny : pokemon.sprites.front_default} className="w-24 h-24 pixelated drop-shadow-2xl" alt="enemy" />
                  <div className="bg-black/80 px-3 py-1 rounded-full border border-white/10 text-[9px] text-white font-bold uppercase mt-2">Enemy {pokemon.name}</div>
                </div>
                <div className="flex flex-col items-start ml-4">
                  <img src={isShiny ? pokemon.sprites.back_shiny : pokemon.sprites.back_default} className="w-32 h-32 pixelated scale-125 transition-transform" alt="yours" />
                  <div className="bg-emerald-600 px-3 py-1 rounded-full text-[9px] text-white font-black uppercase tracking-widest mt-2 shadow-lg">Your {pokemon.name}</div>
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                  <Sword size={12} className="text-emerald-500" /> Battle Simulator Preview
                </p>
              </div>
            </div>
          )}

          {activeTab === 'moves' && (
            <div className="flex flex-col">
                {pokemon.moves.slice(0, 40).map(m => ( <MoveRow key={m.move.name} moveName={m.move.name} /> ))}
            </div>
          )}

          {activeTab === 'stats' && (
             <div className="space-y-5">
               <div className="space-y-4">
                 {pokemon.stats.map(s => (
                   <div key={s.stat.name}>
                     <div className="flex justify-between text-[10px] uppercase font-black text-gray-500 mb-1.5 text-left">
                       <span>{s.stat.name.replace("special-", "sp. ")}</span>
                       <span className="text-white font-black">{s.base_stat}</span>
                     </div>
                     <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${(s.base_stat/255)*100}%` }} />
                     </div>
                   </div>
                 ))}
               </div>
               <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-end">
                 <div className="text-left">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Base Stat Total</p>
                    <p className="text-4xl font-black text-white leading-none tracking-tighter">{bst}</p>
                 </div>
                 <div className="bg-emerald-500/20 text-emerald-400 px-5 py-2 rounded-2xl border border-emerald-500/30 text-[10px] font-black uppercase tracking-widest">
                    {bst > 550 ? 'Legendary' : bst > 450 ? 'Elite' : 'Standard'}
                 </div>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}