#!/usr/bin/env node
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
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("@coder/logger");
var cli_1 = require("./cli");
var constants_1 = require("./constants");
var main_1 = require("./main");
var proxyAgent = __importStar(require("./proxy_agent"));
var wrapper_1 = require("./wrapper");
function entry() {
    return __awaiter(this, void 0, void 0, function () {
        var args_1, cliArgs, configArgs, args, socketPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    proxyAgent.monkeyPatch(false);
                    if (!wrapper_1.isChild(wrapper_1.wrapper)) return [3 /*break*/, 3];
                    return [4 /*yield*/, wrapper_1.wrapper.handshake()];
                case 1:
                    args_1 = _a.sent();
                    wrapper_1.wrapper.preventExit();
                    return [4 /*yield*/, main_1.runCodeServer(args_1)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
                case 3:
                    cliArgs = cli_1.parse(process.argv.slice(2));
                    return [4 /*yield*/, cli_1.readConfigFile(cliArgs.config)];
                case 4:
                    configArgs = _a.sent();
                    return [4 /*yield*/, cli_1.setDefaults(cliArgs, configArgs)];
                case 5:
                    args = _a.sent();
                    if (args.help) {
                        console.log("code-server", constants_1.version, constants_1.commit);
                        console.log("");
                        console.log("Usage: code-server [options] [path]");
                        console.log("");
                        console.log("Options");
                        cli_1.optionDescriptions().forEach(function (description) {
                            console.log("", description);
                        });
                        return [2 /*return*/];
                    }
                    if (args.version) {
                        if (args.json) {
                            console.log({
                                codeServer: constants_1.version,
                                commit: constants_1.commit,
                                vscode: require("../../lib/vscode/package.json").version,
                            });
                        }
                        else {
                            console.log(constants_1.version, constants_1.commit);
                        }
                        return [2 /*return*/];
                    }
                    if (cli_1.shouldRunVsCodeCli(args)) {
                        return [2 /*return*/, main_1.runVsCodeCli(args)];
                    }
                    return [4 /*yield*/, cli_1.shouldOpenInExistingInstance(cliArgs)];
                case 6:
                    socketPath = _a.sent();
                    if (socketPath) {
                        return [2 /*return*/, main_1.openInExistingInstance(args, socketPath)];
                    }
                    return [2 /*return*/, wrapper_1.wrapper.start(args)];
            }
        });
    });
}
entry().catch(function (error) {
    logger_1.logger.error(error.message);
    wrapper_1.wrapper.exit(error);
});
//# sourceMappingURL=entry.js.map