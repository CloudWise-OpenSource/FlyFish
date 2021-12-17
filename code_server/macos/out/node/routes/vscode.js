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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsRouter = exports.router = void 0;
var crypto = __importStar(require("crypto"));
var express_1 = require("express");
var fs_1 = require("fs");
var path = __importStar(require("path"));
var qs_1 = __importDefault(require("qs"));
var emitter_1 = require("../../common/emitter");
var http_1 = require("../../common/http");
var util_1 = require("../../common/util");
var cli_1 = require("../cli");
var constants_1 = require("../constants");
var http_2 = require("../http");
var util_2 = require("../util");
var vscode_1 = require("../vscode");
var wsRouter_1 = require("../wsRouter");
exports.router = express_1.Router();
var vscode = new vscode_1.VscodeProvider();
exports.router.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, content, options, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!http_2.authenticated(req)) {
                    return [2 /*return*/, http_2.redirect(req, res, "login", {
                            // req.baseUrl can be blank if already at the root.
                            to: req.baseUrl && req.baseUrl !== "/" ? req.baseUrl : undefined,
                        })];
                }
                _c = (_b = Promise).all;
                return [4 /*yield*/, fs_1.promises.readFile(path.join(constants_1.rootPath, "src/browser/pages/vscode.html"), "utf8")];
            case 1: return [4 /*yield*/, _c.apply(_b, [[
                        _d.sent(),
                        (function () { return __awaiter(void 0, void 0, void 0, function () {
                            var error_1, devMessage;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, vscode.initialize({ args: req.args, remoteAuthority: req.headers.host || "" }, req.query)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                    case 2:
                                        error_1 = _a.sent();
                                        devMessage = constants_1.isDevMode ? "It might not have finished compiling." : "";
                                        throw new Error("VS Code failed to load. " + devMessage + " " + error_1.message);
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); })()
                    ]])];
            case 2:
                _a = __read.apply(void 0, [_d.sent(), 2]), content = _a[0], options = _a[1];
                options.productConfiguration.codeServerVersion = constants_1.version;
                res.send(http_2.replaceTemplates(req, 
                // Uncomment prod blocks if not in development. TODO: Would this be
                // better as a build step? Or maintain two HTML files again?
                !constants_1.isDevMode ? content.replace(/<!-- PROD_ONLY/g, "").replace(/END_PROD_ONLY -->/g, "") : content, {
                    authed: req.args.auth !== "none",
                    disableTelemetry: !!req.args["disable-telemetry"],
                    disableUpdateCheck: !!req.args["disable-update-check"],
                })
                    .replace("\"{{REMOTE_USER_DATA_URI}}\"", "'" + JSON.stringify(options.remoteUserDataUri) + "'")
                    .replace("\"{{PRODUCT_CONFIGURATION}}\"", "'" + JSON.stringify(options.productConfiguration) + "'")
                    .replace("\"{{WORKBENCH_WEB_CONFIGURATION}}\"", "'" + JSON.stringify(options.workbenchWebConfiguration) + "'")
                    .replace("\"{{NLS_CONFIGURATION}}\"", "'" + JSON.stringify(options.nlsConfiguration) + "'"));
                return [2 /*return*/];
        }
    });
}); });
/**
 * TODO: Might currently be unused.
 */
exports.router.get("/resource(/*)?", http_2.ensureAuthenticated, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!(typeof req.query.path === "string")) return [3 /*break*/, 2];
                res.set("Content-Type", util_2.getMediaMime(req.query.path));
                _b = (_a = res).send;
                return [4 /*yield*/, fs_1.promises.readFile(util_2.pathToFsPath(req.query.path))];
            case 1:
                _b.apply(_a, [_c.sent()]);
                _c.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
/**
 * Used by VS Code to load files.
 */
exports.router.get("/vscode-remote-resource(/*)?", http_2.ensureAuthenticated, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!(typeof req.query.path === "string")) return [3 /*break*/, 2];
                res.set("Content-Type", util_2.getMediaMime(req.query.path));
                _b = (_a = res).send;
                return [4 /*yield*/, fs_1.promises.readFile(util_2.pathToFsPath(req.query.path))];
            case 1:
                _b.apply(_a, [_c.sent()]);
                _c.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
/**
 * VS Code webviews use these paths to load files and to load webview assets
 * like HTML and JavaScript.
 */
