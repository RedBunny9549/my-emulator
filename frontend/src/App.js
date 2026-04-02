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
    let core = (ext === "gbc" || ext === "gb") ? "gambatte" : "mgba";
    setRomFile(file);
    setCoreType(core);
    setGameTitle(file.name.replace(/\.[^.]+$/, "").replace(/[_-]/g, " "));
  };

  return (
    <EmuContext.Provider value={{ romFile, biosFile, setBiosFile, gameTitle, coreType, loadRom }}>
      {/* Classic Dark/Emerald UI Wrapper */}
      <div className="App bg-[#0D0D10] min-h-screen text-white">
        <BrowserRouter>
          <Navbar />
          {/* Padding-top ensures Navbar (h-12) doesn't overlap content */}
          <main className="pt-12">
            <Routes>
              <Route path="/" element={<Navigate to="/play" replace />} />
              <Route path="/play" element={<PlayPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/nuzlocke" element={<NuzlockeList />} />
              <Route path="/nuzlocke/:runId" element={<NuzlockeRunPage />} />
              <Route path="/bosses" element={<BossGuide />} />
              <Route path="/routes" element={<RouteBrowser />} />
              <Route path="/pokedex" element={<PokedexBrowser />} />
              <Route path="/coverage" element={<TypeCoverageMap />} />
            </Routes>
          </main>
        </BrowserRouter>
      </div>
    </EmuContext.Provider>
  );
}

export default App;
