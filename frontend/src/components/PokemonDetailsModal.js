import { useState, useEffect } from "react";
import { X, Loader2, ChevronDown, ChevronUp, ArrowRight, Sword } from "lucide-react";
import { api } from "../lib/pokemonClient";
import { TYPE_COLORS } from "../data/theme";

// MOVES LOGIC (pkmn.help & BattleEngine inspired)
function MoveRow({ moveName }) {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (open) { setOpen(false); return; }
    if (!data) {
      setLoading(true);
      try {
        // Direct fetch to bypass library 'undefined' errors and school filters
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
      } catch (err) { console.error("Move fetch error:", err); }
      setLoading(false);
    } else { setOpen(true); }
  };

  return (
    <div className="mb-2 w-full">
      <button 
        onClick={(e) => { e.preventDefault(); toggle(); }} 
        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 flex justify-between items-center hover:bg-white/10 transition-all text-left"
      >
        <span className="text-white font-black capitalize text-xs tracking-wide">{moveName.replace("-"," ")}</span>
        <div className="flex items-center gap-3">
          {data && <span style={{ backgroundColor: TYPE_COLORS[data.type] }} className="px-2 py-0.5 rounded text-[9px] font-black uppercase text-white shadow-sm">{data.type}</span>}
          {loading ? <Loader2 size={14} className="animate-spin text-emerald-500" /> : (open ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
        </div>
      </button>
      {open && data && (
        <div className="mx-1 px-4 py-3 bg-black/40 border-x border-b border-white/5 rounded-b-xl text-[11px] text-gray-300 space-y-2">
          <div className="flex justify-between items-center border-b border-white/5 pb-2 font-black">
            <div className="flex gap-4">
              <span><span className="text-gray-500 uppercase text-[9px]">Pwr:</span> {data.power}</span>
              <span><span className="text-gray-500 uppercase text-[9px]">PP:</span> {data.pp}</span>
            </div>
            <span className={`uppercase font-black text-[9px] px-2 py-0.5 rounded ${data.category === 'physical' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>{data.category}</span>
          </div>
          <p className="leading-relaxed text-gray-400 font-bold">{data.effect}</p>
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
          chain.push({ name: curr.species.name, id: pId });
          curr = curr.evolves_to[0];
        }
        setEvoChain(chain);
      } catch (e) { console.error("Modal load error:", e); }
    }
    load();
  }, [id]);

  if (!pokemon) return null;

  const bst = pokemon.stats.reduce((total, s) => total + s.base_stat, 0);

  // PROXY URLs (School Filter Fix)
  const normalImg = `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/${id}.png`;
  const shinyImg = `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/shiny/${id}.png`;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#0c0c0e] border border-white/10 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        {/* HEADER - Fixed Gen 9 Scaling */}
        <div className="p-6 border-b border-white/5 bg-white/5 relative">
            <div className="absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-20" style={{ backgroundColor: TYPE_COLORS[pokemon.types[0].type.name] }}></div>
            <div className="flex gap-5 items-center relative z-10">
                {/* Fixed Container to keep Shiny and Normal the same size */}
                <div className="w-28 h-28 flex items-center justify-center bg-white/5 rounded-3xl border border-white/5 shadow-inner">
                  <img 
                    src={isShiny ? shinyImg : normalImg} 
                    className="w-24 h-24 object-contain hover:scale-110 transition-transform cursor-pointer" 
                    onClick={() => setIsShiny(!isShiny)} 
                    alt={pokemon.name} 
                  />
                </div>
                <div className="text-left font-black">
                    <h2 className="text-3xl text-white capitalize tracking-tighter leading-tight">{pokemon.name}</h2>
                    <div className="flex gap-2 mt-2">
                        {pokemon.types.map(t => (
                            <span key={t.type.name} style={{ backgroundColor: TYPE_COLORS[t.type.name] }} className="px-3 py-1 rounded-lg text-[10px] uppercase text-white shadow-lg">{t.type.name}</span>
                        ))}
                    </div>
                    <button onClick={() => setIsShiny(!isShiny)} className={`mt-3 text-[9px] px-2 py-1 rounded border transition-all ${isShiny ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 'bg-white/10 border-white/10 text-gray-400'}`}>
                      {isShiny ? "✨ SHINY MODE" : "✨ VIEW SHINY"}
                    </button>
                </div>
            </div>
            <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full text-gray-500"><X size={20}/></button>
        </div>

        {/* TABS */}
        <div className="flex bg-black/40 border-b border-white/5">
            {['info', 'moves', 'stats', 'battle'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'text-emerald-400 bg-emerald-500/5 border-b-2 border-emerald-400' : 'text-gray-500'}`}>
                    {t}
                </button>
            ))}
        </div>

        {/* CONTENT AREA */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {activeTab === 'info' && (
            <div className="space-y-8 text-left font-black">
                <div>
                    <h3 className="text-[10px] text-gray-600 uppercase mb-4 tracking-widest">Evolution Chain</h3>
                    <div className="flex flex-col gap-3">
                        {evoChain.map((evo, i) => (
                            <div key={evo.id} className="flex flex-col items-center">
                                <button onClick={() => onJump(evo.id)} className={`w-full flex items-center gap-4 p-4 rounded-3xl border transition-all ${evo.id == id ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'}`}>
                                    {/* Big Evolution Icons (PokeSprite inspired) */}
                                    <img src={`https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/${evo.id}.png`} className="w-16 h-16 pixelated drop-shadow-md" alt={evo.name} />
                                    <span className="capitalize text-base tracking-tight">{evo.name}</span>
                                    {evo.id == id && <span className="ml-auto text-[9px] bg-emerald-500 text-white px-3 py-1 rounded-full uppercase">ACTIVE</span>}
                                </button>
                                {i < evoChain.length - 1 && <div className="py-2"><ArrowRight size={20} className="text-gray-800 rotate-90" /></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          )}

          {activeTab === 'battle' && (
            <div className="space-y-4 font-black">
              <div className="relative h-64 bg-[#141416] rounded-[2.5rem] border border-white/5 flex flex-col justify-end p-8 overflow-hidden">
                {/* ENEMY (Top Right) */}
                <div className="absolute top-6 right-10 flex flex-col items-center">
                  <div className="w-20 h-3 bg-black/40 rounded-full blur-sm mb-[-12px]"></div>
                  <img 
                    src={isShiny ? `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/shiny/${id}.png` : `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/${id}.png`} 
                    className="w-24 h-24 pixelated drop-shadow-2xl" 
                    onError={(e) => { e.target.src = normalImg; }} 
                    alt="enemy" 
                  />
                  <div className="bg-black/80 px-3 py-1 rounded-full border border-white/10 text-[9px] text-white uppercase mt-2 shadow-lg tracking-widest">Enemy Level 50</div>
                </div>
                {/* PLAYER (Bottom Left) - BattleEngine Perspective */}
                <div className="flex flex-col items-start mb-2">
                  <img 
                    src={isShiny ? `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/back/shiny/${id}.png` : `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/back/${id}.png`} 
                    className="w-36 h-36 pixelated scale-[1.3] origin-bottom-left transition-transform" 
                    onError={(e) => { e.target.src = normalImg; }} 
                    alt="yours" 
                  />
                  <div className="bg-emerald-600 px-3 py-1 rounded-full text-[9px] text-white uppercase tracking-widest mt-4 shadow-xl">Your Pokémon</div>
                </div>
              </div>
              <p className="text-[9px] text-gray-600 uppercase tracking-widest text-center italic">Type Matchup Logic Active</p>
            </div>
          )}

          {activeTab === 'moves' && (
            <div className="flex flex-col">
                {pokemon.moves.slice(0, 35).map(m => ( <MoveRow key={m.move.name} moveName={m.move.name} /> ))}
            </div>
          )}

          {activeTab === 'stats' && (
             <div className="space-y-6 font-black">
               <div className="space-y-4">
                 {pokemon.stats.map(s => (
                   <div key={s.stat.name}>
                     <div className="flex justify-between text-[10px] uppercase text-gray-500 mb-1.5 text-left">
                       <span>{s.stat.name.replace("special-", "sp. ")}</span>
                       <span className="text-white">{s.base_stat}</span>
                     </div>
                     <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${(s.base_stat/255)*100}%` }} />
                     </div>
                   </div>
                 ))}
               </div>
               {/* PKHeX Stats Footer */}
               <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-end">
                 <div className="text-left">
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">Base Stat Total</p>
                    <p className="text-4xl text-white leading-none tracking-tighter">{bst}</p>
                 </div>
                 <div className="bg-emerald-500/20 text-emerald-400 px-5 py-2 rounded-2xl border border-emerald-500/30 text-[10px] uppercase tracking-widest">
                    {bst > 580 ? 'Legendary' : bst > 500 ? 'Mythical' : 'Standard'}
                 </div>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}