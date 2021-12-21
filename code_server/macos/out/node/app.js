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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAddress = exports.createApp = void 0;
var logger_1 = require("@coder/logger");
var compression_1 = __importDefault(require("compression"));
var express_1 = __importDefault(require("express"));
var fs_1 = require("fs");
var http_1 = __importDefault(require("http"));
var httpolyglot = __importStar(require("httpolyglot"));
var util = __importStar(require("../common/util"));
var wsRouter_1 = require("./wsRouter");
/**
 * Create an Express app and an HTTP/S server to serve it.
 */
var createApp = function (args) { return __awaiter(void 0, void 0, void 0, function () {
    var app, server, _a, _b, _c, _d, _e, resolved, wsApp;
    var _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                app = express_1.default();
                app.use(compression_1.default());
                if (!args.cert) return [3 /*break*/, 5];
                _c = (_b = httpolyglot).createServer;
                _f = {};
                _d = args.cert;
                if (!_d) return [3 /*break*/, 2];
                return [4 /*yield*/, fs_1.promises.readFile(args.cert.value)];
            case 1:
                _d = (_g.sent());
                _g.label = 2;
            case 2:
                _f.cert = _d;
                _e = args["cert-key"];
                if (!_e) return [3 /*break*/, 4];
                return [4 /*yield*/, fs_1.promises.readFile(args["cert-key"])];
            case 3:
                _e = (_g.sent());
                _g.label = 4;
            case 4:
                _a = _c.apply(_b, [(_f.key = _e,
                        _f), app]);
                return [3 /*break*/, 6];
            case 5:
                _a = http_1.default.createServer(app);
                _g.label = 6;
            case 6:
                server = _a;
                resolved = false;
                return [4 /*yield*/, new Promise(function (resolve2, reject) { return __awaiter(void 0, void 0, void 0, function () {
                        var resolve, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    resolve = function () {
                                        resolved = true;
                                        resolve2();
                                    };
                                    server.on("error", function (err) {
                                        if (!resolved) {
                                            reject(err);
                                        }
                                        else {
                                            // Promise resolved earlier so this is an unrelated error.
                                            util.logError(logger_1.logger, "http server error", err);
                                        }
                                    });
                                    if (!args.socket) return [3 /*break*/, 5];
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, fs_1.promises.unlink(args.socket)];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_1 = _a.sent();
                                    if (error_1.code !== "ENOENT") {
                                        logger_1.logger.error(error_1.message);
                                    }
                                    return [3 /*break*/, 4];
                                case 4:
                                    server.listen(args.socket, resolve);
                                    return [3 /*break*/, 6];
                                case 5:
                                    // [] is the correct format when using :: but Node errors with them.
                                    server.listen(args.port, args.host.replace(/^\[|\]$/g, ""), resolve);
                                    _a.label = 6;
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 7:
                _g.sent();
                wsApp = express_1.default();
                wsRouter_1.handleUpgrade(wsApp, server);
                return [2 /*return*/, [app, wsApp, server]];
        }
    });
}); };
exports.createApp = createApp;
/**
 * Get the address of a server as a string (protocol *is* included) while
 * ensuring there is one (will throw if there isn't).
 */
var ensureAddress = function (server) {
    var addr = server.address();
    if (!addr) {
        throw new Error("server has no address");
    }
    if (typeof addr !== "string") {
        return "http://" + addr.address + ":" + addr.port;
    }
    return addr;
};
exports.ensureAddress = ensureAddress;
//# sourceMappingURL=app.js.map