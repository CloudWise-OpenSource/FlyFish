"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsRouter = exports.router = void 0;
const express_1 = require("express");
const http_1 = require("../../common/http");
const util_1 = require("../../common/util");
const http_2 = require("../http");
const proxy_1 = require("../proxy");
const wsRouter_1 = require("../wsRouter");
exports.router = express_1.Router();
/**
 * Return the port if the request should be proxied. Anything that ends in a
 * proxy domain and has a *single* subdomain should be proxied. Anything else
 * should return `undefined` and will be handled as normal.
 *
 * For example if `coder.com` is specified `8080.coder.com` will be proxied
 * but `8080.test.coder.com` and `test.8080.coder.com` will not.
 */
const maybeProxy = (req) => {
    // Split into parts.
    const host = req.headers.host || "";
    const idx = host.indexOf(":");
    const domain = idx !== -1 ? host.substring(0, idx) : host;
    const parts = domain.split(".");
    // There must be an exact match.
    const port = parts.shift();
    const proxyDomain = parts.join(".");
    if (!port || !req.args["proxy-domain"].includes(proxyDomain)) {
        return undefined;
    }
    return port;
};
exports.router.all("*", async (req, res, next) => {
    const port = maybeProxy(req);
    if (!port) {
        return next();
    }
    // Must be authenticated to use the proxy.
    const isAuthenticated = await http_2.authenticated(req);
    if (!isAuthenticated) {
        // Let the assets through since they're used on the login page.
        if (req.path.startsWith("/static/") && req.method === "GET") {
            return next();
        }
        // Assume anything that explicitly accepts text/html is a user browsing a
        // page (as opposed to an xhr request). Don't use `req.accepts()` since
        // *every* request that I've seen (in Firefox and Chromium at least)
        // includes `*/*` making it always truthy. Even for css/javascript.
        if (req.headers.accept && req.headers.accept.includes("text/html")) {
            // Let the login through.
            if (/\/login\/?/.test(req.path)) {
                return next();
            }
            // Redirect all other pages to the login.
            const to = util_1.normalize(`${req.baseUrl}${req.path}`);
            return http_2.redirect(req, res, "login", {
                to: to !== "/" ? to : undefined,
            });
        }
        // Everything else gets an unauthorized message.
        throw new http_1.HttpError("Unauthorized", http_1.HttpCode.Unauthorized);
    }
    proxy_1.proxy.web(req, res, {
        ignorePath: true,
        target: `http://0.0.0.0:${port}${req.originalUrl}`,
    });
});
exports.wsRouter = wsRouter_1.Router();
exports.wsRouter.ws("*", async (req, _, next) => {
    const port = maybeProxy(req);
    if (!port) {
        return next();
    }
    // Must be authenticated to use the proxy.
    await http_2.ensureAuthenticated(req);
    proxy_1.proxy.ws(req, req.ws, req.head, {
        ignorePath: true,
        target: `http://0.0.0.0:${port}${req.originalUrl}`,
    });
});
//# sourceMappingURL=domainProxy.js.map