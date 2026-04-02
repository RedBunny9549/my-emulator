import { useState, useEffect } from "react";
import { BookOpen, X, Loader2 } from "lucide-react";
import { BOSS_DATA } from "../data/bossData";

const GAME_LABELS = {
  emerald: { name: "Pokémon Emerald", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  firered: { name: "Pokémon FireRed", color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/30"     },
  crystal: { name: "Pokémon Crystal", color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/30"    },
};

function getTrainerSprite(leader) {
  let cleanName = leader.toLowerCase().replace(/\s+/g, "").replace("&", "and").replace(".", "");
  if (cleanName === "blue" || cleanName === "championgary") cleanName = "blue";
  if (cleanName === "ltsurge") cleanName = "ltsurge-gen3";
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
      <div className="bg-[#16161A] border border-white/10 rounded-2xl w-full max-w-sm p-6" onClick={e=>e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white capitalize">{pokemon.name}</h2>
            <p className="text-gray-500 font-mono text-sm">Level {pokemon.level}</p>
          </div>
          <button onClick={onClose}><X className="text-gray-500 hover:text-white" /></button>
        </div>

        {!data ? <Loader2 className="animate-spin text-emerald-500 mx-auto" /> : (
          <div>
            <img src={data.sprites.front_default} className="w-24 h-24 mx-auto pixelated" alt={pokemon.name} />
            
            <div className="mt-4">
              <p className="text-xs text-gray-500 font-bold uppercase mb-1">Possible Abilities</p>
              <div className="flex gap-2">
                {data.abilities.map(a => <span key={a.ability.name} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded capitalize">{a.ability.name.replace("-"," ")}</span>)}
              </div>
            </div>

            {pokemon.moves && pokemon.moves.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Known Moves</p>
                <div className="grid grid-cols-2 gap-2">
                  {pokemon.moves.map(m => (
                    <div key={m} className="bg-gray-800 px-2 py-1 rounded text-xs text-gray-300 capitalize">{m.replace("-"," ")}</div>
                  ))}
                </div>
              </div>
            )}
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

  // FIX: Provide robust fallbacks to prevent `.map` crashes
  const gData = BOSS_DATA[game] || BOSS_DATA.emerald;
  const bosses = section === "gyms" 
    ? (gData.gyms || []) 
    : [...(gData.elite || []), gData.champion].filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#16161A] border border-white/5 rounded-xl flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Boss Guide</h1>
          <p className="text-gray-500 text-sm">Gym leaders, Elite Four & Champions</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {Object.entries(GAME_LABELS).map(([key, { name, color, bg, border }]) => (
          <button
            key={key}
            onClick={() => setGame(key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
              game === key ? `${bg} ${border} ${color}` : "bg-transparent border-white/5 text-gray-500 hover:text-white"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="flex border-b border-white/5 mb-6">
        {[{ id: "gyms", label: "Gym Leaders" }, { id: "elite", label: "Elite Four & Champion" }].map(({ id, label }) => (
          <button 
            key={id} 
            onClick={() => setSection(id)} 
            className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${section === id ? "border-emerald-400 text-emerald-400" : "border-transparent text-gray-500 hover:text-white"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {bosses.map(boss => (
          <div key={boss.leader} className="bg-[#16161A] border border-white/10 rounded-3xl p-6 flex flex-col sm:flex-row gap-6">
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl p-2 border border-emerald-500/20">
                <img src={getTrainerSprite(boss.leader)} className="w-full h-full object-contain" alt={boss.leader} onError={(e) => e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/red.png'} />
              </div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase">{boss.badge || boss.title}</span>
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-3 uppercase">{boss.leader}</h2>
              <div className="flex flex-wrap gap-2">
                {boss.team.map((p, i) => (
                  <button key={i} onClick={() => setSelectedPokemon(p)} className="flex flex-col items-center bg-[#0D0D10] hover:bg-white/5 transition-colors cursor-pointer rounded-xl p-2 border border-white/5">
                    <img src={`https://img.pokemondb.net/sprites/emerald/normal/${p.name.toLowerCase()}.png`} className="w-10 h-10 pixelated" title={p.name} onError={(e) => e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'} />
                    <span className="text-[9px] text-gray-500 font-bold uppercase mt-1">Lv.{p.level}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPokemon && <BossPokemonModal pokemon={selectedPokemon} onClose={() => setSelectedPokemon(null)} />}
    </div>
  );
}
