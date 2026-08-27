import React, { useState, useEffect, useMemo } from "react";
import { Search, Loader2, Filter, X } from "lucide-react";
import PokemonDetailsModal from "./PokemonDetailsModal";
import { fetchPoke, sprite } from "../lib/pokeProxy";

const TYPES = ["all","normal","fire","water","grass","electric","ice","fighting","poison","ground","flying","psychic","bug","rock","ghost","dark","dragon","steel","fairy"];
const GENS = [
  { id: "all", label: "All Gens", range: [1,1025] },
  { id: "1", label: "Gen 1 (1-151)", range: [1,151] },
  { id: "2", label: "Gen 2 (152-251)", range: [152,251] },
  { id: "3", label: "Gen 3 (252-386)", range: [252,386] },
  { id: "4", label: "Gen 4 (387-493)", range: [387,493] },
  { id: "5", label: "Gen 5 (494-649)", range: [494,649] },
  { id: "6", label: "Gen 6 (650-721)", range: [650,721] },
  { id: "7", label: "Gen 7 (722-809)", range: [722,809] },
  { id: "8", label: "Gen 8 (810-905)", range: [810,905] },
  { id: "9", label: "Gen 9 (906-1025)", range: [906,1025] },
];

export default function PokedexBrowser() {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedGen, setSelectedGen] = useState("all");
  const [typeIds, setTypeIds] = useState(null); // null = no type filter, Set of IDs
  const [typeLoading, setTypeLoading] = useState(false);

  useEffect(() => {
    async function fetchPokedex() {
      try {
        setLoading(true);
        const response = await fetchPoke("/pokemon?limit=1025");
        const data = await response.json();
        const formatted = data.results.map((p, index) => {
          const id = index + 1;
          return {
            name: p.name,
            id: id,
            image: sprite.cdnOfficial(id)
          };
        });
        setPokemonList(formatted);
        setFilteredList(formatted);
      } catch (err) { console.error(err); }
      setLoading(false);
    }
    fetchPokedex();
  }, []);

  // Fetch type filter IDs via proxy (bypass school firewall)
  useEffect(() => {
    if (selectedType === "all") { setTypeIds(null); return; }
    let cancelled = false;
    async function fetchType() {
      setTypeLoading(true);
      try {
        const res = await fetchPoke(`/type/${selectedType}`);
        const data = await res.json();
        // data.pokemon is [{pokemon:{name,url}, slot}]
        const ids = new Set(data.pokemon.map(entry => {
          const url = entry.pokemon.url;
          const parts = url.split("/").filter(Boolean);
          return parseInt(parts[parts.length-1],10);
        }).filter(id => !isNaN(id) && id <= 1025));
        if (!cancelled) setTypeIds(ids);
      } catch (e) {
        console.error("type filter failed", e);
        if (!cancelled) setTypeIds(new Set());
      }
      if (!cancelled) setTypeLoading(false);
    }
    fetchType();
    return () => { cancelled = true; };
  }, [selectedType]);

  const genRange = useMemo(() => {
    const g = GENS.find(x => x.id === selectedGen);
    return g ? g.range : [1,1025];
  }, [selectedGen]);

  useEffect(() => {
    let filtered = pokemonList.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toString() === searchQuery
    );
    // Gen filter
    if (selectedGen !== "all") {
      const [min,max] = genRange;
      filtered = filtered.filter(p => p.id >= min && p.id <= max);
    }
    // Type filter
    if (typeIds) {
      filtered = filtered.filter(p => typeIds.has(p.id));
    }
    setFilteredList(filtered);
  }, [searchQuery, pokemonList, selectedGen, genRange, typeIds]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#0c0c0e]"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>;

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white p-4">
      <div className="max-w-7xl mx-auto mb-4">
        <h1 className="text-2xl font-black tracking-tighter mb-4 text-left uppercase">Pokedex</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-emerald-500/50 font-black text-sm transition-all"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <select value={selectedType} onChange={(e)=>setSelectedType(e.target.value)} className="bg-[#16161A] border border-white/10 rounded-xl py-3 pl-10 pr-8 outline-none focus:border-emerald-500/50 text-white capitalize text-xs font-bold appearance-none cursor-pointer min-w-[130px]">
                {TYPES.map(t => <option key={t} value={t} className="bg-[#0c0c0e]">{t === "all" ? "All Types" : t}</option>)}
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <select value={selectedGen} onChange={(e)=>setSelectedGen(e.target.value)} className="bg-[#16161A] border border-white/10 rounded-xl py-3 pl-10 pr-8 outline-none focus:border-emerald-500/50 text-white text-xs font-bold appearance-none cursor-pointer min-w-[150px]">
                {GENS.map(g => <option key={g.id} value={g.id} className="bg-[#0c0c0e]">{g.label}</option>)}
              </select>
            </div>
          </div>
        </div>
        {(selectedType !== "all" || selectedGen !== "all" || searchQuery) && (
          <div className="flex items-center gap-2 mt-3 text-xs">
            <span className="text-gray-500">{filteredList.length} of {pokemonList.length} {typeLoading && <Loader2 className="inline w-3 h-3 animate-spin ml-1" />}</span>
            <button onClick={()=>{setSearchQuery(""); setSelectedType("all"); setSelectedGen("all");}} className="flex items-center gap-1 text-gray-400 hover:text-white bg-white/5 border border-white/10 rounded-full px-3 py-1">
              <X size={12} /> Clear filters
            </button>
          </div>
        )}
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
                <img src={pokemon.image} alt={pokemon.name} className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform" loading="lazy" onError={(e)=>{e.target.style.display='none'}} />
              </div>
              <p className="text-gray-500 text-[8px] font-black uppercase w-full">#{pokemon.id}</p>
              <h3 className="text-[11px] font-black capitalize truncate w-full">{pokemon.name}</h3>
            </div>
          </button>
        ))}
      </div>

      {filteredList.length === 0 && !loading && (
        <div className="max-w-7xl mx-auto text-center py-16 text-gray-500">
          <p className="font-bold">No Pokémon match your filters.</p>
          <p className="text-xs mt-1">Try clearing type/gen or search.</p>
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
