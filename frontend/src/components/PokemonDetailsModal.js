import React from 'react';
import { X, Sword, Shield, Zap, Target, Star } from 'lucide-react';
import { TYPE_COLORS, CLASS_COLORS } from '../data/theme';
import pokemonData from '../data/pokemonData';

export default function PokemonDetailsModal({ pokemon, onClose, onJump }) {
  
  // Logic for "Best Moveset"
  const getProTips = (p) => {
    const isSpecial = p.baseStats.spAtk > p.baseStats.atk;
    return {
      nature: isSpecial ? "Timid / Modest" : "Jolly / Adamant",
      item: p.baseStats.speed > 100 ? "Life Orb" : "Leftovers",
      ability: p.abilities[0], // Suggests primary
      bestMoves: p.moves.slice(0, 4).map(m => m.name) // Grabs top 4 from your data
    };
  };

  const proTips = getProTips(pokemon);

  // Logic to find others with the same ability
  const findOthersWithAbility = (abilityName) => {
    return pokemonData.filter(p => p.abilities.includes(abilityName) && p.name !== pokemon.name);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[500] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#16161A] border border-white/10 w-full max-w-4xl rounded-3xl p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full"><X/></button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column: Visuals & Evos */}
          <div>
            <img src={`/sprites/pokemon/${pokemon.id}.png`} className="w-48 h-48 mx-auto" />
            <h2 className="text-4xl font-black text-white text-center uppercase tracking-tighter mb-4">{pokemon.name}</h2>
            
            <div className="bg-black/20 p-4 rounded-2xl mb-6">
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Evolution Chain</h4>
              <div className="flex items-center gap-4 justify-center">
                {pokemon.evoChain.map((evo, i) => (
                  <React.Fragment key={evo}>
                    <button 
                      onClick={() => onJump(evo)}
                      className={`text-sm font-bold ${evo.toLowerCase() === pokemon.name.toLowerCase() ? 'text-emerald-400' : 'text-gray-400 hover:text-white underline'}`}
                    >
                      {evo}
                    </button>
                    {i < pokemon.evoChain.length - 1 && <span className="text-gray-600">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-500 uppercase">Abilities</h4>
              {pokemon.abilities.map(a => (
                <div key={a} className="group relative">
                  <button className="bg-white/5 p-3 rounded-xl w-full text-left text-white font-bold hover:bg-emerald-500/20 transition-colors">
                    {a}
                  </button>
                  {/* Tooltip showing others with this ability */}
                  <div className="hidden group-hover:block absolute left-0 bottom-full mb-2 p-2 bg-gray-800 rounded shadow-xl z-10 w-48">
                    <p className="text-[10px] text-gray-400 mb-1">Also used by:</p>
                    {findOthersWithAbility(a).slice(0, 5).map(other => (
                      <div key={other.name} onClick={() => onJump(other.name)} className="text-[10px] text-emerald-400 hover:underline cursor-pointer">
                        {other.name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Stats & Moves */}
          <div className="space-y-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
              <h4 className="flex items-center gap-2 text-emerald-400 font-bold mb-3"><Star size={16}/> Recommended Competitive Set</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Nature:</span> <span className="text-white">{proTips.nature}</span></div>
                <div><span className="text-gray-500">Item:</span> <span className="text-white">{proTips.item}</span></div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {proTips.bestMoves.map(m => <span key={m} className="text-[10px] bg-black/30 px-2 py-1 rounded text-gray-300">{m}</span>)}
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto pr-2">
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Moveset</h4>
              <table className="w-full text-left border-collapse">
                <thead className="text-[10px] text-gray-500 uppercase border-b border-white/5">
                  <tr><th className="pb-2">Move</th><th className="pb-2">Type</th><th className="pb-2">Cat</th><th className="pb-2 text-right">Pwr</th></tr>
                </thead>
                <tbody className="text-sm">
                  {pokemon.moves.map(move => (
                    <tr key={move.name} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-2 text-white font-medium">{move.name}</td>
                      <td className="py-2">
                        <span style={{backgroundColor: TYPE_COLORS[move.type.toLowerCase()]}} className="text-[10px] px-2 py-0.5 rounded text-white font-bold uppercase">
                          {move.type}
                        </span>
                      </td>
                      <td className="py-2">
                        <span style={{backgroundColor: CLASS_COLORS[move.category]}} className="text-[10px] px-2 py-0.5 rounded text-white font-bold">
                          {move.category[0]}
                        </span>
                      </td>
                      <td className="py-2 text-right text-gray-400 font-mono">{move.power || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
