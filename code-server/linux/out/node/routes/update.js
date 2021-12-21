"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const constants_1 = require("../constants");
const http_1 = require("../http");
const update_1 = require("../update");
exports.router = express_1.Router();
const provider = new update_1.UpdateProvider();
exports.router.get("/check", http_1.ensureAuthenticated, async (req, res) => {
    const update = await provider.getUpdate(req.query.force === "true");
    res.json({
        checked: update.checked,
        latest: update.version,
        current: constants_1.version,
        isLatest: provider.isLatestVersion(update),
    });
});
//# sourceMappingURL=update.js.map