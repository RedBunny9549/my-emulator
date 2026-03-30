import { useState, useEffect } from "react";
import { X, Zap, Shield } from "lucide-react";

// Gen 3 damage category is TYPE-based (not move-based like Gen 4+)
const GEN3_SPECIAL = new Set(["fire", "water", "grass", "electric", "ice", "psychic", "dragon", "dark"]);
const gen3Cat = (type) => GEN3_SPECIAL.has(type) ? "Special" : "Physical";

const TYPE_COLORS = {
  fire:"#FF4422",water:"#3399FF",grass:"#77CC55",electric:"#FFCC33",psychic:"#FF5599",
  ice:"#66CCFF",dragon:"#7766EE",dark:"#AA7766",fairy:"#EE99EE",normal:"#AAAAAA",
  fighting:"#CC6655",flying:"#8899FF",poison:"#AA55AA",ground:"#DDBB55",rock:"#BBAA66",
  bug:"#AABB22",ghost:"#6655BB",steel:"#AAAABB",
};

const STAT_CONFIG = [
  { key: "hp",              label: "HP",  color: "#F87171" },
  { key: "attack",          label: "Atk", color: "#FB923C" },
  { key: "defense",         label: "Def", color: "#FBBF24" },
  { key: "special-attack",  label: "SpA", color: "#60A5FA" },
  { key: "special-defense", label: "SpD", color: "#34D399" },
  { key: "speed",           label: "Spe", color: "#F472B6" },
];

// Module-level caches
const pokeDataCache  = {};
const typeRelCache   = {};

async function fetchTypeRelations(typeName) {
  if (typeRelCache[typeName]) return typeRelCache[typeName];
  const res  = await fetch(`https://pokeapi.co/api/v2/type/${typeName}/`);
  const data = await res.json();
  const r = {
    double: data.damage_relations.double_damage_from.map((t) => t.name),
    half:   data.damage_relations.half_damage_from.map((t)   => t.name),
    none:   data.damage_relations.no_damage_from.map((t)     => t.name),
  };
  typeRelCache[typeName] = r;
  return r;
}

async function calcEffectiveness(types) {
  const mult = {};
  for (const typeName of types) {
    const rel = await fetchTypeRelations(typeName);
    rel.double.forEach((t) => { mult[t] = (mult[t] ?? 1) * 2; });
    rel.half.forEach((t)   => { mult[t] = (mult[t] ?? 1) * 0.5; });
    rel.none.forEach((t)   => { mult[t] = 0; });
  }
  return mult;
}

