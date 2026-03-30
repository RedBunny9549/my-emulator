import { useEffect, useRef } from "react";

// Auto-loaded GBA BIOS (user-supplied)
const GBA_BIOS_URL =
  "https://customer-assets.emergentagent.com/job_nuzlocke-scanner/artifacts/gibis365_gba_bios_romsretro.com.bin";

function detectCore(filename) {
  const ext = filename.toLowerCase().split(".").pop();
  if (ext === "gba") return "gba";
  if (ext === "gbc") return "gbc";
  return "gb";
}

export default function Emulator({ romFile, biosFile }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!romFile) return;

    const romUrl = URL.createObjectURL(romFile);
    const core = detectCore(romFile.name);
    let biosUrl = null;
    const container = containerRef.current;

    // Suppress cross-origin EmulatorJS errors so they don't crash React
    const suppressErrors = (event) => {
      if (
        event.message === "Script error." ||
        event.message === "ResizeObserver loop completed with undelivered notifications." ||
        event.filename?.includes("emulatorjs")
      ) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return true;
      }
    };
    window.addEventListener("error", suppressErrors, true);

    // Remove any previous EmulatorJS instance
    const prevScript = document.getElementById("emulatorjs-loader");
    if (prevScript) prevScript.remove();
    if (container) container.innerHTML = "";

    // Configure EmulatorJS
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

    // BIOS: use uploaded file, or auto-load the pre-configured GBA BIOS
    if (biosFile) {
      biosUrl = URL.createObjectURL(biosFile);
      window.EJS_biosUrl = biosUrl;
    } else if (core === "gba") {
      window.EJS_biosUrl = GBA_BIOS_URL;
    }

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
