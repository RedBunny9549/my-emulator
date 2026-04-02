// frontend/src/components/TypeCoverageMap.js

import { useState } from "react";
import { TYPE_CHART, TYPE_COLOR } from "../data/typeData";
import { LayoutGrid } from "lucide-react";

export default function TypeCoverageMap() {
  const [selectedType, setSelectedType] = useState("normal");
  const types = Object.keys(TYPE_CHART);
  const typeData = TYPE_CHART[selectedType];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-[#16161A] border border-white/5 rounded-2xl flex items-center justify-center">
          <LayoutGrid className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Type Coverage</h1>
          <p className="text-gray-500 text-sm">Defensive Matchups for {selectedType.toUpperCase()}</p>
        </div>
      </div>

      {/* Type Selector Buttons */}
      <div className="flex gap-3 flex-wrap mb-10">
        {types.map(t => (
          <button 
            key={t}
            onClick={() => setSelectedType(t)}
            style={selectedType === t ? { backgroundColor: TYPE_COLOR[t], borderColor: TYPE_COLOR[t] } : {}}
            className={`px-4 py-2 rounded-lg text-sm font-black uppercase tracking-wider transition-all ${
              selectedType === t 
                ? "text-white shadow-lg scale-105" 
                : "bg-[#16161A] text-gray-500 border border-white/5 hover:text-white hover:border-white/20"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {typeData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Weaknesses */}
          <div className="bg-[#16161A] border border-red-500/20 rounded-3xl p-6 shadow-xl">
            <h3 className="text-red-400 font-black uppercase tracking-widest text-sm mb-5">Weak To (2x)</h3>
            <div className="flex flex-wrap gap-2">
              {typeData.weak_to.length > 0 ? typeData.weak_to.map(t => (
                <span key={t} style={{ backgroundColor: TYPE_COLOR[t] + "25", color: TYPE_COLOR[t], borderColor: TYPE_COLOR[t] + "40" }} className="px-3 py-1.5 border text-xs font-black uppercase rounded shadow-sm">
                  {t}
                </span>
              )) : <span className="text-gray-600 text-sm italic font-bold">None</span>}
            </div>
          </div>

          {/* Resistances */}
          <div className="bg-[#16161A] border border-emerald-500/20 rounded-3xl p-6 shadow-xl">
            <h3 className="text-emerald-400 font-black uppercase tracking-widest text-sm mb-5">Resists (0.5x)</h3>
            <div className="flex flex-wrap gap-2">
              {typeData.resists.length > 0 ? typeData.resists.map(t => (
                <span key={t} style={{ backgroundColor: TYPE_COLOR[t] + "25", color: TYPE_COLOR[t], borderColor: TYPE_COLOR[t] + "40" }} className="px-3 py-1.5 border text-xs font-black uppercase rounded shadow-sm">
                  {t}
                </span>
              )) : <span className="text-gray-600 text-sm italic font-bold">None</span>}
            </div>
          </div>

          {/* Immunities */}
          <div className="bg-[#16161A] border border-gray-500/20 rounded-3xl p-6 shadow-xl">
            <h3 className="text-gray-400 font-black uppercase tracking-widest text-sm mb-5">Immune To (0x)</h3>
            <div className="flex flex-wrap gap-2">
              {typeData.immune_to.length > 0 ? typeData.immune_to.map(t => (
                <span key={t} style={{ backgroundColor: TYPE_COLOR[t] + "25", color: TYPE_COLOR[t], borderColor: TYPE_COLOR[t] + "40" }} className="px-3 py-1.5 border text-xs font-black uppercase rounded shadow-sm">
                  {t}
                </span>
              )) : <span className="text-gray-600 text-sm italic font-bold">None</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
