"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const http_1 = require("../http");
const login_1 = require("./login");
exports.router = express_1.Router();
exports.router.get("/", async (req, res) => {
    // Must use the *identical* properties used to set the cookie.
    res.clearCookie(login_1.Cookie.Key, {
        domain: http_1.getCookieDomain(req.headers.host || "", req.args["proxy-domain"]),
        path: req.query.base || "/",
        sameSite: "lax",
    });
    const to = (typeof req.query.to === "string" && req.query.to) || "/";
    return http_1.redirect(req, res, to, { to: undefined, base: undefined });
});
//# sourceMappingURL=logout.js.map