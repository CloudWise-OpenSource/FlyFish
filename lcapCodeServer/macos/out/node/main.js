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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCodeServer = exports.openInExistingInstance = exports.runVsCodeCli = void 0;
var logger_1 = require("@coder/logger");
var cp = __importStar(require("child_process"));
var http_1 = __importDefault(require("http"));
var path = __importStar(require("path"));
var util_1 = require("../common/util");
var app_1 = require("./app");
var cli_1 = require("./cli");
var coder_cloud_1 = require("./coder_cloud");
var constants_1 = require("./constants");
var routes_1 = require("./routes");
var util_2 = require("./util");
var runVsCodeCli = function (args) {
    logger_1.logger.debug("forking vs code cli...");
    var vscode = cp.fork(path.resolve(__dirname, "../../lib/vscode/out/vs/server/fork"), [], {
        env: __assign(__assign({}, process.env), { CODE_SERVER_PARENT_PID: process.pid.toString() }),
    });
    vscode.once("message", function (message) {
        logger_1.logger.debug("got message from VS Code", logger_1.field("message", message));
        if (message.type !== "ready") {
            logger_1.logger.error("Unexpected response waiting for ready response", logger_1.field("type", message.type));
            process.exit(1);
        }
        var send = { type: "cli", args: args };
        vscode.send(send);
    });
    vscode.once("error", function (error) {
        logger_1.logger.error("Got error from VS Code", logger_1.field("error", error));
        process.exit(1);
    });
    vscode.on("exit", function (code) { return process.exit(code || 0); });
};
exports.runVsCodeCli = runVsCodeCli;
var openInExistingInstance = function (args, socketPath) { return __awaiter(void 0, void 0, void 0, function () {
    var pipeArgs, i, fp, vscode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pipeArgs = {
                    type: "open",
                    folderURIs: [],
                    fileURIs: [],
                    forceReuseWindow: args["reuse-window"],
                    forceNewWindow: args["new-window"],
                };
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < args._.length)) return [3 /*break*/, 4];
                fp = path.resolve(args._[i]);
                return [4 /*yield*/, util_2.isFile(fp)];
            case 2:
                if (_a.sent()) {
                    pipeArgs.fileURIs.push(fp);
                }
                else {
                    pipeArgs.folderURIs.push(fp);
                }
                _a.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4:
                if (pipeArgs.forceNewWindow && pipeArgs.fileURIs.length > 0) {
                    logger_1.logger.error("--new-window can only be used with folder paths");
                    process.exit(1);
                }
                if (pipeArgs.folderURIs.length === 0 && pipeArgs.fileURIs.length === 0) {
                    logger_1.logger.error("Please specify at least one file or folder");
                    process.exit(1);
                }
                vscode = http_1.default.request({
                    path: "/",
                    method: "POST",
                    socketPath: socketPath,
                }, function (response) {
                    response.on("data", function (message) {
                        logger_1.logger.debug("got message from VS Code", logger_1.field("message", message.toString()));
                    });
                });
                vscode.on("error", function (error) {
                    logger_1.logger.error("got error from VS Code", logger_1.field("error", error));
                });
                vscode.write(JSON.stringify(pipeArgs));
                vscode.end();
                return [2 /*return*/];
        }
    });
}); };
exports.openInExistingInstance = openInExistingInstance;
var runCodeServer = function (args) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, app, wsApp, server, serverAddress, openAddress, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                logger_1.logger.info("code-server " + constants_1.version + " " + constants_1.commit);
                logger_1.logger.info("Using user-data-dir " + util_2.humanPath(args["user-data-dir"]));
                logger_1.logger.trace("Using extensions-dir " + util_2.humanPath(args["extensions-dir"]));
                if (args.auth === cli_1.AuthType.Password && !args.password && !args["hashed-password"]) {
                    throw new Error("Please pass in a password via the config file or environment variable ($PASSWORD or $HASHED_PASSWORD)");
                }
                return [4 /*yield*/, app_1.createApp(args)];
            case 1:
                _a = __read.apply(void 0, [_b.sent(), 3]), app = _a[0], wsApp = _a[1], server = _a[2];
                serverAddress = app_1.ensureAddress(server);
                return [4 /*yield*/, routes_1.register(app, wsApp, server, args)];
            case 2:
                _b.sent();
                logger_1.logger.info("Using config file " + util_2.humanPath(args.config));
                logger_1.logger.info("HTTP server listening on " + serverAddress + " " + (args.link ? "(randomized by --link)" : ""));
                if (args.auth === cli_1.AuthType.Password) {
                    logger_1.logger.info("  - Authentication is enabled");
                    if (args.usingEnvPassword) {
                        logger_1.logger.info("    - Using password from $PASSWORD");
                    }
                    else if (args.usingEnvHashedPassword) {
                        logger_1.logger.info("    - Using password from $HASHED_PASSWORD");
                    }
                    else {
                        logger_1.logger.info("    - Using password from " + util_2.humanPath(args.config));
                    }
                }
                else {
                    logger_1.logger.info("  - Authentication is disabled " + (args.link ? "(disabled by --link)" : ""));
                }
                if (args.cert) {
                    logger_1.logger.info("  - Using certificate for HTTPS: " + util_2.humanPath(args.cert.value));
                }
                else {
                    logger_1.logger.info("  - Not serving HTTPS " + (args.link ? "(disabled by --link)" : ""));
                }
                if (args["proxy-domain"].length > 0) {
                    logger_1.logger.info("  - " + util_1.plural(args["proxy-domain"].length, "Proxying the following domain") + ":");
                    args["proxy-domain"].forEach(function (domain) { return logger_1.logger.info("    - *." + domain); });
                }
                if (!args.link) return [3 /*break*/, 4];
                return [4 /*yield*/, coder_cloud_1.coderCloudBind(serverAddress.replace(/^https?:\/\//, ""), args.link.value)];
            case 3:
                _b.sent();
                logger_1.logger.info("  - Connected to cloud agent");
                _b.label = 4;
            case 4:
                if (args.enable && args.enable.length > 0) {
                    logger_1.logger.info("Enabling the following experimental features:");
                    args.enable.forEach(function (feature) {
                        if (Object.values(cli_1.Feature).includes(feature)) {
                            logger_1.logger.info("  - \"" + feature + "\"");
                        }
                        else {
                            logger_1.logger.error("  X \"" + feature + "\" (unknown feature)");
                        }
                    });
                    // TODO: Could be nice to add wrapping to the logger?
                    logger_1.logger.info("  The code-server project does not provide stability guarantees or commit to fixing bugs relating to these experimental features. When filing bug reports, please ensure that you can reproduce the bug with all experimental features turned off.");
                }
                if (!(!args.socket && args.open)) return [3 /*break*/, 8];
                openAddress = serverAddress.replace("://0.0.0.0", "://localhost");
                _b.label = 5;
            case 5:
                _b.trys.push([5, 7, , 8]);
                return [4 /*yield*/, util_2.open(openAddress)];
            case 6:
                _b.sent();
                logger_1.logger.info("Opened " + openAddress);
                return [3 /*break*/, 8];
            case 7:
                error_1 = _b.sent();
                logger_1.logger.error("Failed to open", logger_1.field("address", openAddress), logger_1.field("error", error_1));
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/, server];
        }
    });
}); };
exports.runCodeServer = runCodeServer;
//# sourceMappingURL=main.js.map