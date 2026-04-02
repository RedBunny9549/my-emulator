import { useState, useEffect, useCallback, useRef } from "react";
import { Search, X, Loader2, ChevronLeft, ChevronRight, Filter, Zap, Shield, Swords, Star, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { TYPE_COLOR } from "../data/typeData";

// --- Constants ---
const GEN_RANGES = {
  1: { min:1,   max:151,  name:"Generation I",    game:"Red / Blue / Yellow"    },
  2: { min:152, max:251,  name:"Generation II",   game:"Gold / Silver / Crystal" },
  3: { min:252, max:386,  name:"Generation III",  game:"Ruby / Sapphire / Emerald"},
  4: { min:387, max:493,  name:"Generation IV",   game:"Diamond / Pearl / Platinum"},
  5: { min:494, max:649,  name:"Generation V",    game:"Black / White"           },
  6: { min:650, max:721,  name:"Generation VI",   game:"X / Y"                   },
  7: { min:722, max:809,  name:"Generation VII",  game:"Sun / Moon"              },
  8: { min:810, max:905,  name:"Generation VIII", game:"Sword / Shield"          },
  9: { min:906, max:1025, name:"Generation IX",   game:"Scarlet / Violet"        },
};

const GEN_NOTES = {
  1:"No abilities. No Special split. No held items. Psychic dominates — no Dark type. Ghost immune to Psychic.",
  2:"Special split. Steel & Dark added. Held items & breeding introduced.",
  3:"Abilities introduced. EV/IV overhaul. Physical/Special still split by type.",
  4:"Physical/Special split per move. Stealth Rock introduced.",
  5:"Hidden Abilities. Weather teams peak.",
  6:"Fairy type added. Mega Evolution.",
  7:"Z-Moves. Alolan Forms.",
  8:"Dynamax / Gigantamax. Wild Area.",
  9:"Terastallization. Paradox Pokémon.",
};

const STAT_LABELS = { hp:"HP", attack:"Atk", defense:"Def", "special-attack":"SpA", "special-defense":"SpD", speed:"Spe" };
const MOVE_METHOD_LABELS = { "level-up": "Level", "machine": "TM/HM", "egg": "Egg", "tutor": "Tutor" };
const PAGE_SIZE = 30;

const listCache = {};
const detailCache = {};
const moveCache = {};
const abilityCache = {};

// --- Helper Components ---
function TypeBadge({ type, small }) {
  const c = TYPE_COLOR[type] || "#888";
  return (
    <span style={{ background: c+"25", color: c, borderColor: c+"40", fontSize: small?9:10 }}
      className="px-1.5 py-0.5 rounded border font-bold uppercase tracking-wider whitespace-nowrap">
      {type}
    </span>
  );
}

function StatBar({ name, value }) {
  const pct = Math.round((value/255)*100);
  const color = value>=100?"#10b981":value>=70?"#fbbf24":"#f87171";
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500 text-xs w-8 flex-shrink-0">{STAT_LABELS[name]||name}</span>
      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div style={{ width:`${pct}%`, background:color }} className="h-full rounded-full transition-all duration-500" />
      </div>
      <span className="text-gray-400 text-xs font-mono w-7 text-right flex-shrink-0">{value}</span>
    </div>
  );
}

function Section({ title, icon: Icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-white/5">
      <button onClick={() => setOpen(v=>!v)} className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-3.5 h-3.5 text-gray-500" />}
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{title}</span>
        </div>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-gray-700" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-700" />}
      </button>
      {open && <div className="px-5 pb-4">{children}</div>}
    </div>
  );
}

function MoveRow({ moveName, method, level }) {
  const [data, setData] = useState(moveCache[moveName] || null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (moveCache[moveName]) { setData(moveCache[moveName]); return; }
    fetch(`https://pokeapi.co/api/v2/move/${moveName}`)
      .then(r => r.json())
      .then(d => {
        const entry = {
          name: d.name,
          type: d.type.name,
          power: d.power,
          accuracy: d.accuracy,
          desc: d.effect_entries.find(e => e.language.name==="en")?.short_effect || "",
        };
        moveCache[moveName] = entry;
        setData(entry);
      }).catch(()=>{});
  }, [moveName]);

  return (
    <div className="border border-white/5 rounded-lg overflow-hidden mb-1">
      <button onClick={() => setOpen(v=>!v)} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/[0.03] text-left">
        <span className="text-[9px] font-mono text-gray-600 w-10 flex-shrink-0">{method === "level-up" ? (level ? `Lv${level}` : "—") : "TM"}</span>
        <span className="text-gray-200 text-xs capitalize flex-1">{moveName.replace(/-/g," ")}</span>
        {data && <TypeBadge type={data.type} small />}
        {open ? <ChevronUp className="w-3 h-3 text-gray-700" /> : <ChevronDown className="w-3 h-3 text-gray-700" />}
      </button>
      {open && data && <div className="px-3 py-2 bg-white/[0.02] text-gray-400 text-xs">{data.desc}</div>}
    </div>
  );
}

