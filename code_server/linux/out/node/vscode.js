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
exports.VscodeProvider = void 0;
const logger_1 = require("@coder/logger");
const cp = __importStar(require("child_process"));
const path = __importStar(require("path"));
const util_1 = require("../common/util");
const constants_1 = require("./constants");
const settings_1 = require("./settings");
const socket_1 = require("./socket");
const util_2 = require("./util");
const wrapper_1 = require("./wrapper");
class VscodeProvider {
    constructor() {
        this.socketProvider = new socket_1.SocketProxyProvider();
        this.vsRootPath = path.resolve(constants_1.rootPath, "lib/vscode");
        this.serverRootPath = path.join(this.vsRootPath, "out/vs/server");
        wrapper_1.wrapper.onDispose(() => this.dispose());
    }
    async dispose() {
        this.socketProvider.stop();
        if (this._vscode) {
            const vscode = await this._vscode;
            vscode.removeAllListeners();
            vscode.kill();
            this._vscode = undefined;
        }
    }
    async initialize(options, query) {
        const { lastVisited } = await settings_1.settings.read();
        let startPath = await this.getFirstPath([
            { url: query.workspace, workspace: true },
            { url: query.folder, workspace: false },
            options.args._ && options.args._.length > 0
                ? { url: path.resolve(options.args._[options.args._.length - 1]) }
                : undefined,
            !options.args["ignore-last-opened"] ? lastVisited : undefined,
        ]);
        if (query.ew) {
            startPath = undefined;
        }
        settings_1.settings.write({
            lastVisited: startPath,
            query,
        });
        const id = util_1.generateUuid();
        const vscode = await this.fork();
        logger_1.logger.debug("setting up vs code...");
        this.send({
            type: "init",
            id,
            options: {
                ...options,
                startPath,
            },
        }, vscode);
        const message = await wrapper_1.onMessage(vscode, (message) => {
            // There can be parallel initializations so wait for the right ID.
            return message.type === "options" && message.id === id;
        });
        return message.options;
    }
    fork() {
        if (this._vscode) {
            return this._vscode;
        }
        logger_1.logger.debug("forking vs code...");
        const vscode = cp.fork(path.join(this.serverRootPath, "fork"));
        const dispose = () => {
            vscode.removeAllListeners();
            vscode.kill();
            this._vscode = undefined;
        };
        vscode.on("error", (error) => {
            logger_1.logger.error(error.message);
            if (error.stack) {
                logger_1.logger.debug(error.stack);
            }
            dispose();
        });
        vscode.on("exit", (code) => {
            logger_1.logger.error(`VS Code exited unexpectedly with code ${code}`);
            dispose();
        });
        this._vscode = wrapper_1.onMessage(vscode, (message) => {
            return message.type === "ready";
        }).then(() => vscode);
        return this._vscode;
    }
    /**
     * VS Code expects a raw socket. It will handle all the web socket frames.
     */
    async sendWebsocket(socket, query, permessageDeflate) {
        const vscode = await this._vscode;
        // TLS sockets cannot be transferred to child processes so we need an
        // in-between. Non-TLS sockets will be returned as-is.
        const socketProxy = await this.socketProvider.createProxy(socket);
        this.send({ type: "socket", query, permessageDeflate }, vscode, socketProxy);
    }
    send(message, vscode, socket) {
        if (!vscode || vscode.killed) {
            throw new Error("vscode is not running");
        }
        vscode.send(message, socket);
    }
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
    async getFirstPath(startPaths) {
        for (let i = 0; i < startPaths.length; ++i) {
            const startPath = startPaths[i];
            const url = util_1.arrayify(startPath && startPath.url).find((p) => !!p);
            if (startPath && url && typeof url === "string") {
                return {
                    url,
                    // The only time `workspace` is undefined is for the command-line
                    // argument, in which case it's a path (not a URL) so we can stat it
                    // without having to parse it.
                    workspace: typeof startPath.workspace !== "undefined" ? startPath.workspace : await util_2.isFile(url),
                };
            }
        }
        return undefined;
    }
}
exports.VscodeProvider = VscodeProvider;
//# sourceMappingURL=vscode.js.map