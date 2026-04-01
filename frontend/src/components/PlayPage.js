import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Cpu, Gamepad2, Trophy, FileUp, Info, RefreshCw } from "lucide-react";
import Navbar from "./Navbar";
import Emulator from "./Emulator";
import { useEmu } from "../App";

// Default controls shown before EmulatorJS loads
const DEFAULT_CONTROLS = [
  { key: "Arrow Keys", action: "D-Pad" },
  { key: "Z",         action: "A Button" },
  { key: "X",         action: "B Button" },
  { key: "A",         action: "L Button" },
  { key: "S",         action: "R Button" },
  { key: "Enter",     action: "Start" },
  { key: "Shift",     action: "Select" },
  { key: "F1",        action: "Quick Save" },
  { key: "F2",        action: "Quick Load" },
];

// EmulatorJS stores key bindings in localStorage under these keys
// Maps EJS internal action name → display label
const EJS_KEY_MAP = {
  "0":  "D-Pad Up",
  "1":  "D-Pad Down",
  "2":  "D-Pad Left",
  "3":  "D-Pad Right",
  "4":  "B Button",
  "5":  "A Button",
  "6":  "X Button",
  "7":  "Y Button",
  "8":  "Select",
  "9":  "Start",
  "10": "L Button",
  "11": "R Button",
};

function readEJSControls() {
  try {
    // EmulatorJS saves controls like "EmulatorJS-keys-{core}" or similar
    // Check common localStorage keys it uses
    const keys = Object.keys(localStorage).filter(k =>
      k.toLowerCase().includes("emulator") || k.toLowerCase().includes("ejs")
    );
    for (const k of keys) {
      if (k.toLowerCase().includes("key") || k.toLowerCase().includes("control")) {
        const val = localStorage.getItem(k);
        if (val) {
          const parsed = JSON.parse(val);
          if (typeof parsed === "object") return parsed;
        }
      }
    }
  } catch (_) {}
  return null;
}

const CORE_INFO = {
  gba:      { label: "Game Boy Advance",  specs: "ARM7TDMI · 16.78 MHz · 32-bit",    color: "text-pink-400"    },
  gbc:      { label: "Game Boy Color",    specs: "Sharp LR35902 · 8.39 MHz · 8-bit",  color: "text-blue-400"    },
  gb:       { label: "Game Boy",          specs: "Sharp LR35902 · 4.19 MHz · 8-bit",  color: "text-emerald-400" },
  gambatte: { label: "Game Boy / Color",  specs: "Gambatte core · GB + GBC",          color: "text-blue-400"    },
};

