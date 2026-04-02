import { useState, useEffect } from "react";
import { Search, Loader2, ChevronLeft, ChevronRight, Shield, Zap, Swords, LayoutGrid } from "lucide-react";
import { TYPE_COLOR } from "../data/typeData";

const GEN_RANGES = {
  0: { min: 1, max: 1025, name: "All Generations", game: "Complete National Dex" },
  1: { min: 1, max: 151, name: "Gen I", game: "Red/Blue/Yellow" },
  2: { min: 152, max: 251, name: "Gen II", game: "Gold/Silver/Crystal" },
  3: { min: 252, max: 386, name: "Gen III", game: "Ruby/Sapphire/Emerald" },
  4: { min: 387, max: 493, name: "Gen IV", game: "DPP" },
  5: { min: 494, max: 649, name: "Gen V", game: "Black/White" },
  // ... (Higher gens following same pattern)
};

export default function PokedexBrowser() {
  const [gen, setGen] = useState(3); // Default to Emerald Look
  const [allEntries, setAllEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    const { min, max } = GEN_RANGES[gen];
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${max - min + 1}&offset=${min - 1}`)
      .then(r => r.json())
      .then(data => {
        const entries = data.results.map((r, i) => ({ 
          id: min + i, 
          name: r.name, 
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${min + i}.png`
        }));
        setAllEntries(entries);
        setLoading(false);
      });
  }, [gen]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#4a9fd4]">Pokédex</h1>
        {/* Toggle All Gens Button */}
        <button 
          onClick={() => setGen(0)}
          className="flex items-center gap-2 px-4 py-2 bg-[#e8823a] rounded-lg font-bold text-sm"
        >
          <LayoutGrid className="w-4 h-4" /> All Gens
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[1, 2, 3, 4, 5].map(g => (
          <button 
            key={g} 
            onClick={() => setGen(g)} 
            className={`px-3 py-1 rounded border ${gen === g ? "bg-[#4a9fd4] border-[#4a9fd4]" : "border-white/10 text-gray-500"}`}
          >
            Gen {g}
          </button>
        ))}
      </div>

      {loading ? <Loader2 className="animate-spin mx-auto mt-20" /> : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {allEntries.map(e => (
            <button key={e.id} onClick={() => setSelected(e.id)} className="bg-[#141417] border border-white/5 hover:border-[#4a9fd4]/50 rounded-xl p-3 flex flex-col items-center transition-all">
              <img src={e.sprite} className="w-16 h-16 pixelated" alt={e.name} />
              <p className="text-gray-500 text-[10px] font-mono">#{String(e.id).padStart(3, "0")}</p>
              <p className="text-white text-xs font-medium capitalize mt-1">{e.name.replace(/-/g, " ")}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
