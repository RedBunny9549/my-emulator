import { useState, useEffect } from "react";
import { X, Loader2, ChevronDown, ChevronUp, ArrowRight, Sword, Shield } from "lucide-react";
import { TYPE_COLORS } from "../data/theme";

// MOVES ROW
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

// ABILITY ROW (NEW: Shows what it does)
function AbilityRow({ abilityName, isHidden }) {
  const [effect, setEffect] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (open) { setOpen(false); return; }
    if (!effect) {
      setLoading(true);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`).then(r => r.json());
        const entry = res.effect_entries.find(e => e.language.name === "en")?.short_effect || "No info.";
        setEffect(entry);
        setOpen(true);
      } catch (err) { console.error(err); }
      setLoading(false);
    } else { setOpen(true); }
  };

  return (
    <div className="mb-2">
      <button onClick={toggle} className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 flex justify-between items-center hover:bg-white/10 transition-all text-left">
        <div className="flex items-center gap-2">
          <span className="text-white font-black capitalize text-xs">{abilityName.replace("-", " ")}</span>
          {isHidden && <span className="text-[8px] text-purple-400 border border-purple-400/30 px-1.5 rounded uppercase font-black tracking-tighter">Hidden</span>}
        </div>
        {loading ? <Loader2 size={12} className="animate-spin" /> : (open ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
      </button>
      {open && effect && (
        <div className="mx-1 px-4 py-2 text-[11px] text-gray-400 font-bold bg-black/20 border-x border-b border-white/5 rounded-b-xl -mt-1 leading-snug">
          {effect}
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
  const [isMaxStats, setIsMaxStats] = useState(false);

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
      } catch (e) { console.error(e); }
    }
    load();
  }, [id]);

  if (!pokemon) return null;

  const bst = pokemon.stats.reduce((total, s) => total + s.base_stat, 0);
  const normalImg = `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/${id}.png`;
  const shinyImg = `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/shiny/${id}.png`;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#0c0c0e] border border-white/10 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header with Fixed Shiny Toggle */}
        <div className="p-6 border-b border-white/5 bg-white/5 relative">
            <div className="absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-20" style={{ backgroundColor: TYPE_COLORS[pokemon.types[0].type.name] }}></div>
            <div className="flex gap-5 items-center relative z-10 text-left">
                <div className="w-24 h-24 flex items-center justify-center bg-white/5 rounded-3xl border border-white/5 shadow-inner">
                  <img src={isShiny ? shinyImg : normalImg} className="w-20 h-20 object-contain cursor-pointer" onClick={() => setIsShiny(!isShiny)} alt={pokemon.name} />
                </div>
                <div className="font-black">
                    <h2 className="text-2xl text-white capitalize tracking-tighter leading-tight">{pokemon.name}</h2>
                    <div className="flex gap-2 mt-2">
                        {pokemon.types.map(t => (
                            <span key={t.type.name} style={{ backgroundColor: TYPE_COLORS[t.type.name] }} className="px-3 py-1 rounded-lg text-[9px] uppercase text-white shadow-lg">{t.type.name}</span>
                        ))}
                    </div>
                    <button onClick={() => setIsShiny(!isShiny)} className={`mt-3 text-[9px] px-2 py-1 rounded border transition-all ${isShiny ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 'bg-white/10 border-white/10 text-gray-400'}`}>
                      {isShiny ? "✨ SHINY MODE" : "✨ VIEW SHINY"}
                    </button>
                </div>
            </div>
            <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full text-gray-500"><X size={20}/></button>
        </div>

        {/* Tabs */}
        <div className="flex bg-black/40 border-b border-white/5 font-black">
            {['info', 'moves', 'stats', 'battle'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-4 text-[10px] uppercase tracking-widest transition-all ${activeTab === t ? 'text-emerald-400 bg-emerald-500/5 border-b-2 border-emerald-400' : 'text-gray-500'}`}>
                    {t}
                </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {activeTab === 'info' && (
            <div className="space-y-6 text-left font-black">
                <div>
                    <h3 className="text-[10px] text-gray-600 uppercase mb-3 tracking-widest">Abilities</h3>
                    <div className="flex flex-col gap-1">
                        {pokemon.abilities.map(a => (
                            <AbilityRow key={a.ability.name} abilityName={a.ability.name} isHidden={a.is_hidden} />
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-[10px] text-gray-600 uppercase mb-4 tracking-widest">Evolution Chain</h3>
                    <div className="flex flex-col gap-2">
                        {evoChain.map((evo, i) => (
                            <div key={evo.id} className="flex flex-col items-center">
                                <button onClick={() => onJump(evo.id)} className={`w-full flex items-center gap-4 p-3 rounded-2xl border transition-all ${evo.id == id ? 'bg-emerald-600/20 border-emerald-500 text-white' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'}`}>
                                    <img src={`https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/${evo.id}.png`} className="w-12 h-12 pixelated" alt={evo.name} />
                                    <span className="capitalize text-sm font-black">{evo.name}</span>
                                </button>
                                {i < evoChain.length - 1 && <div className="py-1"><ArrowRight size={14} className="text-gray-800 rotate-90" /></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          )}

          {activeTab === 'battle' && (
            <div className="space-y-4 font-black">
              <div className="relative h-64 bg-[#141416] rounded-[2.5rem] border border-white/5 flex flex-col justify-end p-8 overflow-hidden">
                <div className="absolute top-6 right-10 flex flex-col items-center text-center">
                  <img src={isShiny ? `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/shiny/${id}.png` : `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/${id}.png`} className="w-24 h-24 pixelated drop-shadow-2xl" alt="enemy" />
                  <div className="bg-black/80 px-3 py-1 rounded-full border border-white/10 text-[9px] text-white uppercase mt-2 shadow-lg tracking-widest font-black">Enemy</div>
                </div>
                <div className="flex flex-col items-start mb-0"> {/* Fixed: No bottom margin to ground the sprite */}
                  <img src={isShiny ? `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/back/shiny/${id}.png` : `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/back/${id}.png`} 
                       className="w-40 h-40 pixelated scale-[1.3] origin-bottom-left transition-transform -mb-6" // Grounded with negative margin
                       alt="yours" />
                  <div className="bg-emerald-600 px-3 py-1 rounded-full text-[9px] text-white uppercase tracking-widest shadow-xl relative z-20 font-black">Player</div>
                </div>
              </div>
            </div>
          )}

          {/* ... (Moves and Stats remain the same as the Master version) ... */}
        </div>
      </div>
    </div>
  );
}