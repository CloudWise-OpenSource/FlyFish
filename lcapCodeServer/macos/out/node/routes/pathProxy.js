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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsProxy = exports.proxy = void 0;
var path = __importStar(require("path"));
var qs_1 = __importDefault(require("qs"));
var http_1 = require("../../common/http");
var util_1 = require("../../common/util");
var http_2 = require("../http");
var proxy_1 = require("../proxy");
var getProxyTarget = function (req, passthroughPath) {
    if (passthroughPath) {
        return "http://0.0.0.0:" + req.params.port + "/" + req.originalUrl;
    }
    var query = qs_1.default.stringify(req.query);
    return "http://0.0.0.0:" + req.params.port + "/" + (req.params[0] || "") + (query ? "?" + query : "");
};
function proxy(req, res, opts) {
    if (!http_2.authenticated(req)) {
        // If visiting the root (/:port only) redirect to the login page.
        if (!req.params[0] || req.params[0] === "/") {
            var to = util_1.normalize("" + req.baseUrl + req.path);
            return http_2.redirect(req, res, "login", {
                to: to !== "/" ? to : undefined,
            });
        }
        throw new http_1.HttpError("Unauthorized", http_1.HttpCode.Unauthorized);
    }
    if (!(opts === null || opts === void 0 ? void 0 : opts.passthroughPath)) {
        // Absolute redirects need to be based on the subpath when rewriting.
        // See proxy.ts.
        ;
        req.base = req.path.split(path.sep).slice(0, 3).join(path.sep);
    }
    proxy_1.proxy.web(req, res, {
        ignorePath: true,
        target: getProxyTarget(req, opts === null || opts === void 0 ? void 0 : opts.passthroughPath),
    });
}
exports.proxy = proxy;
function wsProxy(req, opts) {
    http_2.ensureAuthenticated(req);
    proxy_1.proxy.ws(req, req.ws, req.head, {
        ignorePath: true,
        target: getProxyTarget(req, opts === null || opts === void 0 ? void 0 : opts.passthroughPath),
    });
}
exports.wsProxy = wsProxy;
//# sourceMappingURL=pathProxy.js.map