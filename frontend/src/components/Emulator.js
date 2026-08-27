import { useEffect, useRef } from "react";

const GBA_BIOS_URL = "/emulator-bios/job_nuzlocke-scanner/artifacts/gibis365_gba_bios_romsretro.com.bin";

// EmulatorJS core names — per https://emulatorjs.org/docs
// snes -> snes9x/bsnes, nes -> fceumm/nestopia, segaMD -> genesis_plus_gx
function detectCore(filename) {
  const ext = filename.toLowerCase().split(".").pop();
  if (ext === "gba") return "gba";
  if (ext === "gbc" || ext === "gb") return "gambatte";
  if (ext === "sfc" || ext === "smc" || ext === "fig" || ext === "snes" || ext === "bs") return "snes";
  if (ext === "nes" || ext === "fds" || ext === "unif" || ext === "unf") return "nes";
  if (ext === "md" || ext === "smd" || ext === "gen" || ext === "bin") return "segaMD";
  if (ext === "zip" || ext === "7z") return "snes"; // zip may contain any — snes as fallback, user can override via manual core picker
  return "snes";
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

export default function Emulator({ romFile, biosFile, coreOverride }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!romFile) return;

    const romUrl = URL.createObjectURL(romFile);
    const core = coreOverride || detectCore(romFile.name);
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
    window.EJS_pathtodata = "/emulator-cdn/";
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
      // Netlify static: try remote BIOS but don't break if blocked (mGBA works without it)
      window.EJS_biosUrl = GBA_BIOS_URL;
      // If BIOS fetch fails, EmulatorJS will fallback to HLE BIOS automatically
    }

    // Inject badge hide early too
    injectBadgeHide();

    const script = document.createElement("script");
    script.id = "emulatorjs-loader";
    script.src = "/emulator-cdn/loader.js";
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
  }, [romFile, biosFile, coreOverride]);

  return (
    <div
      id="emu-game"
      ref={containerRef}
      data-testid="emulator-canvas"
      style={{ width: "100%", minHeight: "420px", backgroundColor: "#000" }}
    />
  );
}
