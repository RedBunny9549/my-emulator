import React from 'react';
import { X, Star, ShieldCheck, Zap, Info } from 'lucide-react';
import { TYPE_COLORS, CLASS_COLORS } from '../data/theme';
import pokemonData from '../data/pokemonData';

export default function PokemonDetailsModal({ pokemon, onClose, onJump }) {
  
  // Logic to suggest Competitive Meta
  const getMetaSet = (p) => {
    const stats = p.baseStats;
    const isSpecial = stats.spAtk > stats.atk;
    const isTank = (stats.hp + stats.def + stats.spDef) > 250;
    
    return {
      nature: isSpecial ? (stats.speed > 90 ? "Timid" : "Modest") : (stats.speed > 90 ? "Jolly" : "Adamant"),
      item: isTank ? "Leftovers" : (stats.speed > 110 ? "Life Orb" : "Choice Scarf"),
      role: isTank ? "Bulky Wall" : "Fast Sweeper"
    };
  };

  const meta = getMetaSet(pokemon);

  // Find other mons with the same ability
  const otherUsers = (ability) => pokemonData.filter(p => p.abilities.includes(ability) && p.id !== pokemon.id);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[500] flex items-center justify-center p-4">
      <div className="bg-[#16161A] border border-white/10 w-full max-w-5xl rounded-3xl p-6 md:p-10 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="fixed top-8 right-8 p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform z-10"><X/></button>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Column 1: Info & Evo */}
          <div className="lg:col-span-4 space-y-6">
            <div className="text-center bg-black/20 p-6 rounded-3xl border border-white/5">
               <img src={`/sprites/pokemon/${pokemon.id}.png`} className="w-48 h-48 mx-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
               <h2 className="text-4xl font-black text-white uppercase italic">{pokemon.name}</h2>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl">
              <h4 className="text-gray-500 font-bold text-xs uppercase mb-3 flex items-center gap-2"><Zap size={14}/> Evolution Chain</h4>
              <div className="flex flex-wrap items-center gap-2">
                {pokemon.evoChain.map((name, i) => (
                  <React.Fragment key={name}>
                    <button 
                      onClick={() => onJump(name)}
                      className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${name.toLowerCase() === pokemon.name.toLowerCase() ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                    >
                      {name}
                    </button>
                    {i < pokemon.evoChain.length - 1 && <span className="text-gray-700">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-gray-500 font-bold text-xs uppercase flex items-center gap-2"><Info size={14}/> Abilities (Click to see others)</h4>
              {pokemon.abilities.map(a => (
                <div key={a} className="group relative">
                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-white text-sm font-bold">
                    {a}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {otherUsers(a).slice(0, 4).map(u => (
                        <button key={u.id} onClick={() => onJump(u.name)} className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded hover:bg-emerald-500/30">
                          {u.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Stats & Strategy */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
               <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-3xl">
                  <h4 className="text-emerald-400 font-black text-sm uppercase mb-4 flex items-center gap-2"><Star size={18}/> Recommended Build</h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between"><span className="text-gray-500 font-medium">Nature</span> <span className="text-white font-bold">{meta.nature}</span></p>
                    <p className="flex justify-between"><span className="text-gray-500 font-medium">Held Item</span> <span className="text-white font-bold">{meta.item}</span></p>
                    <p className="flex justify-between"><span className="text-gray-500 font-medium">Role</span> <span className="text-white font-bold">{meta.role}</span></p>
                  </div>
               </div>
               
               <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                  <h4 className="text-gray-400 font-black text-sm uppercase mb-4 flex items-center gap-2"><ShieldCheck size={18}/> Base Stats</h4>
                  {Object.entries(pokemon.baseStats).map(([stat, val]) => (
                    <div key={stat} className="flex items-center gap-3 mb-1 text-[11px] uppercase font-bold text-gray-400">
                      <span className="w-12">{stat}</span>
                      <div className="flex-1 bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{width: `${(val/255)*100}%`}}></div>
                      </div>
                      <span className="w-8 text-right text-white">{val}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-black/30 rounded-3xl overflow-hidden border border-white/5">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[10px] font-black text-gray-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">Move</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3 text-right">Power</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pokemon.moves.map(m => (
                    <tr key={m.name} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-white font-bold text-sm">{m.name}</td>
                      <td className="px-4 py-3">
                        <span style={{backgroundColor: TYPE_COLORS[m.type.toLowerCase()]}} className="text-[10px] px-2 py-0.5 rounded text-white font-bold uppercase">
                          {m.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                         <span style={{backgroundColor: CLASS_COLORS[m.category]}} className="text-[10px] px-2 py-0.5 rounded text-white font-bold uppercase">
                          {m.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-400 font-mono text-sm">{m.power || '--'}</td>
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
