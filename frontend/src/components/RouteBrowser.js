import { useState } from "react";
import { ChevronDown, ChevronUp, Map } from "lucide-react";
import { ROUTE_DATA } from "../data/encounterTables"; // Assuming this contains your full route lists

function PokemonSprite({ name }) {
  // Logic to fetch ID based on name or use a lookup table
  const spriteUrl = `https://img.pokemondb.net/sprites/emerald/normal/${name.toLowerCase()}.png`;
  return <img src={spriteUrl} className="w-10 h-10 pixelated" alt={name} />;
}

export default function RouteBrowser() {
  const [game, setGame] = useState("Pokemon Emerald");
  const [expanded, setExpanded] = useState({});

  return (
    <div className="p-4 bg-[#0a1628]">
      <h1 className="text-3xl font-bold mb-6 text-[#4a9fd4]">Route Browser</h1>
      
      <div className="space-y-3">
        {ROUTE_DATA[game].map(r => (
          <div key={r.route} className="bg-[#141417] border border-white/10 rounded-xl overflow-hidden">
            <button 
              onClick={() => setExpanded({...expanded, [r.route]: !expanded[r.route]})}
              className="w-full flex justify-between items-center p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Map className="text-[#4a9fd4] w-5 h-5" />
                <span className="font-bold text-lg">{r.route}</span>
              </div>
              {expanded[r.route] ? <ChevronUp /> : <ChevronDown />}
            </button>
            
            {expanded[r.route] && (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-white/5 bg-black/20">
                {r.pokemon.map(p => (
                  <div key={p} className="flex items-center gap-3 bg-[#0a1628] p-2 rounded-lg border border-white/5">
                    <PokemonSprite name={p} />
                    <span className="capitalize font-medium">{p}</span>
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
