// Simple PWA SW for Netlify static — caches app shell, not ROMs (too large)
const CACHE = "emulator-pwa-v1";
const SHELL = ["/", "/index.html", "/manifest.json"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k)=>k!==CACHE).map((k)=>caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // Never cache ROMs, bios, or emulatorjs WASM/data (large, cross-origin)
  if (url.pathname.match(/\.(gb|gbc|gba|smc|sfc|nes|md|zip|bin|wasm|data)$/)) return;
  if (url.origin.includes("cdn.emulatorjs.org")) return;
  if (url.origin.includes("pokeapi.co")) return;

  // Cache-first for shell, network-first for others
  if (SHELL.includes(url.pathname) || e.request.destination === "document") {
    e.respondWith(
      fetch(e.request).then((r) => {
        const clone = r.clone();
        caches.open(CACHE).then((c)=>c.put(e.request, clone));
        return r;
      }).catch(()=>caches.match(e.request))
    );
  }
});
