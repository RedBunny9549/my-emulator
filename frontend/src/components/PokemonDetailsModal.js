import { useState, useEffect } from "react";
import { X, Zap, Shield, Target, ChevronDown, ChevronUp } from "lucide-react";

// ─── Gen 3 mechanics ─────────────────────────────────────────────────────────
const GEN3_SPECIAL = new Set(["fire","water","grass","electric","ice","psychic","dragon","dark"]);
const gen3Cat = (type) => GEN3_SPECIAL.has(type) ? "Special" : "Physical";

const ALL_GEN3_TYPES = [
  "normal","fire","water","electric","grass","ice","fighting","poison",
  "ground","flying","psychic","bug","rock","ghost","dragon","dark","steel",
];

const TYPE_COLORS = {
  fire:"#FF4422",water:"#3399FF",grass:"#77CC55",electric:"#FFCC33",
  psychic:"#FF5599",ice:"#66CCFF",dragon:"#7766EE",dark:"#AA7766",
  normal:"#AAAAAA",fighting:"#CC6655",flying:"#8899FF",poison:"#AA55AA",
  ground:"#DDBB55",rock:"#BBAA66",bug:"#AABB22",ghost:"#6655BB",steel:"#AAAABB",
  fairy:"#EE99EE",
};

const STAT_CONFIG = [
  { key:"hp",             label:"HP",  color:"#F87171" },
  { key:"attack",         label:"Atk", color:"#FB923C" },
  { key:"defense",        label:"Def", color:"#FBBF24" },
  { key:"special-attack", label:"SpA", color:"#60A5FA" },
  { key:"special-defense",label:"SpD", color:"#34D399" },
  { key:"speed",          label:"Spe", color:"#F472B6" },
];

// ─── Caches ───────────────────────────────────────────────────────────────────
const pokeDataCache = {};
const typeRelCache  = {};
const moveDataCache = {};

// ─── Gen 3 stat formula ───────────────────────────────────────────────────────
function calcStat(base, level, isHp = false) {
  if (isHp) return Math.floor(((2 * base + 31) * level / 100) + level + 10);
  return Math.floor(((2 * base + 31) * level / 100) + 5);
}

// ─── Gen 3 base damage ────────────────────────────────────────────────────────
function gen3BaseDamage(atkLevel, power, atkStat, defStat) {
  return Math.floor(Math.floor(Math.floor(2 * atkLevel / 5 + 2) * power * atkStat / defStat) / 50) + 2;
}

// ─── Fetch type relations (cached) ────────────────────────────────────────────
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

// ─── Defender type chart (Gen 3 corrected) ────────────────────────────────────
async function calcEffectiveness(types) {
  const mult = {};
  for (const typeName of types) {
    const rel = await fetchTypeRelations(typeName);
    rel.double.forEach((t) => { mult[t] = (mult[t] ?? 1) * 2; });
    rel.half.forEach((t)   => { mult[t] = (mult[t] ?? 1) * 0.5; });
    rel.none.forEach((t)   => { mult[t] = 0; });
    // Gen 3: Steel resists Dark and Ghost (removed in Gen 6 — not in PokeAPI Gen 9 data)
    if (typeName === "steel") {
      if (mult["dark"]  !== 0) mult["dark"]  = (mult["dark"]  ?? 1) * 0.5;
      if (mult["ghost"] !== 0) mult["ghost"] = (mult["ghost"] ?? 1) * 0.5;
    }
  }
  delete mult["fairy"]; // Fairy type didn't exist in Gen 3
  return mult;
}