function AbilityRow({ name, isHidden }) {
  const [data, setData] = useState(abilityCache[name] || null);
  useEffect(() => {
    if (abilityCache[name]) { setData(abilityCache[name]); return; }
    fetch(`https://pokeapi.co/api/v2/ability/${name}`)
      .then(r => r.json())
      .then(d => {
        const entry = d.effect_entries.find(e => e.language.name==="en")?.short_effect || "";
        abilityCache[name] = entry;
        setData(entry);
      }).catch(()=>{});
  }, [name]);

  return (
    <div className="p-2 border border-white/5 rounded-lg mb-1">
      <p className={`text-xs font-bold capitalize ${isHidden ? "text-purple-400" : "text-blue-400"}`}>{name.replace(/-/g," ")} {isHidden && "(HA)"}</p>
      <p className="text-[11px] text-gray-500 mt-0.5">{data || "Loading..."}</p>
    </div>
  );
}

// --- Modals & Cards ---
function DetailModal({ id, gen, onClose, onPrev, onNext }) {
  const [poke, setPoke] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(r=>r.json())
      .then(p => { setPoke(p); setLoading(false); })
      .catch(()=>setLoading(false));
  }, [id]);

  if (loading) return <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>;
  if (!poke) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[60] flex items-center justify-center p-3" onClick={onClose}>
      <div className="bg-[#0f0f12] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold capitalize">{poke.name.replace(/-/g," ")}</h2>
            <button onClick={onClose}><X className="text-gray-500" /></button>
          </div>
          <div className="flex gap-2 mt-2">
            {poke.types.map(t => <TypeBadge key={t.type.name} type={t.type.name} />)}
          </div>
          <img src={poke.sprites.other["official-artwork"].front_default} className="w-48 h-48 mx-auto my-4" alt={poke.name} />
          
          <Section title="Base Stats" icon={Shield}>
            {poke.stats.map(s => <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} />)}
          </Section>

          <Section title="Abilities" icon={Zap}>
            {poke.abilities.map(a => <AbilityRow key={a.ability.name} name={a.ability.name} isHidden={a.is_hidden} />)}
          </Section>

          <Section title="Level Up Moves" icon={Swords}>
            {poke.moves.filter(m => m.version_group_details[0].move_learn_method.name === "level-up")
              .sort((a,b) => a.version_group_details[0].level_learned_at - b.version_group_details[0].level_learned_at)
              .map(m => <MoveRow key={m.move.name} moveName={m.move.name} method="level-up" level={m.version_group_details[0].level_learned_at} />)}
          </Section>
        </div>
      </div>
    </div>
  );
}

function PokeCard({ entry, onClick }) {
  const accent = TYPE_COLOR[entry.types[0]] || "#888";
  return (
    <button onClick={onClick} className="bg-[#141417] border border-white/5 hover:border-[#4a9fd4]/30 rounded-xl p-3 flex flex-col items-center transition-all group">
      <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${entry.id}.png`} className="w-16 h-16 group-hover:scale-110 transition-transform" alt={entry.name} />
      <p className="text-gray-600 text-[10px] font-mono">#{String(entry.id).padStart(3,"0")}</p>
      <p className="text-white text-xs font-medium capitalize text-center">{entry.name.replace(/-/g," ")}</p>
    </button>
  );
}

export default function PokedexBrowser() {
  const [gen, setGen] = useState(1);
  const [allEntries, setAllEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    const { min, max } = GEN_RANGES[gen];
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${max - min + 1}&offset=${min - 1}`)
      .then(r=>r.json())
      .then(data => {
        const entries = data.results.map((r, i) => ({ id: min + i, name: r.name, types: ["normal"] }));
        setAllEntries(entries);
        setLoading(false);
      });
  }, [gen]);

  return (
    <div className="min-h-screen bg-[#0a1628] text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Pokédex</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(GEN_RANGES).map(g => (
          <button key={g} onClick={() => setGen(Number(g))} className={`px-3 py-1 rounded border ${gen === Number(g) ? "bg-[#4a9fd4] border-[#4a9fd4]" : "border-white/10 text-gray-500"}`}>Gen {g}</button>
        ))}
      </div>
      {loading ? <Loader2 className="animate-spin mx-auto" /> : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {allEntries.map(e => <PokeCard key={e.id} entry={e} onClick={() => setSelected(e.id)} />)}
        </div>
      )}
      {selected && <DetailModal id={selected} gen={gen} onClose={() => setSelected(null)} />}
    </div>
  );
}
