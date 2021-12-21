"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VscodeProvider = void 0;
var logger_1 = require("@coder/logger");
var cp = __importStar(require("child_process"));
var path = __importStar(require("path"));
var util_1 = require("../common/util");
var constants_1 = require("./constants");
var settings_1 = require("./settings");
var socket_1 = require("./socket");
var util_2 = require("./util");
var wrapper_1 = require("./wrapper");
var VscodeProvider = /** @class */ (function () {
    function VscodeProvider() {
        var _this = this;
        this.socketProvider = new socket_1.SocketProxyProvider();
        this.vsRootPath = path.resolve(constants_1.rootPath, "lib/vscode");
        this.serverRootPath = path.join(this.vsRootPath, "out/vs/server");
        wrapper_1.wrapper.onDispose(function () { return _this.dispose(); });
    }
    VscodeProvider.prototype.dispose = function () {
        return __awaiter(this, void 0, void 0, function () {
            var vscode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.socketProvider.stop();
                        if (!this._vscode) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._vscode];
                    case 1:
                        vscode = _a.sent();
                        vscode.removeAllListeners();
                        vscode.kill();
                        this._vscode = undefined;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    VscodeProvider.prototype.initialize = function (options, query) {
        return __awaiter(this, void 0, void 0, function () {
            var lastVisited, startPath, id, vscode, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, settings_1.settings.read()];
                    case 1:
                        lastVisited = (_a.sent()).lastVisited;
                        return [4 /*yield*/, this.getFirstPath([
                                { url: query.workspace, workspace: true },
                                { url: query.folder, workspace: false },
                                options.args._ && options.args._.length > 0
                                    ? { url: path.resolve(options.args._[options.args._.length - 1]) }
                                    : undefined,
                                !options.args["ignore-last-opened"] ? lastVisited : undefined,
                            ])];
                    case 2:
                        startPath = _a.sent();
                        if (query.ew) {
                            startPath = undefined;
                        }
                        settings_1.settings.write({
                            lastVisited: startPath,
                            query: query,
                        });
                        id = util_1.generateUuid();
                        return [4 /*yield*/, this.fork()];
                    case 3:
                        vscode = _a.sent();
                        logger_1.logger.debug("setting up vs code...");
                        this.send({
                            type: "init",
                            id: id,
                            options: __assign(__assign({}, options), { startPath: startPath }),
                        }, vscode);
                        return [4 /*yield*/, wrapper_1.onMessage(vscode, function (message) {
                                // There can be parallel initializations so wait for the right ID.
                                return message.type === "options" && message.id === id;
                            })];
                    case 4:
                        message = _a.sent();
                        return [2 /*return*/, message.options];
                }
            });
        });
    };
    VscodeProvider.prototype.fork = function () {
        var _this = this;
        if (this._vscode) {
            return this._vscode;
        }
        logger_1.logger.debug("forking vs code...");
        var vscode = cp.fork(path.join(this.serverRootPath, "fork"));
        var dispose = function () {
            vscode.removeAllListeners();
            vscode.kill();
            _this._vscode = undefined;
        };
        vscode.on("error", function (error) {
            logger_1.logger.error(error.message);
            if (error.stack) {
                logger_1.logger.debug(error.stack);
            }
            dispose();
        });
        vscode.on("exit", function (code) {
            logger_1.logger.error("VS Code exited unexpectedly with code " + code);
            dispose();
        });
        this._vscode = wrapper_1.onMessage(vscode, function (message) {
            return message.type === "ready";
        }).then(function () { return vscode; });
        return this._vscode;
    };
    /**
     * VS Code expects a raw socket. It will handle all the web socket frames.
     */
    VscodeProvider.prototype.sendWebsocket = function (socket, query, permessageDeflate) {
        return __awaiter(this, void 0, void 0, function () {
            var vscode, socketProxy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._vscode
                        // TLS sockets cannot be transferred to child processes so we need an
                        // in-between. Non-TLS sockets will be returned as-is.
                    ];
                    case 1:
                        vscode = _a.sent();
                        return [4 /*yield*/, this.socketProvider.createProxy(socket)];
                    case 2:
                        socketProxy = _a.sent();
                        this.send({ type: "socket", query: query, permessageDeflate: permessageDeflate }, vscode, socketProxy);
                        return [2 /*return*/];
                }
            });
        });
    };
    VscodeProvider.prototype.send = function (message, vscode, socket) {
        if (!vscode || vscode.killed) {
            throw new Error("vscode is not running");
        }
        vscode.send(message, socket);
    };
    /**
     * Choose the first non-empty path from the provided array.
     *
     * Each array item consists of `url` and an optional `workspace` boolean that
     * indicates whether that url is for a workspace.
     *
     * `url` can be a fully qualified URL or just the path portion.
     *
     * `url` can also be a query object to make it easier to pass in query
     * variables directly but anything that isn't a string or string array is not
     * valid and will be ignored.
     */
    VscodeProvider.prototype.getFirstPath = function (startPaths) {
        return __awaiter(this, void 0, void 0, function () {
            var i, startPath, url, _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(i < startPaths.length)) return [3 /*break*/, 6];
                        startPath = startPaths[i];
                        url = util_1.arrayify(startPath && startPath.url).find(function (p) { return !!p; });
                        if (!(startPath && url && typeof url === "string")) return [3 /*break*/, 5];
                        _b = {
                            url: url
                        };
                        if (!(typeof startPath.workspace !== "undefined")) return [3 /*break*/, 2];
                        _a = startPath.workspace;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, util_2.isFile(url)];
                    case 3:
                        _a = _c.sent();
                        _c.label = 4;
                    case 4: return [2 /*return*/, (
                        // The only time `workspace` is undefined is for the command-line
                        // argument, in which case it's a path (not a URL) so we can stat it
                        // without having to parse it.
                        _b.workspace = _a,
                            _b)];
                    case 5:
                        ++i;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, undefined];
                }
            });
        });
    };
    return VscodeProvider;
}());
exports.VscodeProvider = VscodeProvider;
//# sourceMappingURL=vscode.js.map