exports.router.get("/webview/*", http_2.ensureAuthenticated, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                res.set("Content-Type", util_2.getMediaMime(req.path));
                if (!/^vscode-resource/.test(req.params[0])) return [3 /*break*/, 2];
                _b = (_a = res).send;
                return [4 /*yield*/, fs_1.promises.readFile(req.params[0].replace(/^vscode-resource(\/file)?/, ""))];
            case 1: return [2 /*return*/, _b.apply(_a, [_e.sent()])];
            case 2:
                _d = (_c = res).send;
                return [4 /*yield*/, fs_1.promises.readFile(path.join(vscode.vsRootPath, "out/vs/workbench/contrib/webview/browser/pre", req.params[0]))];
            case 3: return [2 /*return*/, _d.apply(_c, [_e.sent()])];
        }
    });
}); });
var callbacks = new Map();
var callbackEmitter = new emitter_1.Emitter();
/**
 * Get vscode-requestId from the query and throw if it's missing or invalid.
 */
var getRequestId = function (req) {
    if (!req.query["vscode-requestId"]) {
        throw new http_1.HttpError("vscode-requestId is missing", http_1.HttpCode.BadRequest);
    }
    if (typeof req.query["vscode-requestId"] !== "string") {
        throw new http_1.HttpError("vscode-requestId is not a string", http_1.HttpCode.BadRequest);
    }
    return req.query["vscode-requestId"];
};
// Matches VS Code's fetch timeout.
var fetchTimeout = 5 * 60 * 1000;
// The callback endpoints are used during authentication. A URI is stored on
// /callback and then fetched later on /fetch-callback.
// See ../../../lib/vscode/resources/web/code-web.js
exports.router.get("/callback", http_2.ensureAuthenticated, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var uriKeys, id, query, key, callback;
    return __generator(this, function (_a) {
        uriKeys = [
            "vscode-requestId",
            "vscode-scheme",
            "vscode-authority",
            "vscode-path",
            "vscode-query",
            "vscode-fragment",
        ];
        id = getRequestId(req);
        query = {};
        for (key in req.query) {
            if (!uriKeys.includes(key)) {
                query[key] = req.query[key];
            }
        }
        callback = {
            uri: {
                scheme: util_1.getFirstString(req.query["vscode-scheme"]) || "code-oss",
                authority: util_1.getFirstString(req.query["vscode-authority"]),
                path: util_1.getFirstString(req.query["vscode-path"]),
                query: (util_1.getFirstString(req.query.query) || "") + "&" + qs_1.default.stringify(query),
                fragment: util_1.getFirstString(req.query["vscode-fragment"]),
            },
            // Make sure the map doesn't leak if nothing fetches this URI.
            timeout: setTimeout(function () { return callbacks.delete(id); }, fetchTimeout),
        };
        callbacks.set(id, callback);
        callbackEmitter.emit({ id: id, callback: callback });
        res.sendFile(path.join(constants_1.rootPath, "lib/vscode/resources/web/callback.html"));
        return [2 /*return*/];
    });
}); });
exports.router.get("/fetch-callback", http_2.ensureAuthenticated, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, send, callback, handler;
    return __generator(this, function (_a) {
        id = getRequestId(req);
        send = function (callback) {
            clearTimeout(callback.timeout);
            callbacks.delete(id);
            res.json(callback.uri);
        };
        callback = callbacks.get(id);
        if (callback) {
            return [2 /*return*/, send(callback)];
        }
        handler = callbackEmitter.event(function (_a) {
            var emitId = _a.id, callback = _a.callback;
            if (id === emitId) {
                handler.dispose();
                send(callback);
            }
        });
        // If the client closes the connection.
        req.on("close", function () { return handler.dispose(); });
        return [2 /*return*/];
    });
}); });
exports.wsRouter = wsRouter_1.Router();
exports.wsRouter.ws("/", http_2.ensureAuthenticated, function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var magic, reply, responseHeaders, extensions, isCompressionSupported, isCompressionEnabled, useCompression;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                magic = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
                reply = crypto
                    .createHash("sha1")
                    .update(req.headers["sec-websocket-key"] + magic)
                    .digest("base64");
                responseHeaders = [
                    "HTTP/1.1 101 Switching Protocols",
                    "Upgrade: websocket",
                    "Connection: Upgrade",
                    "Sec-WebSocket-Accept: " + reply,
                ];
                extensions = req.headers["sec-websocket-extensions"];
                isCompressionSupported = extensions ? extensions.includes("permessage-deflate") : false;
                isCompressionEnabled = !!((_a = req.args.enable) === null || _a === void 0 ? void 0 : _a.includes(cli_1.Feature.PermessageDeflate));
                useCompression = isCompressionEnabled && isCompressionSupported;
                if (useCompression) {
                    // This response header tells the browser the server supports compression.
                    responseHeaders.push("Sec-WebSocket-Extensions: permessage-deflate; server_max_window_bits=15");
                }
                req.ws.write(responseHeaders.join("\r\n") + "\r\n\r\n");
                return [4 /*yield*/, vscode.sendWebsocket(req.ws, req.query, useCompression)];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=vscode.js.map