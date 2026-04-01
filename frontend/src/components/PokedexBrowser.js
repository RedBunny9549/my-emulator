import { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "./Navbar";
import { Search, X, Loader2, ChevronLeft, ChevronRight, Filter, Zap, Shield, Swords, Star, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { TYPE_COLOR } from "../data/typeData";

// ─── Constants ───────────────────────────────────────────────────────────────

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
  1:"No abilities. No Special split. No held items. Psychic dominates — no Dark type. Ghost immune to Psychic. Sleep/Freeze unlimited turns.",
  2:"Special split into Sp.Atk & Sp.Def. Steel & Dark added. Abilities not yet present. Held items & breeding introduced.",
  3:"Abilities introduced. EV/IV system overhauled (252 cap). Physical/Special still split by type, not move. Weather teams rise.",
  4:"Physical/Special split moves per move (not type). Stealth Rock introduced. Many classic Pokémon gain new evolutions.",
  5:"Gen 5 only until National Dex. Weather teams peak with Drizzle+Swift Swim. Many powerful new moves added.",
  6:"Fairy type added. Mega Evolution. Steel loses Ghost & Dark resistances. EV training via Super Training.",
  7:"Z-Moves replace Mega for most. Alolan Forms change types/abilities. No HMs. Tapus dominate.",
  8:"Dynamax / Gigantamax. Wild Area open world. TR system for move teaching. Some Pokémon cut.",
  9:"Open world. Terastallization changes type. Paradox Pokémon. Many returning Pokémon.",
};

// Recommended movesets for popular Pokémon
const RECOMMENDED_SETS = {
  charizard: {
    role: "Offensive Wallbreaker",
    set: ["Flamethrower","Air Slash","Dragon Pulse","Roost"],
    notes: "Classic special attacker. Solar Beam in sun. Mega X shifts to physical Dragon. Mega Y in sun is devastating.",
  },
  blastoise: {
    role: "Bulky Water",
    set: ["Scald","Ice Beam","Flash Cannon","Rapid Spin"],
    notes: "Reliable spinner and mixed wall. Mega gives access to Mega Launcher, boosting Aura Sphere and Water Pulse.",
  },
  venusaur: {
    role: "Defensive Tank / Sun Sweeper",
    set: ["Giga Drain","Sludge Bomb","Sleep Powder","Synthesis"],
    notes: "Thick Fat in sun removes Fire and Ice weaknesses. Chlorophyll doubles speed in sun. Bulky and self-sustaining.",
  },
  gengar: {
    role: "Special Attacker",
    set: ["Shadow Ball","Sludge Wave","Focus Blast","Nasty Plot"],
    notes: "S-tier special attacker. Fast with Nasty Plot setup potential. Levitate (pre-Gen 6) gives Ground immunity.",
  },
  alakazam: {
    role: "Fast Special Attacker",
    set: ["Psychic","Shadow Ball","Focus Blast","Calm Mind"],
    notes: "Extremely fast. Magic Guard prevents indirect damage. Frail but hits incredibly hard. Mega pushes Speed to absurd levels.",
  },
  machamp: {
    role: "Physical Attacker / Tank",
    set: ["Dynamic Punch","Knock Off","Stone Edge","Bullet Punch"],
    notes: "No Guard makes Dynamic Punch 100% accurate — guaranteed confusion. Priority Bullet Punch for revenge killing.",
  },
  gyarados: {
    role: "Physical Sweeper",
    set: ["Waterfall","Crunch","Ice Fang","Dragon Dance"],
    notes: "Dragon Dance is broken on Gyarados. Intimidate on switch-in. Moxie Mega for snowballing. One of the best physical set-uppers.",
  },
  snorlax: {
    role: "Defensive Wall / Curse Sweeper",
    set: ["Return","Earthquake","Crunch","Curse"],
    notes: "Massive HP and Sp.Def. Thick Fat halves Fire and Ice damage. Curse set turns it into an unstoppable tank. Recycle Berry trick.",
  },
  tyranitar: {
    role: "Sand Setter / Mixed Attacker",
    set: ["Stone Edge","Crunch","Earthquake","Ice Punch"],
    notes: "Sets sand automatically. Strong physical stats. Pursuit trapping was legendary. Low Speed but incredible raw power.",
  },
  garchomp: {
    role: "Physical Sweeper / Lead",
    set: ["Earthquake","Dragon Claw","Stone Edge","Swords Dance"],
    notes: "Incredible Speed and Attack. Rough Skin punishes contact moves. Mega is one of the best physical attackers ever.",
  },
  salamence: {
    role: "Physical / Mixed Sweeper",
    set: ["Dragon Dance","Outrage","Earthquake","Fire Blast"],
    notes: "Moxie makes it snowball after kills. Dragon Dance set is terrifying. Mixed set with Fire Blast surprises Skarmory.",
  },
  metagross: {
    role: "Physical Attacker / Stealth Rocker",
    set: ["Meteor Mash","Earthquake","Zen Headbutt","Stealth Rock"],
    notes: "Incredible typing with only 2 weaknesses. Clear Body prevents stat drops. Hammer Arm in Trick Room.",
  },
  heracross: {
    role: "Physical Attacker",
    set: ["Close Combat","Megahorn","Rock Blast","Swords Dance"],
    notes: "Guts + Flame Orb makes it terrifyingly powerful. Moxie for clean sweeping. One of the best Bug/Fighting combos.",
  },
  scizor: {
    role: "Technician Attacker / Priority Sweeper",
    set: ["Bullet Punch","U-turn","Superpower","Swords Dance"],
    notes: "Bullet Punch + Technician is iconic. Only one weakness (Fire). Swords Dance + Bullet Punch is a win condition late-game.",
  },
  togekiss: {
    role: "Serene Grace Flincher / Support",
    set: ["Air Slash","Thunder Wave","Aura Sphere","Roost"],
    notes: "Air Slash + Serene Grace = 60% flinch chance. Thunder Wave parahax. Incredibly annoying to face. Fairy/Flying typing is great.",
  },
};

const ALL_TYPES = [
  "normal","fire","water","electric","grass","ice","fighting","poison",
  "ground","flying","psychic","bug","rock","ghost","dragon","dark","steel","fairy",
];

const STAT_LABELS = {
  hp:"HP", attack:"Atk", defense:"Def",
  "special-attack":"SpA", "special-defense":"SpD", speed:"Spe",
};

const MOVE_METHOD_LABELS = {
  "level-up": "Level", "machine": "TM/HM", "egg": "Egg", "tutor": "Tutor",
};

const PAGE_SIZE = 30;
const listCache = {};
const detailCache = {};
const moveCache = {};
const abilityCache = {};

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
  const color = value>=100?"#34d399":value>=70?"#fbbf24":"#f87171";
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

function CategoryBadge({ cat }) {
  const cfg = {
    physical: { bg:"rgba(239,68,68,0.15)", color:"#f87171", label:"Physical" },
    special:  { bg:"rgba(99,102,241,0.15)", color:"#a5b4fc", label:"Special"  },
    status:   { bg:"rgba(156,163,175,0.15)", color:"#9ca3af", label:"Status"   },
  }[cat] || { bg:"rgba(107,114,128,0.1)", color:"#6b7280", label:cat };
  return (
    <span style={{ background:cfg.bg, color:cfg.color }} className="text-[10px] font-bold px-1.5 py-0.5 rounded capitalize">{cfg.label}</span>
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

// ─── Move Row ────────────────────────────────────────────────────────────────

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
          category: d.damage_class.name,
          power: d.power,
          accuracy: d.accuracy,
          pp: d.pp,
          desc: d.effect_entries.find(e => e.language.name==="en")?.short_effect || "",
        };
        moveCache[moveName] = entry;
        setData(entry);
      }).catch(()=>{});
  }, [moveName]);

  const c = data ? (TYPE_COLOR[data.type]||"#888") : "#555";

  return (
    <div className="border border-white/5 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(v=>!v)}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/[0.03] transition-colors text-left"
      >
        {/* Method badge */}
        <span className="text-[9px] font-mono text-gray-600 w-10 flex-shrink-0">
          {method === "level-up" ? (level ? `Lv${level}` : "—") : MOVE_METHOD_LABELS[method] || method}
        </span>
        {/* Name */}
        <span className="text-gray-200 text-xs capitalize flex-1 font-medium">{moveName.replace(/-/g," ")}</span>
        {/* Type */}
        {data && <TypeBadge type={data.type} small />}
        {/* Category */}
        {data && <CategoryBadge cat={data.category} />}
        {/* Power */}
        <span className="text-gray-500 text-[10px] font-mono w-8 text-right flex-shrink-0">
          {data ? (data.power || "—") : ""}
        </span>
        {/* Acc */}
        <span className="text-gray-500 text-[10px] font-mono w-8 text-right flex-shrink-0">
          {data ? (data.accuracy ? `${data.accuracy}%` : "—") : ""}
        </span>
        {open ? <ChevronUp className="w-3 h-3 text-gray-700 flex-shrink-0" /> : <ChevronDown className="w-3 h-3 text-gray-700 flex-shrink-0" />}
      </button>
      {open && data && (
        <div style={{ borderTop:`1px solid ${c}20`, background:`${c}08` }} className="px-3 py-2">
          <div className="flex gap-4 mb-1.5">
            <span className="text-[10px] text-gray-500">PP: <span className="text-gray-300 font-mono">{data.pp}</span></span>
            <span className="text-[10px] text-gray-500">Power: <span className="text-gray-300 font-mono">{data.power||"—"}</span></span>
            <span className="text-[10px] text-gray-500">Acc: <span className="text-gray-300 font-mono">{data.accuracy?`${data.accuracy}%`:"—"}</span></span>
          </div>
          {data.desc && <p className="text-gray-400 text-xs leading-relaxed">{data.desc.replace(/\$effect_chance%/g, data.effect_chance ? `${data.effect_chance}%` : "?")}</p>}
        </div>
      )}
    </div>
  );
}

