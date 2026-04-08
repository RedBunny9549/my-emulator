import React, { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import PokemonDetailsModal from "./PokemonDetailsModal";

export default function PokedexBrowser() {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    async function fetchPokedex() {
      try {
        setLoading(true);
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
        const data = await response.json();
        const formatted = data.results.map((p, index) => {
          const id = index + 1;
          return {
            name: p.name,
            id: id,
            image: `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/${id}.png`
          };
        });
        setPokemonList(formatted);
        setFilteredList(formatted);
      } catch (err) { console.error(err); }
      setLoading(false);
    }
    fetchPokedex();
  }, []);

  useEffect(() => {
    const filtered = pokemonList.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toString() === searchQuery
    );
    setFilteredList(filtered);
  }, [searchQuery, pokemonList]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#0c0c0e]"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>;

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white p-4">
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-2xl font-black tracking-tighter mb-4 text-left uppercase">Pokedex</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-emerald-500/50 font-black text-sm transition-all"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {filteredList.map((pokemon) => (
          <button
            key={pokemon.id}
            onClick={() => setSelectedId(pokemon.id)}
            className="group relative bg-white/5 border border-white/5 rounded-2xl p-3 hover:bg-white/10 transition-all text-left active:scale-95 overflow-hidden"
          >
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 mb-2">
                <img src={pokemon.image} alt={pokemon.name} className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform" loading="lazy" />
              </div>
              <p className="text-gray-500 text-[8px] font-black uppercase w-full">#{pokemon.id}</p>
              <h3 className="text-[11px] font-black capitalize truncate w-full">{pokemon.name}</h3>
            </div>
          </button>
        ))}
      </div>

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