export default function PokemonDetailsModal({ name, nickname, level, hp_percent, onClose }) {
  const [data, setData]   = useState(null);
  const [eff,  setEff]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!name || name === "—") { setLoading(false); return; }
    const key = name.toLowerCase().replace(/\s+/g, "-").replace(/['.]/g, "");

    const load = async () => {
      try {
        // Fetch pokemon data
        if (!pokeDataCache[key]) {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${key}/`);
          if (!res.ok) throw new Error("not found");
          pokeDataCache[key] = await res.json();
        }
        const poke = pokeDataCache[key];
        setData(poke);

        // Fetch type effectiveness
        const types = poke.types.map((t) => t.type.name);
        const effectiveness = await calcEffectiveness(types);
        setEff(effectiveness);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [name]);

  // Group effectiveness
  const grouped = eff
    ? {
        immune: Object.entries(eff).filter(([, v]) => v === 0).map(([k]) => k),
        quarter: Object.entries(eff).filter(([, v]) => v === 0.25).map(([k]) => k),
        half:    Object.entries(eff).filter(([, v]) => v === 0.5).map(([k]) => k),
        double:  Object.entries(eff).filter(([, v]) => v === 2).map(([k]) => k),
        quad:    Object.entries(eff).filter(([, v]) => v === 4).map(([k]) => k),
      }
    : null;

  const types  = data?.types?.map((t) => t.type.name) || [];
  const stats  = data?.stats || [];
  const sprite = data?.sprites?.front_default;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      data-testid="pokemon-detail-modal"
    >
      <div
        className="bg-[#141417] border border-white/10 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div>
            <h2 className="text-white font-bold" style={{ fontFamily: "Outfit" }}>
              {nickname || name}
              {nickname && <span className="text-gray-500 font-normal text-sm ml-1.5">({name})</span>}
            </h2>
            <p className="text-gray-500 text-xs">Level {level}</p>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-300 p-1 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-[80vh] overflow-y-auto">
          {loading && (
            <div className="text-center py-10 text-gray-600 text-sm">Loading data from PokéAPI...</div>
          )}
          {error && (
            <div className="text-center py-10 text-gray-600 text-sm">
              Could not find "{name}" in PokéAPI. Check the spelling matches the official name.
            </div>
          )}

          {data && (
            <>
              {/* Sprite + Types + Gen 3 Category */}
              <div className="flex items-start gap-4 mb-5">
                {sprite ? (
                  <img
                    src={sprite}
                    alt={name}
                    style={{ width: 80, height: 80, imageRendering: "pixelated" }}
                    className="flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-800 rounded-lg flex-shrink-0" />
                )}
                <div className="flex-1">
                  {/* Types */}
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {types.map((type) => (
                      <span
                        key={type}
                        style={{ backgroundColor: (TYPE_COLORS[type] || "#888") + "25", color: TYPE_COLORS[type] || "#888", borderColor: (TYPE_COLORS[type] || "#888") + "40" }}
                        className="text-xs font-bold uppercase px-2 py-0.5 rounded border"
                      >
                        {type}
                      </span>
                    ))}
                  </div>

                  {/* Gen 3 STAB category — KEY info for Nuzlocke */}
                  <div className="bg-[#0f0f12] border border-white/5 rounded-lg p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                      Gen 3 STAB Category
                    </p>
                    {types.map((type) => (
                      <div key={type} className="flex items-center gap-2 mb-1">
                        <span style={{ color: TYPE_COLORS[type] || "#888" }} className="text-xs font-bold uppercase w-16 shrink-0">
                          {type}
                        </span>
                        <div className="flex items-center gap-1">
                          {gen3Cat(type) === "Special" ? (
                            <Zap className="w-3 h-3 text-blue-400" />
                          ) : (
                            <Shield className="w-3 h-3 text-orange-400" />
                          )}
                          <span className={`text-xs font-semibold ${gen3Cat(type) === "Special" ? "text-blue-400" : "text-orange-400"}`}>
                            {gen3Cat(type)}
                          </span>
                          <span className="text-gray-600 text-[10px]">
                            → hits {gen3Cat(type) === "Special" ? "Sp.Def" : "Def"}
                          </span>
                        </div>
                      </div>
                    ))}
                    <p className="text-gray-700 text-[10px] mt-1.5 leading-relaxed">
                      In Gen 3 (Emerald/FireRed), all moves of a type are either Special or Physical — the individual move doesn't matter.
                    </p>
                  </div>
                </div>
              </div>

              {/* Base Stats */}
              <div className="mb-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-3">Base Stats</p>
                <div className="space-y-2">
                  {STAT_CONFIG.map(({ key, label, color }) => {
                    const stat = stats.find((s) => s.stat.name === key);
                    const value = stat?.base_stat ?? 0;
                    const pct = Math.min(100, (value / 200) * 100);
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-gray-500 w-8 shrink-0 text-right">{label}</span>
                        <div className="flex-1 h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                          <div style={{ width: `${pct}%`, backgroundColor: color }} className="h-full rounded-full transition-all" />
                        </div>
                        <span className="text-[11px] font-mono text-gray-400 w-8 shrink-0">{value}</span>
                      </div>
                    );
                  })}
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-gray-500 w-8 text-right shrink-0">BST</span>
                    <div className="flex-1" />
                    <span className="text-xs font-mono font-bold text-emerald-400 w-8">
                      {stats.reduce((sum, s) => sum + s.base_stat, 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Type Effectiveness */}
              {grouped && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-3">
                    Type Effectiveness (Gen 3)
                  </p>
                  {[
                    { list: grouped.quad,    label: "4× Weak",   textColor: "text-red-400",     badgeBg: "bg-red-500/15 border-red-500/30" },
                    { list: grouped.double,  label: "2× Weak",   textColor: "text-orange-400",  badgeBg: "bg-orange-500/15 border-orange-500/30" },
                    { list: grouped.half,    label: "½ Resist",  textColor: "text-blue-400",    badgeBg: "bg-blue-500/15 border-blue-500/30" },
                    { list: grouped.quarter, label: "¼ Resist",  textColor: "text-indigo-400",  badgeBg: "bg-indigo-500/15 border-indigo-500/30" },
                    { list: grouped.immune,  label: "Immune",    textColor: "text-gray-500",    badgeBg: "bg-gray-800 border-gray-700" },
                  ].map(({ list, label, textColor, badgeBg }) =>
                    list.length > 0 ? (
                      <div key={label} className="flex items-start gap-3 mb-2">
                        <span className={`text-[10px] font-bold uppercase w-16 shrink-0 pt-0.5 ${textColor}`}>{label}</span>
                        <div className="flex gap-1.5 flex-wrap">
                          {list.map((type) => (
                            <span
                              key={type}
                              style={{ color: TYPE_COLORS[type] || "#888" }}
                              className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${badgeBg}`}
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
