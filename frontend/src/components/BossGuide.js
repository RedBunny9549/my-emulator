import { useState } from "react";
import { BookOpen } from "lucide-react";
import { BOSS_DATA } from "../data/bossData";

const GAME_LABELS = {
  emerald: { name: "Pokémon Emerald", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  firered: { name: "Pokémon FireRed", color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/30"     },
};

export default function BossGuide() {
  const [game, setGame] = useState("emerald");
  const [section, setSection] = useState("gyms");

  const gData = BOSS_DATA[game] || BOSS_DATA.emerald;
  
  // Create an array of bosses based on the selected section to avoid the .map error
  const bosses = section === "gyms"
    ? gData.gyms || []
    : [...(gData.elite || []), gData.champion].filter(Boolean);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#16161A] border border-white/5 rounded-xl flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Boss Guide</h1>
          <p className="text-gray-500 text-sm">Gym leaders, Elite Four & Champions</p>
        </div>
      </div>

      {/* Game selector */}
      <div className="flex gap-2 mb-6">
        {Object.entries(GAME_LABELS).map(([key, { name, color, bg, border }]) => (
          <button
            key={key}
            onClick={() => setGame(key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
              game === key
                ? `${bg} ${border} ${color}`
                : "bg-transparent border-white/5 text-gray-500 hover:text-white"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Section tabs */}
      <div className="flex border-b border-white/5 mb-6">
        {[
          { id: "gyms",  label: "Gym Leaders" },
          { id: "elite", label: "Elite Four & Champion" },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              section === id
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-gray-500 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Boss cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bosses.map(boss => (
          <div key={boss.leader} className="bg-[#16161A] border border-white/10 rounded-3xl p-6 flex flex-col xl:flex-row gap-6">
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl p-2 border border-emerald-500/20">
                <img 
                  src={`https://play.pokemonshowdown.com/sprites/trainers/${boss.leader.toLowerCase().replace(/\s/g, "")}.png`} 
                  className="w-full h-full object-contain" 
                  alt={boss.leader}
                  onError={(e) => e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/red.png'}
                />
              </div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase bg-emerald-500/10 px-2 py-1 rounded">
                {boss.badge || boss.title}
              </span>
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-3 uppercase">{boss.leader}</h2>
              <div className="flex flex-wrap gap-2">
                {boss.team.map((p, i) => (
                  <div key={i} className="flex flex-col items-center bg-[#0D0D10] rounded-xl p-2 border border-white/5">
                    <img 
                      src={`https://img.pokemondb.net/sprites/emerald/normal/${p.name.toLowerCase()}.png`} 
                      className="w-10 h-10 pixelated" 
                      title={p.name} 
                      onError={(e) => e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'}
                    />
                    <span className="text-[9px] text-gray-500 font-bold uppercase mt-1">Lv.{p.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
