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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginAPI = exports.codeServer = void 0;
var logger_1 = require("@coder/logger");
var express = __importStar(require("express"));
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var semver = __importStar(require("semver"));
var http_1 = require("../common/http");
var constants_1 = require("./constants");
var http_2 = require("./http");
var proxy_1 = require("./proxy");
var util = __importStar(require("./util"));
var wsRouter_1 = require("./wsRouter");
var fsp = fs.promises;
/**
 * Inject code-server when `require`d. This is required because the API provides
 * more than just types so these need to be provided at run-time.
 */
var originalLoad = require("module")._load;
require("module")._load = function (request, parent, isMain) {
    return request === "code-server" ? exports.codeServer : originalLoad.apply(this, [request, parent, isMain]);
};
/**
 * The module you get when importing "code-server".
 */
exports.codeServer = {
    HttpCode: http_1.HttpCode,
    HttpError: http_1.HttpError,
    Level: logger_1.Level,
    authenticated: http_2.authenticated,
    ensureAuthenticated: http_2.ensureAuthenticated,
    express: express,
    field: logger_1.field,
    proxy: proxy_1.proxy,
    replaceTemplates: http_2.replaceTemplates,
    WsRouter: wsRouter_1.Router,
    wss: wsRouter_1.wss,
};
/**
 * PluginAPI implements the plugin API described in typings/pluginapi.d.ts
 * Please see that file for details.
 */