// ─── Ability Row ──────────────────────────────────────────────────────────────

function AbilityRow({ name, isHidden }) {
  const [data, setData] = useState(abilityCache[name] || null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (abilityCache[name]) { setData(abilityCache[name]); return; }
    fetch(`https://pokeapi.co/api/v2/ability/${name}`)
      .then(r => r.json())
      .then(d => {
        const entry = {
          name: d.name,
          desc: d.effect_entries.find(e => e.language.name==="en")?.short_effect || "",
          longDesc: d.effect_entries.find(e => e.language.name==="en")?.effect || "",
        };
        abilityCache[name] = entry;
        setData(entry);
      }).catch(()=>{});
  }, [name]);

  return (
    <div className={`border rounded-lg overflow-hidden ${isHidden ? "border-purple-500/20" : "border-white/5"}`}>
      <button onClick={() => setOpen(v=>!v)} className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/[0.03] transition-colors text-left gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`text-xs font-medium capitalize ${isHidden?"text-purple-300":"text-gray-200"}`}>{name.replace(/-/g," ")}</span>
          {isHidden && <span className="text-[9px] text-purple-500 border border-purple-500/30 px-1 rounded">Hidden</span>}
        </div>
        {data && <span className="text-gray-600 text-[10px] truncate max-w-[180px] text-right">{data.desc.slice(0,60)}{data.desc.length>60?"…":""}</span>}
        {open ? <ChevronUp className="w-3 h-3 text-gray-700 flex-shrink-0" /> : <ChevronDown className="w-3 h-3 text-gray-700 flex-shrink-0" />}
      </button>
      {open && data && (
        <div className="px-3 py-2 border-t border-white/5 bg-white/[0.02]">
          <p className="text-gray-300 text-xs leading-relaxed">{data.longDesc || data.desc}</p>
        </div>
      )}
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({ id, gen, onClose, onPrev, onNext }) {
  const [poke, setPoke] = useState(null);
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [moveTab, setMoveTab] = useState("level-up");
  const [spriteAnim, setSpriteAnim] = useState(true);

  useEffect(() => {
    setLoading(true); setPoke(null); setSpecies(null);
    const cached = detailCache[id];
    if (cached?.poke && cached?.species) {
      setPoke(cached.poke); setSpecies(cached.species); setLoading(false); return;
    }
    Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(r=>r.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(r=>r.json()),
    ]).then(([p, s]) => {
      detailCache[id] = { poke:p, species:s };
      setPoke(p); setSpecies(s); setLoading(false);
    }).catch(()=>setLoading(false));
  }, [id]);

  if (!poke && !loading) return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-[#141417] border border-white/10 rounded-xl p-8 text-center">
        <p className="text-gray-400">Failed to load.</p>
        <button onClick={onClose} className="mt-3 text-emerald-400 text-sm">Close</button>
      </div>
    </div>
  );

  const bst = poke ? poke.stats.reduce((s,st)=>s+st.base_stat,0) : 0;
  const animSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
  const staticSprite = poke?.sprites?.other?.["official-artwork"]?.front_default || poke?.sprites?.front_default;

  // Group moves by learn method
  const movesByMethod = {};
  if (poke) {
    for (const m of poke.moves) {
      for (const vgd of m.version_group_details) {
        const method = vgd.move_learn_method.name;
        if (!movesByMethod[method]) movesByMethod[method] = [];
        const existing = movesByMethod[method].find(x => x.name === m.move.name);
        if (!existing) {
          movesByMethod[method].push({
            name: m.move.name,
            level: vgd.level_learned_at,
          });
        }
      }
    }
    // Sort level-up moves by level
    if (movesByMethod["level-up"]) {
      movesByMethod["level-up"].sort((a,b) => a.level - b.level);
    }
  }

  const availableTabs = ["level-up","machine","egg","tutor"].filter(t => movesByMethod[t]?.length > 0);
  const currentMoves = movesByMethod[moveTab] || [];

  // Pokédex flavor texts for this gen
  const flavorEntries = species?.flavor_text_entries?.filter(e => e.language.name === "en") || [];
  const flavor = flavorEntries.slice(-3);

  // Recommended set
  const recSet = poke ? RECOMMENDED_SETS[poke.name] : null;

  // Gen-specific notes
  const genNotes = [];
  if (poke && gen <= 1) {
    genNotes.push("Abilities don't exist in Gen 1.");
    if (poke.types.some(t=>t.type.name==="psychic")) genNotes.push("Psychic is dominant — no counters yet.");
    if (poke.types.some(t=>t.type.name==="ghost")) genNotes.push("Ghost moves deal 0× to Psychic in Gen 1 (bug).");
  }
  if (gen <= 3) genNotes.push("Physical/Special split is per type, not per move.");
  if (gen <= 5 && poke?.types.some(t=>t.type.name==="steel")) genNotes.push("Steel resisted Ghost and Dark until Gen 6.");
  if (gen >= 6 && poke?.types.some(t=>t.type.name==="dragon")) genNotes.push("Fairy now counters Dragon — be wary.");

  const primaryType = poke?.types[0]?.type.name;
  const accentColor = primaryType ? (TYPE_COLOR[primaryType]||"#10b981") : "#10b981";

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3" onClick={onClose}>
      <div
        className="bg-[#0f0f12] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[95vh] overflow-y-auto"
        onClick={e=>e.stopPropagation()}
        style={{ borderColor: accentColor+"30" }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: accentColor }} />
          </div>
        ) : (
          <>
            {/* Hero */}
            <div style={{ background:`linear-gradient(135deg, ${accentColor}15 0%, transparent 60%)` }} className="px-6 pt-6 pb-4">
              <div className="flex items-start gap-5">
                {/* Sprite */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="relative">
                    <img
                      src={spriteAnim ? animSprite : staticSprite}
                      alt={poke.name}
                      onError={() => setSpriteAnim(false)}
                      className="w-28 h-28 object-contain drop-shadow-lg"
                      style={{ imageRendering:"pixelated" }}
                    />
                  </div>
                  <button
                    onClick={() => setSpriteAnim(v=>!v)}
                    className="text-[10px] text-gray-600 hover:text-gray-400 border border-white/5 px-2 py-0.5 rounded transition-colors"
                  >
                    {spriteAnim ? "Static" : "Animated"}
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-gray-500 text-xs font-mono">#{String(poke.id).padStart(3,"0")}</p>
                      <h2 className="text-2xl font-bold text-white capitalize mt-0.5" style={{ fontFamily:"Outfit" }}>
                        {poke.name.replace(/-/g," ")}
                      </h2>
                      {species && <p className="text-gray-500 text-xs capitalize">{species.genera?.find(g=>g.language.name==="en")?.genus}</p>}
                    </div>
                    <button onClick={onClose} className="text-gray-600 hover:text-white p-1 flex-shrink-0">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {poke.types.map(t=><TypeBadge key={t.type.name} type={t.type.name} />)}
                  </div>

                  <div className="flex gap-4 mt-3">
                    <div className="text-center">
                      <p className="text-white font-bold font-mono text-lg">{bst}</p>
                      <p className="text-gray-600 text-[10px] uppercase tracking-wider">BST</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-mono text-lg">{(poke.height/10).toFixed(1)}m</p>
                      <p className="text-gray-600 text-[10px] uppercase tracking-wider">Height</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-mono text-lg">{(poke.weight/10).toFixed(1)}kg</p>
                      <p className="text-gray-600 text-[10px] uppercase tracking-wider">Weight</p>
                    </div>
                    {species && (
                      <div className="text-center">
                        <p className="text-white font-mono text-lg capitalize">{species.growth_rate?.name?.replace(/-/g," ")}</p>
                        <p className="text-gray-600 text-[10px] uppercase tracking-wider">Growth</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Gen notes */}
            {genNotes.length > 0 && (
              <div className="mx-5 mb-1 bg-yellow-500/5 border border-yellow-500/20 rounded-xl px-4 py-3">
                <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-wider mb-1">Gen {gen} Mechanics</p>
                {genNotes.map((n,i)=><p key={i} className="text-yellow-200/60 text-xs">{n}</p>)}
              </div>
            )}

            {/* Pokédex Entries */}
            {flavor.length > 0 && (
              <Section title="Pokédex Entries" icon={BookOpen}>
                <div className="space-y-2">
                  {flavor.map((f,i) => (
                    <p key={i} className="text-gray-400 text-sm leading-relaxed italic border-l-2 pl-3" style={{ borderColor:accentColor+"40" }}>
                      {f.flavor_text.replace(/\f/g," ")}
                    </p>
                  ))}
                </div>
              </Section>
            )}

            {/* Stats */}
            <Section title="Base Stats" icon={Shield}>
              <div className="space-y-1.5">
                {poke.stats.map(s=><StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} />)}
                <div className="flex items-center gap-2 pt-1 border-t border-white/5 mt-1">
                  <span className="text-gray-400 text-xs w-8 font-bold">BST</span>
                  <div className="flex-1" />
                  <span className="text-white text-sm font-mono font-bold">{bst}</span>
                </div>
              </div>
            </Section>

            {/* Abilities */}
            <Section title={gen >= 3 ? "Abilities" : "Abilities (Gen 3+)"} icon={Zap}>
              {gen < 3 ? (
                <p className="text-gray-600 text-xs">Abilities were introduced in Generation III (Ruby & Sapphire).</p>
              ) : (
                <div className="space-y-2">
                  {poke.abilities.map(a=>(
                    <AbilityRow key={a.ability.name} name={a.ability.name} isHidden={a.is_hidden} />
                  ))}
                </div>
              )}
            </Section>

            {/* Recommended Moveset */}
            {recSet && (
              <Section title="Recommended Moveset" icon={Star} defaultOpen={true}>
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 mb-3">
                  <p className="text-emerald-400 text-xs font-bold mb-1">{recSet.role}</p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {recSet.set.map(m=>(
                      <span key={m} className="text-xs px-2 py-1 bg-white/5 text-gray-200 rounded-lg border border-white/5">{m}</span>
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{recSet.notes}</p>
                </div>
              </Section>
            )}

            {/* Moves */}
            <Section title="Moves" icon={Swords} defaultOpen={false}>
              {/* Move headers */}
              <div className="flex items-center justify-end gap-1 mb-2 pr-1">
                <span className="text-[10px] text-gray-600 w-8 text-right">Pwr</span>
                <span className="text-[10px] text-gray-600 w-8 text-right">Acc</span>
                <span className="w-3" />
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-3 flex-wrap">
                {availableTabs.map(t=>(
                  <button
                    key={t}
                    onClick={()=>setMoveTab(t)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                      moveTab===t
                        ? "text-white border-white/20 bg-white/10"
                        : "text-gray-500 border-white/5 hover:border-white/10 hover:text-gray-300"
                    }`}
                  >
                    {MOVE_METHOD_LABELS[t]||t} <span className="text-[10px] text-gray-600 ml-1">{movesByMethod[t]?.length}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                {currentMoves.map((m,i)=>(
                  <MoveRow key={`${m.name}-${i}`} moveName={m.name} method={moveTab} level={m.level} />
                ))}
                {currentMoves.length === 0 && (
                  <p className="text-gray-600 text-xs text-center py-4">No moves via this method.</p>
                )}
              </div>
            </Section>

            {/* Species info */}
            {species && (
              <Section title="Species Info" defaultOpen={false}>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label:"Catch Rate", value: species.capture_rate },
                    { label:"Base Happiness", value: species.base_happiness },
                    { label:"Egg Groups", value: species.egg_groups?.map(e=>e.name).join(", ") },
                    { label:"Hatch Steps", value: species.hatch_counter ? `${species.hatch_counter * 255} steps` : "—" },
                    { label:"Gender Ratio", value: species.gender_rate === -1 ? "Genderless" : `${(8-species.gender_rate)/8*100}% M / ${species.gender_rate/8*100}% F` },
                    { label:"Habitat", value: species.habitat?.name || "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-[#0A0A0C] border border-white/5 rounded-lg p-3">
                      <p className="text-gray-600 text-[10px] uppercase tracking-wider mb-0.5">{label}</p>
                      <p className="text-white text-xs capitalize font-mono">{value ?? "—"}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Prev / Next */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-white/5">
              <button onClick={onPrev} className="flex items-center gap-1 text-gray-500 hover:text-white text-sm transition-colors">
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <span className="text-gray-700 text-xs font-mono">#{String(poke.id).padStart(3,"0")}</span>
              <button onClick={onNext} className="flex items-center gap-1 text-gray-500 hover:text-white text-sm transition-colors">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Pokémon Card ─────────────────────────────────────────────────────────────

function PokeCard({ entry, onClick }) {
  const [sprite, setSprite] = useState(null);
  const [animFailed, setAnimFailed] = useState(false);

  const animSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${entry.id}.gif`;

  useEffect(() => {
    if (detailCache[entry.id]?.poke) {
      setSprite(detailCache[entry.id].poke.sprites.front_default);
      return;
    }
    fetch(`https://pokeapi.co/api/v2/pokemon/${entry.id}`)
      .then(r=>r.json())
      .then(p => {
        if (!detailCache[entry.id]) detailCache[entry.id] = { poke:p };
        else detailCache[entry.id].poke = p;
        setSprite(p.sprites.front_default);
      }).catch(()=>{});
  }, [entry.id]);

  const primaryType = entry.types?.[0];
  const accent = primaryType ? (TYPE_COLOR[primaryType]||"#888") : "#888";

  return (
    <button
      onClick={onClick}
      className="bg-[#141417] border border-white/5 hover:border-white/15 hover:-translate-y-0.5 rounded-xl p-3 flex flex-col items-center gap-1.5 transition-all cursor-pointer group"
      style={{ "--accent": accent }}
    >
      <div className="relative w-20 h-20 flex items-center justify-center">
        {!animFailed ? (
          <img
            src={animSrc}
            alt={entry.name}
            onError={() => setAnimFailed(true)}
            className="w-16 h-16 object-contain group-hover:scale-110 transition-transform"
            style={{ imageRendering:"pixelated" }}
          />
        ) : sprite ? (
          <img
            src={sprite}
            alt={entry.name}
            className="w-16 h-16 object-contain group-hover:scale-110 transition-transform"
            style={{ imageRendering:"pixelated" }}
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-800/40 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-gray-700 animate-spin" />
          </div>
        )}
      </div>
      <p className="text-gray-600 text-[10px] font-mono">#{String(entry.id).padStart(3,"0")}</p>
      <p className="text-white text-xs font-medium capitalize text-center leading-tight">{entry.name.replace(/-/g," ")}</p>
      <div className="flex gap-1 flex-wrap justify-center">
        {entry.types?.map(t=><TypeBadge key={t} type={t} small />)}
      </div>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PokedexBrowser() {
  const [gen, setGen] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState(null);
  const [allEntries, setAllEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const abortRef = useRef(null);

  useEffect(() => {
    setLoading(true); setPage(0); setAllEntries([]); setSelected(null);
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const { min, max } = GEN_RANGES[gen];
    const cacheKey = `gen-${gen}`;
    if (listCache[cacheKey]) { setAllEntries(listCache[cacheKey]); setLoading(false); return; }

    const ids = Array.from({ length: max - min + 1 }, (_,i) => min + i);
    const BATCH = 20;
    let results = [];

    (async () => {
      for (let i = 0; i < ids.length; i += BATCH) {
        if (controller.signal.aborted) return;
        const batch = ids.slice(i, i + BATCH);
        const data = await Promise.all(
          batch.map(id =>
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, { signal: controller.signal })
              .then(r=>r.json())
              .then(p => {
                const entry = { id:p.id, name:p.name, types:p.types.map(t=>t.type.name) };
                if (!detailCache[id]) detailCache[id] = { poke:p };
                else detailCache[id].poke = p;
                return entry;
              })
              .catch(()=>null)
          )
        );
        results = [...results, ...data.filter(Boolean)];
        if (!controller.signal.aborted) setAllEntries([...results]);
      }
      if (!controller.signal.aborted) { listCache[cacheKey] = results; setLoading(false); }
    })();

    return () => controller.abort();
  }, [gen]);

  const filtered = allEntries.filter(e => {
    if (search && !e.name.includes(search.toLowerCase().replace(/\s+/g,"-"))) return false;
    if (typeFilter && !e.types.includes(typeFilter)) return false;
    return true;
  });

  const pages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice(page * PAGE_SIZE, (page+1) * PAGE_SIZE);
  const selectedIdx = selected ? filtered.findIndex(e=>e.id===selected) : -1;

  const goNext = useCallback(() => {
    if (selectedIdx < filtered.length-1) setSelected(filtered[selectedIdx+1].id);
  }, [selectedIdx, filtered]);

  const goPrev = useCallback(() => {
    if (selectedIdx > 0) setSelected(filtered[selectedIdx-1].id);
  }, [selectedIdx, filtered]);

  return (
    <div className="min-h-screen bg-[#0A0A0C]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily:"Outfit" }}>Pokédex</h1>
          <p className="text-gray-500 text-sm mt-1">{GEN_RANGES[gen].name} · {GEN_RANGES[gen].game} · #{GEN_RANGES[gen].min}–{GEN_RANGES[gen].max}</p>
        </div>

        {/* Gen selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(GEN_RANGES).map(([g,info]) => (
            <button key={g} onClick={() => { setGen(Number(g)); setSearch(""); setTypeFilter(null); setPage(0); }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${gen===Number(g) ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "border-white/5 text-gray-500 hover:text-gray-300 hover:border-white/10"}`}>
              Gen {g}
            </button>
          ))}
        </div>

        {/* Gen mechanics note */}
        <div className="mb-5 bg-[#141417] border border-white/5 rounded-xl px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Gen {gen} Mechanics</p>
          <p className="text-gray-500 text-xs leading-relaxed">{GEN_NOTES[gen]}</p>
        </div>

        {/* Search + filter */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input value={search} onChange={e=>{ setSearch(e.target.value); setPage(0); }}
              placeholder="Search Pokémon..."
              className="w-full bg-[#141417] border border-white/5 focus:border-emerald-500/50 text-white placeholder-gray-600 text-sm pl-9 pr-4 py-2.5 rounded-lg outline-none transition-colors" />
            {search && <button onClick={()=>setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white"><X className="w-3.5 h-3.5" /></button>}
          </div>
          <button onClick={()=>setShowFilters(v=>!v)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg border text-sm transition-all ${typeFilter ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "border-white/5 text-gray-500 hover:text-gray-300"}`}>
            <Filter className="w-4 h-4" />
            {typeFilter || "Type"}
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-1.5 mb-4 p-3 bg-[#141417] border border-white/5 rounded-xl">
            <button onClick={()=>{ setTypeFilter(null); setPage(0); }}
              className={`text-xs px-2 py-1 rounded border transition-all ${!typeFilter ? "border-white/30 text-white" : "border-white/5 text-gray-600 hover:text-gray-300"}`}>All</button>
            {ALL_TYPES.map(t => (
              <button key={t} onClick={()=>{ setTypeFilter(typeFilter===t?null:t); setPage(0); }}
                style={typeFilter===t ? { background:TYPE_COLOR[t]+"25", color:TYPE_COLOR[t], borderColor:TYPE_COLOR[t]+"50" } : {}}
                className={`text-xs px-2 py-1 rounded border capitalize transition-all ${typeFilter===t ? "" : "border-white/5 text-gray-500 hover:text-gray-300 hover:border-white/10"}`}>
                {t}
              </button>
            ))}
          </div>
        )}

        <p className="text-gray-600 text-xs mb-4">
          {loading && allEntries.length === 0 ? "Loading..." : `${filtered.length} Pokémon`}
          {(search || typeFilter) && ` filtered from ${allEntries.length}`}
        </p>

        {visible.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {visible.map(entry => <PokeCard key={entry.id} entry={entry} onClick={()=>setSelected(entry.id)} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-600">
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading Gen {gen}... {allEntries.length}/{GEN_RANGES[gen].max - GEN_RANGES[gen].min + 1}</span>
              </div>
            ) : "No Pokémon found."}
          </div>
        )}

        {loading && allEntries.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-4 text-gray-600 text-xs">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Loading... {allEntries.length}/{GEN_RANGES[gen].max - GEN_RANGES[gen].min + 1}
          </div>
        )}

        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0}
              className="p-2 rounded-lg border border-white/5 text-gray-500 hover:text-white disabled:opacity-30 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-gray-500 text-sm">Page {page+1} of {pages}</span>
            <button onClick={()=>setPage(p=>Math.min(pages-1,p+1))} disabled={page===pages-1}
              className="p-2 rounded-lg border border-white/5 text-gray-500 hover:text-white disabled:opacity-30 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {selected && (
        <DetailModal id={selected} gen={gen} onClose={()=>setSelected(null)} onPrev={goPrev} onNext={goNext} />
      )}
    </div>
  );
}
