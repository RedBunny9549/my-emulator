import { Link, useLocation, useNavigate } from "react-router-dom";
import { Gamepad2, Trophy, Home, Upload, Library } from "lucide-react";
import { useRef } from "react";
import { useEmu } from "../App";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loadRom } = useEmu();
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      loadRom(file);
      navigate("/play");
    }
    e.target.value = "";
  };

  const links = [
    { to: "/",         icon: Home,     label: "Home"     },
    { to: "/play",     icon: Gamepad2, label: "Play"     },
    { to: "/library",  icon: Library,  label: "Library"  },
    { to: "/nuzlocke", icon: Trophy,   label: "Nuzlocke" },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0A0A0C]/90 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5" data-testid="nav-logo">
            <Gamepad2 className="w-6 h-6 text-emerald-400" />
            <span className="text-lg font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
              Nuzlocke<span className="text-emerald-400">Studio</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {links.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                data-testid={`nav-${label.toLowerCase()}`}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === to
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </div>

          {/* Upload ROM button */}
          <div>
            <input
              ref={fileRef}
              type="file"
              accept=".gb,.gbc,.gba"
              className="hidden"
              onChange={handleFileChange}
              data-testid="nav-file-input"
            />
            <button
              onClick={() => fileRef.current?.click()}
              data-testid="nav-upload-btn"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Load ROM</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
