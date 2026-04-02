import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, MapPin, Search } from "lucide-react";
import axios from "axios";

export default function NuzlockeRunPage() {
  const { runId } = useParams();
  const navigate = useNavigate();
  const [run, setRun] = useState(null);
  const [encounters, setEncounters] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    async function fetchData() {
      try {
        const runRes = await axios.get(`${API_URL}/api/nuzlocke/runs/${runId}`);
        setRun(runRes.data);
        
        const encRes = await axios.get(`${API_URL}/api/nuzlocke/runs/${runId}/encounters`);
        setEncounters(encRes.data || []);
      } catch (err) {
        console.error("Run not found:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [runId, API_URL]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;
  }

  if (!run) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Run not found</h2>
        <p className="text-gray-500 mb-6">This run may have been deleted or your server restarted.</p>
        <button onClick={() => navigate("/nuzlocke")} className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate("/nuzlocke")} className="p-2 bg-[#16161A] border border-white/5 rounded-xl text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-white capitalize">{run.name}</h1>
          <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest">{run.game}</p>
        </div>
      </div>

      <div className="bg-[#16161A] border border-white/5 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><MapPin className="text-emerald-500 w-5 h-5"/> Encounters</h2>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Add Encounter</button>
        </div>
        
        {encounters.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-white/10 rounded-2xl">
            <Search className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No encounters logged yet.</p>
            <p className="text-xs text-gray-600 mt-1">Catch your first Pokémon to start tracking!</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {/* Encounter mapping goes here */}
          </div>
        )}
      </div>
    </div>
  );
}
