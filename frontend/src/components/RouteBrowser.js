import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Map, Search, X, Loader2 } from "lucide-react";
import { ENCOUNTER_TABLES } from "../data/encounterTables";

function RoutePokemonDetail({ name, onClose }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const key = name.toLowerCase().replace(/[♀♂\s]/g,"-");
    fetch(`https://pokeapi.co/api/v2/pokemon/${key}`)
      .then(r => r.json()).then(p => setData(p)).catch(()=>{});
  }, [name]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#141417] border border-white/10 rounded-2xl w-full max-w-sm p-6" onClick={e=>e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-white capitalize">{name}</h2>
          <button onClick={onClose}><X className="text-gray-500 hover:text-white" /></button>
        </div>
        {!data ? <Loader2 className="animate-spin text-emerald-500 mx-auto" /> : (
          <div>
            <img src={data.sprites.other["official-artwork"].front_default || data.sprites.front_default} className="w-32 h-32 mx-auto pixelated drop-shadow-lg" alt={name} />
            <div className="flex gap-2 justify-center mb-4">
              {data.types.map(t => <span key={t.type.name} className="px-2 py-1 bg-gray-800 rounded text-xs uppercase font-bold text-gray-300">{t.type.name}</span>)}
            </div>
            <div className="space-y-2">
              {data.stats.map(s => (
                <div key={s.stat.name} className="flex items-center text-xs">
                  <span className="w-16 text-gray-500 uppercase">{s.stat.name.replace("special-","sp.")}</span>
                  <div className="flex-1 h-2 bg-gray-800 rounded-full mx-2"><div className="h-full bg-emerald-500 rounded-full" style={{width:`${Math.min(100, s.base_stat)}%`}} /></div>
                  <span className="w-8 text-right font-mono text-gray-300">{s.base_stat}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RouteBrowser() {
  const [game, setGame] = useState("emerald");
  const [expanded, setExpanded] = useState({});
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  // Safely grab routes for the selected game
  const routes = ENCOUNTER_TABLES[game] || {};
  
  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-emerald-500">Route Browser</h1>
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
          {["emerald", "firered", "crystal"].map(g => (
            <button key={g} onClick={() => setGame(g)} className={`px-4 py-1.5 rounded-md text-xs font-bold capitalize ${game === g ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:text-white'}`}>{g}</button>
          ))}
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input 
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search routes..." 
          className="w-full bg-[#16161A] border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-emerald-500/50 text-white"
        />
      </div>

      {Object.keys(routes).length === 0 ? (
        <div className="text-center py-10 text-gray-500">No route data available for this game.</div>
      ) : (
        <div className="space-y-3">
          {Object.entries(routes).filter(([r, p]) => r.toLowerCase().includes(search.toLowerCase()) || p.join(" ").toLowerCase().includes(search.toLowerCase())).map(([routeName, pokemon]) => (
            <div key={routeName} className="bg-[#16161A] border border-white/5 rounded-2xl overflow-hidden">
              <button 
                onClick={() => setExpanded(prev => ({...prev, [routeName]: !prev[routeName]}))}
                className="w-full flex justify-between items-center p-5 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-emerald-500/10 rounded-lg"><Map className="text-emerald-500 w-5 h-5" /></div>
                  <span className="font-bold text-lg capitalize tracking-tight text-white">{routeName}</span>
                </div>
                {expanded[routeName] ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
              </button>
              
              {expanded[routeName] && (
                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 bg-black/20 border-t border-white/5">
                  {pokemon.map(p => (
                    <button key={p} onClick={() => setSelected(p)} className="flex flex-col items-center bg-[#0D0D10] p-3 rounded-xl border border-white/5 hover:border-emerald-500/50 transition-colors">
                      <img src={`https://img.pokemondb.net/sprites/emerald/normal/${p.toLowerCase().replace(/\s/g, '-')}.png`} className="w-12 h-12 pixelated" alt={p} onError={(e) => e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'} />
                      <span className="text-[10px] font-bold capitalize mt-2 text-gray-400">{p}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {selected && <RoutePokemonDetail name={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
