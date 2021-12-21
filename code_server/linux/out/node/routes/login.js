"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = exports.RateLimiter = exports.Cookie = void 0;
const express_1 = require("express");
const fs_1 = require("fs");
const limiter_1 = require("limiter");
const path = __importStar(require("path"));
const constants_1 = require("../constants");
const http_1 = require("../http");
const util_1 = require("../util");
var Cookie;
(function (Cookie) {
    Cookie["Key"] = "key";
})(Cookie = exports.Cookie || (exports.Cookie = {}));
// RateLimiter wraps around the limiter library for logins.
// It allows 2 logins every minute plus 12 logins every hour.
class RateLimiter {
    constructor() {
        this.minuteLimiter = new limiter_1.RateLimiter(2, "minute");
        this.hourLimiter = new limiter_1.RateLimiter(12, "hour");
    }
    canTry() {
        // Note: we must check using >= 1 because technically when there are no tokens left
        // you get back a number like 0.00013333333333333334
        // which would cause fail if the logic were > 0
        return this.minuteLimiter.getTokensRemaining() >= 1 || this.hourLimiter.getTokensRemaining() >= 1;
    }
    removeToken() {
        return this.minuteLimiter.tryRemoveTokens(1) || this.hourLimiter.tryRemoveTokens(1);
    }
}
exports.RateLimiter = RateLimiter;
const getRoot = async (req, error) => {
    const content = await fs_1.promises.readFile(path.join(constants_1.rootPath, "src/browser/pages/login.html"), "utf8");
    let passwordMsg = `Check the config file at ${util_1.humanPath(req.args.config)} for the password.`;
    if (req.args.usingEnvPassword) {
        passwordMsg = "Password was set from $PASSWORD.";
    }
    else if (req.args.usingEnvHashedPassword) {
        passwordMsg = "Password was set from $HASHED_PASSWORD.";
    }
    return http_1.replaceTemplates(req, content
        .replace(/{{PASSWORD_MSG}}/g, passwordMsg)
        .replace(/{{ERROR}}/, error ? `<div class="error">${util_1.escapeHtml(error.message)}</div>` : ""));
};
const limiter = new RateLimiter();
exports.router = express_1.Router();
exports.router.use(async (req, res, next) => {
    const to = (typeof req.query.to === "string" && req.query.to) || "/";
    if (await http_1.authenticated(req)) {
        return http_1.redirect(req, res, to, { to: undefined });
    }
    next();
});
exports.router.get("/", async (req, res) => {
    res.send(await getRoot(req));
});
exports.router.post("/", async (req, res) => {
    const password = util_1.sanitizeString(req.body.password);
    const hashedPasswordFromArgs = req.args["hashed-password"];
    try {
        // Check to see if they exceeded their login attempts
        if (!limiter.canTry()) {
            throw new Error("Login rate limited!");
        }
        if (!password) {
            throw new Error("Missing password");
        }
        const passwordMethod = util_1.getPasswordMethod(hashedPasswordFromArgs);
        const { isPasswordValid, hashedPassword } = await util_1.handlePasswordValidation({
            passwordMethod,
            hashedPasswordFromArgs,
            passwordFromRequestBody: password,
            passwordFromArgs: req.args.password,
        });
        if (isPasswordValid) {
            // The hash does not add any actual security but we do it for
            // obfuscation purposes (and as a side effect it handles escaping).
            res.cookie(Cookie.Key, hashedPassword, {
                domain: http_1.getCookieDomain(req.headers.host || "", req.args["proxy-domain"]),
                path: req.body.base || "/",
                sameSite: "lax",
            });
            const to = (typeof req.query.to === "string" && req.query.to) || "/";
            return http_1.redirect(req, res, to, { to: undefined });
        }
        // Note: successful logins should not count against the RateLimiter
        // which is why this logic must come after the successful login logic
        limiter.removeToken();
        console.error("Failed login attempt", JSON.stringify({
            xForwardedFor: req.headers["x-forwarded-for"],
            remoteAddress: req.connection.remoteAddress,
            userAgent: req.headers["user-agent"],
            timestamp: Math.floor(new Date().getTime() / 1000),
        }));
        throw new Error("Incorrect password");
    }
    catch (error) {
        const renderedHtml = await getRoot(req, error);
        res.send(renderedHtml);
    }
});
//# sourceMappingURL=login.js.map