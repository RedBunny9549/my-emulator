import { useState, useEffect } from "react";
import { Play, Trash2, Library, Clock } from "lucide-react";
import { useEmu } from "../App";
import { useNavigate } from "react-router-dom";

export default function LibraryPage() {
  const [history, setHistory] = useState([]);
  const { loadRom } = useEmu();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("recent_roms") || "[]");
      setHistory(stored);
    } catch (_) {}
  }, []);

  const handlePlay = async (entry) => {
    // Note: This relies on the browser caching the file via the File System Access API
    // or requires the user to re-upload. In a typical pure-frontend web emulator,
    // storing the actual ROM binary in localStorage is often impossible due to size limits.
    // This assumes your loadRom handles file objects. 
    alert("Please re-upload the ROM file to play. Browser security prevents storing large binaries permanently.");
  };

  const removeEntry = (name) => {
    const updated = history.filter(r => r.name !== name);
    localStorage.setItem("recent_roms", JSON.stringify(updated));
    setHistory(updated);
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
          <Library className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Rom Library</h1>
          <p className="text-gray-500 text-sm">Your recently played games</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="bg-[#16161A] border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center">
          <Library className="w-12 h-12 text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No games yet</h3>
          <p className="text-gray-500 mb-6">Load a ROM in the Play tab to see it here.</p>
          <button onClick={() => navigate("/play")} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold">Go to Play</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((entry, idx) => (
            <div key={idx} className="bg-[#16161A] border border-white/5 p-5 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center font-bold text-gray-500">
                  {entry.core === 'gba' ? 'GBA' : 'GB'}
                </div>
                <div>
                  <p className="font-bold text-white truncate max-w-[200px]">{entry.name}</p>
                  <div className="flex gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(entry.lastPlayed).toLocaleDateString()}</span>
                    <span>{(entry.size / 1024 / 1024).toFixed(1)} MB</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handlePlay(entry)} className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20"><Play className="w-4 h-4" /></button>
                <button onClick={() => removeEntry(entry.name)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