// ─── Attacker effectiveness (for Kill Calc) ───────────────────────────────────
async function getMoveEffMultiplier(moveType, targetTypes) {
  if (moveType === "fairy") return 1; // Fairy didn't exist in Gen 3
  let mult = 1;
  for (const targetType of targetTypes) {
    const rel = await fetchTypeRelations(targetType);
    if (rel.none.includes(moveType))   { mult = 0; break; }
    if (rel.double.includes(moveType))  mult *= 2;
    if (rel.half.includes(moveType))    mult *= 0.5;
    // Gen 3: Steel resists Dark and Ghost (PokeAPI Gen 9 data won't include this)
    if (targetType === "steel" && (moveType === "dark" || moveType === "ghost")) {
      if (!rel.half.includes(moveType) && mult !== 0) mult *= 0.5;
    }
  }
  return mult;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PokemonDetailsModal({ name, nickname, level, hp_percent, onClose, moves = [] }) {
  const [data,    setData]    = useState(null);
  const [eff,     setEff]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const [tab,     setTab]     = useState("stats");

  // Move data: moveName → { type, power }
  const [moveDetails, setMoveDetails] = useState({});

  // Kill Calc state
  const [kcTarget,      setKcTarget]      = useState("");
  const [kcTargetLevel, setKcTargetLevel] = useState(20);
  const [kcMovePower,   setKcMovePower]   = useState(80);
  const [kcMoveType,    setKcMoveType]    = useState("");
  const [kcResult,      setKcResult]      = useState(null);
  const [kcLoading,     setKcLoading]     = useState(false);
  const [kcError,       setKcError]       = useState("");
  const [kcOpen,        setKcOpen]        = useState(false);

  // ── Fetch Pokemon data + type chart ─────────────────────────────────────────
  useEffect(() => {
    if (!name || name === "—") { setLoading(false); return; }
    const key = name.toLowerCase().replace(/\s+/g, "-").replace(/['.]/g, "").replace(/♂/,"-m").replace(/♀/,"-f");

    const load = async () => {
      try {
        if (!pokeDataCache[key]) {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${key}/`);
          if (!res.ok) throw new Error("not found");
          pokeDataCache[key] = await res.json();
        }
        const poke = pokeDataCache[key];
        setData(poke);
        const types = poke.types.map((t) => t.type.name);
        const effectiveness = await calcEffectiveness(types);
        setEff(effectiveness);
        if (!kcMoveType) setKcMoveType(types[0] || "normal");
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [name]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fetch move details ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!moves || moves.length === 0) return;
    const fetchMoves = async () => {
      const updated = { ...moveDetails };
      for (const m of moves) {
        if (!m) continue;
        const key = m.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        if (moveDataCache[key] !== undefined) { updated[m] = moveDataCache[key]; continue; }
        try {
          const res = await fetch(`https://pokeapi.co/api/v2/move/${key}/`);
          if (res.ok) {
            const d = await res.json();
            moveDataCache[key] = { type: d.type.name, power: d.power || 0 };
          } else {
            moveDataCache[key] = null;
          }
        } catch {
          moveDataCache[key] = null;
        }
        updated[m] = moveDataCache[key];
      }
      setMoveDetails(updated);
    };
    fetchMoves();
  }, [moves]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Kill Range Calc ──────────────────────────────────────────────────────────
  const runKillCalc = async (e) => {
    e.preventDefault();
    if (!kcTarget.trim() || !kcMoveType || kcMovePower <= 0 || !data) return;
    setKcLoading(true);
    setKcError("");
    setKcResult(null);
    try {
      const targetKey = kcTarget.toLowerCase().replace(/\s+/g,"-").replace(/['.]/g,"").replace(/♂/,"-m").replace(/♀/,"-f");
      if (!pokeDataCache[targetKey]) {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${targetKey}/`);
        if (!res.ok) throw new Error(`"${kcTarget}" not found in PokéAPI`);
        pokeDataCache[targetKey] = await res.json();
      }
      const target = pokeDataCache[targetKey];
      const targetTypes = target.types.map((t) => t.type.name);
      const category = gen3Cat(kcMoveType);
      const isSpecial = category === "Special";

      const atkBase     = data.stats.find((s) => s.stat.name === (isSpecial ? "special-attack" : "attack"))?.base_stat || 50;
      const defBase     = target.stats.find((s) => s.stat.name === (isSpecial ? "special-defense" : "defense"))?.base_stat || 50;
      const targetHpBase = target.stats.find((s) => s.stat.name === "hp")?.base_stat || 50;

      const atkStat  = calcStat(atkBase, level);
      const defStat  = calcStat(defBase, kcTargetLevel);
      const targetHp = calcStat(targetHpBase, kcTargetLevel, true);

      const attackerTypes = data.types.map((t) => t.type.name);
      const hasStab = attackerTypes.includes(kcMoveType);
      const typeEff = await getMoveEffMultiplier(kcMoveType, targetTypes);

      if (typeEff === 0) {
        setKcResult({ immune: true, targetName: target.name, targetTypes, category });
        return;
      }

      let dmg = gen3BaseDamage(level, Number(kcMovePower), atkStat, defStat);
      if (hasStab) dmg = Math.floor(dmg * 1.5);
      if (typeEff === 4)    dmg = Math.floor(dmg * 4);
      else if (typeEff === 2)    dmg = Math.floor(dmg * 2);
      else if (typeEff === 0.5)  dmg = Math.floor(dmg * 0.5);
      else if (typeEff === 0.25) dmg = Math.floor(dmg * 0.25);

      const minDmg = Math.floor(dmg * 217 / 255);
      const maxDmg = dmg;
      const minPct = Math.round((minDmg / targetHp) * 100);
      const maxPct = Math.round((maxDmg / targetHp) * 100);

      let verdict, vColor;
      if (minDmg >= targetHp)      { verdict = "Guaranteed OHKO"; vColor = "text-emerald-400"; }
      else if (maxDmg >= targetHp)  { verdict = "Possible OHKO";   vColor = "text-lime-400"; }
      else if (minDmg * 2 >= targetHp) { verdict = "Guaranteed 2HKO"; vColor = "text-blue-400"; }
      else if (maxDmg * 2 >= targetHp) { verdict = "Possible 2HKO";   vColor = "text-blue-300"; }
      else if (minDmg * 3 >= targetHp) { verdict = "Guaranteed 3HKO"; vColor = "text-yellow-400"; }
      else if (maxDmg * 3 >= targetHp) { verdict = "Possible 3HKO";   vColor = "text-orange-400"; }
      else                             { verdict = "4+ hits needed";   vColor = "text-red-400"; }

      setKcResult({ targetName: target.name, targetTypes, category, atkStat, defStat, targetHp, minDmg, maxDmg, minPct, maxPct, stab: hasStab, typeEff, verdict, vColor });
    } catch (err) {
      setKcError(err.message || "Calculation failed. Check Pokemon name.");
    } finally {
      setKcLoading(false);
    }
  };

  // ── Grouped effectiveness ────────────────────────────────────────────────────
  const grouped = eff ? {
    immune:  Object.entries(eff).filter(([, v]) => v === 0).map(([k]) => k),
    quarter: Object.entries(eff).filter(([, v]) => v === 0.25).map(([k]) => k),
    half:    Object.entries(eff).filter(([, v]) => v === 0.5).map(([k]) => k),
    double:  Object.entries(eff).filter(([, v]) => v === 2).map(([k]) => k),
    quad:    Object.entries(eff).filter(([, v]) => v === 4).map(([k]) => k),
  } : null;

  const types  = data?.types?.map((t) => t.type.name) || [];
  const stats  = data?.stats || [];
  const sprite = data?.sprites?.front_default;
  const validMoves = (moves || []).filter(Boolean);

  const tabs = [
    { id: "stats",      label: "Stats"      },
    { id: "weaknesses", label: "Weaknesses" },
    { id: "killcalc",   label: "Kill Calc"  },
  ];

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
        {/* Header */}
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

        {/* Tabs */}
        <div className="flex border-b border-white/5">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              data-testid={`modal-tab-${id}`}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 -mb-px transition-colors ${
                tab === id
                  ? "border-emerald-400 text-emerald-400"
                  : "border-transparent text-gray-600 hover:text-gray-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {loading && (
            <div className="text-center py-10 text-gray-600 text-sm">Loading data from PokéAPI...</div>
          )}
          {error && (
            <div className="text-center py-10 text-gray-600 text-sm">
              Could not find "{name}" in PokéAPI. Check spelling matches the official name.
            </div>
          )}

          {/* ── STATS TAB ─────────────────────────────────────────────────────── */}
          {data && tab === "stats" && (
            <>
              {/* Sprite + Types + Gen 3 Category */}
              <div className="flex items-start gap-4 mb-5">
                {sprite ? (
                  <img src={sprite} alt={name} style={{ width: 80, height: 80, imageRendering: "pixelated" }} className="flex-shrink-0" />
                ) : (
                  <div className="w-20 h-20 bg-gray-800 rounded-lg flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {types.map((type) => (
                      <span key={type} style={{ backgroundColor: (TYPE_COLORS[type] || "#888") + "25", color: TYPE_COLORS[type] || "#888", borderColor: (TYPE_COLORS[type] || "#888") + "40" }}
                        className="text-xs font-bold uppercase px-2 py-0.5 rounded border">
                        {type}
                      </span>
                    ))}
                  </div>
                  <div className="bg-[#0f0f12] border border-white/5 rounded-lg p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">Gen 3 STAB Category</p>
                    {types.map((type) => (
                      <div key={type} className="flex items-center gap-2 mb-1">
                        <span style={{ color: TYPE_COLORS[type] || "#888" }} className="text-xs font-bold uppercase w-16 shrink-0">{type}</span>
                        <div className="flex items-center gap-1">
                          {gen3Cat(type) === "Special"
                            ? <Zap className="w-3 h-3 text-blue-400" />
                            : <Shield className="w-3 h-3 text-orange-400" />
                          }
                          <span className={`text-xs font-semibold ${gen3Cat(type) === "Special" ? "text-blue-400" : "text-orange-400"}`}>
                            {gen3Cat(type)}
                          </span>
                          <span className="text-gray-600 text-[10px]">→ hits {gen3Cat(type) === "Special" ? "Sp.Def" : "Def"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Base Stats */}
              <div className="mb-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-3">Base Stats</p>
                <div className="space-y-2">
                  {STAT_CONFIG.map(({ key, label, color }) => {
                    const stat  = stats.find((s) => s.stat.name === key);
                    const value = stat?.base_stat ?? 0;
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-gray-500 w-8 shrink-0 text-right">{label}</span>
                        <div className="flex-1 h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                          <div style={{ width: `${Math.min(100, (value / 200) * 100)}%`, backgroundColor: color }} className="h-full rounded-full transition-all" />
                        </div>
                        <span className="text-[11px] font-mono text-gray-400 w-8 shrink-0">{value}</span>
                      </div>
                    );
                  })}
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-gray-500 w-8 text-right shrink-0">BST</span>
                    <div className="flex-1" />
                    <span className="text-xs font-mono font-bold text-emerald-400 w-8">{stats.reduce((sum, s) => sum + s.base_stat, 0)}</span>
                  </div>
                </div>
              </div>

              {/* Logged Moves */}
              {validMoves.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-2">Moves (Gen 3)</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {validMoves.map((m, i) => {
                      const md = moveDetails[m];
                      const mtype = md?.type || null;
                      const cat = mtype ? gen3Cat(mtype) : null;
                      return (
                        <div key={i} data-testid={`move-slot-${i}`} className="bg-[#0f0f12] border border-white/5 rounded-lg px-3 py-2 flex items-center justify-between gap-2">
                          <span className="text-white text-xs font-medium capitalize">{m}</span>
                          {mtype && (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span style={{ backgroundColor: (TYPE_COLORS[mtype] || "#888") + "25", color: TYPE_COLORS[mtype] || "#888" }}
                                className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">{mtype}</span>
                              {cat === "Special"
                                ? <Zap className="w-3 h-3 text-blue-400" />
                                : <Shield className="w-3 h-3 text-orange-400" />
                              }
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── WEAKNESSES TAB ────────────────────────────────────────────────── */}
          {data && tab === "weaknesses" && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-3">
                Type Effectiveness (Gen 3) — no Fairy, Steel resists Dark/Ghost
              </p>
              {grouped && [
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
                        <span key={type} style={{ color: TYPE_COLORS[type] || "#888" }}
                          className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${badgeBg}`}>{type}</span>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
              {!grouped && <div className="text-gray-600 text-sm text-center py-6">Loading type data...</div>}
            </div>
          )}

          {/* ── KILL CALC TAB ─────────────────────────────────────────────────── */}
          {data && tab === "killcalc" && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-3">
                Kill Range Calculator (Gen 3 Damage Formula)
              </p>
              <form onSubmit={runKillCalc} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Target Pokemon</label>
                    <input
                      value={kcTarget}
                      onChange={(e) => setKcTarget(e.target.value)}
                      placeholder="Geodude, Starmie..."
                      data-testid="kc-target-input"
                      className="w-full bg-[#0A0A0C] border border-gray-700 focus:border-emerald-500 text-white placeholder-gray-600 text-xs px-3 py-2 rounded-lg outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Target Level</label>
                    <input
                      type="number"
                      min="1" max="100"
                      value={kcTargetLevel}
                      onChange={(e) => setKcTargetLevel(Number(e.target.value))}
                      data-testid="kc-target-level-input"
                      className="w-full bg-[#0A0A0C] border border-gray-700 focus:border-emerald-500 text-white text-xs px-3 py-2 rounded-lg outline-none transition-colors"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Move Type</label>
                    <select
                      value={kcMoveType}
                      onChange={(e) => setKcMoveType(e.target.value)}
                      data-testid="kc-move-type-select"
                      className="w-full bg-[#0A0A0C] border border-gray-700 focus:border-emerald-500 text-white text-xs px-3 py-2 rounded-lg outline-none transition-colors"
                    >
                      {ALL_GEN3_TYPES.map((t) => (
                        <option key={t} value={t} style={{ color: TYPE_COLORS[t] }}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Move Power</label>
                    <input
                      type="number"
                      min="1" max="250"
                      value={kcMovePower}
                      onChange={(e) => setKcMovePower(e.target.value)}
                      data-testid="kc-move-power-input"
                      className="w-full bg-[#0A0A0C] border border-gray-700 focus:border-emerald-500 text-white text-xs px-3 py-2 rounded-lg outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Attacker info row */}
                <div className="bg-[#0f0f12] border border-white/5 rounded-lg px-3 py-2 flex items-center gap-3 text-[11px] flex-wrap">
                  <span className="text-gray-500">Attacker:</span>
                  <span className="text-white font-semibold">{nickname || name} Lv.{level}</span>
                  <span className="text-gray-700">·</span>
                  <span className={gen3Cat(kcMoveType) === "Special" ? "text-blue-400" : "text-orange-400"}>
                    {gen3Cat(kcMoveType)} move → {gen3Cat(kcMoveType) === "Special" ? "SpA vs SpD" : "Atk vs Def"}
                  </span>
                  {data && types.includes(kcMoveType) && (
                    <span className="text-yellow-400 font-bold">STAB ×1.5</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={kcLoading}
                  data-testid="kc-calculate-btn"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Target className="w-3.5 h-3.5" />
                  {kcLoading ? "Calculating..." : "Calculate Damage Range"}
                </button>
              </form>

              {kcError && (
                <div className="mt-3 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {kcError}
                </div>
              )}

              {kcResult && (
                <div className="mt-4 bg-[#0f0f12] border border-white/8 rounded-xl p-4" data-testid="kc-result">
                  {kcResult.immune ? (
                    <div className="text-center">
                      <p className="text-gray-400 font-bold text-sm mb-1">
                        {kcMoveType.charAt(0).toUpperCase() + kcMoveType.slice(1)} move doesn't affect
                        <span className="text-white capitalize ml-1">{kcResult.targetName}</span>!
                      </p>
                      <div className="flex gap-1.5 justify-center mt-2">
                        {kcResult.targetTypes.map((t) => (
                          <span key={t} style={{ color: TYPE_COLORS[t] || "#888", backgroundColor: (TYPE_COLORS[t] || "#888") + "20" }}
                            className="text-[10px] font-bold uppercase px-2 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                      <p className="text-gray-600 text-[10px] mt-2">Immune — 0× damage</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-white text-sm font-bold capitalize">{kcResult.targetName}</p>
                          <div className="flex gap-1 mt-0.5">
                            {kcResult.targetTypes.map((t) => (
                              <span key={t} style={{ color: TYPE_COLORS[t] || "#888", backgroundColor: (TYPE_COLORS[t] || "#888") + "20" }}
                                className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">{t}</span>
                            ))}
                          </div>
                        </div>
                        <span className={`text-sm font-bold ${kcResult.vColor}`}>{kcResult.verdict}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center mb-3">
                        {[
                          { label: "Target HP", value: kcResult.targetHp, sub: `base×lv.${kcTargetLevel}` },
                          { label: kcResult.category === "Special" ? "Your SpAtk" : "Your Atk", value: kcResult.atkStat, sub: `base×lv.${level}` },
                          { label: kcResult.category === "Special" ? "Foe SpDef" : "Foe Def",   value: kcResult.defStat, sub: `base×lv.${kcTargetLevel}` },
                        ].map(({ label, value, sub }) => (
                          <div key={label} className="bg-[#141417] border border-white/5 rounded-lg py-2">
                            <p className="text-[9px] text-gray-500 uppercase tracking-wider">{label}</p>
                            <p className="text-white font-mono font-bold text-sm">{value}</p>
                            <p className="text-[9px] text-gray-600">{sub}</p>
                          </div>
                        ))}
                      </div>

                      <div className="bg-[#141417] border border-white/5 rounded-lg px-4 py-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-500 text-[11px]">Damage Range</span>
                          <div className="flex items-center gap-2 text-xs font-mono">
                            <span className="text-white">{kcResult.minDmg}–{kcResult.maxDmg}</span>
                            <span className="text-gray-600">({kcResult.minPct}%–{kcResult.maxPct}%)</span>
                          </div>
                        </div>
                        {/* HP bar showing damage range */}
                        <div className="h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-800 relative">
                          <div style={{ width: `${Math.min(100, kcResult.maxPct)}%` }}
                            className="h-full rounded-full bg-orange-500/40 absolute left-0 top-0 transition-all" />
                          <div style={{ width: `${Math.min(100, kcResult.minPct)}%` }}
                            className="h-full rounded-full bg-orange-500 absolute left-0 top-0 transition-all" />
                        </div>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {kcResult.stab && (
                            <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded">STAB ×1.5</span>
                          )}
                          {kcResult.typeEff !== 1 && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              kcResult.typeEff >= 2 ? "text-red-400 bg-red-400/10" : "text-blue-400 bg-blue-400/10"
                            }`}>
                              {kcResult.typeEff}× effective
                            </span>
                          )}
                          <span className="text-gray-600 text-[10px]">31 IVs, 0 EVs est.</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
