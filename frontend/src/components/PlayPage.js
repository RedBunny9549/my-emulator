import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Cpu, Gamepad2, FileUp, RefreshCw, Save, Download, FastForward, Play, Settings, X, HardDrive } from "lucide-react";
import Emulator from "./Emulator";
import { useEmu } from "../App";

// Default Hotkeys (Uses standard KeyboardEvent.code)
const DEFAULT_HOTKEYS = {
  quickSave: "F1",
  quickLoad: "F2",
  fastForward: "Space",
  autoFireA: "KeyP" // Example: P key for Auto-fire
};

export default function PlayPage() {
  const navigate = useNavigate();
  const { romFile, biosFile, setBiosFile, gameTitle, coreType, loadRom } = useEmu();
  const [emuKey, setEmuKey] = useState(0);
  
  // HUD & Hotkey State
  const [hotkeys, setHotkeys] = useState(() => JSON.parse(localStorage.getItem("emu_hotkeys")) || DEFAULT_HOTKEYS);
  const [showSettings, setShowSettings] = useState(false);
  const [listeningFor, setListeningFor] = useState(null); // Which key is currently being remapped
  const [isFastForwarding, setIsFastForwarding] = useState(false);
  const [autoFireA, setAutoFireA] = useState(false);
  
  const romRef = useRef(null);
  const biosRef = useRef(null);
  const autoFireInterval = useRef(null);

  // --- EMULATOR COMMANDS ---
  const commands = {
    quickSave: () => window.EJS_emulator?.gameManager?.quickSave(),
    quickLoad: () => window.EJS_emulator?.gameManager?.quickLoad(),
    fastForward: () => {
      window.EJS_emulator?.gameManager?.fastForward();
      setIsFastForwarding(prev => !prev);
    },
    exportSav: () => {
      // Reaches into EmulatorJS to trigger the actual .sav file download
      if (window.EJS_emulator?.gameManager) {
         window.EJS_emulator.gameManager.exportSavegames();
      } else {
         alert("Game must be running to export a save.");
      }
    },
    autoFireA: () => {
      if (autoFireInterval.current) {
        clearInterval(autoFireInterval.current);
        autoFireInterval.current = null;
        setAutoFireA(false);
      } else {
        setAutoFireA(true);
        // Fires the 'Z' key (EmulatorJS default A button) every 50ms
        autoFireInterval.current = setInterval(() => {
          document.dispatchEvent(new KeyboardEvent('keydown', { key: "z", keyCode: 90, code: 'KeyZ', bubbles: true }));
          setTimeout(() => document.dispatchEvent(new KeyboardEvent('keyup', { key: "z", keyCode: 90, code: 'KeyZ', bubbles: true })), 25);
        }, 50);
      }
    }
  };

  // --- GLOBAL HOTKEY LISTENER ---
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Ignore if typing in an input or remapping
      if (e.target.tagName === "INPUT" || listeningFor) return; 

      // Check if pressed key matches any of our hotkeys
      Object.entries(hotkeys).forEach(([action, code]) => {
        if (e.code === code) {
          e.preventDefault(); // Stop page scrolling (like spacebar)
          if (commands[action]) commands[action]();
        }
      });
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [hotkeys, listeningFor, commands]);

  // --- REMAPPING LOGIC ---
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
      setEmuKey(k => k + 1);
    }
    e.target.value = "";
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
      
      {/* Top Bar: Title & Settings Button */}
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

      {/* Emulator Canvas */}
      <div className="bg-black border border-[#27272A] rounded-xl overflow-hidden mb-4 shadow-2xl relative">
        <Emulator key={emuKey} romFile={romFile} biosFile={biosFile} />
      </div>

      {/* Custom mGBA-Style Command Bar */}
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

        <button onClick={commands.exportSav} className="flex flex-col items-center justify-center gap-1 bg-[#16161A] hover:bg-white/5 border border-white/5 p-3 rounded-xl transition-colors group col-span-2 md:col-span-1">
          <HardDrive className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Export .SAV</span>
          <span className="text-[9px] font-mono text-gray-600">Disk Save</span>
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-[#16161A] border border-white/10 w-full max-w-md rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white uppercase tracking-widest">Emulator Settings</h2>
              <button onClick={() => { setShowSettings(false); setListeningFor(null); }} className="p-2 bg-white/5 rounded-full hover:bg-white/10"><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Custom Hotkeys</h3>
              
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
