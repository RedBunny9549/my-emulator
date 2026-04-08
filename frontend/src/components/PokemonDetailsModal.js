import { useState, useEffect } from "react";
import { X, Loader2, Star, ArrowRight } from "lucide-react";
import { TYPE_COLORS } from "../data/theme";

// Sub-component for clickable ability rows (Re-added)
function AbilityRow({ name, isHidden }) {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!open && !data) {
      setLoading(true);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/ability/${name}`);
        const json = await res.json();
        const effect = json.effect_entries.find(e => e.language.name === "en")?.short_effect || "No description available.";
        setData(effect);
      } catch (err) { setData("Failed to load ability data."); }
      setLoading(false);
    }
    setOpen(!open);
  };

  return (
    <div className="bg-[#0D0D10] border border-white/5 rounded-xl mb-2 overflow-hidden">
      <button onClick={toggle} className="w-full px-4 py-3 flex justify-between items-center hover:bg-white/5">
        <span className="text-white font-bold capitalize text-sm">{name.replace("-"," ")}</span>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (open ? "−" : "+")}
      </button>
      {open && <div className="px-4 pb-4 text-sm text-gray-400 pt-2">{data}</div>}
    </div>
  );
}

// Sub-component for clickable move rows (Fixed Color coding)
function MoveRow({ moveName }) {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);

  const toggle = async () => {
    if (!open && !data) {
      const res = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`);
      const json = await res.json();
      setData({
        type: json.type.name,
        power: json.power || "-",
        effect: json.effect_entries?.find(e => e.language.name === "en")?.short_effect || ""
      });
    }
    setOpen(!open);
  };

  return (
    <div className="bg-[#0D0D10] border border-white/5 rounded-xl mb-2 overflow-hidden">
      <button onClick={toggle} className="w-full px-4 py-3 flex justify-between items-center hover:bg-white/5">
        <span className="text-white font-bold capitalize text-sm">{moveName.replace("-"," ")}</span>
        {data && (
          <span style={{ backgroundColor: TYPE_COLORS[data.type] }} className="px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white">
            {data.type}
          </span>
        )}
      </button>
      {open && data && <div className="px-4 pb-4 text-xs text-gray-500 italic">{data.effect}</div>}
    </div>
  );
}

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

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#16161A] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <div className="flex gap-4 items-center">
                <img src={data.sprites.front_default} className="w-16 h-16 bg-black/20 rounded-full" style={{imageRendering: 'pixelated'}} />
                <h2 className="text-2xl font-black text-white capitalize">{data.name.replace("-"," ")}</h2>
            </div>
            <button onClick={onClose}><X className="text-gray-500" /></button>
        </div>

        <div className="flex border-b border-white/5">
            {['info', 'moves', 'best stuff'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest ${activeTab === t ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-500'}`}>
                    {t}
                </button>
            ))}
        </div>

        <div className="p-6 overflow-y-auto">
          {activeTab === 'info' && (
            <div className="space-y-6">
                <div>
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-3">Evolution Chain</h3>
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
                <div>
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-3">Abilities</h3>
                    {data.abilities.map(a => <AbilityRow key={a.ability.name} name={a.ability.name} isHidden={a.is_hidden} />)}
                </div>
            </div>
          )}

          {activeTab === 'moves' && (
            <div className="space-y-1">
                {data.moves.slice(0, 30).map(m => <MoveRow key={m.move.name} moveName={m.move.name} />)}
            </div>
          )}

          {activeTab === 'best stuff' && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
                <h4 className="flex items-center gap-2 text-emerald-400 font-bold mb-3"><Star size={16}/> Suggested Build</h4>
                <p className="text-sm text-gray-300">Nature: <span className="text-white">{data.stats[3].base_stat > data.stats[1].base_stat ? "Modest" : "Adamant"}</span></p>
                <p className="text-sm text-gray-300">Best Ability: <span className="text-white">{data.abilities[0].ability.name}</span></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
