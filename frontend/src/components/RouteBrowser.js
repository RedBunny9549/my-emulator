import { useState } from "react";
import { ChevronDown, ChevronUp, Map, Search } from "lucide-react";
import { ENCOUNTER_TABLES } from "../data/encounterTables";

export default function RouteBrowser() {
  const [game, setGame] = useState("emerald");
  const [expanded, setExpanded] = useState({});
  const [search, setSearch] = useState("");

  const routes = ENCOUNTER_TABLES[game] || {};
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-emerald-500">Route Browser</h1>
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
          <button onClick={() => setGame("emerald")} className={`px-4 py-1.5 rounded-md text-xs font-bold ${game === 'emerald' ? 'bg-emerald-600 text-white' : 'text-gray-500'}`}>Emerald</button>
          <button onClick={() => setGame("firered")} className={`px-4 py-1.5 rounded-md text-xs font-bold ${game === 'firered' ? 'bg-emerald-600 text-white' : 'text-gray-500'}`}>FireRed</button>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(routes).map(([routeName, pokemon]) => (
          <div key={routeName} className="bg-[#16161A] border border-white/5 rounded-2xl overflow-hidden">
            <button 
              onClick={() => setExpanded(prev => ({...prev, [routeName]: !prev[routeName]}))}
              className="w-full flex justify-between items-center p-5 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Map className="text-emerald-500 w-5 h-5" />
                </div>
                <span className="font-bold text-lg uppercase tracking-tight">{routeName}</span>
              </div>
              {expanded[routeName] ? <ChevronUp /> : <ChevronDown />}
            </button>
            
            {expanded[routeName] && (
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 bg-black/20 border-t border-white/5">
                {pokemon.map(p => (
                  <div key={p} className="flex flex-col items-center bg-[#0D0D10] p-3 rounded-xl border border-white/5">
                    <img 
                      src={`https://img.pokemondb.net/sprites/emerald/normal/${p.toLowerCase().replace(/\s/g, '-')}.png`} 
                      className="w-12 h-12 pixelated" 
                      alt={p}
                      onError={(e) => e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'}
                    />
                    <span className="text-[10px] font-bold capitalize mt-2 text-gray-400">{p}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
