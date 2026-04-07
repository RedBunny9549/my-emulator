import React, { useState } from 'react';
import { TYPE_COLORS } from '../data/theme';
import PokemonDetailsModal from './PokemonDetailsModal';
import pokemonData from '../data/pokemonData'; 

export default function PokedexBrowser() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const filteredPokemon = pokemonData.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.types.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between bg-[#16161A] p-6 rounded-3xl border border-white/5">
        <h1 className="text-3xl font-black text-white italic tracking-tighter">POKÉDEX</h1>
        <input 
          type="text" 
          placeholder="Search name or type..." 
          className="w-full md:w-96 p-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-emerald-500 outline-none transition-all"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredPokemon.map(p => (
          <div 
            key={p.id} 
            onClick={() => setSelectedPokemon(p)}
            className="bg-[#16161A] border border-white/5 rounded-2xl p-4 hover:border-emerald-500/50 transition-all cursor-pointer group hover:bg-[#1f1f26]"
          >
            {/* Netlify Fix: Leading slash for absolute path */}
            <img src={`/sprites/pokemon/${p.id}.png`} alt={p.name} className="w-24 h-24 mx-auto group-hover:scale-110 transition-transform pixelated" />
            <h3 className="text-center font-bold text-white mt-2 capitalize tracking-tight">{p.name}</h3>
            <div className="flex justify-center gap-1 mt-2">
              {p.types.map(t => (
                <span 
                  key={t} 
                  style={{ backgroundColor: TYPE_COLORS[t.toLowerCase()] }}
                  className="text-[9px] px-2 py-0.5 rounded-sm text-white font-black uppercase shadow-lg"
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
