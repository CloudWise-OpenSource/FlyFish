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
exports.register = void 0;
const logger_1 = require("@coder/logger");
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const fs_1 = require("fs");
const path = __importStar(require("path"));
const http_1 = require("../../common/http");
const util_1 = require("../../common/util");
const cli_1 = require("../cli");
const constants_1 = require("../constants");
const heart_1 = require("../heart");
const http_2 = require("../http");
const plugin_1 = require("../plugin");
const util_2 = require("../util");
const wrapper_1 = require("../wrapper");
const apps = __importStar(require("./apps"));
const domainProxy = __importStar(require("./domainProxy"));
const health = __importStar(require("./health"));
const login = __importStar(require("./login"));
const logout = __importStar(require("./logout"));
const pathProxy = __importStar(require("./pathProxy"));
// static is a reserved keyword.
const _static = __importStar(require("./static"));
const update = __importStar(require("./update"));
const vscode = __importStar(require("./vscode"));
/**
 * Register all routes and middleware.
 */
const register = async (app, wsApp, server, args) => {
    const heart = new heart_1.Heart(path.join(util_2.paths.data, "heartbeat"), async () => {
        return new Promise((resolve, reject) => {
            server.getConnections((error, count) => {
                if (error) {
                    return reject(error);
                }
                logger_1.logger.debug(util_1.plural(count, `${count} active connection`));
                resolve(count > 0);
            });
        });
    });
    server.on("close", () => {
        heart.dispose();
    });
    app.disable("x-powered-by");
    wsApp.disable("x-powered-by");
    app.use(cookie_parser_1.default());
    wsApp.use(cookie_parser_1.default());
    const common = (req, _, next) => {
        // /healthz|/healthz/ needs to be excluded otherwise health checks will make
        // it look like code-server is always in use.
        if (!/^\/healthz\/?$/.test(req.url)) {
            heart.beat();
        }
        // Add common variables routes can use.
        req.args = args;
        req.heart = heart;
        next();
    };
    app.use(common);
    wsApp.use(common);
    app.use(async (req, res, next) => {
        // If we're handling TLS ensure all requests are redirected to HTTPS.
        // TODO: This does *NOT* work if you have a base path since to specify the
        // protocol we need to specify the whole path.
        if (args.cert && !req.connection.encrypted) {
            return res.redirect(`https://${req.headers.host}${req.originalUrl}`);
        }
        // Return robots.txt.
        if (req.originalUrl === "/robots.txt") {
            const resourcePath = path.resolve(constants_1.rootPath, "src/browser/robots.txt");
            res.set("Content-Type", util_2.getMediaMime(resourcePath));
            return res.send(await fs_1.promises.readFile(resourcePath));
        }
        next();
    });
    app.use("/", domainProxy.router);
    wsApp.use("/", domainProxy.wsRouter.router);
    app.all("/proxy/(:port)(/*)?", (req, res) => {
        pathProxy.proxy(req, res);
    });
    wsApp.get("/proxy/(:port)(/*)?", async (req) => {
        await pathProxy.wsProxy(req);
    });
    // These two routes pass through the path directly.
    // So the proxied app must be aware it is running
    // under /absproxy/<someport>/
    app.all("/absproxy/(:port)(/*)?", (req, res) => {
        pathProxy.proxy(req, res, {
            passthroughPath: true,
        });
    });
    wsApp.get("/absproxy/(:port)(/*)?", async (req) => {
        await pathProxy.wsProxy(req, {
            passthroughPath: true,
        });
    });
    if (!process.env.CS_DISABLE_PLUGINS) {
        const workingDir = args._ && args._.length > 0 ? path.resolve(args._[args._.length - 1]) : undefined;
        const pluginApi = new plugin_1.PluginAPI(logger_1.logger, process.env.CS_PLUGIN, process.env.CS_PLUGIN_PATH, workingDir);
        await pluginApi.loadPlugins();
        pluginApi.mount(app, wsApp);
        app.use("/api/applications", http_2.ensureAuthenticated, apps.router(pluginApi));
        wrapper_1.wrapper.onDispose(() => pluginApi.dispose());
    }
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use("/", vscode.router);
    wsApp.use("/", vscode.wsRouter.router);
    app.use("/vscode", vscode.router);
    wsApp.use("/vscode", vscode.wsRouter.router);
    app.use("/healthz", health.router);
    wsApp.use("/healthz", health.wsRouter.router);
    if (args.auth === cli_1.AuthType.Password) {
        app.use("/login", login.router);
        app.use("/logout", logout.router);
    }
    else {
        app.all("/login", (req, res) => http_2.redirect(req, res, "/", {}));
        app.all("/logout", (req, res) => http_2.redirect(req, res, "/", {}));
    }
    app.use("/static", _static.router);
    app.use("/update", update.router);
    app.use(() => {
        throw new http_1.HttpError("Not Found", http_1.HttpCode.NotFound);
    });
    const errorHandler = async (err, req, res, next) => {
        if (err.code === "ENOENT" || err.code === "EISDIR") {
            err.status = http_1.HttpCode.NotFound;
        }
        const status = err.status ?? err.statusCode ?? 500;
        res.status(status);
        // Assume anything that explicitly accepts text/html is a user browsing a
        // page (as opposed to an xhr request). Don't use `req.accepts()` since
        // *every* request that I've seen (in Firefox and Chromium at least)
        // includes `*/*` making it always truthy. Even for css/javascript.
        if (req.headers.accept && req.headers.accept.includes("text/html")) {
            const resourcePath = path.resolve(constants_1.rootPath, "src/browser/pages/error.html");
            res.set("Content-Type", util_2.getMediaMime(resourcePath));
            const content = await fs_1.promises.readFile(resourcePath, "utf8");
            res.send(http_2.replaceTemplates(req, content)
                .replace(/{{ERROR_TITLE}}/g, status)
                .replace(/{{ERROR_HEADER}}/g, status)
                .replace(/{{ERROR_BODY}}/g, err.message));
        }
        else {
            res.json({
                error: err.message,
                ...(err.details || {}),
            });
        }
    };
    app.use(errorHandler);
    const wsErrorHandler = async (err, req, res, next) => {
        logger_1.logger.error(`${err.message} ${err.stack}`);
        req.ws.end();
    };
    wsApp.use(wsErrorHandler);
};
exports.register = register;
//# sourceMappingURL=index.js.map