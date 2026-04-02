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
    let core = "mgba";
    if (ext === "gbc" || ext === "gb") core = "gambatte";

    setRomFile(file);
    setCoreType(core);
    setGameTitle(file.name.replace(/\.[^.]+$/, "").replace(/[_-]/g, " "));
  };

  return (
    <EmuContext.Provider value={{ romFile, biosFile, setBiosFile, gameTitle, coreType, loadRom }}>
      {/* Use the Mudkip Navy background across all pages */}
      <div className="App bg-[#0a1628] min-h-screen text-white">
        <BrowserRouter>
          <Navbar />
          {/* Main content container with padding to prevent Navbar overlap */}
          <main className="pt-4">
            <Routes>
              <Route path="/"            element={<Navigate to="/play" replace />} />
              <Route path="/play"        element={<PlayPage />} />
              <Route path="/library"     element={<LibraryPage />} />
