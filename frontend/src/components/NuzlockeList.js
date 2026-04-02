import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Plus, ChevronRight, Loader2, AlertTriangle } from "lucide-react";
import axios from "axios";

export default function NuzlockeList() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  // FIX: Wrapped fetchRuns in useCallback to satisfy ESLint dependency rules
  const fetchRuns = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/nuzlocke/runs`);
      setRuns(res.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Could not connect to Nuzlocke Tracker database. Please check your backend CORS settings.");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // FIX: Added fetchRuns to the dependency array
  useEffect(() => {
    fetchRuns();
  }, [fetchRuns]);

  const createRun = async () => {
    try {
      setIsCreating(true);
      const res = await axios.post(`${API_URL}/api/nuzlocke/runs`, {
        game: "emerald",
        name: `New Run ${new Date().toLocaleDateString()}`
      });
      if (res.data && res.data.id) {
        navigate(`/nuzlocke/${res.data.id}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create run.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Nuzlocke Tracker</h1>
            <p className="text-gray-500 text-sm">Manage your active runs</p>
          </div>
        </div>
        <button 
          onClick={createRun} 
          disabled={isCreating}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50"
        >
          {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          New Run
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 mb-6">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
      ) : runs.length === 0 && !error ? (
        <div className="bg-[#16161A] border border-white/5 rounded-3xl p-12 text-center">
          <p className="text-gray-500 mb-4">You don't have any active Nuzlocke runs.</p>
          <button onClick={createRun} className="text-emerald-400 font-bold hover:underline">Start your first run</button>
        </div>
      ) : (
        <div className="grid gap-3">
          {runs.map(run => (
            <button 
              key={run.id} 
              onClick={() => navigate(`/nuzlocke/${run.id}`)}
              className="bg-[#16161A] border border-white/5 p-5 rounded-2xl flex items-center justify-between hover:border-emerald-500/30 transition-all text-left"
            >
              <div>
                <h3 className="text-lg font-bold text-white capitalize">{run.name || 'Unnamed Run'}</h3>
                <p className="text-sm text-gray-500 capitalize">{run.game || 'Unknown Game'}</p>
              </div>
              <ChevronRight className="text-gray-600" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
