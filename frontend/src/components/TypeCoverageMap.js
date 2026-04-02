import { useState, useMemo, useEffect } from "react";
import { TYPE_COLOR } from "../data/typeData";
import { LayoutGrid, X } from "lucide-react";

// Generate charts dynamically based on Generation
const getChartForGen = (gen) => {
  const base = {
    normal: { weak_to: ["fighting"], resists: [], immune_to: ["ghost"] },
    fire: { weak_to: ["water", "ground", "rock"], resists: ["fire", "grass", "ice", "bug"], immune_to: [] },
    water: { weak_to: ["electric", "grass"], resists: ["fire", "water", "ice"], immune_to: [] },
    electric: { weak_to: ["ground"], resists: ["electric", "flying"], immune_to: [] },
    grass: { weak_to: ["fire", "ice", "poison", "flying", "bug"], resists: ["water", "electric", "grass", "ground"], immune_to: [] },
    ice: { weak_to: ["fire", "fighting", "rock"], resists: ["ice"], immune_to: [] },
    fighting: { weak_to: ["flying", "psychic"], resists: ["bug", "rock"], immune_to: [] },
    poison: { weak_to: ["ground", "psychic"], resists: ["grass", "fighting", "poison"], immune_to: [] },
    ground: { weak_to: ["water", "grass", "ice"], resists: ["poison", "rock"], immune_to: ["electric"] },
    flying: { weak_to: ["electric", "ice", "rock"], resists: ["grass", "fighting", "bug"], immune_to: ["ground"] },
    psychic: { weak_to: ["bug"], resists: ["fighting", "psychic"], immune_to: ["ghost"] }, // Gen 1 ghost immunity
    bug: { weak_to: ["fire", "flying", "rock", "poison"], resists: ["grass", "fighting", "ground"], immune_to: [] },
    rock: { weak_to: ["water", "grass", "fighting", "ground"], resists: ["normal", "fire", "poison", "flying"], immune_to: [] },
    ghost: { weak_to: ["ghost"], resists: ["poison", "bug"], immune_to: ["normal", "fighting"] },
    dragon: { weak_to: ["ice", "dragon"], resists: ["fire", "water", "electric", "grass"], immune_to: [] },
  };

  if (gen === 1) return base; // Kanto Only

  // Gen 2-5 Changes (Dark, Steel added. Psychic nerfed. Bug/Poison fixed)
  base.psychic.weak_to.push("ghost", "dark");
  base.psychic.immune_to = [];
  base.bug.weak_to = ["fire", "flying", "rock"]; // Removed Poison weakness
  base.poison.resists.push("bug");
  
  base.dark = { weak_to: ["fighting", "bug"], resists: ["ghost", "dark"], immune_to: ["psychic"] };
  base.steel = { weak_to: ["fire", "fighting", "ground"], resists: ["normal", "grass", "ice", "flying", "psychic", "bug", "rock", "dragon", "steel", "ghost", "dark"], immune_to: ["poison"] };
  
  base.fire.resists.push("steel");
  base.water.resists.push("steel");
  base.electric.resists.push("steel");
  base.ice.weak_to.push("steel");
  base.rock.weak_to.push("steel");

  if (gen <= 5) return base; // Johto, Hoenn, Sinnoh, Unova

  // Gen 6+ Changes (Fairy added, Steel loses Ghost/Dark resist)
  base.steel.resists = base.steel.resists.filter(t => t !== "ghost" && t !== "dark");
  base.steel.resists.push("fairy");
  
  base.fairy = { weak_to: ["poison", "steel"], resists: ["fighting", "bug", "dark"], immune_to: ["dragon"] };
  base.fighting.weak_to.push("fairy");
  base.dragon.weak_to.push("fairy");
  base.dark.weak_to.push("fairy");
  base.fire.resists.push("fairy");
  base.poison.resists.push("fairy");

  return base;
};

