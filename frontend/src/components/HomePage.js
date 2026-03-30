import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Gamepad2, Trophy, ArrowRight, Zap, Cpu, Monitor } from "lucide-react";
import Navbar from "./Navbar";
import { useEmu } from "../App";

const PLATFORMS = [
  {
    short: "GB",
    name: "Game Boy",
    year: "1989",
    ext: ".gb",
    color: "#4ADE80",
    desc: "Original 8-bit monochrome classic. Sharp LR35902 CPU at 4.19 MHz.",
  },
  {
    short: "GBC",
    name: "Game Boy Color",
    year: "1998",
    ext: ".gbc",
    color: "#60A5FA",
    desc: "Color display with enhanced processor. Backwards compatible with GB.",
  },
  {
    short: "GBA",
    name: "Game Boy Advance",
    year: "2001",
    ext: ".gba",
    color: "#F472B6",
    desc: "ARM7TDMI CPU, 32-bit, 240×160 resolution. Radical Red, Emerald & more.",
  },
];

const FEATURES = [
  { icon: Zap, title: "Instant Play", desc: "Drop a ROM and play immediately — no installs or plugins needed." },
  { icon: Cpu, title: "Cycle-Accurate", desc: "EmulatorJS mGBA core for accurate GBA emulation with save states." },
  { icon: Trophy, title: "Nuzlocke Tracker", desc: "Built-in run tracker. Log encounters, party HP, and manage entire runs." },
  { icon: Monitor, title: "Full Screen", desc: "Expand to full screen, remap controls, adjust volume." },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { loadRom } = useEmu();
  const fileRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(
    (file) => {
      if (!file) return;
      const ext = file.name.toLowerCase().split(".").pop();
      if (!["gb", "gbc", "gba"].includes(ext)) {
        alert("Please upload a .gb, .gbc, or .gba ROM file");
        return;
      }
      loadRom(file);
      try {
        const recent = JSON.parse(localStorage.getItem("recent_roms") || "[]");
        const entry = { name: file.name, size: file.size, lastPlayed: Date.now(), core: ext };
        const filtered = recent.filter((r) => r.name !== file.name);
        localStorage.setItem("recent_roms", JSON.stringify([entry, ...filtered].slice(0, 5)));
      } catch (_) {}
      navigate("/play");
    },
    [loadRom, navigate]
  );

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C]">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24 px-4">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 15% 60%, rgba(16,185,129,0.09) 0%, transparent 55%), radial-gradient(ellipse at 85% 35%, rgba(225,29,72,0.06) 0%, transparent 55%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-sm font-medium">GB · GBC · GBA — All in your Browser</span>
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-5 tracking-tighter leading-none"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Play Any Game Boy
            <br />
            <span className="text-emerald-400">Game Instantly</span>
          </h1>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Upload a ROM file, play in your browser. Track Nuzlocke runs for Radical Red, Emerald, Crystal, and any GB/GBC/GBA game.
          </p>

          {/* Drop Zone */}
          <div
            data-testid="rom-drop-zone"
            className={`relative border-2 border-dashed rounded-xl p-12 mx-auto max-w-lg cursor-pointer transition-all duration-200 ${
              dragging ? "border-emerald-400 bg-emerald-500/5" : "border-gray-700 hover:border-gray-500 hover:bg-white/[0.015]"
            }`}
            onClick={() => fileRef.current?.click()}
            onDrop={onDrop}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
          >
            <Upload className={`w-10 h-10 mx-auto mb-4 transition-colors ${dragging ? "text-emerald-400" : "text-gray-600"}`} />
            <p className="text-white font-semibold mb-1.5">Drop your ROM file here</p>
            <p className="text-gray-500 text-sm">or click to browse your files</p>
            <div className="flex items-center justify-center gap-2 mt-5">
              {[".gb", ".gbc", ".gba"].map((ext) => (
                <span key={ext} className="px-2.5 py-0.5 bg-gray-800/80 border border-gray-700 rounded text-gray-400 text-xs font-mono">
                  {ext}
                </span>
              ))}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".gb,.gbc,.gba"
              className="hidden"
              data-testid="rom-file-input"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-600 mb-8">
          Supported Platforms
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLATFORMS.map((p) => (
            <div
              key={p.short}
              data-testid={`platform-card-${p.short.toLowerCase()}`}
              className="bg-[#141417] border border-white/5 rounded-xl p-6 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-lg font-black" style={{ color: p.color, fontFamily: "JetBrains Mono, monospace" }}>
                  {p.short}
                </span>
                <span className="text-gray-700 text-xs">{p.year}</span>
              </div>
              <p className="text-white font-semibold text-sm mb-1.5">{p.name}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{p.desc}</p>
              <p className="text-gray-700 font-mono text-xs mt-3">{p.ext}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-600 mb-8">Features</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-[#141417] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors">
              <div className="w-9 h-9 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-3">
                <Icon className="w-4.5 h-4.5 text-emerald-400" size={18} />
              </div>
              <p className="text-white font-semibold text-sm mb-1">{title}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Nuzlocke CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <div className="bg-gradient-to-r from-[#0F1A14] via-[#111A14] to-[#141417] border border-emerald-500/20 rounded-xl p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Trophy className="w-7 h-7 text-emerald-400" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-white font-bold text-xl mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
              Built-in Nuzlocke Tracker
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Log encounters, track party HP, manage full runs. Designed for Radical Red, Emerald, Crystal &amp; any hack.
            </p>
          </div>
          <button
            onClick={() => navigate("/nuzlocke")}
            data-testid="nuzlocke-cta-btn"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all flex-shrink-0"
          >
            Start Tracking <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gamepad2 className="w-4 h-4 text-emerald-400" />
          <span className="text-white font-semibold text-sm" style={{ fontFamily: "Outfit" }}>NuzlockeStudio</span>
        </div>
        <p className="text-gray-700 text-xs">GB · GBC · GBA Emulation + Nuzlocke Tracking</p>
      </footer>
    </div>
  );
}
