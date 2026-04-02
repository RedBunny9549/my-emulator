import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, X, Loader2, Map, Search } from "lucide-react";

const FIXED_TIERS = {
  mewtwo:"S", mew:"S", rayquaza:"S", kyogre:"S", groudon:"S", lugia:"S", "ho-oh":"S",
  garchomp:"S", dragonite:"S", salamence:"S", metagross:"S", tyranitar:"S",
  gengar:"S", alakazam:"S", gyarados:"S", snorlax:"S", starmie:"S",
  espeon:"S", vaporeon:"S", zapdos:"S", moltres:"S", articuno:"S",
  heracross:"S", scizor:"S", machamp:"S", miltank:"A", blissey:"A",
  raikou:"A", entei:"A", suicune:"A", venusaur:"B", charizard:"B", blastoise:"B"
};

const TIER_STYLE = {
  S: "bg-red-500/20 text-red-300 border-red-500/30",
  A: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  B: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "?": "bg-gray-800/50 text-gray-600 border-gray-700/30",
};

const ROUTE_DATA = {
  "Pokemon Emerald": [
    { route:"Route 101", pokemon:["Poochyena","Zigzagoon","Wurmple"] },
    { route:"Route 102", pokemon:["Poochyena","Zigzagoon","Wurmple","Ralts"] }
  ],
  "Pokemon FireRed": [
    { route:"Route 1", pokemon:["Pidgey","Rattata"] },
    { route:"Route 2", pokemon:["Pidgey","Rattata","Caterpie"] }
  ]
};

function PokemonCard({ name, onSelect }) {
  const tier = FIXED_TIERS[name.toLowerCase()] || "?";
  return (
    <button onClick={() => onSelect(name)} className="flex items-center justify-between bg-[#0A0A0C] border border-white/5 rounded-lg px-3 py-2 w-full mb-1">
      <span className="text-gray-300 text-sm capitalize">{name}</span>
      <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded border ${TIER_STYLE[tier]}`}>{tier}</span>
    </button>
  );
}

export default function RouteBrowser() {
  const [game, setGame] = useState("Pokemon Emerald");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});

  const routes = ROUTE_DATA[game] || [];
  const filtered = routes.filter(r => r.route.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0a1628] text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Route Browser</h1>
      <div className="flex gap-2 mb-4">
        {Object.keys(ROUTE_DATA).map(g => (
          <button key={g} onClick={() => setGame(g)} className={`px-3 py-1 rounded border ${game === g ? "bg-[#4a9fd4] border-[#4a9fd4]" : "border-white/10 text-gray-500"}`}>{g}</button>
        ))}
      </div>
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search routes..." className="w-full bg-[#141417] border border-white/5 text-white pl-9 pr-4 py-2 rounded-lg outline-none" />
      </div>
      <div className="space-y-2">
        {filtered.map(r => (
          <div key={r.route} className="bg-[#141417] border border-white/5 rounded-xl">
            <button onClick={() => setExpanded({...expanded, [r.route]: !expanded[r.route]})} className="w-full flex justify-between p-4 font-bold capitalize">
              {r.route} {expanded[r.route] ? <ChevronUp /> : <ChevronDown />}
            </button>
            {expanded[r.route] && <div className="p-4 pt-0">{r.pokemon.map(p => <PokemonCard key={p} name={p} onSelect={()=>{}} />)}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
