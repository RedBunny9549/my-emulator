import { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, Shield, Sword } from "lucide-react";
import Navbar from "./Navbar";
import PokemonSprite from "./PokemonSprite";
import PokemonDetailsModal from "./PokemonDetailsModal";
import { BOSS_DATA } from "../data/bossData";

const TYPE_COLORS = {
  fire:"#FF4422",water:"#3399FF",grass:"#77CC55",electric:"#FFCC33",
  psychic:"#FF5599",ice:"#66CCFF",dragon:"#7766EE",dark:"#AA7766",
  normal:"#AAAAAA",fighting:"#CC6655",flying:"#8899FF",poison:"#AA55AA",
  ground:"#DDBB55",rock:"#BBAA66",bug:"#AABB22",ghost:"#6655BB",steel:"#AAAABB",
  fairy:"#EE99EE",mixed:"#94A3B8",
};

const GAME_LABELS = {
  emerald: { name: "Pokémon Emerald", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  firered: { name: "Pokémon FireRed", color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/30"     },
};

function TypeBadge({ type }) {
  const color = TYPE_COLORS[type] || "#888";
  return (
    <span
      style={{ backgroundColor: color + "25", color, borderColor: color + "40" }}
      className="text-[10px] font-bold uppercase px-2 py-0.5 rounded border"
    >
      {type}
    </span>
  );
}

function BossCard({ boss, onSelectPokemon }) {
  const [open, setOpen] = useState(false);
  const acePokemon = boss.team[boss.team.length - 1];

  return (
    <div className="bg-[#141417] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors">
      {/* Card Header */}
      <div
        className="flex items-center gap-4 px-5 py-4 cursor-pointer select-none"
        onClick={() => setOpen((o) => !o)}
      >
        {/* Gym # / Title */}
        <div className="flex-shrink-0 w-10 h-10 bg-[#0f0f12] border border-white/5 rounded-lg flex items-center justify-center">
          <span className="text-gray-400 font-mono font-bold text-sm">{boss.num}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Outfit" }}>
              {boss.leader}
            </h3>
            {boss.badge && (
              <span className="text-[10px] text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full border border-gray-700">
                {boss.badge}
              </span>
            )}
            {boss.title && (
              <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                {boss.title}
              </span>
            )}
          </div>
          <p className="text-gray-600 text-xs mt-0.5">{boss.city}</p>
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            {boss.specialty.map((t) => <TypeBadge key={t} type={t} />)}
          </div>
        </div>

        {/* Ace + expand */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <p className="text-[10px] text-gray-600 mb-1">Ace</p>
            <PokemonSprite name={acePokemon.name} size={40} showTypes={false} />
            <p className="text-[10px] text-gray-500 font-mono mt-0.5">Lv.{acePokemon.level}</p>
          </div>
          {open
            ? <ChevronUp   className="w-4 h-4 text-gray-600" />
            : <ChevronDown className="w-4 h-4 text-gray-600" />
          }
        </div>
      </div>

      {/* Expanded content */}
      {open && (
        <div className="border-t border-white/5 px-5 py-4">
          {/* Team */}
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-3">Team</p>
          <div className="flex gap-3 flex-wrap mb-4">
            {boss.team.map((member, i) => (
              <button
                key={i}
                data-testid={`boss-pokemon-${boss.leader.toLowerCase().replace(/\s+/g,"-")}-${i}`}
                onClick={() => onSelectPokemon({ ...member, nickname: null, hp_percent: 100 })}
                className="flex flex-col items-center gap-1 bg-[#0f0f12] border border-white/5 rounded-xl p-3 hover:border-emerald-500/30 hover:-translate-y-0.5 transition-all group cursor-pointer"
              >
                <PokemonSprite name={member.name} size={52} showTypes />
                <p className="text-white text-[11px] font-semibold capitalize mt-1 group-hover:text-emerald-400 transition-colors">
                  {member.name.replace(/-/g, " ")}
                </p>
                <p className="text-gray-500 text-[10px] font-mono">Lv.{member.level}</p>
                {member.item && (
                  <p className="text-yellow-500/70 text-[9px]">{member.item}</p>
                )}
              </button>
            ))}
          </div>

          {/* Counters */}
          <div className="flex items-start gap-3 mb-3">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Sword className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Bring</span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {boss.counters.map((t) => <TypeBadge key={t} type={t} />)}
            </div>
          </div>

          {/* Tip */}
          <div className="bg-[#0f0f12] border border-yellow-500/10 rounded-lg px-3 py-2.5 flex gap-2">
            <Shield className="w-3.5 h-3.5 text-yellow-500/60 flex-shrink-0 mt-0.5" />
            <p className="text-gray-400 text-[11px] leading-relaxed">{boss.notes}</p>
          </div>

          <p className="text-gray-700 text-[10px] mt-2 text-center">
            Click any Pokémon to open Smart HUD & Kill Range Calculator
          </p>
        </div>
      )}
    </div>
  );
}

export default function BossGuide() {
  const [game,    setGame]    = useState("emerald");
  const [section, setSection] = useState("gyms");
  const [selected, setSelected] = useState(null);

  const gData = BOSS_DATA[game];
  const bosses = section === "gyms"
    ? gData.gyms
    : [...gData.elite, { ...gData.champion }];

  const handleSelectPokemon = (member) => {
    setSelected({
      name: member.name.replace(/-/g, " "),
      level: member.level,
      hp_percent: 100,
      moves: member.moves || [],
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#141417] border border-white/5 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Outfit" }}>Boss Guide</h1>
            <p className="text-gray-500 text-sm">Gym leaders, Elite Four & Champions with team data</p>
          </div>
        </div>

        {/* Game selector */}
        <div className="flex gap-2 mb-6">
          {Object.entries(GAME_LABELS).map(([key, { name, color, bg, border }]) => (
            <button
              key={key}
              data-testid={`game-tab-${key}`}
              onClick={() => setGame(key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                game === key
                  ? `${bg} ${border} ${color}`
                  : "bg-transparent border-white/5 text-gray-500 hover:text-gray-300 hover:border-white/10"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Section tabs */}
        <div className="flex border-b border-white/5 mb-6">
          {[
            { id: "gyms",  label: "Gym Leaders" },
            { id: "elite", label: "Elite Four & Champion" },
          ].map(({ id, label }) => (
            <button
              key={id}
              data-testid={`section-tab-${id}`}
              onClick={() => setSection(id)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                section === id
                  ? "border-emerald-400 text-emerald-400"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Boss cards */}
        <div className="space-y-3">
          {bosses.map((boss) => (
            <BossCard
              key={`${game}-${boss.leader}`}
              boss={boss}
              onSelectPokemon={handleSelectPokemon}
            />
          ))}
        </div>

        <p className="text-gray-700 text-xs text-center mt-8">
          All team data based on in-game boss encounters. Click any Pokémon to open Smart HUD.
        </p>
      </div>

      {selected && (
        <PokemonDetailsModal
          name={selected.name}
          nickname={null}
          level={selected.level}
          hp_percent={selected.hp_percent}
          moves={selected.moves}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
