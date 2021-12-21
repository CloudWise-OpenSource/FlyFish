"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.isChild = exports.wrapper = exports.ParentProcess = exports.onMessage = void 0;
var logger_1 = require("@coder/logger");
var cp = __importStar(require("child_process"));
var path = __importStar(require("path"));
var rfs = __importStar(require("rotating-file-stream"));
var emitter_1 = require("../common/emitter");
var util_1 = require("./util");
var timeoutInterval = 10000; // 10s, matches VS Code's timeouts.
/**
 * Listen to a single message from a process. Reject if the process errors,
 * exits, or times out.
 *
 * `fn` is a function that determines whether the message is the one we're
 * waiting for.
 */
function onMessage(proc, fn, customLogger) {
    return new Promise(function (resolve, reject) {
        var cleanup = function () {
            proc.off("error", onError);
            proc.off("exit", onExit);
            proc.off("message", onMessage);
            clearTimeout(timeout);
        };
        var timeout = setTimeout(function () {
            cleanup();
            reject(new Error("timed out"));
        }, timeoutInterval);
        var onError = function (error) {
            cleanup();
            reject(error);
        };
        var onExit = function (code) {
            cleanup();
            reject(new Error("exited unexpectedly with code " + code));
        };
        var onMessage = function (message) {
            ;
            (customLogger || logger_1.logger).trace("got message", logger_1.field("message", message));
            if (fn(message)) {
                cleanup();
                resolve(message);
            }
        };
        proc.on("message", onMessage);
        proc.on("error", onError);
        proc.on("exit", onExit);
    });
}
exports.onMessage = onMessage;
var ProcessError = /** @class */ (function (_super) {
    __extends(ProcessError, _super);
    function ProcessError(message, code) {
        var _this = _super.call(this, message) || this;
        _this.code = code;
        _this.name = _this.constructor.name;
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return ProcessError;
}(Error));
/**
 * Wrapper around a process that tries to gracefully exit when a process exits
 * and provides a way to prevent `process.exit`.
 */
var Process = /** @class */ (function () {
    function Process() {
        var _this = this;
        /**
         * Emit this to trigger a graceful exit.
         */
        this._onDispose = new emitter_1.Emitter();
        /**
         * Emitted when the process is about to be disposed.
         */
        this.onDispose = this._onDispose.event;
        this.processExit = process.exit;
        process.on("SIGINT", function () { return _this._onDispose.emit("SIGINT"); });
        process.on("SIGTERM", function () { return _this._onDispose.emit("SIGTERM"); });
        process.on("exit", function () { return _this._onDispose.emit(undefined); });
        this.onDispose(function (signal, wait) {
            // Remove listeners to avoid possibly triggering disposal again.
            process.removeAllListeners();
            // Try waiting for other handlers to run first then exit.
            _this.logger.debug("disposing", logger_1.field("code", signal));
            wait.then(function () { return _this.exit(0); });
            setTimeout(function () { return _this.exit(0); }, 5000);
        });
    }
    /**
     * Ensure control over when the process exits.
     */
    Process.prototype.preventExit = function () {
        var _this = this;
        ;
        process.exit = function (code) {
            _this.logger.warn("process.exit() was prevented: " + (code || "unknown code") + ".");
        };
    };
    /**
     * Will always exit even if normal exit is being prevented.
     */
    Process.prototype.exit = function (error) {
        if (error && typeof error !== "number") {
            this.processExit(typeof error.code === "number" ? error.code : 1);
        }
        else {
            this.processExit(error);
        }
    };
    return Process;
}());
/**
 * Child process that will clean up after itself if the parent goes away and can
 * perform a handshake with the parent and ask it to relaunch.
 */
var ChildProcess = /** @class */ (function (_super) {
    __extends(ChildProcess, _super);
    function ChildProcess(parentPid) {
        var _this = _super.call(this) || this;
        _this.parentPid = parentPid;
        _this.logger = logger_1.logger.named("child:" + process.pid);
        // Kill the inner process if the parent dies. This is for the case where the
        // parent process is forcefully terminated and cannot clean up.
        setInterval(function () {
            try {
                // process.kill throws an exception if the process doesn't exist.
                process.kill(_this.parentPid, 0);
            }
            catch (_) {
                // Consider this an error since it should have been able to clean up
                // the child process unless it was forcefully killed.
                _this.logger.error("parent process " + parentPid + " died");
                _this._onDispose.emit(undefined);
            }
        }, 5000);
        return _this;
    }
    /**
     * Initiate the handshake and wait for a response from the parent.
     */
    ChildProcess.prototype.handshake = function () {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.send({ type: "handshake" });
                        return [4 /*yield*/, onMessage(process, function (message) {
                                return message.type === "handshake";
                            }, this.logger)];
                    case 1:
                        message = _a.sent();
                        return [2 /*return*/, message.args];
                }
            });
        });
    };
    /**
     * Notify the parent process that it should relaunch the child.
     */
    ChildProcess.prototype.relaunch = function (version) {
        this.send({ type: "relaunch", version: version });
    };
    /**
     * Send a message to the parent.
     */
    ChildProcess.prototype.send = function (message) {
        if (!process.send) {
            throw new Error("not spawned with IPC");
        }
        process.send(message);
    };
    return ChildProcess;
}(Process));
/**
 * Parent process wrapper that spawns the child process and performs a handshake
 * with it. Will relaunch the child if it receives a SIGUSR1 or is asked to by
 * the child. If the child otherwise exits the parent will also exit.
 */
