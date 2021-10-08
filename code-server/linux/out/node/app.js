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
exports.ensureAddress = exports.createApp = void 0;
const logger_1 = require("@coder/logger");
const compression_1 = __importDefault(require("compression"));
const express_1 = __importDefault(require("express"));
const fs_1 = require("fs");
const http_1 = __importDefault(require("http"));
const httpolyglot = __importStar(require("httpolyglot"));
const util = __importStar(require("../common/util"));
const wsRouter_1 = require("./wsRouter");
/**
 * Create an Express app and an HTTP/S server to serve it.
 */
const createApp = async (args) => {
    const app = express_1.default();
    app.use(compression_1.default());
    const server = args.cert
        ? httpolyglot.createServer({
            cert: args.cert && (await fs_1.promises.readFile(args.cert.value)),
            key: args["cert-key"] && (await fs_1.promises.readFile(args["cert-key"])),
        }, app)
        : http_1.default.createServer(app);
    let resolved = false;
    await new Promise(async (resolve2, reject) => {
        const resolve = () => {
            resolved = true;
            resolve2();
        };
        server.on("error", (err) => {
            if (!resolved) {
                reject(err);
            }
            else {
                // Promise resolved earlier so this is an unrelated error.
                util.logError(logger_1.logger, "http server error", err);
            }
        });
        if (args.socket) {
            try {
                await fs_1.promises.unlink(args.socket);
            }
            catch (error) {
                if (error.code !== "ENOENT") {
                    logger_1.logger.error(error.message);
                }
            }
            server.listen(args.socket, resolve);
        }
        else {
            // [] is the correct format when using :: but Node errors with them.
            server.listen(args.port, args.host.replace(/^\[|\]$/g, ""), resolve);
        }
    });
    const wsApp = express_1.default();
    wsRouter_1.handleUpgrade(wsApp, server);
    return [app, wsApp, server];
};
exports.createApp = createApp;
/**
 * Get the address of a server as a string (protocol *is* included) while
 * ensuring there is one (will throw if there isn't).
 */
const ensureAddress = (server) => {
    const addr = server.address();
    if (!addr) {
        throw new Error("server has no address");
    }
    if (typeof addr !== "string") {
        return `http://${addr.address}:${addr.port}`;
    }
    return addr;
};
exports.ensureAddress = ensureAddress;
//# sourceMappingURL=app.js.map