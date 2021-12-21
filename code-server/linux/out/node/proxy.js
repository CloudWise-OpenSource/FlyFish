"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxy = void 0;
const http_proxy_1 = __importDefault(require("http-proxy"));
const http_1 = require("../common/http");
exports.proxy = http_proxy_1.default.createProxyServer({});
exports.proxy.on("error", (error, _, res) => {
    res.writeHead(http_1.HttpCode.ServerError);
    res.end(error.message);
});
// Intercept the response to rewrite absolute redirects against the base path.
// Is disabled when the request has no base path which means /absproxy is in use.
exports.proxy.on("proxyRes", (res, req) => {
    if (res.headers.location && res.headers.location.startsWith("/") && req.base) {
        res.headers.location = req.base + res.headers.location;
    }
});
//# sourceMappingURL=proxy.js.map