import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Library, Gamepad2, Clock, PlayCircle, Trash2, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "./Navbar";
import { useEmu } from "../App";
import SaveStateManager from "./SaveStateManager";

const CORE_STYLE = {
  gba: "text-pink-400 bg-pink-500/10",
  gbc: "text-blue-400 bg-blue-500/10",
  gb:  "text-emerald-400 bg-emerald-500/10",
};

function formatSize(bytes) {
  if (!bytes) return "?";
  const mb = bytes / 1024 / 1024;
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

function formatDate(ts) {
  if (!ts) return "Never";
  const d = new Date(ts);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function RomRow({ rom, idx, onPlay, onRemove }) {
  const [showStates, setShowStates] = useState(false);

  return (
    <div className="bg-[#141417] border border-white/5 rounded-xl overflow-hidden transition-all">
      {/* Main row */}
      <div className="px-5 py-4 flex items-center gap-4 hover:bg-white/[0.01] group">
        {/* Icon */}
        <div className="w-10 h-10 bg-gray-800/60 border border-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
          <Gamepad2 className="w-5 h-5 text-gray-600" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">
            {rom.name.replace(/\.[^.]+$/, "").replace(/[_-]/g, " ")}
          </p>
          <p className="text-gray-600 text-xs font-mono truncate">{rom.name}</p>
        </div>

        {/* Meta */}
        <div className="hidden sm:flex items-center gap-4 flex-shrink-0 text-xs">
          <span className={`font-bold uppercase px-2 py-0.5 rounded font-mono text-[10px] ${CORE_STYLE[rom.core] || "text-gray-400 bg-gray-800"}`}>
            {rom.core?.toUpperCase()}
          </span>
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="w-3 h-3" />
            <span>{formatDate(rom.lastPlayed)}</span>
          </div>
          <span className="text-gray-700 font-mono">{formatSize(rom.size)}</span>
          <div className="text-center w-14">
            <span className="text-emerald-400 font-mono font-bold text-sm">{rom.playCount || 1}</span>
            <span className="text-gray-700 text-[10px] block">play{(rom.playCount || 1) !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Toggle save states */}
          <button
            onClick={() => setShowStates((v) => !v)}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-300 text-xs px-2 py-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5 transition-all"
            title="Save states"
          >
            {showStates ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">States</span>
          </button>

          <button
            onClick={() => onPlay(rom.name)}
            data-testid={`play-rom-${idx}`}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs px-3 py-1.5 rounded-lg transition-all"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            Play
          </button>
          <button
            onClick={(e) => onRemove(rom.name, e)}
            data-testid={`remove-rom-${idx}`}
            className="text-gray-700 hover:text-red-400 p-1.5 rounded hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Save state panel */}
      {showStates && (
        <div className="border-t border-white/5 p-3">
          <SaveStateManager romName={rom.name} />
        </div>
      )}
    </div>
  );
}

export default function LibraryPage() {
  const navigate = useNavigate();
  const { loadRom } = useEmu();
  const [roms, setRoms] = useState([]);
  const [pendingName, setPendingName] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recent_roms") || "[]");
    setRoms(stored);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      loadRom(file);
      navigate("/play");
    }
    e.target.value = "";
    setPendingName(null);
  };

  const handlePlay = (name) => {
    setPendingName(name);
    fileRef.current?.click();
  };

  const removeRom = (name, e) => {
    e.stopPropagation();
    const updated = roms.filter((r) => r.name !== name);
    localStorage.setItem("recent_roms", JSON.stringify(updated));
    setRoms(updated);
  };

  const clearAll = () => {
    if (!window.confirm("Clear entire ROM library history?")) return;
    localStorage.removeItem("recent_roms");
    setRoms([]);
  };

  const totalPlays = roms.reduce((sum, r) => sum + (r.playCount || 1), 0);

  return (
    <div className="min-h-screen bg-[#0A0A0C]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "Outfit" }}>ROM Library</h1>
            <p className="text-gray-500 text-sm mt-1">
              {roms.length} ROM{roms.length !== 1 ? "s" : ""} · {totalPlays} total play{totalPlays !== 1 ? "s" : ""}
            </p>
          </div>
          {roms.length > 0 && (
            <button
              onClick={clearAll}
              data-testid="clear-library-btn"
              className="flex items-center gap-1.5 text-gray-600 hover:text-red-400 text-sm transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear History
            </button>
          )}
        </div>

        {/* Stats bar */}
        {roms.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { label: "GBA ROMs", value: roms.filter((r) => r.core === "gba").length, color: "text-pink-400" },
              { label: "GBC ROMs", value: roms.filter((r) => r.core === "gbc").length, color: "text-blue-400" },
              { label: "GB ROMs",  value: roms.filter((r) => r.core === "gb").length,  color: "text-emerald-400" },
            ].map((s) => (
              <div key={s.label} className="bg-[#141417] border border-white/5 rounded-xl p-4 text-center">
                <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
                <p className="text-gray-600 text-xs uppercase tracking-wider mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileRef}
          type="file"
          accept=".gb,.gbc,.gba"
          className="hidden"
          onChange={handleFileChange}
          data-testid="library-file-input"
        />

        {roms.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-gray-800/60 border border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Library className="w-8 h-8 text-gray-700" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2" style={{ fontFamily: "Outfit" }}>
              No ROMs played yet
            </h3>
            <p className="text-gray-600 text-sm mb-6 max-w-xs mx-auto">
              Load a ROM from the home page to see your play history here
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all"
            >
              Go to Home
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {roms.map((rom, idx) => (
              <RomRow
                key={rom.name}
                rom={rom}
                idx={idx}
                onPlay={handlePlay}
                onRemove={removeRom}
              />
            ))}

            {/* Tip box */}
            <div className="mt-4 p-4 bg-[#141417] border border-white/5 rounded-xl">
              <p className="text-gray-600 text-xs leading-relaxed">
                <span className="text-gray-400 font-semibold">Re-loading a ROM:</span> Since browsers can't access files from previous sessions for security reasons, clicking "Play" will ask you to re-select the file. Your play count, history, and save states are always saved.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
