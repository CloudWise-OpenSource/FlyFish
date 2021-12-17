"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
self.addEventListener("install", function () {
    console.log("[Service Worker] installed");
});
self.addEventListener("activate", function (event) {
    event.waitUntil(self.clients.claim());
    console.log("[Service Worker] activated");
});
self.addEventListener("fetch", function () {
    // Without this event handler we won't be recognized as a PWA.
});
//# sourceMappingURL=serviceWorker.js.map