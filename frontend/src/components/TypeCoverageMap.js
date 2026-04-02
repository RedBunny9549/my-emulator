import { useState, useMemo } from "react";
import { TYPE_CHART, TYPE_COLOR } from "../data/typeData";
import { LayoutGrid, X } from "lucide-react";

export default function TypeCoverageMap() {
  const [type1, setType1] = useState("normal");
  const [type2, setType2] = useState(null); // Optional secondary type
  
  const types = Object.keys(TYPE_CHART);

  // Math to calculate multiplier of an attacking move against our defender
  const getMultiplier = (defender, attacker) => {
    if (!defender) return 1;
    if (TYPE_CHART[defender].immune_to.includes(attacker)) return 0;
    if (TYPE_CHART[defender].weak_to.includes(attacker)) return 2;
    if (TYPE_CHART[defender].resists.includes(attacker)) return 0.5;
    return 1;
  };

  const matchups = useMemo(() => {
    const results = { "4x": [], "2x": [], "1x": [], "0.5x": [], "0.25x": [], "0x": [] };
    
    types.forEach(attacker => {
      let multiplier = getMultiplier(type1, attacker);
      if (type2 && type1 !== type2) {
        multiplier *= getMultiplier(type2, attacker);
      }
      
      if (multiplier === 4) results["4x"].push(attacker);
      else if (multiplier === 2) results["2x"].push(attacker);
      else if (multiplier === 0.5) results["0.5x"].push(attacker);
      else if (multiplier === 0.25) results["0.25x"].push(attacker);
      else if (multiplier === 0) results["0x"].push(attacker);
    });
    
    return results;
  }, [type1, type2, types]);

  const toggleType = (t) => {
    if (type1 === t) return; // Can't deselect primary easily, just pick another
    if (type2 === t) setType2(null);
    else if (!type2) setType2(t);
    else {
      setType1(type2); // Shift secondary to primary
      setType2(t);     // Make new type secondary
    }
  };

  const MatchupSection = ({ title, list, colorClass, borderClass }) => {
    if (list.length === 0) return null;
    return (
      <div className={`bg-[#16161A] border ${borderClass} rounded-3xl p-6 shadow-xl mb-4`}>
        <h3 className={`${colorClass} font-black uppercase tracking-widest text-sm mb-5`}>{title}</h3>
        <div className="flex flex-wrap gap-2">
          {list.map(t => (
            <span key={t} style={{ backgroundColor: TYPE_COLOR[t] + "25", color: TYPE_COLOR[t], borderColor: TYPE_COLOR[t] + "40" }} className="px-3 py-1.5 border text-xs font-black uppercase rounded shadow-sm">
              {t}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-[#16161A] border border-white/5 rounded-2xl flex items-center justify-center">
          <LayoutGrid className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Type Coverage</h1>
          <p className="text-gray-500 text-sm">Defensive Matchups & Dual Typing</p>
        </div>
      </div>

      <div className="bg-[#16161A] border border-white/5 p-4 rounded-2xl mb-8 flex items-center gap-4">
        <span className="text-gray-500 font-bold text-sm uppercase tracking-widest">Defender:</span>
        <div className="flex gap-2">
          <span style={{ backgroundColor: TYPE_COLOR[type1], borderColor: TYPE_COLOR[type1] }} className="px-4 py-2 text-white font-black uppercase rounded-lg shadow-lg">
            {type1}
          </span>
          {type2 ? (
            <button onClick={() => setType2(null)} style={{ backgroundColor: TYPE_COLOR[type2], borderColor: TYPE_COLOR[type2] }} className="flex items-center gap-1 px-4 py-2 text-white font-black uppercase rounded-lg shadow-lg hover:opacity-80">
              {type2} <X className="w-4 h-4 ml-1" />
            </button>
          ) : (
            <span className="px-4 py-2 border border-dashed border-gray-600 text-gray-600 font-black uppercase rounded-lg">
              + 2nd Type
            </span>
          )}
        </div>
      </div>

      {/* Selectors */}
      <div className="flex gap-3 flex-wrap mb-10">
        {types.map(t => {
          const isActive = type1 === t || type2 === t;
          return (
            <button 
              key={t}
              onClick={() => toggleType(t)}
              style={isActive ? { backgroundColor: TYPE_COLOR[t], borderColor: TYPE_COLOR[t] } : {}}
              className={`px-4 py-2 rounded-lg text-sm font-black uppercase tracking-wider transition-all ${
                isActive 
                  ? "text-white shadow-lg scale-105" 
                  : "bg-[#16161A] text-gray-500 border border-white/5 hover:text-white hover:border-white/20"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Dynamic Grid Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <MatchupSection title="Fatal Weakness (4x)" list={matchups["4x"]} colorClass="text-red-500" borderClass="border-red-500/30" />
          <MatchupSection title="Weak To (2x)" list={matchups["2x"]} colorClass="text-orange-400" borderClass="border-orange-500/20" />
        </div>
        <div>
          <MatchupSection title="Immune To (0x)" list={matchups["0x"]} colorClass="text-gray-400" borderClass="border-gray-500/30" />
          <MatchupSection title="Double Resists (0.25x)" list={matchups["0.25x"]} colorClass="text-emerald-500" borderClass="border-emerald-500/30" />
          <MatchupSection title="Resists (0.5x)" list={matchups["0.5x"]} colorClass="text-emerald-300" borderClass="border-emerald-500/10" />
        </div>
      </div>
    </div>
  );
}
