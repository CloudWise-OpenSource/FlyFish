"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCookieDomain = exports.redirect = exports.relativeRoot = exports.authenticated = exports.ensureAuthenticated = exports.replaceTemplates = void 0;
const logger_1 = require("@coder/logger");
const qs_1 = __importDefault(require("qs"));
const http_1 = require("../common/http");
const util_1 = require("../common/util");
const cli_1 = require("./cli");
const constants_1 = require("./constants");
const util_2 = require("./util");
/**
 * Replace common variable strings in HTML templates.
 */
const replaceTemplates = (req, content, extraOpts) => {
    const base = exports.relativeRoot(req);
    const options = {
        base,
        csStaticBase: base + "/static/" + constants_1.commit + constants_1.rootPath,
        logLevel: logger_1.logger.level,
        ...extraOpts,
    };
    return content
        .replace(/{{TO}}/g, (typeof req.query.to === "string" && util_2.escapeHtml(req.query.to)) || "/")
        .replace(/{{BASE}}/g, options.base)
        .replace(/{{CS_STATIC_BASE}}/g, options.csStaticBase)
        .replace(/"{{OPTIONS}}"/, `'${JSON.stringify(options)}'`);
};
exports.replaceTemplates = replaceTemplates;
/**
 * Throw an error if not authorized. Call `next` if provided.
 */
const ensureAuthenticated = async (req, _, next) => {
    const isAuthenticated = await exports.authenticated(req);
    if (!isAuthenticated) {
        throw new http_1.HttpError("Unauthorized", http_1.HttpCode.Unauthorized);
    }
    if (next) {
        next();
    }
};
exports.ensureAuthenticated = ensureAuthenticated;
/**
 * Return true if authenticated via cookies.
 */
const authenticated = async (req) => {
    switch (req.args.auth) {
        case cli_1.AuthType.None: {
            return true;
        }
        case cli_1.AuthType.Password: {
            // The password is stored in the cookie after being hashed.
            const hashedPasswordFromArgs = req.args["hashed-password"];
            const passwordMethod = util_2.getPasswordMethod(hashedPasswordFromArgs);
            const isCookieValidArgs = {
                passwordMethod,
                cookieKey: util_2.sanitizeString(req.cookies.key),
                passwordFromArgs: req.args.password || "",
                hashedPasswordFromArgs: req.args["hashed-password"],
            };
            return await util_2.isCookieValid(isCookieValidArgs);
        }
        default: {
            throw new Error(`Unsupported auth type ${req.args.auth}`);
        }
    }
};
exports.authenticated = authenticated;
/**
 * Get the relative path that will get us to the root of the page. For each
 * slash we need to go up a directory. For example:
 * / => .
 * /foo => .
 * /foo/ => ./..
 * /foo/bar => ./..
 * /foo/bar/ => ./../..
 */
const relativeRoot = (req) => {
    const depth = (req.originalUrl.split("?", 1)[0].match(/\//g) || []).length;
    return util_1.normalize("./" + (depth > 1 ? "../".repeat(depth - 1) : ""));
};
exports.relativeRoot = relativeRoot;
/**
 * Redirect relatively to `/${to}`. Query variables on the current URI will be preserved.
 * `to` should be a simple path without any query parameters
 * `override` will merge with the existing query (use `undefined` to unset).
 */
const redirect = (req, res, to, override = {}) => {
    const query = Object.assign({}, req.query, override);
    Object.keys(override).forEach((key) => {
        if (typeof override[key] === "undefined") {
            delete query[key];
        }
    });
    const relativePath = util_1.normalize(`${exports.relativeRoot(req)}/${to}`, true);
    const queryString = qs_1.default.stringify(query);
    const redirectPath = `${relativePath}${queryString ? `?${queryString}` : ""}`;
    logger_1.logger.debug(`redirecting from ${req.originalUrl} to ${redirectPath}`);
    res.redirect(redirectPath);
};
exports.redirect = redirect;
/**
 * Get the value that should be used for setting a cookie domain. This will
 * allow the user to authenticate once no matter what sub-domain they use to log
 * in. This will use the highest level proxy domain (e.g. `coder.com` over
 * `test.coder.com` if both are specified).
 */
const getCookieDomain = (host, proxyDomains) => {
    const idx = host.lastIndexOf(":");
    host = idx !== -1 ? host.substring(0, idx) : host;
    // If any of these are true we will still set cookies but without an explicit
    // `Domain` attribute on the cookie.
    if (
    // The host can be be blank or missing so there's nothing we can set.
    !host ||
        // IP addresses can't have subdomains so there's no value in setting the
        // domain for them. Assume that anything with a : is ipv6 (valid domain name
        // characters are alphanumeric or dashes)...
        host.includes(":") ||
        // ...and that anything entirely numbers and dots is ipv4 (currently tlds
        // cannot be entirely numbers).
        !/[^0-9.]/.test(host) ||
        // localhost subdomains don't seem to work at all (browser bug?). A cookie
        // set at dev.localhost cannot be read by 8080.dev.localhost.
        host.endsWith(".localhost") ||
        // Domains without at least one dot (technically two since domain.tld will
        // become .domain.tld) are considered invalid according to the spec so don't
        // set the domain for them. In my testing though localhost is the only
        // problem (the browser just doesn't store the cookie at all). localhost has
        // an additional problem which is that a reverse proxy might give
        // code-server localhost even though the domain is really domain.tld (by
        // default NGINX does this).
        !host.includes(".")) {
        logger_1.logger.debug("no valid cookie doman", logger_1.field("host", host));
        return undefined;
    }
    proxyDomains.forEach((domain) => {
        if (host.endsWith(domain) && domain.length < host.length) {
            host = domain;
        }
    });
    logger_1.logger.debug("got cookie doman", logger_1.field("host", host));
    return host || undefined;
};
exports.getCookieDomain = getCookieDomain;
//# sourceMappingURL=http.js.map