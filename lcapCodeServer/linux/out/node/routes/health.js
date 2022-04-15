"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsRouter = exports.router = void 0;
const express_1 = require("express");
const wsRouter_1 = require("../wsRouter");
exports.router = express_1.Router();
exports.router.get("/", (req, res) => {
    res.json({
        status: req.heart.alive() ? "alive" : "expired",
        lastHeartbeat: req.heart.lastHeartbeat,
    });
});
exports.wsRouter = wsRouter_1.Router();
exports.wsRouter.ws("/", async (req) => {
    wsRouter_1.wss.handleUpgrade(req, req.ws, req.head, (ws) => {
        ws.addEventListener("message", () => {
            ws.send(JSON.stringify({
                event: "health",
                status: req.heart.alive() ? "alive" : "expired",
                lastHeartbeat: req.heart.lastHeartbeat,
            }));
        });
        req.ws.resume();
    });
});
//# sourceMappingURL=health.js.map