import { Link, useLocation, useNavigate } from "react-router-dom";
import { Gamepad2, Trophy, Library, Upload } from "lucide-react";
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
    { to: "/play",     icon: Gamepad2, label: "Play"     },
    { to: "/library",  icon: Library,  label: "Library"  },
    { to: "/nuzlocke", icon: Trophy,   label: "Nuzlocke" },
  ];

  const isActive = (to) => to === "/nuzlocke"
    ? location.pathname.startsWith("/nuzlocke")
    : location.pathname === to;

  return (
    <nav className="sticky top-0 z-50 bg-[#0D0D10] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-12 gap-1">
          <div className="flex items-center gap-0.5 flex-1">
            {links.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                data-testid={`nav-${label.toLowerCase()}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  isActive(to)
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-medium">{label}</span>
              </Link>
            ))}
          </div>
          <input ref={fileRef} type="file" accept=".gb,.gbc,.gba" className="hidden" onChange={handleFileChange} data-testid="nav-file-input" />
          <button
            onClick={() => fileRef.current?.click()}
            data-testid="nav-upload-btn"
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Load ROM</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