export default function PlayPage() {
  const navigate = useNavigate();
  const { romFile, biosFile, setBiosFile, gameTitle, coreType, loadRom } = useEmu();
  const [emuKey, setEmuKey] = useState(0);
  const [controls, setControls] = useState(DEFAULT_CONTROLS);
  const [ejsReady, setEjsReady] = useState(false);
  const romRef = useRef(null);
  const biosRef = useRef(null);

  // useCallback so refreshControls is stable across renders
  const refreshControls = useCallback(() => {
    const ejsControls = readEJSControls();
    if (!ejsControls) return;
    const built = [];
    for (const [k, v] of Object.entries(ejsControls)) {
      const label = EJS_KEY_MAP[k] || k;
      const keyName = typeof v === "string" ? v : JSON.stringify(v);
      if (keyName && label) built.push({ key: keyName, action: label });
    }
    if (built.length > 0) setControls(built);
  }, []);

  // Listen for EmulatorJS ready event fired from Emulator.js
  useEffect(() => {
    const onReady = () => {
      setEjsReady(true);
      refreshControls();
    };
    window.addEventListener("ejs-ready", onReady);

    // Poll localStorage for control changes every 2s — use a ref so interval
    // always sees the latest ejsReady without being a dependency
    const ejsReadyRef = { current: false };
    const interval = setInterval(() => {
      if (ejsReadyRef.current) refreshControls();
    }, 2000);

    const onReadyForRef = () => { ejsReadyRef.current = true; };
    window.addEventListener("ejs-ready", onReadyForRef);

    // Listen for storage changes (user remaps in emulator settings)
    const onStorage = (e) => {
      if (e.key && (e.key.toLowerCase().includes("emulator") || e.key.toLowerCase().includes("ejs"))) {
        refreshControls();
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("ejs-ready", onReady);
      window.removeEventListener("ejs-ready", onReadyForRef);
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
  }, [refreshControls]);



  const handleRomChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) { loadRom(file); setEmuKey(k => k + 1); setEjsReady(false); setControls(DEFAULT_CONTROLS); }
    e.target.value = "";
  }, [loadRom]);

  const handleBiosChange = (e) => {
    const file = e.target.files[0];
    if (file) { setBiosFile(file); setEmuKey(k => k + 1); }
    e.target.value = "";
  };

  // Resolve display core — gambatte covers gb + gbc
  const displayCore = coreType === "gb" || coreType === "gbc" ? "gambatte" : coreType;
  const coreInfo = CORE_INFO[displayCore] || CORE_INFO[coreType] || CORE_INFO.gba;

  if (!romFile) {
    return (
      <div className="min-h-screen bg-[#0A0A0C]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
          <div className="w-16 h-16 bg-gray-800/60 border border-white/5 rounded-2xl flex items-center justify-center mb-6">
            <Gamepad2 className="w-8 h-8 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "Outfit" }}>No ROM Loaded</h2>
          <p className="text-gray-500 mb-8 text-center max-w-xs">
            Upload a .gb, .gbc, or .gba ROM file to start playing in your browser
          </p>
          <input ref={romRef} type="file" accept=".gb,.gbc,.gba" className="hidden" onChange={handleRomChange} />
          <button
            onClick={() => romRef.current?.click()}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            <Upload className="w-5 h-5" /> Load ROM File
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Emulator Panel */}
          <div className="flex-1 min-w-0">
            <div className="bg-black border border-[#27272A] hover:border-emerald-500/30 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.04)] transition-colors duration-300">
              <Emulator key={emuKey} romFile={romFile} biosFile={biosFile} />
            </div>
            <div className="flex items-center justify-between mt-3 px-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <span className="text-white font-medium text-sm truncate">{gameTitle}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs font-mono font-bold ${coreInfo.color}`}>{coreType.toUpperCase()}</span>
                <span className="text-xs text-gray-600 font-mono bg-gray-800 border border-gray-700 px-2 py-0.5 rounded">EmulatorJS</span>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:w-72 space-y-4">

            {/* Actions */}
            <div className="bg-[#141417] border border-white/5 rounded-xl p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">Actions</p>
              <div className="space-y-2">
                <input ref={romRef} type="file" accept=".gb,.gbc,.gba" className="hidden" onChange={handleRomChange} />
                <button
                  onClick={() => romRef.current?.click()}
                  className="w-full flex items-center gap-2 bg-transparent border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white text-sm px-3 py-2.5 rounded-lg transition-colors"
                >
                  <FileUp className="w-4 h-4" /> Change ROM
                </button>

                {coreType === "gba" && (
                  <>
                    <input ref={biosRef} type="file" accept=".bin" className="hidden" onChange={handleBiosChange} />
                    <button
                      onClick={() => biosRef.current?.click()}
                      className="w-full flex items-center gap-2 bg-transparent border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white text-sm px-3 py-2.5 rounded-lg transition-colors"
                    >
                      <Cpu className="w-4 h-4" />
                      {biosFile ? `BIOS: ${biosFile.name}` : "Load GBA BIOS (optional)"}
                    </button>
                  </>
                )}

                <button
                  onClick={() => navigate("/nuzlocke")}
                  className="w-full flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 text-sm px-3 py-2.5 rounded-lg transition-colors"
                >
                  <Trophy className="w-4 h-4" /> Nuzlocke Tracker
                </button>
              </div>
            </div>

            {/* Controls — updates when user remaps in EmulatorJS */}
            <div className="bg-[#141417] border border-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-600">Controls</p>
                {ejsReady && (
                  <button
                    onClick={refreshControls}
                    title="Refresh controls"
                    className="text-gray-700 hover:text-gray-400 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="space-y-1.5">
                {controls.map(({ key, action }) => (
                  <div key={action} className="flex items-center justify-between">
                    <span className="font-mono text-xs bg-gray-900 border border-gray-700 px-2 py-0.5 rounded text-gray-300">
                      {key}
                    </span>
                    <span className="text-gray-500 text-xs">{action}</span>
                  </div>
                ))}
              </div>
              {ejsReady && (
                <p className="text-gray-700 text-[10px] mt-2 leading-relaxed">
                  Remap in emulator Settings → Controls. Panel updates automatically.
                </p>
              )}
            </div>

            {/* Platform info */}
            <div className="bg-[#141417] border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Info className="w-3.5 h-3.5 text-gray-600" />
                <p className="text-xs font-bold uppercase tracking-widest text-gray-600">Platform</p>
              </div>
              <p className={`font-semibold text-sm ${coreInfo.color}`}>{coreInfo.label}</p>
              <p className="text-gray-600 text-xs mt-0.5 font-mono">{coreInfo.specs}</p>

              {coreType === "gba" && !biosFile && (
                <div className="mt-3 p-2.5 bg-emerald-500/5 border border-emerald-500/15 rounded-lg">
                  <p className="text-emerald-600 text-[11px] leading-relaxed">
                    GBA BIOS auto-loaded for best compatibility.
                  </p>
                </div>
              )}

              {(coreType === "gbc" || coreType === "gb") && (
                <div className="mt-3 p-2.5 bg-blue-500/5 border border-blue-500/15 rounded-lg">
                  <p className="text-blue-400 text-[11px] leading-relaxed">
                    Using Gambatte core — best accuracy for GB & GBC.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
