import { useState } from "react";
import Navbar from "./Navbar";
import { TYPES, TYPE_COLOR, getMultiplier, GEN_OPTIONS } from "../data/typeData";

const MULT_CONFIG = {
  0:    { bg: "#1a1a1a",         border: "#2a2a2a",     label: "0×",  textColor: "#555"  },
  0.25: { bg: "rgba(239,68,68,0.15)",  border: "rgba(239,68,68,0.3)",  label: "¼×",  textColor: "#f87171" },
  0.5:  { bg: "rgba(251,146,60,0.12)", border: "rgba(251,146,60,0.25)", label: "½×",  textColor: "#fb923c" },
  1:    { bg: "transparent",     border: "transparent", label: "",    textColor: "#333"  },
  2:    { bg: "rgba(52,211,153,0.15)", border: "rgba(52,211,153,0.3)",  label: "2×",  textColor: "#34d399" },
  4:    { bg: "rgba(52,211,153,0.35)", border: "rgba(52,211,153,0.5)",  label: "4×",  textColor: "#6ee7b7" },
};

export default function TypeCoverageMap() {
  const [gen, setGen] = useState(6);
  const [selected, setSelected] = useState(null);

  const handleClick = (atk, def) => {
    const key = `${atk}|${def}`;
    setSelected(selected === key ? null : key);
  };

  const [selAtk, selDef] = selected ? selected.split("|") : [null, null];
  const selMult = selAtk && selDef ? getMultiplier(selAtk, selDef, gen) : null;

  return (
    <div className="min-h-screen bg-[#0A0A0C]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "Outfit" }}>Type Coverage</h1>
            <p className="text-gray-500 text-sm mt-1">Row = attacking · Column = defending. Click any cell for details.</p>
          </div>
          <select
            value={gen}
            onChange={e => { setGen(Number(e.target.value)); setSelected(null); }}
            className="bg-[#141417] border border-white/5 text-white text-sm px-3 py-2 rounded-lg outline-none"
          >
            {GEN_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
        </div>

        {/* Selected cell info */}
        {selected && selMult !== null && (
          <div className="mb-5 flex items-center gap-3 bg-[#141417] border border-white/10 rounded-xl px-5 py-3">
            <span className="text-sm font-bold capitalize" style={{ color: TYPE_COLOR[selAtk] }}>{selAtk}</span>
            <span className="text-gray-600 text-sm">attacking</span>
            <span className="text-sm font-bold capitalize" style={{ color: TYPE_COLOR[selDef] }}>{selDef}</span>
            <span className="text-gray-600">→</span>
            <span className={`text-base font-bold font-mono ${
              selMult === 0 ? "text-gray-500" :
              selMult < 1 ? "text-orange-400" :
              selMult > 1 ? "text-emerald-400" : "text-gray-400"
            }`}>{selMult}× damage</span>
            <button onClick={() => setSelected(null)} className="ml-auto text-gray-600 hover:text-gray-400 text-xs border border-white/5 px-2 py-1 rounded">clear</button>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-5">
          {Object.entries(MULT_CONFIG).filter(([k]) => k !== "1").map(([mult, cfg]) => (
            <div key={mult} className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-sm border" style={{ background: cfg.bg, borderColor: cfg.border }} />
              <span className="text-xs font-mono" style={{ color: cfg.textColor }}>{cfg.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-sm border border-white/5 bg-transparent" />
            <span className="text-xs text-gray-700">1×</span>
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-x-auto pb-2">
          <div style={{ minWidth: 520 }}>

            {/* Column headers — defending types */}
            <div className="flex gap-px mb-px" style={{ paddingLeft: 72 }}>
              {TYPES.map(def => (
                <div key={def} style={{ width: 28, flexShrink: 0 }} className="flex justify-center">
                  <span
                    className="text-[9px] font-bold uppercase"
                    style={{
                      color: TYPE_COLOR[def],
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                      lineHeight: 1,
                      display: "block",
                    }}
                  >
                    {def.slice(0, 5)}
                  </span>
                </div>
              ))}
            </div>

            {/* Rows */}
            {TYPES.map(atk => (
              <div key={atk} className="flex gap-px mb-px items-center">
                {/* Row label */}
                <div style={{ width: 72, flexShrink: 0 }} className="pr-2 text-right">
                  <span className="text-[10px] font-bold capitalize" style={{ color: TYPE_COLOR[atk] }}>
                    {atk}
                  </span>
                </div>

                {/* Cells */}
                {TYPES.map(def => {
                  const mult = getMultiplier(atk, def, gen);
                  const cfg = MULT_CONFIG[mult] || MULT_CONFIG[1];
                  const isSelected = selected === `${atk}|${def}`;
                  return (
                    <div
                      key={def}
                      onClick={() => handleClick(atk, def)}
                      title={`${atk} → ${def}: ${mult}×`}
                      style={{
                        width: 28, height: 22, flexShrink: 0,
                        background: isSelected ? "rgba(16,185,129,0.25)" : cfg.bg,
                        borderColor: isSelected ? "#10b981" : cfg.border,
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderRadius: 2,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.1s",
                      }}
                      className="hover:brightness-150"
                    >
                      {mult !== 1 && (
                        <span style={{ fontSize: 8, fontWeight: 700, color: cfg.textColor, lineHeight: 1 }}>
                          {cfg.label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Gen note */}
        <p className="text-gray-700 text-xs mt-4">
          {gen <= 1 && "Gen 1: Ghost is immune to Psychic. Steel and Dark don't exist yet."}
          {gen === 2 && "Gen 2–5: Steel and Dark added. Ghost now hits Psychic. Fairy doesn't exist yet."}
          {gen >= 6 && "Gen 6+: Fairy type added. Dragon is no longer immune to Fairy. Steel lost Dark/Ghost resistances."}
        </p>
      </div>
    </div>
  );
}