var ParentProcess = /** @class */ (function (_super) {
    __extends(ParentProcess, _super);
    function ParentProcess(currentVersion) {
        var _this = _super.call(this) || this;
        _this.currentVersion = currentVersion;
        _this.logger = logger_1.logger.named("parent:" + process.pid);
        _this._onChildMessage = new emitter_1.Emitter();
        _this.onChildMessage = _this._onChildMessage.event;
        process.on("SIGUSR1", function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.logger.info("Received SIGUSR1; hotswapping");
                this.relaunch();
                return [2 /*return*/];
            });
        }); });
        var opts = {
            size: "10M",
            maxFiles: 10,
        };
        _this.logStdoutStream = rfs.createStream(path.join(util_1.paths.data, "coder-logs", "code-server-stdout.log"), opts);
        _this.logStderrStream = rfs.createStream(path.join(util_1.paths.data, "coder-logs", "code-server-stderr.log"), opts);
        _this.onDispose(function () { return _this.disposeChild(); });
        _this.onChildMessage(function (message) {
            switch (message.type) {
                case "relaunch":
                    _this.logger.info("Relaunching: " + _this.currentVersion + " -> " + message.version);
                    _this.currentVersion = message.version;
                    _this.relaunch();
                    break;
                default:
                    _this.logger.error("Unrecognized message " + message);
                    break;
            }
        });
        return _this;
    }
    ParentProcess.prototype.disposeChild = function () {
        return __awaiter(this, void 0, void 0, function () {
            var child_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.started = undefined;
                        if (!this.child) return [3 /*break*/, 2];
                        child_1 = this.child;
                        child_1.removeAllListeners();
                        child_1.kill();
                        // Wait for the child to exit otherwise its output will be lost which can
                        // be especially problematic if you're trying to debug why cleanup failed.
                        return [4 /*yield*/, new Promise(function (r) { return child_1.on("exit", r); })];
                    case 1:
                        // Wait for the child to exit otherwise its output will be lost which can
                        // be especially problematic if you're trying to debug why cleanup failed.
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    ParentProcess.prototype.relaunch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.disposeChild();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        this.started = this._start();
                        return [4 /*yield*/, this.started];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        this.logger.error(error_1.message);
                        this.exit(typeof error_1.code === "number" ? error_1.code : 1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ParentProcess.prototype.start = function (args) {
        // Store for relaunches.
        this.args = args;
        if (!this.started) {
            this.started = this._start();
        }
        return this.started;
    };
    ParentProcess.prototype._start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var child;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        child = this.spawn();
                        this.child = child;
                        // Log both to stdout and to the log directory.
                        if (child.stdout) {
                            child.stdout.pipe(this.logStdoutStream);
                            child.stdout.pipe(process.stdout);
                        }
                        if (child.stderr) {
                            child.stderr.pipe(this.logStderrStream);
                            child.stderr.pipe(process.stderr);
                        }
                        this.logger.debug("spawned inner process " + child.pid);
                        return [4 /*yield*/, this.handshake(child)];
                    case 1:
                        _a.sent();
                        child.once("exit", function (code) {
                            _this.logger.debug("inner process " + child.pid + " exited unexpectedly");
                            _this.exit(code || 0);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    ParentProcess.prototype.spawn = function () {
        // Use spawn (instead of fork) to use the new binary in case it was updated.
        return cp.spawn(process.argv[0], process.argv.slice(1), {
            env: __assign(__assign({}, process.env), { CODE_SERVER_PARENT_PID: process.pid.toString(), NODE_OPTIONS: "--max-old-space-size=2048 " + (process.env.NODE_OPTIONS || "") }),
            stdio: ["inherit", "inherit", "inherit", "ipc"],
        });
    };
    /**
     * Wait for a handshake from the child then reply.
     */
    ParentProcess.prototype.handshake = function (child) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.args) {
                            throw new Error("started without args");
                        }
                        return [4 /*yield*/, onMessage(child, function (message) {
                                return message.type === "handshake";
                            }, this.logger)];
                    case 1:
                        _a.sent();
                        this.send(child, { type: "handshake", args: this.args });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Send a message to the child.
     */
    ParentProcess.prototype.send = function (child, message) {
        child.send(message);
    };
    return ParentProcess;
}(Process));
exports.ParentProcess = ParentProcess;
/**
 * Process wrapper.
 */
exports.wrapper = typeof process.env.CODE_SERVER_PARENT_PID !== "undefined"
    ? new ChildProcess(parseInt(process.env.CODE_SERVER_PARENT_PID))
    : new ParentProcess(require("../../package.json").version);
function isChild(proc) {
    return proc instanceof ChildProcess;
}
exports.isChild = isChild;
// It's possible that the pipe has closed (for example if you run code-server
// --version | head -1). Assume that means we're done.
if (!process.stdout.isTTY) {
    process.stdout.on("error", function () { return exports.wrapper.exit(); });
}
// Don't let uncaught exceptions crash the process.
process.on("uncaughtException", function (error) {
    exports.wrapper.logger.error("Uncaught exception: " + error.message);
    if (typeof error.stack !== "undefined") {
        exports.wrapper.logger.error(error.stack);
    }
});
//# sourceMappingURL=wrapper.js.map