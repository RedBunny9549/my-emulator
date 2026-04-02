import { useState, useEffect } from "react";
import { BookOpen, X, Loader2, Crosshair, ChevronDown, ChevronUp, Package } from "lucide-react";
import { BOSS_DATA } from "../data/bossData";

const GAME_LABELS = {
  emerald: { name: "Pokémon Emerald", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  firered: { name: "Pokémon FireRed", color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/30"     },
  crystal: { name: "Pokémon Crystal", color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/30"    },
};

function getTrainerSprite(leader) {
  if (!leader) return 'https://play.pokemonshowdown.com/sprites/trainers/red.png';
  let cleanName = leader.toLowerCase().replace(/\s+/g, "").replace("&", "and").replace(".", "");
  const map = { "blue": "blue", "championgary": "blue", "ltsurge": "ltsurge-gen3", "tateandliza": "tateandliza-gen3", "koga": "koga-gen2", "phoebe": "phoebe-gen3", "drake": "drake-gen3", "agatha": "agatha-gen3", "lorelei": "lorelei-gen3" };
  return `https://play.pokemonshowdown.com/sprites/trainers/${map[cleanName] || cleanName}.png`;
}

// --- Interactive Item Row for Bosses ---
function ItemRow({ itemName }) {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!open && !data) {
      setLoading(true);
      try {
        const formattedName = itemName.toLowerCase().replace(/\s/g, "-");
        const res = await fetch(`https://pokeapi.co/api/v2/item/${formattedName}`);
        const json = await res.json();
        const effect = json.effect_entries?.find(e => e.language.name === "en")?.short_effect || json.flavor_text_entries?.find(e => e.language.name === "en")?.text || "No effect described.";
        setData(effect);
      } catch (err) { setData("Failed to load item data."); }
      setLoading(false);
    }
    setOpen(!open);
  };

  return (
    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl mb-4 overflow-hidden transition-all">
      <button onClick={toggle} className="w-full px-4 py-3 flex justify-between items-center hover:bg-white/5">
        <div className="flex items-center gap-3">
          <Package className="w-4 h-4 text-yellow-500" />
          <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Held Item</span>
          <span className="text-yellow-400 font-bold capitalize text-sm">{itemName.replace("-"," ")}</span>
        </div>
        {loading ? <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" /> : open ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>
      {open && data && (
        <div className="px-4 pb-4 text-sm text-gray-400 border-t border-yellow-500/20 pt-3 bg-black/20 leading-relaxed">
          {data}
        </div>
      )}
    </div>
  );
}

// --- Interactive Ability Row for Bosses ---
function AbilityRow({ abilityName }) {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!open && !data) {
      setLoading(true);
      try {
        const formattedName = abilityName.toLowerCase().replace(/\s/g, "-");
        const res = await fetch(`https://pokeapi.co/api/v2/ability/${formattedName}`);
        const json = await res.json();
        const effect = json.effect_entries.find(e => e.language.name === "en")?.short_effect || "No description available.";
        setData(effect);
      } catch (err) { setData("Failed to load ability data."); }
      setLoading(false);
    }
    setOpen(!open);
  };

  return (
    <div className="bg-[#0D0D10] border border-white/5 rounded-xl mb-4 overflow-hidden transition-all">
      <button onClick={toggle} className="w-full px-4 py-3 flex justify-between items-center hover:bg-white/5">
        <div className="flex items-center gap-3">
          <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Ability</span>
          <span className="text-white font-bold capitalize text-sm">{abilityName}</span>
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

// --- Interactive Move Row for Bosses ---
function MoveRow({ moveName }) {
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
          type: json.type.name, category: json.damage_class.name, power: json.power || "-", acc: json.accuracy || "-", pp: json.pp,
          effect: json.effect_entries.find(e => e.language.name === "en")?.short_effect.replace("$effect_chance", json.effect_chance) || "No effect."
        });
      } catch (err) { setData({ effect: "Failed to load move data." }); }
      setLoading(false);
    }
    setOpen(!open);
  };

  return (
    <div className="bg-[#0D0D10] border border-white/5 rounded-xl mb-2 overflow-hidden">
      <button onClick={toggle} className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5">
        <span className="text-gray-200 capitalize font-bold text-sm">{moveName.replace("-"," ")}</span>
        <div className="flex items-center gap-3">
          {data && <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-gray-600`}>{data.type}</span>}
          {loading ? <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" /> : open ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </div>
      </button>
      {open && data && (
        <div className="px-4 pb-4 pt-3 border-t border-white/5 bg-black/20">
          <div className="flex gap-4 mb-3">
             <div className="bg-gray-900 px-3 py-1.5 rounded-lg border border-white/5"><p className="text-[9px] text-gray-500 uppercase font-bold">Class</p><p className="text-xs font-bold text-white capitalize">{data.category}</p></div>
             <div className="bg-gray-900 px-3 py-1.5 rounded-lg border border-white/5"><p className="text-[9px] text-gray-500 uppercase font-bold">Power</p><p className="text-xs font-bold text-white font-mono">{data.power}</p></div>
             <div className="bg-gray-900 px-3 py-1.5 rounded-lg border border-white/5"><p className="text-[9px] text-gray-500 uppercase font-bold">Acc</p><p className="text-xs font-bold text-white font-mono">{data.acc}</p></div>
          </div>
          <p className="text-sm text-gray-400 italic leading-relaxed">{data.effect}</p>
        </div>
      )}
    </div>
  );
}

function BossPokemonModal({ pokemon, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name.toLowerCase()}`)
      .then(r => r.json()).then(d => setData(d)).catch(()=>{});
  }, [pokemon]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#16161A] border border-white/10 rounded-3xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={e=>e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-black text-white capitalize tracking-tight">{pokemon.name}</h2>
            <p className="text-emerald-500 font-bold text-sm">Level {pokemon.level}</p>
          </div>
          <button onClick={onClose} className="bg-white/5 p-2 rounded-full hover:bg-white/10 transition-colors"><X className="text-gray-400 w-5 h-5" /></button>
        </div>

        {!data ? <Loader2 className="animate-spin text-emerald-500 mx-auto my-12" /> : (
          <div>
            <div className="relative">
               {/* Display Held Item Sprite next to the Pokemon if it has one */}
               {pokemon.item && (
                 <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${pokemon.item}.png`} 
                      className="absolute top-0 right-10 w-12 h-12 pixelated drop-shadow-md z-20" 
                      alt={pokemon.item} title={pokemon.item.replace("-", " ")} />
               )}
               <img src={data.sprites.other["official-artwork"]?.front_default || data.sprites.front_default} className="w-32 h-32 mx-auto drop-shadow-xl relative z-10" alt={pokemon.name} />
            </div>
            
            <div className="mt-4">
              {pokemon.item && <ItemRow itemName={pokemon.item} />}
              
              {pokemon.ability ? (
                <AbilityRow abilityName={pokemon.ability} />
              ) : (
                <div className="bg-[#0D0D10] border border-white/5 p-4 rounded-xl mb-4 text-center">
                  <p className="text-xs text-gray-500 italic">No specific historical ability recorded.</p>
                </div>
              )}
            </div>

            <div className="mb-2">
              <div className="flex items-center gap-2 mb-3">
                <Crosshair className="w-4 h-4 text-emerald-500" />
                <p className="text-xs text-white font-bold uppercase tracking-widest">Historical Moveset</p>
              </div>
              
              {pokemon.moves && pokemon.moves.length > 0 ? (
                <div className="flex flex-col">
                  {pokemon.moves.map(m => <MoveRow key={m} moveName={m.toLowerCase().replace(/\s/g, "-")} />)}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic bg-[#0D0D10] p-4 rounded-xl text-center">Moveset data not available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BossGuide() {
  const [game, setGame] = useState("emerald");
  const [section, setSection] = useState("gyms");
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const gData = BOSS_DATA[game] || {};
  const bosses = section === "gyms" ? (gData.gyms || []) : [...(gData.elite || []), gData.champion, gData.secret].filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-[#16161A] border border-emerald-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/10">
          <BookOpen className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Boss Guide</h1>
          <p className="text-gray-500 text-sm">Gym leaders, Elite Four & Champions</p>
        </div>
      </div>
      
      <div className="flex gap-2 mb-6 flex-wrap">
        {Object.entries(GAME_LABELS).map(([key, { name, color, bg, border }]) => (
          <button key={key} onClick={() => setGame(key)} className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all shadow-sm ${game === key ? `${bg} ${border} ${color} shadow-lg scale-105` : "bg-[#16161A] border-white/5 text-gray-400 hover:text-white"}`}>{name}</button>
        ))}
      </div>
      
      <div className="flex border-b border-white/10 mb-8">
        {[{ id: "gyms", label: "Gym Leaders" }, { id: "elite", label: "Elite Four & Champion" }].map(({ id, label }) => (
          <button key={id} onClick={() => setSection(id)} className={`px-6 py-4 text-sm font-bold border-b-2 -mb-px transition-colors ${section === id ? "border-emerald-400 text-emerald-400" : "border-transparent text-gray-500 hover:text-white"}`}>{label}</button>
        ))}
      </div>
      
      {bosses.length === 0 ? (
        <div className="text-center py-20 text-gray-500 font-bold">No boss data available for this section.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bosses.map(boss => (
            <div key={boss.leader} className="bg-[#16161A] border border-white/5 rounded-3xl p-6 flex flex-col sm:flex-row gap-6 shadow-xl hover:border-white/10 transition-colors">
              <div className="flex flex-col items-center gap-3 flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-t from-black/40 to-transparent rounded-2xl p-2 border border-white/5 shadow-inner">
                  <img src={getTrainerSprite(boss.leader)} className="w-full h-full object-contain" alt={boss.leader} />
                </div>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{boss.badge || boss.title}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">{boss.leader}</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {boss.team.map((p, i) => (
                    <button key={i} onClick={() => setSelectedPokemon(p)} className="flex flex-col items-center bg-[#0D0D10] hover:bg-emerald-500/10 transition-all cursor-pointer rounded-xl p-3 border border-white/5 shadow-sm relative">
                      {p.item && (
                        <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${p.item}.png`} className="absolute -top-2 -right-2 w-6 h-6 pixelated z-10" alt="Held Item" title={p.item} />
                      )}
                      <img src={`https://img.pokemondb.net/sprites/emerald/normal/${p.name.toLowerCase()}.png`} className="w-10 h-10 pixelated drop-shadow-md mb-2" title={p.name} onError={(e) => e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'} />
                      <span className="text-[10px] text-gray-400 font-black font-mono">LV.{p.level}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedPokemon && <BossPokemonModal pokemon={selectedPokemon} onClose={() => setSelectedPokemon(null)} />}
    </div>
  );
}
