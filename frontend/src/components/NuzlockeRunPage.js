import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Skull, Box, Minus, Edit3, Trash2, Check, X, Info } from "lucide-react";
import axios from "axios";
import Navbar from "./Navbar";
import HpBar from "./HpBar";
import PokemonSprite from "./PokemonSprite";
import RouteTracker from "./RouteTracker";
import PokemonDetailsModal from "./PokemonDetailsModal";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const STATUS_CFG = {
  alive:   { label: "Alive",   color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  dead:    { label: "Fainted", color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20" },
  boxed:   { label: "Boxed",   color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20" },
  missed:  { label: "Missed",  color: "text-gray-400",    bg: "bg-gray-500/10 border-gray-500/20" },
  escaped: { label: "Escaped", color: "text-orange-400",  bg: "bg-orange-500/10 border-orange-500/20" },
};

const RUN_STATUS_CFG = {
  active:    { label: "Active",    color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  completed: { label: "Completed", color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20" },
  failed:    { label: "Failed",    color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20" },
};

const EMPTY_FORM = {
  location: "", pokemon: "", nickname: "", level: 5,
  status: "alive", hp_percent: 100, is_starter: false, notes: "",
};

export default function NuzlockeRunPage() {
  const { runId } = useParams();
  const navigate = useNavigate();
  const [run, setRun] = useState(null);
  const [encounters, setEncounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null); // for detail modal

  const fetchData = useCallback(async () => {
    try {
      const [runRes, encRes] = await Promise.all([
        axios.get(`${API}/nuzlocke/runs/${runId}`),
        axios.get(`${API}/nuzlocke/runs/${runId}/encounters`),
      ]);
      setRun(runRes.data);
      setEncounters(encRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [runId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const submitEncounter = async (e) => {
    e.preventDefault();
    if (!form.location.trim() || !form.pokemon.trim()) return;
    setSubmitting(true);
    try {
      await axios.post(`${API}/nuzlocke/runs/${runId}/encounters`, {
        ...form,
        level: Number(form.level),
        hp_percent: Number(form.hp_percent),
      });
      setShowAdd(false);
      setForm(EMPTY_FORM);
      fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const quickUpdate = async (encId, patch) => {
    try {
      await axios.put(`${API}/nuzlocke/encounters/${encId}`, patch);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const saveEdit = async (encId) => {
    try {
      const payload = { ...editData };
      if (payload.level) payload.level = Number(payload.level);
      if (payload.hp_percent !== undefined) payload.hp_percent = Number(payload.hp_percent);
      await axios.put(`${API}/nuzlocke/encounters/${encId}`, payload);
      setEditId(null);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const deleteEncounter = async (encId) => {
    if (!window.confirm("Remove this encounter?")) return;
    try {
      await axios.delete(`${API}/nuzlocke/encounters/${encId}`);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const updateRunStatus = async (status) => {
    try {
      await axios.put(`${API}/nuzlocke/runs/${runId}`, { status });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const party = encounters.filter((e) => e.status === "alive").slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0C]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-600 text-sm">Loading run data...</p>
        </div>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="min-h-screen bg-[#0A0A0C]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-gray-400 mb-4">Run not found</p>
          <button onClick={() => navigate("/nuzlocke")} className="text-emerald-400 hover:text-emerald-300 text-sm">
            ← Back to Runs
          </button>
        </div>
      </div>
    );
  }

  const runCfg = RUN_STATUS_CFG[run.status] || RUN_STATUS_CFG.active;
  const aliveCount = encounters.filter((e) => e.status === "alive").length;
  const deadCount = encounters.filter((e) => e.status === "dead").length;
  const otherCount = encounters.filter((e) => !["alive", "dead"].includes(e.status)).length;

  return (
    <div className="min-h-screen bg-[#0A0A0C]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Run Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/nuzlocke")}
              data-testid="back-btn"
              className="text-gray-600 hover:text-gray-300 transition-colors p-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Outfit" }}>{run.name}</h1>
                <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-full border ${runCfg.bg} ${runCfg.color}`}>
                  {runCfg.label}
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-0.5">{run.game} · {run.core?.toUpperCase()}</p>
            </div>
          </div>

          {run.status === "active" && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateRunStatus("completed")}
                data-testid="complete-run-btn"
                className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 text-blue-400 text-sm px-3 py-1.5 rounded-lg transition-colors"
              >
                <Check className="w-3.5 h-3.5" /> Complete
              </button>
              <button
                onClick={() => updateRunStatus("failed")}
                data-testid="fail-run-btn"
                className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-sm px-3 py-1.5 rounded-lg transition-colors"
              >
                <Skull className="w-3.5 h-3.5" /> Fail Run
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total", value: encounters.length, color: "text-white" },
            { label: "Alive", value: aliveCount, color: "text-emerald-400" },
            { label: "Fainted", value: deadCount, color: "text-red-400" },
            { label: "Other", value: otherCount, color: "text-gray-400" },
          ].map((s) => (
            <div key={s.label} className="bg-[#141417] border border-white/5 rounded-xl p-4 text-center">
              <p className={`text-3xl font-bold font-mono ${s.color}`}>{s.value}</p>
              <p className="text-gray-600 text-xs uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Route Tracker */}
        <RouteTracker encounters={encounters} runId={runId} onUpdate={fetchData} />

        {/* Party */}
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">Active Party</h2>
          {party.length === 0 ? (
            <div className="bg-[#141417] border border-white/5 rounded-xl p-6 text-center">
              <p className="text-gray-600 text-sm">No alive party members yet. Add encounters to populate the party.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {party.map((enc) => (
                <div
                  key={enc.id}
                  data-testid={`party-slot-${enc.id}`}
                  onClick={() => setSelectedPokemon(enc)}
                  className="bg-[#141417] border border-emerald-500/20 rounded-xl p-3 text-center hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all cursor-pointer group relative"
                >
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Info className="w-3 h-3 text-emerald-400/60" />
                  </div>
                  <PokemonSprite name={enc.pokemon} size={52} showTypes={true} />
                  <p className="text-white font-semibold text-xs truncate mt-2">{enc.nickname || enc.pokemon}</p>
                  {enc.nickname && (
                    <p className="text-gray-600 text-[10px] truncate">{enc.pokemon}</p>
                  )}
                  <p className="text-gray-500 font-mono text-[10px] mt-0.5">Lv.{enc.level}</p>
                  <div className="mt-2">
                    <HpBar percent={enc.hp_percent} />
                    <p className="text-right text-[10px] font-mono text-gray-600 mt-0.5">{enc.hp_percent}%</p>
                  </div>
                </div>
              ))}
              {Array.from({ length: Math.max(0, 6 - party.length) }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="bg-[#141417] border border-white/5 rounded-xl p-3 flex items-center justify-center opacity-30"
                  style={{ minHeight: "150px" }}
                >
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                    <Minus className="w-4 h-4 text-gray-700" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Encounters Table */}
        <div className="bg-[#141417] border border-white/5 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h2 className="text-white font-semibold" style={{ fontFamily: "Outfit" }}>
              All Encounters <span className="text-gray-600 font-normal text-sm ml-1">({encounters.length})</span>
            </h2>
            <button
              onClick={() => setShowAdd(true)}
              data-testid="add-encounter-btn"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-sm px-3 py-1.5 rounded-lg transition-all"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {encounters.length === 0 ? (
            <div className="text-center py-14">
              <p className="text-gray-600 text-sm mb-2">No encounters logged yet.</p>
              <button
                onClick={() => setShowAdd(true)}
                data-testid="first-encounter-btn"
                className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
              >
                Log your first encounter →
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Pokemon", "Location", "Lv", "HP", "Status", "Actions"].map((h, i) => (
                      <th
                        key={h}
                        className={`px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-600 ${i === 5 ? "text-right" : "text-left"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {encounters.map((enc) => {
                    const sc = STATUS_CFG[enc.status] || STATUS_CFG.alive;
                    const isEditing = editId === enc.id;
                    return (
                      <tr key={enc.id} data-testid={`encounter-row-${enc.id}`} className="hover:bg-white/[0.02] transition-colors">

                        {/* Pokemon */}
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              value={editData.nickname ?? ""}
                              onChange={(e) => setEditData({ ...editData, nickname: e.target.value })}
                              placeholder={enc.pokemon}
                              className="bg-[#0A0A0C] border border-gray-700 text-white text-xs px-2 py-1 rounded w-28 outline-none"
                            />
                          ) : (
                            <div>
                              {enc.pokemon === "—" ? (
                                <span className="text-gray-600 italic text-xs">No Pokemon</span>
                              ) : (
                                <>
                                  <span className="text-white font-medium">{enc.nickname || enc.pokemon}</span>
                                  {enc.nickname && (
                                    <span className="text-gray-600 text-xs ml-1">({enc.pokemon})</span>
                                  )}
                                  {enc.is_starter && <span className="ml-1 text-yellow-500 text-xs">★</span>}
                                </>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Location */}
                        <td className="px-4 py-3 text-gray-400 text-xs">{enc.location}</td>

                        {/* Level */}
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editData.level ?? enc.level}
                              onChange={(e) => setEditData({ ...editData, level: e.target.value })}
                              className="bg-[#0A0A0C] border border-gray-700 text-white text-xs px-2 py-1 rounded w-14 outline-none"
                              min="1" max="100"
                            />
                          ) : (
                            <span className="font-mono text-gray-400 text-xs">{enc.level}</span>
                          )}
                        </td>

                        {/* HP */}
                        <td className="px-4 py-3 w-32">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editData.hp_percent ?? enc.hp_percent}
                              onChange={(e) => setEditData({ ...editData, hp_percent: e.target.value })}
                              className="bg-[#0A0A0C] border border-gray-700 text-white text-xs px-2 py-1 rounded w-16 outline-none"
                              min="0" max="100"
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <HpBar percent={enc.hp_percent} />
                              <span className="font-mono text-[10px] text-gray-600 w-8 shrink-0">{enc.hp_percent}%</span>
                            </div>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <select
                              value={editData.status || enc.status}
                              onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                              className="bg-[#0A0A0C] border border-gray-700 text-white text-xs px-2 py-1 rounded outline-none"
                            >
                              {Object.entries(STATUS_CFG).map(([k, v]) => (
                                <option key={k} value={k}>{v.label}</option>
                              ))}
                            </select>
                          ) : (
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${sc.bg} ${sc.color}`}>
                              {sc.label}
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-0.5">
                            {isEditing ? (
                              <>
                                <button onClick={() => saveEdit(enc.id)} data-testid={`save-edit-${enc.id}`} className="text-emerald-400 hover:text-emerald-300 p-1.5 rounded hover:bg-emerald-500/10 transition-colors">
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => setEditId(null)} className="text-gray-600 hover:text-gray-400 p-1.5 rounded hover:bg-white/5 transition-colors">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <>
                                {enc.status === "alive" && (
                                  <button
                                    onClick={() => quickUpdate(enc.id, { status: "dead" })}
                                    data-testid={`faint-btn-${enc.id}`}
                                    title="Mark as Fainted"
                                    className="text-gray-600 hover:text-red-400 p-1.5 rounded hover:bg-red-500/10 transition-colors"
                                  >
                                    <Skull className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {enc.status === "alive" && (
                                  <button
                                    onClick={() => quickUpdate(enc.id, { status: "boxed" })}
                                    data-testid={`box-btn-${enc.id}`}
                                    title="Move to Box"
                                    className="text-gray-600 hover:text-blue-400 p-1.5 rounded hover:bg-blue-500/10 transition-colors"
                                  >
                                    <Box className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    setEditId(enc.id);
                                    setEditData({ status: enc.status, nickname: enc.nickname || "", level: enc.level, hp_percent: enc.hp_percent });
                                  }}
                                  data-testid={`edit-btn-${enc.id}`}
                                  className="text-gray-600 hover:text-gray-300 p-1.5 rounded hover:bg-white/5 transition-colors"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => deleteEncounter(enc.id)}
                                  data-testid={`delete-enc-${enc.id}`}
                                  className="text-gray-600 hover:text-red-400 p-1.5 rounded hover:bg-red-500/10 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Encounter Modal */}
      {showAdd && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          data-testid="add-encounter-modal"
        >
          <div className="bg-[#141417] border border-white/10 rounded-xl p-6 w-full max-w-md my-4 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Outfit" }}>Log Encounter</h2>
              <button onClick={() => setShowAdd(false)} className="text-gray-600 hover:text-gray-300 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submitEncounter} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Pokemon *</label>
                  <input
                    value={form.pokemon}
                    onChange={(e) => setForm({ ...form, pokemon: e.target.value })}
                    placeholder="Bulbasaur"
                    data-testid="enc-pokemon-input"
                    className="w-full bg-[#0A0A0C] border border-gray-700 focus:border-emerald-500 text-white placeholder-gray-600 text-sm px-3 py-2 rounded-lg outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Nickname</label>
                  <input
                    value={form.nickname}
                    onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                    placeholder="Leafy"
                    data-testid="enc-nickname-input"
                    className="w-full bg-[#0A0A0C] border border-gray-700 focus:border-emerald-500 text-white placeholder-gray-600 text-sm px-3 py-2 rounded-lg outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Location *</label>
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Route 1"
                    data-testid="enc-location-input"
                    className="w-full bg-[#0A0A0C] border border-gray-700 focus:border-emerald-500 text-white placeholder-gray-600 text-sm px-3 py-2 rounded-lg outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Level</label>
                  <input
                    type="number"
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                    min="1" max="100"
                    data-testid="enc-level-input"
                    className="w-full bg-[#0A0A0C] border border-gray-700 focus:border-emerald-500 text-white text-sm px-3 py-2 rounded-lg outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    data-testid="enc-status-select"
                    className="w-full bg-[#0A0A0C] border border-gray-700 focus:border-emerald-500 text-white text-sm px-3 py-2 rounded-lg outline-none transition-colors"
                  >
                    <option value="alive">Alive</option>
                    <option value="missed">Missed</option>
                    <option value="escaped">Escaped</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">HP %</label>
                  <input
                    type="number"
                    value={form.hp_percent}
                    onChange={(e) => setForm({ ...form, hp_percent: e.target.value })}
                    min="0" max="100"
                    data-testid="enc-hp-input"
                    className="w-full bg-[#0A0A0C] border border-gray-700 focus:border-emerald-500 text-white text-sm px-3 py-2 rounded-lg outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="enc-starter"
                  checked={form.is_starter}
                  onChange={(e) => setForm({ ...form, is_starter: e.target.checked })}
                  data-testid="enc-starter-check"
                  className="accent-emerald-500 w-4 h-4 rounded"
                />
                <label htmlFor="enc-starter" className="text-gray-400 text-sm cursor-pointer select-none">
                  Starter Pokemon
                </label>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Optional notes about this encounter..."
                  rows={2}
                  data-testid="enc-notes-input"
                  className="w-full bg-[#0A0A0C] border border-gray-700 focus:border-emerald-500 text-white placeholder-gray-600 text-sm px-3 py-2 rounded-lg outline-none transition-colors resize-none"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  data-testid="cancel-encounter-btn"
                  className="flex-1 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white text-sm py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  data-testid="submit-encounter-btn"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                >
                  {submitting ? "Logging..." : "Log Encounter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Pokemon Detail Modal */}
      {selectedPokemon && (
        <PokemonDetailsModal
          name={selectedPokemon.pokemon}
          nickname={selectedPokemon.nickname}
          level={selectedPokemon.level}
          hp_percent={selectedPokemon.hp_percent}
          onClose={() => setSelectedPokemon(null)}
        />
      )}
    </div>
  );
}
