import { useMemo } from "react";
import PokemonSprite from "./PokemonSprite";

const STATUS_CFG = {
  alive:   { dot: "bg-emerald-400",  line: "border-emerald-400/40", label: "Alive",   labelColor: "text-emerald-400" },
  dead:    { dot: "bg-red-400",      line: "border-red-400/40",     label: "Fainted", labelColor: "text-red-400"     },
  boxed:   { dot: "bg-blue-400",     line: "border-blue-400/40",    label: "Boxed",   labelColor: "text-blue-400"    },
  missed:  { dot: "bg-gray-600",     line: "border-gray-600/40",    label: "Missed",  labelColor: "text-gray-500"    },
  escaped: { dot: "bg-orange-400",   line: "border-orange-400/40",  label: "Escaped", labelColor: "text-orange-400"  },
};

function formatDate(iso) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    time: d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
  };
}

export default function RunTimeline({ encounters }) {
  const sorted = useMemo(
    () => [...encounters].sort((a, b) => new Date(a.caught_at) - new Date(b.caught_at)),
    [encounters]
  );

  if (sorted.length === 0) {
    return (
      <div className="text-center py-14">
        <p className="text-gray-600 text-sm">No encounters logged yet.</p>
        <p className="text-gray-700 text-xs mt-1">Your run story will appear here as you add encounters.</p>
      </div>
    );
  }

  return (
    <div className="relative" data-testid="run-timeline">
      {/* Vertical spine */}
      <div className="absolute left-[18px] top-5 bottom-5 w-px bg-white/[0.04]" />

      <div className="space-y-2 py-2">
        {sorted.map((enc, idx) => {
          const cfg  = STATUS_CFG[enc.status] || STATUS_CFG.missed;
          const { date, time } = formatDate(enc.caught_at);
          const isMissed = enc.status === "missed" || enc.status === "escaped";
          const isDead   = enc.status === "dead";

          return (
            <div
              key={enc.id}
              data-testid={`timeline-item-${enc.id}`}
              className="flex items-start gap-4"
            >
              {/* Dot */}
              <div className="relative z-10 flex-shrink-0 mt-4">
                <div className={`w-[10px] h-[10px] rounded-full ${cfg.dot} shadow-sm ml-[9px]`} />
              </div>

              {/* Card */}
              <div
                className={`flex-1 bg-[#141417] border rounded-xl p-3 flex items-center gap-3 transition-colors ${
                  isDead ? "border-red-500/10 opacity-80" : "border-white/5"
                }`}
              >
                {/* Sprite or placeholder */}
                {!isMissed ? (
                  <PokemonSprite name={enc.pokemon} size={44} showTypes={false} />
                ) : (
                  <div className="w-11 h-11 bg-gray-800/60 rounded-xl flex items-center justify-center text-gray-700 text-lg font-bold flex-shrink-0">?</div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-sm font-semibold ${isDead ? "text-gray-400 line-through" : "text-white"}`}>
                      {enc.nickname || enc.pokemon}
                    </span>
                    {enc.nickname && (
                      <span className="text-gray-600 text-xs">({enc.pokemon})</span>
                    )}
                    <span className="text-gray-600 font-mono text-xs">Lv.{enc.level}</span>
                  </div>
                  <p className="text-gray-500 text-xs truncate">{enc.location}</p>
                  {enc.notes && (
                    <p className="text-gray-600 text-[11px] italic truncate mt-0.5">"{enc.notes}"</p>
                  )}
                </div>

                {/* Date + status */}
                <div className="text-right flex-shrink-0 space-y-0.5">
                  <p className="text-gray-700 text-[10px] font-mono">{date}</p>
                  <p className="text-gray-700 text-[10px] font-mono">{time}</p>
                  <p className={`text-[10px] font-bold uppercase ${cfg.labelColor}`}>{cfg.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-gray-700 text-[10px] text-center mt-4">
        {sorted.length} encounter{sorted.length !== 1 ? "s" : ""} logged
      </p>
    </div>
  );
}
