import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trophy, ChevronRight, Trash2, Gamepad2 } from "lucide-react";
import axios from "axios";
import Navbar from "./Navbar";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const STATUS_STYLE = {
  active:    "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  completed: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  failed:    "text-red-400 bg-red-500/10 border-red-500/20",
};

const CORE_STYLE = {
  gba: "text-pink-400 bg-pink-500/10",
  gbc: "text-blue-400 bg-blue-500/10",
  gb:  "text-emerald-400 bg-emerald-500/10",
};

const POPULAR_GAMES = [
  "Pokemon Radical Red",
  "Pokemon Emerald",
  "Pokemon FireRed",
  "Pokemon Crystal",
  "Pokemon HeartGold",
  "Pokemon Unbound",
  "Custom Game",
];

const EMPTY_FORM = { name: "", game: "", core: "gba" };

export default function NuzlockeList() {
  const navigate = useNavigate();
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const fetchRuns = async () => {
    try {
      const res = await axios.get(`${API}/nuzlocke/runs`);
      setRuns(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRuns(); }, []);

  const createRun = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.game.trim()) return;
    setSubmitting(true);
    try {
      await axios.post(`${API}/nuzlocke/runs`, form);
      setShowCreate(false);
      setForm(EMPTY_FORM);
      fetchRuns();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteRun = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this run and all its encounters?")) return;
    try {
      await axios.delete(`${API}/nuzlocke/runs/${id}`);
      fetchRuns();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "Outfit" }}>Nuzlocke Runs</h1>
            <p className="text-gray-500 text-sm mt-1">
              {loading ? "Loading..." : `${runs.length} run${runs.length !== 1 ? "s" : ""} tracked`}
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            data-testid="create-run-btn"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
          >
            <Plus className="w-4 h-4" /> New Run
          </button>
        </div>

        {/* Runs Grid */}
        {loading ? (
          <div className="text-center py-16 text-gray-600 text-sm">Loading runs...</div>
        ) : runs.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-gray-800/60 border border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Trophy className="w-8 h-8 text-gray-700" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2" style={{ fontFamily: "Outfit" }}>No runs yet</h3>
            <p className="text-gray-600 text-sm mb-6 max-w-xs mx-auto">
              Create your first Nuzlocke run to start tracking your Pokemon journey
            </p>
            <button
              onClick={() => setShowCreate(true)}
              data-testid="empty-create-btn"
              className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all"
            >
              Create First Run
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {runs.map((run) => (
              <div
                key={run.id}
                onClick={() => navigate(`/nuzlocke/${run.id}`)}
                data-testid={`run-card-${run.id}`}
                className="bg-[#141417] border border-white/5 rounded-xl p-5 cursor-pointer hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0">
                    <h3 className="text-white font-semibold truncate" style={{ fontFamily: "Outfit" }}>{run.name}</h3>
                    <p className="text-gray-500 text-xs mt-0.5 truncate">{run.game}</p>
                  </div>
                  <button
                    onClick={(e) => deleteRun(run.id, e)}
                    data-testid={`delete-run-${run.id}`}
                    className="opacity-0 group-hover:opacity-100 text-gray-700 hover:text-red-400 transition-all p-1 ml-2 flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded font-mono ${CORE_STYLE[run.core] || "text-gray-400 bg-gray-800"}`}>
                    {run.core?.toUpperCase()}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${STATUS_STYLE[run.status] || STATUS_STYLE.active}`}>
                    {run.status}
                  </span>
                </div>

                {/* Progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Encounters</span>
                    <span className="font-mono text-gray-400">
                      <span className="text-emerald-400">{run.alive_count || 0}</span>
                      {" alive · "}
                      <span className="text-red-400">{run.dead_count || 0}</span>
                      {" fainted"}
                    </span>
                  </div>
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    {(run.total_encounters || 0) > 0 && (
                      <div
                        style={{ width: `${((run.alive_count || 0) / run.total_encounters) * 100}%` }}
                        className="h-full bg-emerald-500 rounded-full"
                      />
                    )}
                  </div>
                  <p className="text-gray-700 text-xs text-right font-mono">{run.total_encounters || 0} total</p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                  <span className="text-gray-700 text-xs">{new Date(run.created_at).toLocaleDateString()}</span>
                  <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-emerald-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Run Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="create-run-modal">
          <div className="bg-[#141417] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-5" style={{ fontFamily: "Outfit" }}>New Nuzlocke Run</h2>
            <form onSubmit={createRun} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Run Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="My Radical Red Nuzlocke"
                  data-testid="run-name-input"
                  className="w-full bg-[#0A0A0C] border border-gray-700 focus:border-emerald-500 text-white placeholder-gray-600 text-sm px-3 py-2.5 rounded-lg outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Game *</label>
                <input
                  value={form.game}
                  onChange={(e) => setForm({ ...form, game: e.target.value })}
                  list="games-datalist"
                  placeholder="Pokemon Radical Red"
                  data-testid="run-game-input"
                  className="w-full bg-[#0A0A0C] border border-gray-700 focus:border-emerald-500 text-white placeholder-gray-600 text-sm px-3 py-2.5 rounded-lg outline-none transition-colors"
                  required
                />
                <datalist id="games-datalist">
                  {POPULAR_GAMES.map((g) => <option key={g} value={g} />)}
                </datalist>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Platform</label>
                <select
                  value={form.core}
                  onChange={(e) => setForm({ ...form, core: e.target.value })}
                  data-testid="run-core-select"
                  className="w-full bg-[#0A0A0C] border border-gray-700 focus:border-emerald-500 text-white text-sm px-3 py-2.5 rounded-lg outline-none transition-colors"
                >
                  <option value="gba">Game Boy Advance (GBA)</option>
                  <option value="gbc">Game Boy Color (GBC)</option>
                  <option value="gb">Game Boy (GB)</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowCreate(false); setForm(EMPTY_FORM); }}
                  data-testid="cancel-create-btn"
                  className="flex-1 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white text-sm py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  data-testid="submit-create-btn"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                >
                  {submitting ? "Creating..." : "Create Run"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
