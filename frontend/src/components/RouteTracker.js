import { useState, useMemo } from "react";
import { MapPin, CheckCircle, XCircle, AlertCircle, Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
import { getEncounterSuggestions } from "../data/encounterTables";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ROUTE_STATUS = {
  alive:   { icon: CheckCircle,  color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", label: "Cleared" },
  dead:    { icon: XCircle,      color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20",         label: "Lost"    },
  boxed:   { icon: CheckCircle,  color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20",       label: "Boxed"   },
  missed:  { icon: AlertCircle,  color: "text-gray-500",    bg: "bg-gray-800 border-gray-700",             label: "Missed"  },
  escaped: { icon: AlertCircle,  color: "text-orange-400",  bg: "bg-orange-500/10 border-orange-500/20",   label: "Escaped" },
};

export default function RouteTracker({ encounters, runId, onUpdate, game }) {
  const [collapsed, setCollapsed]           = useState(false);
  const [showForm, setShowForm]             = useState(false);
  const [missedLocation, setMissedLocation] = useState("");
  const [submitting, setSubmitting]         = useState(false);

  // Group encounters by location — best status per route
  const routes = useMemo(() => {
    const map = {};
    for (const enc of encounters) {
      if (!map[enc.location]) map[enc.location] = [];
      map[enc.location].push(enc);
    }
    const priority = { alive: 0, boxed: 1, escaped: 2, dead: 3, missed: 4 };
    return Object.entries(map)
      .map(([location, encs]) => {
        const sorted = [...encs].sort((a, b) => (priority[a.status] ?? 5) - (priority[b.status] ?? 5));
        return { location, primary: sorted[0], extra: sorted.length - 1 };
      })
      .sort((a, b) => a.location.localeCompare(b.location));
  }, [encounters]);

  const summary = useMemo(() => ({
    cleared: routes.filter((r) => r.primary.status === "alive").length,
    lost:    routes.filter((r) => r.primary.status === "dead").length,
    missed:  routes.filter((r) => r.primary.status === "missed").length,
    other:   routes.filter((r) => !["alive", "dead", "missed"].includes(r.primary.status)).length,
  }), [routes]);

  const logMissed = async (e) => {
    e.preventDefault();
    if (!missedLocation.trim()) return;
    setSubmitting(true);
    try {
      await axios.post(`${API}/nuzlocke/runs/${runId}/encounters`, {
        location: missedLocation.trim(),
        pokemon: "—",
        status: "missed",
        level: 1,
        hp_percent: 0,
      });
      setMissedLocation("");
      setShowForm(false);
      onUpdate?.();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#141417] border border-white/5 rounded-xl overflow-hidden mb-8">

      {/* Header row */}
      <div
        className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 cursor-pointer select-none hover:bg-white/[0.02] transition-colors"
        onClick={() => setCollapsed((c) => !c)}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="text-white font-semibold text-sm" style={{ fontFamily: "Outfit" }}>
            Route Tracker
          </span>
          <span className="text-gray-600 text-xs">({routes.length} routes)</span>

          {/* Mini summary chips */}
          <div className="hidden sm:flex items-center gap-2 ml-1 text-xs">
            <span className="text-emerald-400 font-mono">{summary.cleared} clear</span>
            <span className="text-gray-700">·</span>
            <span className="text-red-400 font-mono">{summary.lost} lost</span>
            <span className="text-gray-700">·</span>
            <span className="text-gray-500 font-mono">{summary.missed} missed</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!collapsed && (
            <button
              onClick={(e) => { e.stopPropagation(); setShowForm((v) => !v); }}
              data-testid="log-missed-btn"
              className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-xs px-2.5 py-1 rounded-md transition-colors"
            >
              <Plus className="w-3 h-3" /> Missed
            </button>
          )}
          {collapsed
            ? <ChevronDown className="w-4 h-4 text-gray-600" />
            : <ChevronUp   className="w-4 h-4 text-gray-600" />
          }
        </div>
      </div>

      {!collapsed && (
        <>
          {/* Quick "missed route" form */}
          {showForm && (
            <div className="px-5 py-3 border-b border-white/5 bg-[#0f0f12]">
              <form onSubmit={logMissed} className="flex items-center gap-2">
                <input
                  value={missedLocation}
                  onChange={(e) => setMissedLocation(e.target.value)}
                  placeholder="Route name (e.g. Route 3, Viridian Forest)"
                  data-testid="missed-route-input"
                  autoFocus
                  required
                  className="flex-1 bg-[#0A0A0C] border border-gray-700 focus:border-gray-500 text-white placeholder-gray-600 text-sm px-3 py-1.5 rounded-lg outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  data-testid="submit-missed-btn"
                  className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  {submitting ? "..." : "Log"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-gray-600 hover:text-gray-400 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Route list */}
          {routes.length === 0 ? (
            <div className="text-center py-8 text-gray-600 text-sm">
              No routes logged yet — add encounters to see them here.
            </div>
          ) : (
            <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
              {routes.map(({ location, primary, extra }) => {
                const sc = ROUTE_STATUS[primary.status] || ROUTE_STATUS.missed;
                const Icon = sc.icon;
                const showPokemon = primary.status !== "missed" && primary.pokemon !== "—";
                return (
                  <div
                    key={location}
                    data-testid={`route-row-${location.replace(/\s+/g, "-").toLowerCase()}`}
                    className="flex items-center gap-3 px-5 py-2.5 hover:bg-white/[0.02] transition-colors"
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${sc.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{location}</p>
                      {showPokemon && (
                        <p className="text-gray-500 text-xs truncate">
                          {primary.nickname
                            ? `${primary.nickname} (${primary.pokemon})`
                            : primary.pokemon}
                          {" · Lv."}{primary.level}
                          {extra > 0 && <span className="text-gray-700 ml-1">+{extra}</span>}
                        </p>
                      )}
                      {(() => {
                        const suggestions = getEncounterSuggestions(game, location);
                        if (!suggestions) return null;
                        return (
                          <p className="text-gray-700 text-[10px] truncate mt-0.5">
                            Possible: {suggestions.slice(0, 5).join(", ")}{suggestions.length > 5 ? "…" : ""}
                          </p>
                        );
                      })()}
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border flex-shrink-0 ${sc.bg} ${sc.color}`}
                    >
                      {sc.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
