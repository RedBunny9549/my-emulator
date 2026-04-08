import React, { useState, useEffect } from "react";
import { Search, Loader2, Info } from "lucide-react";
import PokemonDetailsModal from "./PokemonDetailsModal";

export default function PokedexBrowser() {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  // 1. Bulletproof Fetch (Replaces the broken Do.listPokemons)
  useEffect(() => {
    async function fetchPokedex() {
      try {
        setLoading(true);
        // Fetching up to Gen 9 (1025 Pokemon)
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
        const data = await response.json();
        
        const formatted = data.results.map((p, index) => {
          const id = index + 1;
          return {
            name: p.name,
            id: id,
            // School-safe jsDelivr Proxy
            image: `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/${id}.png`
          };
        });
        
        setPokemonList(formatted);
        setFilteredList(formatted);
      } catch (err) {
        console.error("Failed to fetch Pokedex:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPokedex();
  }, []);

  // 2. Search Logic
  useEffect(() => {
    const filtered = pokemonList.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.id.toString() === searchQuery
    );
    setFilteredList(filtered);
  }, [searchQuery, pokemonList]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0c0c0e]">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white p-4 md:p-8">
      {/* Search Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-4xl font-black tracking-tighter mb-6 text-left">POKEDEX</h1>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-bold"
          />
        </div>
      </div>

      {/* Pokemon Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredList.map((pokemon) => (
          <button
            key={pokemon.id}
            onClick={() => setSelectedId(pokemon.id)}
            className="group relative bg-white/5 border border-white/5 rounded-[2rem] p-6 hover:bg-white/10 hover:border-white/20 transition-all text-left overflow-hidden active:scale-95"
          >
            {/* Background ID Number */}
            <span className="absolute -bottom-2 -right-2 text-6xl font-black text-white/5 tracking-tighter group-hover:text-white/10 transition-colors">
              #{pokemon.id}
            </span>

            <div className="relative z-10">
              <div className="w-full aspect-square flex items-center justify-center mb-4">
                <img 
                  src={pokemon.image} 
                  alt={pokemon.name} 
                  className="w-full h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">#{pokemon.id.toString().padStart(3, '0')}</p>
              <h3 className="text-xl font-black capitalize tracking-tight">{pokemon.name}</h3>
            </div>
          </button>
        ))}
      </div>

      {/* No Results */}
      {filteredList.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 font-bold">No Pokemon found matching "{searchQuery}"</p>
        </div>
      )}

      {/* Modal Integration */}
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