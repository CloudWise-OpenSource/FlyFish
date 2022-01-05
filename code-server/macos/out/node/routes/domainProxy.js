"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsRouter = exports.router = void 0;
var express_1 = require("express");
var http_1 = require("../../common/http");
var util_1 = require("../../common/util");
var http_2 = require("../http");
var proxy_1 = require("../proxy");
var wsRouter_1 = require("../wsRouter");
exports.router = express_1.Router();
/**
 * Return the port if the request should be proxied. Anything that ends in a
 * proxy domain and has a *single* subdomain should be proxied. Anything else
 * should return `undefined` and will be handled as normal.
 *
 * For example if `coder.com` is specified `8080.coder.com` will be proxied
 * but `8080.test.coder.com` and `test.8080.coder.com` will not.
 */
var maybeProxy = function (req) {
    // Split into parts.
    var host = req.headers.host || "";
    var idx = host.indexOf(":");
    var domain = idx !== -1 ? host.substring(0, idx) : host;
    var parts = domain.split(".");
    // There must be an exact match.
    var port = parts.shift();
    var proxyDomain = parts.join(".");
    if (!port || !req.args["proxy-domain"].includes(proxyDomain)) {
        return undefined;
    }
    return port;
};
exports.router.all("*", function (req, res, next) {
    var port = maybeProxy(req);
    if (!port) {
        return next();
    }
    // Must be authenticated to use the proxy.
    if (!http_2.authenticated(req)) {
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
            var to = util_1.normalize("" + req.baseUrl + req.path);
            return http_2.redirect(req, res, "login", {
                to: to !== "/" ? to : undefined,
            });
        }
        // Everything else gets an unauthorized message.
        throw new http_1.HttpError("Unauthorized", http_1.HttpCode.Unauthorized);
    }
    proxy_1.proxy.web(req, res, {
        ignorePath: true,
        target: "http://0.0.0.0:" + port + req.originalUrl,
    });
});
exports.wsRouter = wsRouter_1.Router();
exports.wsRouter.ws("*", function (req, _, next) {
    var port = maybeProxy(req);
    if (!port) {
        return next();
    }
    // Must be authenticated to use the proxy.
    http_2.ensureAuthenticated(req);
    proxy_1.proxy.ws(req, req.ws, req.head, {
        ignorePath: true,
        target: "http://0.0.0.0:" + port + req.originalUrl,
    });
});
//# sourceMappingURL=domainProxy.js.map