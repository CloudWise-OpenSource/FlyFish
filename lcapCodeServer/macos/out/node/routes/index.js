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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
var logger_1 = require("@coder/logger");
var body_parser_1 = __importDefault(require("body-parser"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var fs_1 = require("fs");
var path = __importStar(require("path"));
var http_1 = require("../../common/http");
var util_1 = require("../../common/util");
var cli_1 = require("../cli");
var constants_1 = require("../constants");
var heart_1 = require("../heart");
var http_2 = require("../http");
var plugin_1 = require("../plugin");
var util_2 = require("../util");
var wrapper_1 = require("../wrapper");
var apps = __importStar(require("./apps"));
var domainProxy = __importStar(require("./domainProxy"));
var health = __importStar(require("./health"));
var login = __importStar(require("./login"));
var logout = __importStar(require("./logout"));
var pathProxy = __importStar(require("./pathProxy"));
// static is a reserved keyword.
var _static = __importStar(require("./static"));
var update = __importStar(require("./update"));
var vscode = __importStar(require("./vscode"));
/**
 * Register all routes and middleware.
 */
var register = function (app, wsApp, server, args) { return __awaiter(void 0, void 0, void 0, function () {
    var heart, common, workingDir, pluginApi_1, errorHandler, wsErrorHandler;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                heart = new heart_1.Heart(path.join(util_2.paths.data, "heartbeat"), function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                server.getConnections(function (error, count) {
                                    if (error) {
                                        return reject(error);
                                    }
                                    logger_1.logger.debug(util_1.plural(count, count + " active connection"));
                                    resolve(count > 0);
                                });
                            })];
                    });
                }); });
                server.on("close", function () {
                    heart.dispose();
                });
                app.disable("x-powered-by");
                wsApp.disable("x-powered-by");
                app.use(cookie_parser_1.default());
                wsApp.use(cookie_parser_1.default());
                common = function (req, _, next) {
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
                app.use(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
                    var resourcePath, _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                // If we're handling TLS ensure all requests are redirected to HTTPS.
                                // TODO: This does *NOT* work if you have a base path since to specify the
                                // protocol we need to specify the whole path.
                                if (args.cert && !req.connection.encrypted) {
                                    return [2 /*return*/, res.redirect("https://" + req.headers.host + req.originalUrl)];
                                }
                                if (!(req.originalUrl === "/robots.txt")) return [3 /*break*/, 2];
                                resourcePath = path.resolve(constants_1.rootPath, "src/browser/robots.txt");
                                res.set("Content-Type", util_2.getMediaMime(resourcePath));
                                _b = (_a = res).send;
                                return [4 /*yield*/, fs_1.promises.readFile(resourcePath)];
                            case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                            case 2:
                                next();
                                return [2 /*return*/];
                        }
                    });
                }); });
                app.use("/", domainProxy.router);
                wsApp.use("/", domainProxy.wsRouter.router);
                app.all("/proxy/(:port)(/*)?", function (req, res) {
                    pathProxy.proxy(req, res);
                });
                wsApp.get("/proxy/(:port)(/*)?", function (req) {
                    pathProxy.wsProxy(req);
                });
                // These two routes pass through the path directly.
                // So the proxied app must be aware it is running
                // under /absproxy/<someport>/
                app.all("/absproxy/(:port)(/*)?", function (req, res) {
                    pathProxy.proxy(req, res, {
                        passthroughPath: true,
                    });
                });
                wsApp.get("/absproxy/(:port)(/*)?", function (req) {
                    pathProxy.wsProxy(req, {
                        passthroughPath: true,
                    });
                });
                if (!!process.env.CS_DISABLE_PLUGINS) return [3 /*break*/, 2];
                workingDir = args._ && args._.length > 0 ? path.resolve(args._[args._.length - 1]) : undefined;
                pluginApi_1 = new plugin_1.PluginAPI(logger_1.logger, process.env.CS_PLUGIN, process.env.CS_PLUGIN_PATH, workingDir);
                return [4 /*yield*/, pluginApi_1.loadPlugins()];
            case 1:
                _a.sent();
                pluginApi_1.mount(app, wsApp);
                app.use("/api/applications", http_2.ensureAuthenticated, apps.router(pluginApi_1));
                wrapper_1.wrapper.onDispose(function () { return pluginApi_1.dispose(); });
                _a.label = 2;
            case 2:
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
                    app.all("/login", function (req, res) { return http_2.redirect(req, res, "/", {}); });
                    app.all("/logout", function (req, res) { return http_2.redirect(req, res, "/", {}); });
                }
                app.use("/static", _static.router);
                app.use("/update", update.router);
                app.use(function () {
                    throw new http_1.HttpError("Not Found", http_1.HttpCode.NotFound);
                });
                errorHandler = function (err, req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
                    var status, resourcePath, content;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (err.code === "ENOENT" || err.code === "EISDIR") {
                                    err.status = http_1.HttpCode.NotFound;
                                }
                                status = (_b = (_a = err.status) !== null && _a !== void 0 ? _a : err.statusCode) !== null && _b !== void 0 ? _b : 500;
                                res.status(status);
                                if (!(req.headers.accept && req.headers.accept.includes("text/html"))) return [3 /*break*/, 2];
                                resourcePath = path.resolve(constants_1.rootPath, "src/browser/pages/error.html");
                                res.set("Content-Type", util_2.getMediaMime(resourcePath));
                                return [4 /*yield*/, fs_1.promises.readFile(resourcePath, "utf8")];
                            case 1:
                                content = _c.sent();
                                res.send(http_2.replaceTemplates(req, content)
                                    .replace(/{{ERROR_TITLE}}/g, status)
                                    .replace(/{{ERROR_HEADER}}/g, status)
                                    .replace(/{{ERROR_BODY}}/g, err.message));
                                return [3 /*break*/, 3];
                            case 2:
                                res.json(__assign({ error: err.message }, (err.details || {})));
                                _c.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); };
                app.use(errorHandler);
                wsErrorHandler = function (err, req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        logger_1.logger.error(err.message + " " + err.stack);
                        req.ws.end();
                        return [2 /*return*/];
                    });
                }); };
                wsApp.use(wsErrorHandler);
                return [2 /*return*/];
        }
    });
}); };
exports.register = register;
//# sourceMappingURL=index.js.map