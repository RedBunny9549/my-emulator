import { Link, useLocation, useNavigate } from "react-router-dom";
import { Gamepad2, Library, Upload, BookOpen, Map, BookMarked, LayoutGrid, Database } from "lucide-react";
import { useRef } from "react";
import { useEmu } from "../App";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loadRom } = useEmu();
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { loadRom(file); navigate("/play"); }
    e.target.value = "";
  };

  const links = [
    { to: "/play",     icon: Gamepad2,   label: "Play"     },
    { to: "/library",  icon: Library,    label: "Library"  },
    { to: "/routes",   icon: Map,        label: "Routes"   },
    { to: "/pokedex",  icon: BookMarked, label: "Pokédex"  },
    { to: "/coverage", icon: LayoutGrid, label: "Coverage" },
    { to: "/bosses",   icon: BookOpen,   label: "Bosses"   },
    { to: "/database", icon: Database,   label: "Database" },
  ];

  const isActive = (to) => location.pathname.startsWith(to) && (to !== "/" || location.pathname === "/");

  return (
    <nav className="sticky top-0 z-[100] w-full bg-[#0A0A0C] border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-14 gap-2">
          <div className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
            {links.map(({ to, icon: Icon, label }) => (
              <Link key={to} to={to} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap flex-shrink-0 ${isActive(to) ? "bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">{label}</span>
              </Link>
            ))}
          </div>
          <input ref={fileRef} type="file" accept=".gb,.gbc,.gba" className="hidden" onChange={handleFileChange} />
          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all flex-shrink-0">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Load ROM</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