var PluginAPI = /** @class */ (function () {
    function PluginAPI(logger, 
    /**
     * These correspond to $CS_PLUGIN_PATH and $CS_PLUGIN respectively.
     */
    csPlugin, csPluginPath, workingDirectory) {
        if (csPlugin === void 0) { csPlugin = ""; }
        if (csPluginPath === void 0) { csPluginPath = path.join(util.paths.data, "plugins") + ":/usr/share/code-server/plugins"; }
        if (workingDirectory === void 0) { workingDirectory = undefined; }
        this.csPlugin = csPlugin;
        this.csPluginPath = csPluginPath;
        this.workingDirectory = workingDirectory;
        this.plugins = new Map();
        this.logger = logger.named("pluginapi");
    }
    /**
     * applications grabs the full list of applications from
     * all loaded plugins.
     */
    PluginAPI.prototype.applications = function () {
        return __awaiter(this, void 0, void 0, function () {
            var apps, _loop_1, _a, _b, _c, p, e_1_1;
            var e_1, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        apps = new Array();
                        _loop_1 = function (p) {
                            var pluginApps;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        if (!p.applications) {
                                            return [2 /*return*/, "continue"];
                                        }
                                        return [4 /*yield*/, p.applications()
                                            // Add plugin key to each app.
                                        ];
                                    case 1:
                                        pluginApps = _f.sent();
                                        // Add plugin key to each app.
                                        apps.push.apply(apps, __spreadArray([], __read(pluginApps.map(function (app) {
                                            app = __assign(__assign({}, app), { path: path.join(p.routerPath, app.path || "") });
                                            app = __assign(__assign({}, app), { iconPath: path.join(app.path || "", app.iconPath) });
                                            return __assign(__assign({}, app), { plugin: {
                                                    name: p.name,
                                                    version: p.version,
                                                    modulePath: p.modulePath,
                                                    displayName: p.displayName,
                                                    description: p.description,
                                                    routerPath: p.routerPath,
                                                    homepageURL: p.homepageURL,
                                                } });
                                        }))));
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 6, 7, 8]);
                        _a = __values(this.plugins), _b = _a.next();
                        _e.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 5];
                        _c = __read(_b.value, 2), p = _c[1];
                        return [5 /*yield**/, _loop_1(p)];
                    case 3:
                        _e.sent();
                        _e.label = 4;
                    case 4:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/, apps];
                }
            });
        });
    };
    /**
     * mount mounts all plugin routers onto r and websocket routers onto wr.
     */
    PluginAPI.prototype.mount = function (r, wr) {
        var e_2, _a;
        try {
            for (var _b = __values(this.plugins), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), p = _d[1];
                if (p.router) {
                    r.use("" + p.routerPath, p.router());
                }
                if (p.wsRouter) {
                    wr.use("" + p.routerPath, p.wsRouter().router);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    /**
     * loadPlugins loads all plugins based on this.csPlugin,
     * this.csPluginPath and the built in plugins.
     */
    PluginAPI.prototype.loadPlugins = function (loadBuiltin) {
        if (loadBuiltin === void 0) { loadBuiltin = true; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, dir, e_3_1, _c, _d, dir, e_4_1;
            var e_3, _e, e_4, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 5, 6, 7]);
                        _a = __values(this.csPlugin.split(":")), _b = _a.next();
                        _g.label = 1;
                    case 1:
                        if (!!_b.done) return [3 /*break*/, 4];
                        dir = _b.value;
                        if (!dir) {
                            return [3 /*break*/, 3];
                        }
                        return [4 /*yield*/, this.loadPlugin(dir)];
                    case 2:
                        _g.sent();
                        _g.label = 3;
                    case 3:
                        _b = _a.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_3_1 = _g.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                        }
                        finally { if (e_3) throw e_3.error; }
                        return [7 /*endfinally*/];
                    case 7:
                        _g.trys.push([7, 12, 13, 14]);
                        _c = __values(this.csPluginPath.split(":")), _d = _c.next();
                        _g.label = 8;
                    case 8:
                        if (!!_d.done) return [3 /*break*/, 11];
                        dir = _d.value;
                        if (!dir) {
                            return [3 /*break*/, 10];
                        }
                        return [4 /*yield*/, this._loadPlugins(dir)];
                    case 9:
                        _g.sent();
                        _g.label = 10;
                    case 10:
                        _d = _c.next();
                        return [3 /*break*/, 8];
                    case 11: return [3 /*break*/, 14];
                    case 12:
                        e_4_1 = _g.sent();
                        e_4 = { error: e_4_1 };
                        return [3 /*break*/, 14];
                    case 13:
                        try {
                            if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                        }
                        finally { if (e_4) throw e_4.error; }
                        return [7 /*endfinally*/];
                    case 14:
                        if (!loadBuiltin) return [3 /*break*/, 16];
                        return [4 /*yield*/, this._loadPlugins(path.join(__dirname, "../../plugins"))];
                    case 15:
                        _g.sent();
                        _g.label = 16;
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * _loadPlugins is the counterpart to loadPlugins.
     *
     * It differs in that it loads all plugins in a single
     * directory whereas loadPlugins uses all available directories
     * as documented.
     */
    PluginAPI.prototype._loadPlugins = function (dir) {
        return __awaiter(this, void 0, void 0, function () {
            var entries, entries_1, entries_1_1, ent, e_5_1, err_1;
            var e_5, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 10, , 11]);
                        return [4 /*yield*/, fsp.readdir(dir, { withFileTypes: true })];
                    case 1:
                        entries = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, 8, 9]);
                        entries_1 = __values(entries), entries_1_1 = entries_1.next();
                        _b.label = 3;
                    case 3:
                        if (!!entries_1_1.done) return [3 /*break*/, 6];
                        ent = entries_1_1.value;
                        if (!ent.isDirectory()) {
                            return [3 /*break*/, 5];
                        }
                        return [4 /*yield*/, this.loadPlugin(path.join(dir, ent.name))];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        entries_1_1 = entries_1.next();
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_5_1 = _b.sent();
                        e_5 = { error: e_5_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
                        }
                        finally { if (e_5) throw e_5.error; }
                        return [7 /*endfinally*/];
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        err_1 = _b.sent();
                        if (err_1.code !== "ENOENT") {
                            this.logger.warn("failed to load plugins from " + q(dir) + ": " + err_1.message);
                        }
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    PluginAPI.prototype.loadPlugin = function (dir) {
        return __awaiter(this, void 0, void 0, function () {
            var str, packageJSON, _a, _b, _c, p_1, p, err_2;
            var e_6, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fsp.readFile(path.join(dir, "package.json"), {
                                encoding: "utf8",
                            })];
                    case 1:
                        str = _e.sent();
                        packageJSON = JSON.parse(str);
                        try {
                            for (_a = __values(this.plugins), _b = _a.next(); !_b.done; _b = _a.next()) {
                                _c = __read(_b.value, 2), p_1 = _c[1];
                                if (p_1.name === packageJSON.name) {
                                    this.logger.warn("ignoring duplicate plugin " + q(p_1.name) + " at " + q(dir) + ", using previously loaded " + q(p_1.modulePath));
                                    return [2 /*return*/];
                                }
                            }
                        }
                        catch (e_6_1) { e_6 = { error: e_6_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                            }
                            finally { if (e_6) throw e_6.error; }
                        }
                        p = this._loadPlugin(dir, packageJSON);
                        this.plugins.set(p.name, p);
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _e.sent();
                        if (err_2.code !== "ENOENT") {
                            this.logger.warn("failed to load plugin: " + err_2.stack);
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * _loadPlugin is the counterpart to loadPlugin and actually
     * loads the plugin now that we know there is no duplicate
     * and that the package.json has been read.
     */
    PluginAPI.prototype._loadPlugin = function (dir, packageJSON) {
        dir = path.resolve(dir);
        var logger = this.logger.named(packageJSON.name);
        logger.debug("loading plugin", logger_1.field("plugin_dir", dir), logger_1.field("package_json", packageJSON));
        if (!packageJSON.name) {
            throw new Error("plugin package.json missing name");
        }
        if (!packageJSON.version) {
            throw new Error("plugin package.json missing version");
        }
        if (!packageJSON.engines || !packageJSON.engines["code-server"]) {
            throw new Error("plugin package.json missing code-server range like:\n  \"engines\": {\n    \"code-server\": \"^3.7.0\"\n   }\n");
        }
        if (!semver.satisfies(constants_1.version, packageJSON.engines["code-server"])) {
            throw new Error("plugin range " + q(packageJSON.engines["code-server"]) + " incompatible" + (" with code-server version " + constants_1.version));
        }
        var pluginModule = require(dir);
        if (!pluginModule.plugin) {
            throw new Error("plugin module does not export a plugin");
        }
        var p = __assign({ name: packageJSON.name, version: packageJSON.version, modulePath: dir }, pluginModule.plugin);
        if (!p.displayName) {
            throw new Error("plugin missing displayName");
        }
        if (!p.description) {
            throw new Error("plugin missing description");
        }
        if (!p.routerPath) {
            throw new Error("plugin missing router path");
        }
        if (!p.routerPath.startsWith("/")) {
            throw new Error("plugin router path " + q(p.routerPath) + ": invalid");
        }
        if (!p.homepageURL) {
            throw new Error("plugin missing homepage");
        }
        p.init({
            logger: logger,
            workingDirectory: this.workingDirectory,
        });
        logger.debug("loaded");
        return p;
    };
    PluginAPI.prototype.dispose = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(Array.from(this.plugins.values()).map(function (p) { return __awaiter(_this, void 0, void 0, function () {
                            var error_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!p.deinit) {
                                            return [2 /*return*/];
                                        }
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, p.deinit()];
                                    case 2:
                                        _a.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        error_1 = _a.sent();
                                        this.logger.error("plugin failed to deinit", logger_1.field("name", p.name), logger_1.field("error", error_1.message));
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return PluginAPI;
}());
exports.PluginAPI = PluginAPI;
function q(s) {
    if (s === undefined) {
        s = "undefined";
    }
    return JSON.stringify(s);
}
//# sourceMappingURL=plugin.js.map