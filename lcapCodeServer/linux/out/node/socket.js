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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketProxyProvider = void 0;
const fs_1 = require("fs");
const net = __importStar(require("net"));
const path = __importStar(require("path"));
const tls = __importStar(require("tls"));
const emitter_1 = require("../common/emitter");
const util_1 = require("../common/util");
const util_2 = require("./util");
/**
 * Provides a way to proxy a TLS socket. Can be used when you need to pass a
 * socket to a child process since you can't pass the TLS socket.
 */
class SocketProxyProvider {
    constructor() {
        this.onProxyConnect = new emitter_1.Emitter();
        this.proxyPipe = path.join(util_2.paths.runtime, "tls-proxy");
        this.proxyTimeout = 5000;
    }
    /**
     * Stop the proxy server.
     */
    stop() {
        if (this._proxyServer) {
            this._proxyServer.then((server) => server.close());
            this._proxyServer = undefined;
        }
    }
    /**
     * Create a socket proxy for TLS sockets. If it's not a TLS socket the
     * original socket is returned. This will spawn a proxy server on demand.
     */
    async createProxy(socket) {
        if (!(socket instanceof tls.TLSSocket)) {
            return socket;
        }
        await this.startProxyServer();
        return new Promise((resolve, reject) => {
            const id = util_1.generateUuid();
            const proxy = net.connect(this.proxyPipe);
            proxy.once("connect", () => proxy.write(id));
            const timeout = setTimeout(() => {
                listener.dispose(); // eslint-disable-line @typescript-eslint/no-use-before-define
                socket.destroy();
                proxy.destroy();
                reject(new Error("TLS socket proxy timed out"));
            }, this.proxyTimeout);
            const listener = this.onProxyConnect.event((connection) => {
                connection.once("data", (data) => {
                    if (!socket.destroyed && !proxy.destroyed && data.toString() === id) {
                        clearTimeout(timeout);
                        listener.dispose();
                        [
                            [proxy, socket],
                            [socket, proxy],
                        ].forEach(([a, b]) => {
                            a.pipe(b);
                            a.on("error", () => b.destroy());
                            a.on("close", () => b.destroy());
                            a.on("end", () => b.end());
                        });
                        resolve(connection);
                    }
                });
            });
        });
    }
    async startProxyServer() {
        if (!this._proxyServer) {
            this._proxyServer = this.findFreeSocketPath(this.proxyPipe)
                .then((pipe) => {
                this.proxyPipe = pipe;
                return Promise.all([
                    fs_1.promises.mkdir(path.dirname(this.proxyPipe), { recursive: true }),
                    fs_1.promises.rmdir(this.proxyPipe, { recursive: true }),
                ]);
            })
                .then(() => {
                return new Promise((resolve) => {
                    const proxyServer = net.createServer((p) => this.onProxyConnect.emit(p));
                    proxyServer.once("listening", () => resolve(proxyServer));
                    proxyServer.listen(this.proxyPipe);
                });
            });
        }
        return this._proxyServer;
    }
    async findFreeSocketPath(basePath, maxTries = 100) {
        let i = 0;
        let path = basePath;
        while ((await util_2.canConnect(path)) && i < maxTries) {
            path = `${basePath}-${++i}`;
        }
        return path;
    }
}
exports.SocketProxyProvider = SocketProxyProvider;
//# sourceMappingURL=socket.js.map