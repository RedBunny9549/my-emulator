import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { api } from "../lib/pokemonClient"; // This uses the new node library
import { TYPE_COLORS } from "../data/theme";
import PokemonDetailsModal from "./PokemonDetailsModal";

const GEN_RANGES = {
  1: { min: 1, max: 151, name: "Gen I" },
  2: { min: 152, max: 251, name: "Gen II" },
  3: { min: 252, max: 386, name: "Gen III" },
  4: { min: 387, max: 493, name: "Gen IV" },
  5: { min: 494, max: 649, name: "Gen V" },
  6: { min: 650, max: 721, name: "Gen VI" },
  7: { min: 722, max: 809, name: "Gen VII" },
  8: { min: 810, max: 905, name: "Gen VIII" },
  9: { min: 906, max: 1025, name: "Gen IX" },
  0: { min: 1, max: 1025, name: "All" }
};

export default function PokedexBrowser() {
  const [gen, setGen] = useState(3);
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    async function fetchGen() {
      setLoading(true);
      try {
        const { min, max } = GEN_RANGES[gen];
        // Using pokenode-ts to list pokemon
        const data = await api.listPokemons(min - 1, max - min + 1);
        
        const formatted = data.results.map((p) => {
          const id = p.url.split("/").filter(Boolean).pop();
          return {
            id,
            name: p.name,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
          };
        });
        setPokemonList(formatted);
      } catch (err) {
        console.error("Failed to fetch Pokedex", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGen();
  }, [gen]);

  const filtered = pokemonList.filter(p => p.name.includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 pt-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-black text-emerald-500 italic tracking-tighter">POKÉDEX</h1>
        <div className="flex flex-wrap justify-center gap-2">
          {Object.entries(GEN_RANGES).map(([key, info]) => (
            <button
              key={key}
              onClick={() => setGen(Number(key))}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                gen === Number(key) ? "bg-emerald-600 border-emerald-500 text-white" : "bg-[#16161A] border-white/5 text-gray-500 hover:text-white"
              }`}
            >
              {info.name}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input 
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name..." 
          className="w-full bg-[#16161A] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-emerald-500/50 text-white text-lg"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-emerald-500 w-12 h-12 mb-4" />
          <p className="text-gray-500 font-bold">LOADING DATA...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filtered.map(p => (
            <button 
              key={p.id} 
              onClick={() => setSelectedId(p.id)}
              className="bg-[#16161A] border border-white/5 p-6 rounded-3xl flex flex-col items-center hover:border-emerald-500/50 transition-all group hover:bg-[#1c1c21]"
            >
              <img src={p.sprite} className="w-24 h-24 group-hover:scale-110 transition-transform" alt={p.name} />
              <span className="text-[10px] font-mono text-gray-600 mt-4 font-bold">#{String(p.id).padStart(3, '0')}</span>
              <span className="text-sm font-black capitalize text-gray-200 mt-1 truncate w-full text-center tracking-tight">{p.name.replace("-"," ")}</span>
            </button>
          ))}
        </div>
      )}

      {selectedId && (
        <PokemonDetailsModal 
          id={selectedId} 
          onClose={() => setSelectedId(null)} 
          onJump={(newId) => setSelectedId(newId)} 
        />
      )}
    </div>
  );
}