import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Gamepad2, FileUp, Play, Settings, X } from "lucide-react";
import Emulator from "./Emulator";
import { useEmu } from "../App";

// Only keeping the Auto-Fire toggle hotkey
const DEFAULT_HOTKEYS = {
  autoFireToggle: "KeyP" 
};

// Auto-fire defaults to 'E'
const DEFAULT_AUTOFIRE_TARGET = { key: "e", code: "KeyE", keyCode: 69 };

export default function PlayPage() {
  const navigate = useNavigate();
  const { romFile, biosFile, setBiosFile, gameTitle, coreType, loadRom } = useEmu();
  const [emuKey, setEmuKey] = useState(0);
  
  const [hotkeys, setHotkeys] = useState(() => {
    try {
      const stored = localStorage.getItem("emu_hotkeys");
      return stored ? JSON.parse(stored) : DEFAULT_HOTKEYS;
    } catch {
      return DEFAULT_HOTKEYS;
    }
  });

  const [autoFireTarget, setAutoFireTarget] = useState(() => {
    try {
      const stored = localStorage.getItem("emu_autofire_target");
      return stored ? JSON.parse(stored) : DEFAULT_AUTOFIRE_TARGET;
    } catch {
      return DEFAULT_AUTOFIRE_TARGET;
    }
  });
  
  const [showSettings, setShowSettings] = useState(false);
  const [listeningFor, setListeningFor] = useState(null); 
  const [isAutoFiring, setIsAutoFiring] = useState(false);
  
  const romRef = useRef(null);
  const autoFireInterval = useRef(null);

  // --- WASM-BYPASS MACRO ENGINE (Auto-Fire Only) ---
  const commands = useMemo(() => {
    const dispatchWasmKey = (type, keyCode, code, key) => {
      const canvas = document.querySelector("canvas");
      // Must focus the canvas or the emulator ignores the input!
      if (canvas) canvas.focus(); 
      
      const target = canvas || document.body;
      const event = new KeyboardEvent(type, { key, code, bubbles: true, cancelable: true, composed: true });
      
      Object.defineProperty(event, 'keyCode', { get: () => keyCode });
      Object.defineProperty(event, 'which', { get: () => keyCode });
      
      target.dispatchEvent(event);
      window.dispatchEvent(event);
    };

    const triggerClick = (keyCode, code, key) => {
      dispatchWasmKey("keydown", keyCode, code, key);
      setTimeout(() => dispatchWasmKey("keyup", keyCode, code, key), 80); 
    };

    return {
      autoFireToggle: () => {
        if (autoFireInterval.current) {
          clearInterval(autoFireInterval.current);
          autoFireInterval.current = null;
          setIsAutoFiring(false);
          dispatchWasmKey("keyup", autoFireTarget.keyCode, autoFireTarget.code, autoFireTarget.key);
        } else {
          setIsAutoFiring(true);
          autoFireInterval.current = setInterval(() => {
            triggerClick(autoFireTarget.keyCode, autoFireTarget.code, autoFireTarget.key);
          }, 50);
        }
      }
    };
  }, [autoFireTarget]); 

  // --- GLOBAL HOTKEY LISTENER ---
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (!e.isTrusted) return; 
      if (e.target.tagName === "INPUT" || listeningFor) return; 

      Object.entries(hotkeys).forEach(([action, code]) => {
        if (e.code === code) {
          e.preventDefault();
          if (commands[action]) commands[action]();
        }
      });
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [hotkeys, listeningFor, commands]);

  // --- SETTINGS REMAPPING LOGIC ---
  useEffect(() => {
    if (!listeningFor) return;

    const handleRemap = (e) => {
      e.preventDefault();
      
      if (listeningFor === "autoFireTarget") {
        const newTarget = { key: e.key, code: e.code, keyCode: e.keyCode };
        setAutoFireTarget(newTarget);
        localStorage.setItem("emu_autofire_target", JSON.stringify(newTarget));
      } else {
        const newHotkeys = { ...hotkeys, [listeningFor]: e.code };
        setHotkeys(newHotkeys);
        localStorage.setItem("emu_hotkeys", JSON.stringify(newHotkeys));
      }
      setListeningFor(null);
    };

    window.addEventListener("keydown", handleRemap);
    return () => window.removeEventListener("keydown", handleRemap);
  }, [listeningFor, hotkeys]);

  const handleRomChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (window.EJS_emulator) {
        try {
          if (window.EJS_emulator.gameManager) window.EJS_emulator.gameManager.pause();
          if (window.EJS_emulator.audioContext) window.EJS_emulator.audioContext.suspend();
        } catch (err) {}
      }
      const container = document.getElementById("game");
      if (container) container.innerHTML = "";

      loadRom(file);
      setEmuKey((k) => k + 1);
    }
    if (e.target) e.target.value = "";
  }, [loadRom]);

  if (!romFile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="w-16 h-16 bg-[#16161A] border border-white/5 rounded-2xl flex items-center justify-center mb-6">
          <Gamepad2 className="w-8 h-8 text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No ROM Loaded</h2>
        <p className="text-gray-500 mb-8 text-center">Upload a .gb, .gbc, or .gba ROM file</p>
        <input ref={romRef} type="file" accept=".gb,.gbc,.gba,.zip" className="hidden" onChange={handleRomChange} />
        <button onClick={() => romRef.current?.click()} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold transition-all">
          <Upload className="w-5 h-5" /> Load ROM File
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-2">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-[#16161A] border border-white/5 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <h1 className="font-black text-white uppercase tracking-widest truncate max-w-[200px] sm:max-w-md">{gameTitle}</h1>
          <span className="hidden sm:inline text-xs bg-gray-800 text-emerald-400 px-2 py-1 rounded font-mono font-bold">{coreType.toUpperCase()}</span>
        </div>
        <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content: Emulator & Sidebar */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        
        {/* Emulator Canvas */}
        <div className="flex-1 bg-black border border-[#27272A] rounded-xl overflow-hidden shadow-2xl relative flex justify-center min-h-[300px]">
          <Emulator key={emuKey} romFile={romFile} biosFile={biosFile} />
        </div>

        {/* Side Panel Controls */}
        <div className="flex flex-row md:flex-col gap-2 shrink-0 md:w-32">
          <button onClick={commands.autoFireToggle} className={`flex-1 flex flex-col items-center justify-center gap-2 border p-4 sm:p-6 rounded-xl transition-all group ${isAutoFiring ? "bg-red-500/20 border-red-500/50" : "bg-[#16161A] hover:bg-white/5 border-white/5"}`}>
            <Play className={`w-8 h-8 ${isAutoFiring ? "text-red-400 animate-pulse" : "text-red-500 group-hover:scale-110 transition-transform"}`} />
            <span className="text-sm font-bold text-gray-300 uppercase tracking-wider">Auto-Fire</span>
            <span className="text-[10px] font-mono text-gray-500">[{hotkeys.autoFireToggle}]</span>
          </button>
        </div>

      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-[#16161A] border border-white/10 w-full max-w-md rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white uppercase tracking-widest">HUD Settings</h2>
              <button onClick={() => { setShowSettings(false); setListeningFor(null); }} className="p-2 bg-white/5 rounded-full hover:bg-white/10"><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="space-y-2 mb-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2 mb-3">Auto-Fire Trigger</h3>
              
              {Object.keys(DEFAULT_HOTKEYS).map((action) => (
                <div key={action} className="flex items-center justify-between bg-[#0D0D10] border border-white/5 p-3 rounded-xl">
                  <span className="text-sm font-bold text-gray-300 capitalize">{action.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <button 
                    onClick={() => setListeningFor(action)}
                    className={`px-4 py-1.5 rounded font-mono text-xs font-bold transition-all ${listeningFor === action ? "bg-emerald-500 text-white animate-pulse" : "bg-gray-800 text-gray-400 hover:text-white"}`}
                  >
                    {listeningFor === action ? "Press any key..." : hotkeys[action]}
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2 mb-3">Target Button</h3>
              <p className="text-[10px] text-gray-500 italic mb-2">This is the key Auto-Fire will mash. Currently defaults to 'E' (your 'A' button).</p>
              
              <div className="flex items-center justify-between bg-[#0D0D10] border border-white/5 p-3 rounded-xl">
                <span className="text-sm font-bold text-gray-300">Spammed Key</span>
                <button 
                  onClick={() => setListeningFor("autoFireTarget")}
                  className={`px-4 py-1.5 rounded font-mono text-xs font-bold transition-all ${listeningFor === "autoFireTarget" ? "bg-red-500 text-white animate-pulse" : "bg-gray-800 text-red-400 hover:text-white border border-red-500/20"}`}
                >
                  {listeningFor === "autoFireTarget" ? "Press target key..." : autoFireTarget.code}
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
               <input ref={romRef} type="file" accept=".gb,.gbc,.gba,.zip" className="hidden" onChange={handleRomChange} />
               <button onClick={() => romRef.current?.click()} className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-colors">
                 <FileUp className="w-5 h-5" /> Change ROM File
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
