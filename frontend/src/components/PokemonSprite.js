import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

// Module-level cache — survives re-renders, cleared on page refresh
const pokeCache = {};

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/['.]/g, "")
    .replace(/♂/, "-m")
    .replace(/♀/, "-f");
}

const TYPE_COLORS = {
  fire:     { bg: "rgba(255,68,34,0.15)",  text: "#FF4422" },
  water:    { bg: "rgba(51,153,255,0.15)", text: "#3399FF" },
  grass:    { bg: "rgba(119,204,85,0.15)", text: "#77CC55" },
  electric: { bg: "rgba(255,204,51,0.15)", text: "#FFCC33" },
  psychic:  { bg: "rgba(255,85,153,0.15)", text: "#FF5599" },
  ice:      { bg: "rgba(102,204,255,0.15)", text: "#66CCFF" },
  dragon:   { bg: "rgba(119,102,238,0.15)", text: "#7766EE" },
  dark:     { bg: "rgba(119,85,68,0.15)",  text: "#AA7766" },
  fairy:    { bg: "rgba(238,153,238,0.15)", text: "#EE99EE" },
  normal:   { bg: "rgba(170,170,153,0.15)", text: "#AAAAAA" },
  fighting: { bg: "rgba(187,85,68,0.15)",  text: "#CC6655" },
  flying:   { bg: "rgba(136,153,255,0.15)", text: "#8899FF" },
  poison:   { bg: "rgba(170,85,153,0.15)", text: "#AA55AA" },
  ground:   { bg: "rgba(221,187,85,0.15)", text: "#DDBB55" },
  rock:     { bg: "rgba(187,170,102,0.15)", text: "#BBAA66" },
  bug:      { bg: "rgba(170,187,34,0.15)", text: "#AABB22" },
  ghost:    { bg: "rgba(102,85,187,0.15)", text: "#6655BB" },
  steel:    { bg: "rgba(170,170,187,0.15)", text: "#AAAABB" },
};

export default function PokemonSprite({ name, size = 56, showTypes = false }) {
  const [data, setData] = useState(pokeCache[normalizeName(name || "")] || null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!name || failed) return;
    const key = normalizeName(name);
    if (pokeCache[key]) {
      setData(pokeCache[key]);
      return;
    }
    fetch(`https://pokeapi.co/api/v2/pokemon/${key}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((res) => {
        const entry = {
          sprite: res.sprites.front_default,
          types: res.types.map((t) => t.type.name),
        };
        pokeCache[key] = entry;
        setData(entry);
      })
      .catch(() => setFailed(true));
  }, [name, failed]);

  return (
    <div className="flex flex-col items-center gap-1">
      {data?.sprite && !failed ? (
        <img
          src={data.sprite}
          alt={name}
          style={{ width: size, height: size, imageRendering: "pixelated" }}
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          style={{ width: size, height: size }}
          className="bg-emerald-500/10 rounded-full flex items-center justify-center"
        >
          <Heart className="text-emerald-400" style={{ width: size * 0.45, height: size * 0.45 }} />
        </div>
      )}
      {showTypes && data?.types?.length > 0 && (
        <div className="flex gap-1 justify-center flex-wrap">
          {data.types.map((type) => {
            const tc = TYPE_COLORS[type] || { bg: "rgba(120,120,120,0.15)", text: "#888" };
            return (
              <span
                key={type}
                style={{ backgroundColor: tc.bg, color: tc.text, fontSize: "9px" }}
                className="px-1.5 py-0.5 rounded font-bold uppercase tracking-wider"
              >
                {type}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