export default function TypeCoverageMap() {
  const [generation, setGeneration] = useState(6);
  const [type1, setType1] = useState(null); 
  const [type2, setType2] = useState(null); 
  
  const chart = getChartForGen(generation);
  // Memoize types array so it doesn't cause unnecessary re-renders
  const types = useMemo(() => Object.keys(chart), [chart]);

  // Deselect types if you change generation to one where that type doesn't exist
  useEffect(() => {
    if (generation === 1) {
      if (["dark", "steel", "fairy"].includes(type1)) setType1(null);
      if (["dark", "steel", "fairy"].includes(type2)) setType2(null);
    } else if (generation === 5) {
      if (type1 === "fairy") setType1(null);
      if (type2 === "fairy") setType2(null);
    }
  }, [generation, type1, type2]);

  const matchups = useMemo(() => {
    // FIX: Moved getMultiplier inside useMemo to satisfy ESLint dependencies
    const getMultiplier = (defender, attacker) => {
      if (!defender) return 1;
      if (chart[defender].immune_to.includes(attacker)) return 0;
      if (chart[defender].weak_to.includes(attacker)) return 2;
      if (chart[defender].resists.includes(attacker)) return 0.5;
      return 1;
    };

    const results = { "4x": [], "2x": [], "1x": [], "0.5x": [], "0.25x": [], "0x": [] };
    if (!type1 && !type2) return results; 

    types.forEach(attacker => {
      let multiplier = getMultiplier(type1, attacker);
      if (type2 && type1 !== type2) multiplier *= getMultiplier(type2, attacker);
      
      if (multiplier === 4) results["4x"].push(attacker);
      else if (multiplier === 2) results["2x"].push(attacker);
      else if (multiplier === 0.5) results["0.5x"].push(attacker);
      else if (multiplier === 0.25) results["0.25x"].push(attacker);
      else if (multiplier === 0) results["0x"].push(attacker);
    });
    
    return results;
  }, [type1, type2, types, chart]);

  const toggleType = (t) => {
    if (type1 === t) { type2 ? (setType1(type2), setType2(null)) : setType1(null); } 
    else if (type2 === t) setType2(null); 
    else if (!type1) setType1(t); 
    else if (!type2) setType2(t); 
    else { setType1(type2); setType2(t); }
  };

  const MatchupSection = ({ title, list, colorClass, borderClass }) => {
    if (list.length === 0) return null;
    return (
      <div className={`bg-[#16161A] border ${borderClass} rounded-3xl p-6 shadow-xl mb-4`}>
        <h3 className={`${colorClass} font-black uppercase tracking-widest text-sm mb-5`}>{title}</h3>
        <div className="flex flex-wrap gap-2">
          {list.map(t => <span key={t} style={{ backgroundColor: TYPE_COLOR[t] + "25", color: TYPE_COLOR[t], borderColor: TYPE_COLOR[t] + "40" }} className="px-3 py-1.5 border text-xs font-black uppercase rounded shadow-sm">{t}</span>)}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#16161A] border border-white/5 rounded-2xl flex items-center justify-center">
            <LayoutGrid className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Type Coverage</h1>
            <p className="text-gray-500 text-sm">Defensive Matchups & Dual Typing</p>
          </div>
        </div>

        {/* Generational Toggle */}
        <div className="flex bg-[#16161A] border border-white/5 p-1 rounded-xl">
          <button onClick={() => setGeneration(1)} className={`px-4 py-2 text-xs font-bold rounded-lg ${generation===1 ? "bg-emerald-600 text-white" : "text-gray-500"}`}>Gen 1</button>
          <button onClick={() => setGeneration(5)} className={`px-4 py-2 text-xs font-bold rounded-lg ${generation===5 ? "bg-emerald-600 text-white" : "text-gray-500"}`}>Gen 2-5</button>
          <button onClick={() => setGeneration(6)} className={`px-4 py-2 text-xs font-bold rounded-lg ${generation===6 ? "bg-emerald-600 text-white" : "text-gray-500"}`}>Gen 6+</button>
        </div>
      </div>

      <div className="bg-[#16161A] border border-white/5 p-4 rounded-2xl mb-8 flex flex-wrap items-center gap-4">
        <span className="text-gray-500 font-bold text-sm uppercase tracking-widest">Defender:</span>
        <div className="flex gap-2">
          {type1 ? (
            <button onClick={() => toggleType(type1)} style={{ backgroundColor: TYPE_COLOR[type1], borderColor: TYPE_COLOR[type1] }} className="flex items-center gap-1 px-4 py-2 text-white font-black uppercase rounded-lg shadow-lg hover:opacity-80">
              {type1} <X className="w-4 h-4 ml-1" />
            </button>
          ) : <span className="px-4 py-2 border border-dashed border-gray-600 text-gray-600 font-black uppercase rounded-lg">Select a Type</span>}

          {type2 && (
            <button onClick={() => setType2(null)} style={{ backgroundColor: TYPE_COLOR[type2], borderColor: TYPE_COLOR[type2] }} className="flex items-center gap-1 px-4 py-2 text-white font-black uppercase rounded-lg shadow-lg hover:opacity-80">
              {type2} <X className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-3 flex-wrap mb-10">
        {types.map(t => {
          const isActive = type1 === t || type2 === t;
          return <button key={t} onClick={() => toggleType(t)} style={isActive ? { backgroundColor: TYPE_COLOR[t], borderColor: TYPE_COLOR[t] } : {}} className={`px-4 py-2 rounded-lg text-sm font-black uppercase tracking-wider transition-all ${isActive ? "text-white shadow-lg scale-105" : "bg-[#16161A] text-gray-500 border border-white/5 hover:text-white"}`}>{t}</button>;
        })}
      </div>

      {(!type1 && !type2) ? (
        <div className="text-center py-20 text-gray-600 font-bold">Select a type above to view matchups.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><MatchupSection title="Fatal Weakness (4x)" list={matchups["4x"]} colorClass="text-red-500" borderClass="border-red-500/30" /><MatchupSection title="Weak To (2x)" list={matchups["2x"]} colorClass="text-orange-400" borderClass="border-orange-500/20" /></div>
          <div><MatchupSection title="Immune To (0x)" list={matchups["0x"]} colorClass="text-gray-400" borderClass="border-gray-500/30" /><MatchupSection title="Double Resists (0.25x)" list={matchups["0.25x"]} colorClass="text-emerald-500" borderClass="border-emerald-500/30" /><MatchupSection title="Resists (0.5x)" list={matchups["0.5x"]} colorClass="text-emerald-300" borderClass="border-emerald-500/10" /></div>
        </div>
      )}
    </div>
  );
}
