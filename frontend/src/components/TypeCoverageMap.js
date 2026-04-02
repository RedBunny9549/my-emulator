import { useState } from "react";
import { TYPE_CHART } from "../data/typeData"; // Assumes you have standard type data here
import { LayoutGrid } from "lucide-react";

export default function TypeCoverageMap() {
  const [selectedType, setSelectedType] = useState("normal");
  
  const types = Object.keys(TYPE_CHART || {}).length > 0 ? Object.keys(TYPE_CHART) : [
    "normal","fire","water","electric","grass","ice","fighting","poison","ground",
    "flying","psychic","bug","rock","ghost","dragon","dark","steel","fairy"
  ];

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
          <LayoutGrid className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Type Coverage</h1>
          <p className="text-gray-500 text-sm">Offensive & Defensive Matchups</p>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap mb-8">
        {types.map(t => (
          <button 
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-4 py-2 rounded-lg text-sm font-bold uppercase transition-all ${
              selectedType === t ? "bg-emerald-600 text-white" : "bg-[#16161A] text-gray-500 border border-white/5"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-[#16161A] border border-white/5 rounded-3xl p-6 min-h-[400px] flex items-center justify-center">
         <p className="text-gray-500 text-center">Select a type above to view matchups.<br/><span className="text-xs mt-2 block">(Type chart visualization rendering area)</span></p>
      </div>
    </div>
  );
}
