import { useState, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "@/App.css";
import PlayPage from "./components/PlayPage";
import NuzlockeList from "./components/NuzlockeList";
import NuzlockeRunPage from "./components/NuzlockeRunPage";
import LibraryPage from "./components/LibraryPage";
import BossGuide from "./components/BossGuide";
import RouteBrowser from "./components/RouteBrowser";
import PokedexBrowser from "./components/PokedexBrowser";
import TypeCoverageMap from "./components/TypeCoverageMap";
import Navbar from "./components/Navbar";

export const EmuContext = createContext(null);
export function useEmu() { return useContext(EmuContext); }

function App() {
  const [romFile, setRomFile] = useState(null);
  const [biosFile, setBiosFile] = useState(null);
  const [gameTitle, setGameTitle] = useState("");
  const [coreType, setCoreType] = useState("mgba");

  const loadRom = (file) => {
    const ext = file.name.toLowerCase().split(".").pop();
    const core = (ext === "gbc" || ext === "gb") ? "gambatte" : "mgba";
    
    setRomFile(file);
    setCoreType(core);
    setGameTitle(file.name.replace(/\.[^.]+$/, "").replace(/[_-]/g, " "));

    try {
      const stored = JSON.parse(localStorage.getItem("recent_roms") || "[]");
      const existing = stored.find((r) => r.name === file.name);
      const entry = {
        name: file.name,
        size: file.size,
        lastPlayed: Date.now(),
        core,
        playCount: existing ? (existing.playCount || 1) + 1 : 1,
      };
      const filtered = stored.filter((r) => r.name !== file.name);
      localStorage.setItem("recent_roms", JSON.stringify([entry, ...filtered].slice(0, 10)));
    } catch (_) {}
  };

  return (
    <EmuContext.Provider value={{ romFile, biosFile, setBiosFile, gameTitle, coreType, loadRom }}>
      <div className="App min-h-screen bg-[#0A0A0C] text-white">
        <BrowserRouter>
          <Navbar />
          {/* pt-6 ensures content isn't hidden under the sticky navbar */}
          <main className="pt-6 pb-12">
            <Routes>
              <Route path="/"            element={<Navigate to="/play" replace />} />
              <Route path="/play"        element={<PlayPage />} />
              <Route path="/library"     element={<LibraryPage />} />
              <Route path="/nuzlocke"    element={<NuzlockeList />} />
              <Route path="/nuzlocke/:runId" element={<NuzlockeRunPage />} />
              <Route path="/bosses"      element={<BossGuide />} />
              <Route path="/routes"      element={<RouteBrowser />} />
              <Route path="/pokedex"     element={<PokedexBrowser />} />
              <Route path="/coverage"    element={<TypeCoverageMap />} />
            </Routes>
          </main>
        </BrowserRouter>
      </div>
    </EmuContext.Provider>
  );
}

export default App;
