import { useState, useEffect } from "react";
import { Search, Loader2, X, ChevronDown, ChevronUp, ArrowRight, Layers } from "lucide-react";
import { TYPE_COLORS } from "../data/theme";
import PokemonDetailsModal from "./PokemonDetailsModal";

const GEN_RANGES = {
  1: { min:1, max:151, name:"Gen I" },
  2: { min:152, max:251, name:"Gen II" },
  3: { min:252, max:386, name:"Gen III" },
  4: { min:387, max:493, name:"Gen IV" },
  5: { min:494, max:649, name:"Gen V" },
  0: { min:1, max:1025, name:"All" }
};

export default function PokedexBrowser() {
  const [gen, setGen] = useState(3);
  const [allEntries, setAllEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    const { min, max } = GEN_RANGES[gen];
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${max - min + 1}&offset=${min - 1}`)
      .then(r => r.json())
      .then(data => {
        const entries = data.results.map((r, i) => {
          const id = min + i;
          const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
          return { id, name: r.name, sprite };
        });
        setAllEntries(entries);
        setLoading(false);
      });
  }, [gen]);

  const filtered = allEntries.filter(p => p.name.includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 pt-8">
        <div>
          <h1 className="text-3xl font-bold text-emerald-500">Pokédex</h1>
          <p className="text-gray-500 text-sm">Official Information Base</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(GEN_RANGES).map(([key, info]) => (
            <button
              key={key}
              onClick={() => setGen(Number(key))}
              className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-all ${
                gen === Number(key) ? "bg-emerald-600 border-emerald-500 text-white" : "bg-[#16161A] border-white/5 text-gray-500 hover:text-white"
              }`}
            >
              {info.name}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input 
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search Pokémon..." 
          className="w-full bg-[#16161A] border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-emerald-500/50 text-white"
        />
      </div>

      {loading ? <Loader2 className="animate-spin mx-auto text-emerald-500 mt-20 w-8 h-8" /> : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {filtered.map(p => (
            <button key={p.id} onClick={() => setSelected(p.id)} className="bg-[#16161A] border border-white/5 p-4 rounded-2xl flex flex-col items-center hover:border-emerald-500/50 transition-all group">
              <img src={p.sprite} className="w-16 h-16 group-hover:scale-110 transition-transform" style={{imageRendering: 'pixelated'}} alt={p.name} />
              <span className="text-xs font-bold capitalize text-gray-300 mt-1 truncate w-full text-center">{p.name.replace("-"," ")}</span>
            </button>
          ))}
        </div>
      )}
      {selected && <PokemonDetailsModal id={selected} onClose={() => setSelected(null)} onJump={(newId) => setSelected(newId)} />}
    </div>
  );
}
