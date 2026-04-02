import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Gamepad2, FileUp, Save, Download, FastForward, Play, Settings, X, Menu } from "lucide-react";
import Emulator from "./Emulator";
import { useEmu } from "../App";

const DEFAULT_HOTKEYS = {
  quickSave: "F1",
  quickLoad: "F2",
  fastForward: "Space",
  autoFireA: "KeyP" 
};

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
  
  const [showSettings, setShowSettings] = useState(false);
  const [listeningFor, setListeningFor] = useState(null); 
  const [isFastForwarding, setIsFastForwarding] = useState(false);
  const [autoFireA, setAutoFireA] = useState(false);
  
  const romRef = useRef(null);
  const autoFireInterval = useRef(null);

  // --- AGGRESSIVE MACRO COMMANDS ---
  const commands = useMemo(() => {
    // This function acts like a ghost pressing the physical keyboard on the exact game screen
    const triggerKey = (keyCode, code, key) => {
      const payload = { key, code, keyCode, which: keyCode, charCode: keyCode, bubbles: true, composed: true };
      const eventDown = new KeyboardEvent("keydown", payload);
      const eventUp = new KeyboardEvent("keyup", payload);
      
      const canvas = document.querySelector("canvas");
      const target = canvas || document; // Fallback to document if canvas isn't found
      
      target.dispatchEvent(eventDown);
      window.dispatchEvent(eventDown);
      
      setTimeout(() => {
        target.dispatchEvent(eventUp);
        window.dispatchEvent(eventUp);
      }, 50);
    };

    return {
      quickSave: () => triggerKey(113, "F2", "F2"), // F2 is standard for Savestate Slot 1
      quickLoad: () => triggerKey(115, "F4", "F4"), // F4 is standard for Loadstate Slot 1
      openMenu: () => triggerKey(112, "F1", "F1"),  // F1 opens the core emulator settings
      fastForward: () => {
        triggerKey(32, "Space", " "); 
        setIsFastForwarding((prev) => !prev);
      },
      autoFireA: () => {
        if (autoFireInterval.current) {
          clearInterval(autoFireInterval.current);
          autoFireInterval.current = null;
          setAutoFireA(false);
        } else {
          setAutoFireA(true);
          autoFireInterval.current = setInterval(() => {
            // Fires both X and Z to guarantee it hits the 'A' button across different console cores
            triggerKey(88, "KeyX", "x"); 
            triggerKey(90, "KeyZ", "z"); 
          }, 50);
        }
      }
    };
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (!e.isTrusted) return; // Prevent infinite loop from our own macros
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

  useEffect(() => {
    if (!listeningFor) return;

    const handleRemap = (e) => {
      e.preventDefault();
      const newHotkeys = { ...hotkeys, [listeningFor]: e.code };
      setHotkeys(newHotkeys);
      localStorage.setItem("emu_hotkeys", JSON.stringify(newHotkeys));
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
      
      <div className="flex items-center justify-between bg-[#16161A] border border-white/5 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <h1 className="font-black text-white uppercase tracking-widest">{gameTitle}</h1>
          <span className="text-xs bg-gray-800 text-emerald-400 px-2 py-1 rounded font-mono font-bold">{coreType.toUpperCase()}</span>
        </div>
        <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-black border border-[#27272A] rounded-xl overflow-hidden mb-4 shadow-2xl relative">
        <Emulator key={emuKey} romFile={romFile} biosFile={biosFile} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <button onClick={commands.quickSave} className="flex flex-col items-center justify-center gap-1 bg-[#16161A] hover:bg-white/5 border border-white/5 p-3 rounded-xl transition-colors group">
          <Save className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Save State</span>
          <span className="text-[9px] font-mono text-gray-600">[{hotkeys.quickSave}]</span>
        </button>

        <button onClick={commands.quickLoad} className="flex flex-col items-center justify-center gap-1 bg-[#16161A] hover:bg-white/5 border border-white/5 p-3 rounded-xl transition-colors group">
          <Download className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Load State</span>
          <span className="text-[9px] font-mono text-gray-600">[{hotkeys.quickLoad}]</span>
        </button>

        <button onClick={commands.fastForward} className={`flex flex-col items-center justify-center gap-1 border p-3 rounded-xl transition-all group ${isFastForwarding ? "bg-yellow-500/20 border-yellow-500/50" : "bg-[#16161A] hover:bg-white/5 border-white/5"}`}>
          <FastForward className={`w-5 h-5 ${isFastForwarding ? "text-yellow-400 animate-pulse" : "text-yellow-500 group-hover:scale-110 transition-transform"}`} />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Speed</span>
          <span className="text-[9px] font-mono text-gray-600">[{hotkeys.fastForward}]</span>
        </button>

        <button onClick={commands.autoFireA} className={`flex flex-col items-center justify-center gap-1 border p-3 rounded-xl transition-all group ${autoFireA ? "bg-red-500/20 border-red-500/50" : "bg-[#16161A] hover:bg-white/5 border-white/5"}`}>
          <Play className={`w-5 h-5 ${autoFireA ? "text-red-400 animate-pulse" : "text-red-500 group-hover:scale-110 transition-transform"}`} />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Auto-Fire A</span>
          <span className="text-[9px] font-mono text-gray-600">[{hotkeys.autoFireA}]</span>
        </button>

        <button onClick={commands.openMenu} className="flex flex-col items-center justify-center gap-1 bg-[#16161A] hover:bg-white/5 border border-white/5 p-3 rounded-xl transition-colors group col-span-2 md:col-span-1">
          <Menu className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Emu Menu</span>
          <span className="text-[9px] font-mono text-gray-600">Export .SAV File</span>
        </button>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-[#16161A] border border-white/10 w-full max-w-md rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white uppercase tracking-widest">HUD Settings</h2>
              <button onClick={() => { setShowSettings(false); setListeningFor(null); }} className="p-2 bg-white/5 rounded-full hover:bg-white/10"><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">HUD Hotkeys</h3>
              <p className="text-[10px] text-gray-500 italic mb-2">Use the "Emu Menu" button to change actual controller/keyboard inputs.</p>
              
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
