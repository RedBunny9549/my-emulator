import { useState, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/App.css";
import HomePage from "./components/HomePage";
import PlayPage from "./components/PlayPage";
import NuzlockeList from "./components/NuzlockeList";
import NuzlockeRunPage from "./components/NuzlockeRunPage";
import LibraryPage from "./components/LibraryPage";

export const EmuContext = createContext(null);

export function useEmu() {
  return useContext(EmuContext);
}

function App() {
  const [romFile, setRomFile] = useState(null);
  const [biosFile, setBiosFile] = useState(null);
  const [gameTitle, setGameTitle] = useState("");
  const [coreType, setCoreType] = useState("gba");

  const loadRom = (file) => {
    const ext = file.name.toLowerCase().split(".").pop();
    const core = ext === "gba" ? "gba" : ext === "gbc" ? "gbc" : "gb";
    setRomFile(file);
    setCoreType(core);
    setGameTitle(file.name.replace(/\.[^.]+$/, "").replace(/[_-]/g, " "));
    // Update play library in localStorage
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
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/play" element={<PlayPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/nuzlocke" element={<NuzlockeList />} />
            <Route path="/nuzlocke/:runId" element={<NuzlockeRunPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </EmuContext.Provider>
  );
}

export default App;
