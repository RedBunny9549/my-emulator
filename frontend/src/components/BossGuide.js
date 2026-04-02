import { useState, useEffect } from "react";
import { BookOpen, X, Loader2, AlertTriangle, Crosshair } from "lucide-react";
import { BOSS_DATA } from "../data/bossData";
import { MOVE_DATA } from "../data/moveData";

const GAME_LABELS = {
  emerald: { name: "Pokémon Emerald", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  firered: { name: "Pokémon FireRed", color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/30"     },
  crystal: { name: "Pokémon Crystal", color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/30"    },
};

const TYPE_COLORS = {
  fire:"#FF4422",water:"#3399FF",grass:"#77CC55",electric:"#FFCC33",
  psychic:"#FF5599",ice:"#66CCFF",dragon:"#7766EE",dark:"#AA7766",
  normal:"#AAAAAA",fighting:"#CC6655",flying:"#8899FF",poison:"#AA55AA",
  ground:"#DDBB55",rock:"#BBAA66",bug:"#AABB22",ghost:"#6655BB",steel:"#AAAABB",
};

function getTrainerSprite(leader) {
  if (!leader) return 'https://play.pokemonshowdown.com/sprites/trainers/red.png';
  let cleanName = leader.toLowerCase().replace(/\s+/g, "").replace("&", "and").replace(".", "");
  
  const map = {
    "blue": "blue",
    "championgary": "blue",
    "ltsurge": "ltsurge-gen3",
    "tateandliza": "tateandliza-gen3",
    "koga": "koga-gen2",
    "phoebe": "phoebe-gen3",
    "drake": "drake-gen3",
    "agatha": "agatha-gen3",
    "lorelei": "lorelei-gen3"
  };
  
  cleanName = map[cleanName] || cleanName;
  return `https://play.pokemonshowdown.com/sprites/trainers/${cleanName}.png`;
}

function BossPokemonModal({ pokemon, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name.toLowerCase()}`)
      .then(r => r.json()).then(d => setData(d)).catch(()=>{});
  }, [pokemon]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#16161A] border border-white/10 rounded-3xl w-full max-w-md p-6 shadow-2xl" onClick={e=>e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-black text-white capitalize tracking-tight">{pokemon.name}</h2>
            <p className="text-emerald-500 font-bold text-sm">Level {pokemon.level}</p>
          </div>
          <button onClick={onClose} className="bg-white/5 p-2 rounded-full hover:bg-white/10 transition-colors"><X className="text-gray-400 w-5 h-5" /></button>
        </div>

        {!data ? <Loader2 className="animate-spin text-emerald-500 mx-auto my-12" /> : (
          <div>
            <div className="bg-[#0D0D10] border border-white/5 rounded-2xl p-4 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-emerald-500/5" />
              <img src={data.sprites.other["official-artwork"]?.front_default || data.sprites.front_default} className="w-32 h-32 mx-auto drop-shadow-xl relative z-10" alt={pokemon.name} />
              <div className="flex gap-2 justify-center mt-4 relative z-10">
                {data.types.map(t => (
                  <span key={t.type.name} style={{ backgroundColor: TYPE_COLORS[t.type.name]+"25", color: TYPE_COLORS[t.type.name], borderColor: TYPE_COLORS[t.type.name]+"40" }} className="px-3 py-1 border text-[10px] font-black uppercase rounded shadow-sm">
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs text-gray-500 font-bold uppercase mb-2">Historical Ability</p>
              {pokemon.ability ? (
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-xs font-bold">{pokemon.ability}</span>
              ) : (
                <p className="text-xs text-gray-600 italic">Not logged in local database. Check standard Pokédex.</p>
              )}
            </div>

            <div className="mb-2">
              <div className="flex items-center gap-2 mb-3">
                <Crosshair className="w-4 h-4 text-emerald-500" />
                <p className="text-xs text-white font-bold uppercase tracking-widest">Historical Moveset</p>
              </div>
              
              {pokemon.moves && pokemon.moves.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {pokemon.moves.map(m => {
                    const moveKey = m.toLowerCase().replace(/\s/g, "-");
                    const moveStats = MOVE_DATA ? MOVE_DATA[moveKey] : null;
                    return (
                      <div key={m} className="bg-[#0D0D10] border border-white/5 px-4 py-3 rounded-xl flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          {moveStats ? (
                            <span style={{ backgroundColor: TYPE_COLORS[moveStats.type]+"20", color: TYPE_COLORS[moveStats.type] }} className="w-16 text-center py-1 rounded text-[10px] font-black uppercase">
                              {moveStats.type}
                            </span>
                          ) : (
                            <span className="w-16 text-center py-1 bg-gray-800 text-gray-400 rounded text-[10px] font-black uppercase">???</span>
                          )}
                          <span className="text-sm text-gray-200 font-bold capitalize">{m}</span>
                        </div>
                        {moveStats && (
                          <div className="flex gap-4 text-[10px] font-mono">
                            <span className="text-gray-400">PWR <span className="text-white font-bold">{moveStats.power}</span></span>
                            <span className="text-gray-400">ACC <span className="text-white font-bold">{moveStats.acc}</span></span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-[#0D0D10] border border-white/5 p-4 rounded-xl text-center">
                  <p className="text-xs text-gray-500 italic">Moveset data not yet added to local database for this specific fight.</p>
                </div>
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
          <button
            key={key}
            onClick={() => setGame(key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all shadow-sm ${
              game === key ? `${bg} ${border} ${color} shadow-lg scale-105` : "bg-[#16161A] border-white/5 text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="flex border-b border-white/10 mb-8">
        {[{ id: "gyms", label: "Gym Leaders" }, { id: "elite", label: "Elite Four & Champion" }].map(({ id, label }) => (
          <button 
            key={id} 
            onClick={() => setSection(id)} 
            className={`px-6 py-4 text-sm font-bold border-b-2 -mb-px transition-colors ${section === id ? "border-emerald-400 text-emerald-400" : "border-transparent text-gray-500 hover:text-white"}`}
          >
            {label}
          </button>
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
                  <img src={getTrainerSprite(boss.leader)} className="w-full h-full object-contain" alt={boss.leader} onError={(e) => e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/red.png'} />
                </div>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{boss.badge || boss.title}</span>
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">{boss.leader}</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {boss.team.map((p, i) => (
                    <button key={i} onClick={() => setSelectedPokemon(p)} className="flex flex-col items-center bg-[#0D0D10] hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all cursor-pointer rounded-xl p-3 border border-white/5 shadow-sm">
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
