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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketProxyProvider = void 0;
var fs_1 = require("fs");
var net = __importStar(require("net"));
var path = __importStar(require("path"));
var tls = __importStar(require("tls"));
var emitter_1 = require("../common/emitter");
var util_1 = require("../common/util");
var util_2 = require("./util");
/**
 * Provides a way to proxy a TLS socket. Can be used when you need to pass a
 * socket to a child process since you can't pass the TLS socket.
 */
var SocketProxyProvider = /** @class */ (function () {
    function SocketProxyProvider() {
        this.onProxyConnect = new emitter_1.Emitter();
        this.proxyPipe = path.join(util_2.paths.runtime, "tls-proxy");
        this.proxyTimeout = 5000;
    }
    /**
     * Stop the proxy server.
     */
    SocketProxyProvider.prototype.stop = function () {
        if (this._proxyServer) {
            this._proxyServer.then(function (server) { return server.close(); });
            this._proxyServer = undefined;
        }
    };
    /**
     * Create a socket proxy for TLS sockets. If it's not a TLS socket the
     * original socket is returned. This will spawn a proxy server on demand.
     */
    SocketProxyProvider.prototype.createProxy = function (socket) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(socket instanceof tls.TLSSocket)) {
                            return [2 /*return*/, socket];
                        }
                        return [4 /*yield*/, this.startProxyServer()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                var id = util_1.generateUuid();
                                var proxy = net.connect(_this.proxyPipe);
                                proxy.once("connect", function () { return proxy.write(id); });
                                var timeout = setTimeout(function () {
                                    listener.dispose(); // eslint-disable-line @typescript-eslint/no-use-before-define
                                    socket.destroy();
                                    proxy.destroy();
                                    reject(new Error("TLS socket proxy timed out"));
                                }, _this.proxyTimeout);
                                var listener = _this.onProxyConnect.event(function (connection) {
                                    connection.once("data", function (data) {
                                        if (!socket.destroyed && !proxy.destroyed && data.toString() === id) {
                                            clearTimeout(timeout);
                                            listener.dispose();
                                            [
                                                [proxy, socket],
                                                [socket, proxy],
                                            ].forEach(function (_a) {
                                                var _b = __read(_a, 2), a = _b[0], b = _b[1];
                                                a.pipe(b);
                                                a.on("error", function () { return b.destroy(); });
                                                a.on("close", function () { return b.destroy(); });
                                                a.on("end", function () { return b.end(); });
                                            });
                                            resolve(connection);
                                        }
                                    });
                                });
                            })];
                }
            });
        });
    };
    SocketProxyProvider.prototype.startProxyServer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!this._proxyServer) {
                    this._proxyServer = this.findFreeSocketPath(this.proxyPipe)
                        .then(function (pipe) {
                        _this.proxyPipe = pipe;
                        return Promise.all([
                            fs_1.promises.mkdir(path.dirname(_this.proxyPipe), { recursive: true }),
                            fs_1.promises.rmdir(_this.proxyPipe, { recursive: true }),
                        ]);
                    })
                        .then(function () {
                        return new Promise(function (resolve) {
                            var proxyServer = net.createServer(function (p) { return _this.onProxyConnect.emit(p); });
                            proxyServer.once("listening", function () { return resolve(proxyServer); });
                            proxyServer.listen(_this.proxyPipe);
                        });
                    });
                }
                return [2 /*return*/, this._proxyServer];
            });
        });
    };
    SocketProxyProvider.prototype.findFreeSocketPath = function (basePath, maxTries) {
        if (maxTries === void 0) { maxTries = 100; }
        return __awaiter(this, void 0, void 0, function () {
            var i, path;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        path = basePath;
                        _a.label = 1;
                    case 1: return [4 /*yield*/, util_2.canConnect(path)];
                    case 2:
                        if (!((_a.sent()) && i < maxTries)) return [3 /*break*/, 3];
                        path = basePath + "-" + ++i;
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/, path];
                }
            });
        });
    };
    return SocketProxyProvider;
}());
exports.SocketProxyProvider = SocketProxyProvider;
//# sourceMappingURL=socket.js.map