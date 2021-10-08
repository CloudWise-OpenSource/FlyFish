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
exports.wsRouter = exports.router = void 0;
const crypto = __importStar(require("crypto"));
const express_1 = require("express");
const fs_1 = require("fs");
const path = __importStar(require("path"));
const qs_1 = __importDefault(require("qs"));
const emitter_1 = require("../../common/emitter");
const http_1 = require("../../common/http");
const util_1 = require("../../common/util");
const cli_1 = require("../cli");
const constants_1 = require("../constants");
const http_2 = require("../http");
const util_2 = require("../util");
const vscode_1 = require("../vscode");
const wsRouter_1 = require("../wsRouter");
exports.router = express_1.Router();
const vscode = new vscode_1.VscodeProvider();
exports.router.get("/", async (req, res) => {
    const isAuthenticated = await http_2.authenticated(req);
    if (!isAuthenticated) {
        return http_2.redirect(req, res, "login", {
            // req.baseUrl can be blank if already at the root.
            to: req.baseUrl && req.baseUrl !== "/" ? req.baseUrl : undefined,
        });
    }
    const [content, options] = await Promise.all([
        await fs_1.promises.readFile(path.join(constants_1.rootPath, "src/browser/pages/vscode.html"), "utf8"),
        (async () => {
            try {
                return await vscode.initialize({ args: req.args, remoteAuthority: req.headers.host || "" }, req.query);
            }
            catch (error) {
                const devMessage = constants_1.isDevMode ? "It might not have finished compiling." : "";
                throw new Error(`VS Code failed to load. ${devMessage} ${error.message}`);
            }
        })(),
    ]);
    options.productConfiguration.codeServerVersion = constants_1.version;
    res.send(http_2.replaceTemplates(req, 
    // Uncomment prod blocks if not in development. TODO: Would this be
    // better as a build step? Or maintain two HTML files again?
    !constants_1.isDevMode ? content.replace(/<!-- PROD_ONLY/g, "").replace(/END_PROD_ONLY -->/g, "") : content, {
        authed: req.args.auth !== "none",
        disableUpdateCheck: !!req.args["disable-update-check"],
    })
        .replace(`"{{REMOTE_USER_DATA_URI}}"`, `'${JSON.stringify(options.remoteUserDataUri)}'`)
        .replace(`"{{PRODUCT_CONFIGURATION}}"`, `'${JSON.stringify(options.productConfiguration)}'`)
        .replace(`"{{WORKBENCH_WEB_CONFIGURATION}}"`, `'${JSON.stringify(options.workbenchWebConfiguration)}'`)
        .replace(`"{{NLS_CONFIGURATION}}"`, `'${JSON.stringify(options.nlsConfiguration)}'`));
});
/**
 * TODO: Might currently be unused.
 */
exports.router.get("/resource(/*)?", http_2.ensureAuthenticated, async (req, res) => {
    const path = util_1.getFirstString(req.query.path);
    if (path) {
        res.set("Content-Type", util_2.getMediaMime(path));
        res.send(await fs_1.promises.readFile(util_2.pathToFsPath(path)));
    }
});
/**
 * Used by VS Code to load files.
 */
exports.router.get("/vscode-remote-resource(/*)?", http_2.ensureAuthenticated, async (req, res) => {
    const path = util_1.getFirstString(req.query.path);
    if (path) {
        res.set("Content-Type", util_2.getMediaMime(path));
        res.send(await fs_1.promises.readFile(util_2.pathToFsPath(path)));
    }
});
/**
 * VS Code webviews use these paths to load files and to load webview assets
 * like HTML and JavaScript.
 */
exports.router.get("/webview/*", http_2.ensureAuthenticated, async (req, res) => {
    res.set("Content-Type", util_2.getMediaMime(req.path));
    if (/^vscode-resource/.test(req.params[0])) {
        return res.send(await fs_1.promises.readFile(req.params[0].replace(/^vscode-resource(\/file)?/, "")));
    }
    return res.send(await fs_1.promises.readFile(path.join(vscode.vsRootPath, "out/vs/workbench/contrib/webview/browser/pre", req.params[0])));
});
const callbacks = new Map();
const callbackEmitter = new emitter_1.Emitter();
/**
 * Get vscode-requestId from the query and throw if it's missing or invalid.
 */
