import { useState, useEffect } from "react";
import { X, Loader2, Star, Zap, Shield, ArrowRight } from "lucide-react";
import { TYPE_COLORS, CLASS_COLORS } from "../data/theme";

export default function PokemonDetailsModal({ id, onClose, onJump }) {
  const [data, setData] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evoChain, setEvoChain] = useState([]);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(r => r.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(r => r.json())
    ]).then(([p, s]) => {
      setData(p);
      setSpecies(s);
      fetch(s.evolution_chain.url).then(r => r.json()).then(eco => {
        const chain = [];
        let curr = eco.chain;
        while(curr) {
            chain.push({ name: curr.species.name, id: curr.species.url.split('/').filter(Boolean).pop() });
            curr = curr.evolves_to[0];
        }
        setEvoChain(chain);
      });
    });
  }, [id]);

  if (!data || !species) return null;

  // Logic for Recommended Set
  const getBestSet = () => {
    const isSpecial = data.stats[3].base_stat > data.stats[1].base_stat;
    return {
      nature: isSpecial ? "Modest / Timid" : "Adamant / Jolly",
      item: "Leftovers / Life Orb",
      ability: data.abilities[0].ability.name.replace("-", " ")
    };
  };
  const bestSet = getBestSet();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#16161A] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <div className="flex gap-4 items-center">
                <img src={data.sprites.front_default} className="w-16 h-16 pixelated bg-black/20 rounded-full" />
                <div>
                    <h2 className="text-2xl font-black text-white capitalize">{data.name.replace("-"," ")}</h2>
                    <div className="flex gap-2 mt-1">
                        {data.types.map(t => (
                            <span key={t.type.name} style={{ backgroundColor: TYPE_COLORS[t.type.name] }} className="px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white">
                                {t.type.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><X className="text-gray-500" /></button>
        </div>

        <div className="flex border-b border-white/5">
            {['info', 'moves', 'strategy'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest ${activeTab === t ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-500'}`}>
                    {t}
                </button>
            ))}
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {activeTab === 'info' && (
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    {data.stats.map(s => (
                        <div key={s.stat.name}>
                            <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500 mb-1">
                                <span>{s.stat.name.replace("special-", "sp")}</span>
                                <span className="text-white">{s.base_stat}</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: `${(s.base_stat/255)*100}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-3">Evolution Chain (Click to jump)</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                        {evoChain.map((evo, i) => (
                            <div key={evo.id} className="flex items-center gap-2">
                                <button onClick={() => onJump(evo.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize border ${evo.id == id ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-white/5 border-white/5 text-gray-400'}`}>
                                    {evo.name}
                                </button>
                                {i < evoChain.length - 1 && <ArrowRight size={14} className="text-gray-700" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          )}

          {activeTab === 'strategy' && (
            <div className="space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
                    <h4 className="flex items-center gap-2 text-emerald-400 font-bold mb-3"><Star size={16}/> Pro Build</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                        <p><span className="text-gray-500">Nature:</span> {bestSet.nature}</p>
                        <p><span className="text-gray-500">Held Item:</span> {bestSet.item}</p>
                        <p><span className="text-gray-500">Key Ability:</span> {bestSet.ability}</p>
                    </div>
                </div>
            </div>
          )}

          {activeTab === 'moves' && (
            <div className="space-y-2">
                {data.moves.slice(0, 20).map(m => (
                    <div key={m.move.name} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-white font-bold capitalize text-sm">{m.move.name.replace("-"," ")}</span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Level {m.version_group_details[0].level_learned_at || '—'}</span>
                    </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
