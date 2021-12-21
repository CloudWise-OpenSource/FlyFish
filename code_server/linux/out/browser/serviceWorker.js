"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
self.addEventListener("install", () => {
    console.log("[Service Worker] installed");
});
self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
    console.log("[Service Worker] activated");
});
self.addEventListener("fetch", () => {
    // Without this event handler we won't be recognized as a PWA.
});
//# sourceMappingURL=serviceWorker.js.map