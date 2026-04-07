import React, { useState } from 'react';
import { TYPE_COLORS } from '../data/theme';
import PokemonDetailsModal from './PokemonDetailsModal';
import pokemonData from '../data/pokemonData'; // Assuming this is your data path

export default function PokedexBrowser() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const filteredPokemon = pokemonData.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <input 
        type="text" 
        placeholder="Search Pokedex..." 
        className="w-full p-3 mb-6 bg-[#16161A] border border-white/10 rounded-xl text-white"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredPokemon.map(p => (
          <div 
            key={p.id} 
            onClick={() => setSelectedPokemon(p)}
            className="bg-[#16161A] border border-white/5 rounded-2xl p-4 hover:border-emerald-500/50 transition-all cursor-pointer group"
          >
            {/* Absolute Pathing for Netlify Fix */}
            <img src={`/sprites/pokemon/${p.id}.png`} alt={p.name} className="w-20 h-20 mx-auto group-hover:scale-110 transition-transform" />
            <h3 className="text-center font-bold text-white mt-2 capitalize">{p.name}</h3>
            <div className="flex justify-center gap-1 mt-2">
              {p.types.map(t => (
                <span 
                  key={t} 
                  style={{ backgroundColor: TYPE_COLORS[t.toLowerCase()] }}
                  className="text-[10px] px-2 py-0.5 rounded text-white font-bold uppercase"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedPokemon && (
        <PokemonDetailsModal 
          pokemon={selectedPokemon} 
          onClose={() => setSelectedPokemon(null)} 
          onJump={(name) => {
            const found = pokemonData.find(p => p.name.toLowerCase() === name.toLowerCase());
            if (found) setSelectedPokemon(found);
          }}
        />
      )}
    </div>
  );
}
