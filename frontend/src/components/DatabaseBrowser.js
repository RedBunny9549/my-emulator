import { useState, useEffect } from "react";
import { Search, Loader2, Database } from "lucide-react";

export default function DatabaseBrowser() {
  const [tab, setTab] = useState("moves");
  const [search, setSearch] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    setSearch("");
    setSelected(null);
    fetch(`https://pokeapi.co/api/v2/${tab}?limit=1000`)
      .then(r => r.json())
      .then(data => {
        setList(data.results);
        setLoading(false);
      });
  }, [tab]);

  const loadDetails = async (url) => {
    setSelected(null);
    const res = await fetch(url);
    const data = await res.json();
    setSelected(data);
  };

  const filtered = list.filter(i => i.name.includes(search.toLowerCase().replace(/\s/g, "-")));

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
          <Database className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Data Browser</h1>
          <p className="text-gray-500 text-sm">Lookup Moves & Abilities</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {["moves", "abilities"].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all capitalize ${tab === t ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-[#16161A] border-white/5 text-gray-400 hover:text-white"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side: List */}
        <div className="lg:w-1/2 flex flex-col gap-4 h-[60vh]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${tab}...`} className="w-full bg-[#16161A] border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-emerald-500/50 text-white transition-colors" />
          </div>
          
          <div className="flex-1 overflow-y-auto bg-[#16161A] border border-white/5 rounded-2xl p-2 space-y-1 custom-scrollbar">
            {loading ? <Loader2 className="animate-spin text-emerald-500 mx-auto mt-10" /> : filtered.map(i => (
              <button key={i.name} onClick={() => loadDetails(i.url)} className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-white capitalize font-bold text-sm">
                {i.name.replace(/-/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="lg:w-1/2">
          {selected ? (
            <div className="bg-[#16161A] border border-white/5 rounded-3xl p-6 shadow-xl sticky top-20">
              <h2 className="text-3xl font-black text-white capitalize mb-2">{selected.name.replace(/-/g, " ")}</h2>
              <span className="inline-block px-3 py-1 bg-white/5 text-gray-400 text-xs font-bold uppercase rounded border border-white/10 mb-6">
                Introduced in {selected.generation.name.replace("generation-", "Gen ")}
              </span>

              {tab === "moves" && (
                <div className="flex gap-4 mb-6">
                  <div className="bg-[#0D0D10] px-4 py-2 rounded-xl border border-white/5"><p className="text-[10px] text-gray-500 uppercase font-bold">Type</p><p className="text-sm font-bold text-white uppercase">{selected.type.name}</p></div>
                  <div className="bg-[#0D0D10] px-4 py-2 rounded-xl border border-white/5"><p className="text-[10px] text-gray-500 uppercase font-bold">Class</p><p className="text-sm font-bold text-white capitalize">{selected.damage_class.name}</p></div>
                  <div className="bg-[#0D0D10] px-4 py-2 rounded-xl border border-white/5"><p className="text-[10px] text-gray-500 uppercase font-bold">Power</p><p className="text-sm font-bold text-white font-mono">{selected.power || "-"}</p></div>
                  <div className="bg-[#0D0D10] px-4 py-2 rounded-xl border border-white/5"><p className="text-[10px] text-gray-500 uppercase font-bold">Acc</p><p className="text-sm font-bold text-white font-mono">{selected.accuracy || "-"}</p></div>
                </div>
              )}

              <h3 className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Effect</h3>
              <p className="text-sm text-gray-300 leading-relaxed bg-[#0D0D10] p-4 rounded-xl border border-white/5">
                {selected.effect_entries?.find(e => e.language.name === "en")?.effect.replace("$effect_chance", selected.effect_chance) || "No description available."}
              </p>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl p-10 text-gray-500">
              Select an item from the list to view its details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
