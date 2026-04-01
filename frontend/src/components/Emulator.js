import { useEffect, useRef } from "react";

const GBA_BIOS_URL =
  "https://customer-assets.emergentagent.com/job_nuzlocke-scanner/artifacts/gibis365_gba_bios_romsretro.com.bin";

// EmulatorJS core names — gambatte handles both GB and GBC
function detectCore(filename) {
  const ext = filename.toLowerCase().split(".").pop();
  if (ext === "gba") return "gba";
  if (ext === "gbc") return "gambatte";
  if (ext === "gb")  return "gambatte";
  return "gambatte";
}

// Hide the EmulatorJS "Powered by" badge via injected CSS
function injectBadgeHide() {
  const id = "ejs-badge-hide";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    .ejs_powered_by, .ejs-powered-by, .ejs_shoutout,
    .netplay-shoutout, [class*="powered"], [class*="shoutout"],
    .ejs_menu_bar .ejs_menu_item:last-child { display: none !important; }
  `;
  document.head.appendChild(style);
}

export default function Emulator({ romFile, biosFile }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!romFile) return;

    const romUrl = URL.createObjectURL(romFile);
    const core = detectCore(romFile.name);
    let biosUrl = null;
    const container = containerRef.current;

    const suppressErrors = (event) => {
      if (
        event.message === "Script error." ||
        event.message === "ResizeObserver loop completed with undelivered notifications." ||
        event.filename?.includes("emulatorjs") ||
        event.filename?.includes("emulator.min")
      ) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return true;
      }
    };
    window.addEventListener("error", suppressErrors, true);

    const prevScript = document.getElementById("emulatorjs-loader");
    if (prevScript) prevScript.remove();
    if (container) container.innerHTML = "";

    window.EJS_player = "#emu-game";
    window.EJS_core = core;
    window.EJS_gameUrl = romUrl;
    window.EJS_startOnLoaded = true;
    window.EJS_color = "#10B981";
    window.EJS_backgroundColor = "#000000";
    window.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    window.EJS_volume = 0.7;
    window.EJS_Buttons = {
      playPause: true, restart: true, mute: true,
      settings: true, fullscreen: true, saveState: true,
      loadState: true, screenRecord: false, gamepad: true,
      cheat: false, volume: true, saveSavFiles: true,
      loadSavFiles: true, quickSave: true, quickLoad: true,
    };

    // Callback fired when emulator finishes loading — good time to hide badge
    window.EJS_onGameStart = () => {
      injectBadgeHide();
      // Notify React that controls may have loaded
      window.dispatchEvent(new CustomEvent("ejs-ready"));
    };

    if (biosFile) {
      biosUrl = URL.createObjectURL(biosFile);
      window.EJS_biosUrl = biosUrl;
    } else if (core === "gba") {
      window.EJS_biosUrl = GBA_BIOS_URL;
    }

    // Inject badge hide early too
    injectBadgeHide();

    const script = document.createElement("script");
    script.id = "emulatorjs-loader";
    script.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    document.body.appendChild(script);

    return () => {
      try {
        window.removeEventListener("error", suppressErrors, true);
        URL.revokeObjectURL(romUrl);
        if (biosUrl) URL.revokeObjectURL(biosUrl);
        const s = document.getElementById("emulatorjs-loader");
        if (s) s.remove();
        if (container) container.innerHTML = "";
        delete window.EJS_player;
        delete window.EJS_gameUrl;
        delete window.EJS_core;
        delete window.EJS_biosUrl;
        delete window.EJS_onGameStart;
      } catch (_) {}
    };
  }, [romFile, biosFile]);

  return (
    <div
      id="emu-game"
      ref={containerRef}
      data-testid="emulator-canvas"
      style={{ width: "100%", minHeight: "420px", backgroundColor: "#000" }}
    />
  );
}