const getRequestId = (req) => {
    if (!req.query["vscode-requestId"]) {
        throw new http_1.HttpError("vscode-requestId is missing", http_1.HttpCode.BadRequest);
    }
    if (typeof req.query["vscode-requestId"] !== "string") {
        throw new http_1.HttpError("vscode-requestId is not a string", http_1.HttpCode.BadRequest);
    }
    return req.query["vscode-requestId"];
};
// Matches VS Code's fetch timeout.
const fetchTimeout = 5 * 60 * 1000;
// The callback endpoints are used during authentication. A URI is stored on
// /callback and then fetched later on /fetch-callback.
// See ../../../lib/vscode/resources/web/code-web.js
exports.router.get("/callback", http_2.ensureAuthenticated, async (req, res) => {
    const uriKeys = [
        "vscode-requestId",
        "vscode-scheme",
        "vscode-authority",
        "vscode-path",
        "vscode-query",
        "vscode-fragment",
    ];
    const id = getRequestId(req);
    // Move any query variables that aren't URI keys into the URI's query
    // (importantly, this will include the code for oauth).
    const query = {};
    for (const key in req.query) {
        if (!uriKeys.includes(key)) {
            query[key] = req.query[key];
        }
    }
    const callback = {
        uri: {
            scheme: util_1.getFirstString(req.query["vscode-scheme"]) || "code-oss",
            authority: util_1.getFirstString(req.query["vscode-authority"]),
            path: util_1.getFirstString(req.query["vscode-path"]),
            query: (util_1.getFirstString(req.query.query) || "") + "&" + qs_1.default.stringify(query),
            fragment: util_1.getFirstString(req.query["vscode-fragment"]),
        },
        // Make sure the map doesn't leak if nothing fetches this URI.
        timeout: setTimeout(() => callbacks.delete(id), fetchTimeout),
    };
    callbacks.set(id, callback);
    callbackEmitter.emit({ id, callback });
    res.sendFile(path.join(constants_1.rootPath, "lib/vscode/resources/web/callback.html"));
});
exports.router.get("/fetch-callback", http_2.ensureAuthenticated, async (req, res) => {
    const id = getRequestId(req);
    const send = (callback) => {
        clearTimeout(callback.timeout);
        callbacks.delete(id);
        res.json(callback.uri);
    };
    const callback = callbacks.get(id);
    if (callback) {
        return send(callback);
    }
    // VS Code will try again if the route returns no content but it seems more
    // efficient to just wait on this request for as long as possible?
    const handler = callbackEmitter.event(({ id: emitId, callback }) => {
        if (id === emitId) {
            handler.dispose();
            send(callback);
        }
    });
    // If the client closes the connection.
    req.on("close", () => handler.dispose());
});
exports.wsRouter = wsRouter_1.Router();
exports.wsRouter.ws("/", http_2.ensureAuthenticated, async (req) => {
    const magic = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
    const reply = crypto
        .createHash("sha1")
        .update(req.headers["sec-websocket-key"] + magic)
        .digest("base64");
    const responseHeaders = [
        "HTTP/1.1 101 Switching Protocols",
        "Upgrade: websocket",
        "Connection: Upgrade",
        `Sec-WebSocket-Accept: ${reply}`,
    ];
    // See if the browser reports it supports web socket compression.
    // TODO: Parse this header properly.
    const extensions = req.headers["sec-websocket-extensions"];
    const isCompressionSupported = extensions ? extensions.includes("permessage-deflate") : false;
    // TODO: For now we only use compression if the user enables it.
    const isCompressionEnabled = !!req.args.enable?.includes(cli_1.Feature.PermessageDeflate);
    const useCompression = isCompressionEnabled && isCompressionSupported;
    if (useCompression) {
        // This response header tells the browser the server supports compression.
        responseHeaders.push("Sec-WebSocket-Extensions: permessage-deflate; server_max_window_bits=15");
    }
    req.ws.write(responseHeaders.join("\r\n") + "\r\n\r\n");
    await vscode.sendWebsocket(req.ws, req.query, useCompression);
});
//# sourceMappingURL=vscode.js.map