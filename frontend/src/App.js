import { useState, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "@/App.css";
import PlayPage from "./components/PlayPage";
import BossGuide from "./components/BossGuide";
import RouteBrowser from "./components/RouteBrowser";
import PokedexBrowser from "./components/PokedexBrowser";
import TypeCoverageMap from "./components/TypeCoverageMap";
import DatabaseBrowser from "./components/DatabaseBrowser";
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
    let core = "snes";
    if (ext === "gbc" || ext === "gb") core = "gambatte";
    else if (ext === "gba") core = "gba";
    else if (["sfc","smc","fig","snes","bs"].includes(ext)) core = "snes";
    else if (["nes","fds","unif","unf"].includes(ext)) core = "nes";
    else if (["md","smd","gen","bin"].includes(ext)) core = "segaMD";
    else if (["zip","7z"].includes(ext)) core = "snes";
    setRomFile(file);
    setCoreType(core);
    setGameTitle(file.name.replace(/\.[^.]+$/, "").replace(/[_-]/g, " "));
  };

  return (
    <EmuContext.Provider value={{ romFile, biosFile, setBiosFile, gameTitle, coreType, setCoreType, loadRom }}>
      <div className="App min-h-screen bg-[#0A0A0C] text-white">
        <BrowserRouter>
          <Navbar />
          <main className="pt-6 pb-12">
            <Routes>
              <Route path="/"            element={<Navigate to="/play" replace />} />
              <Route path="/play"        element={<PlayPage />} />
              <Route path="/bosses"      element={<BossGuide />} />
              <Route path="/routes"      element={<RouteBrowser />} />
              <Route path="/pokedex"     element={<PokedexBrowser />} />
              <Route path="/coverage"    element={<TypeCoverageMap />} />
              <Route path="/database"    element={<DatabaseBrowser />} />
              
              {/* Catch-all */}
              <Route path="*"            element={<Navigate to="/play" replace />} />
            </Routes>
          </main>
        </BrowserRouter>
      </div>
    </EmuContext.Provider>
  );
}

export default App;
