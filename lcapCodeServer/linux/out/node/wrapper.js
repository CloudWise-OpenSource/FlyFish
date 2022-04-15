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
exports.isChild = exports.wrapper = exports.ParentProcess = exports.onMessage = void 0;
const logger_1 = require("@coder/logger");
const cp = __importStar(require("child_process"));
const path = __importStar(require("path"));
const rfs = __importStar(require("rotating-file-stream"));
const emitter_1 = require("../common/emitter");
const util_1 = require("./util");
const timeoutInterval = 10000; // 10s, matches VS Code's timeouts.
/**
 * Listen to a single message from a process. Reject if the process errors,
 * exits, or times out.
 *
 * `fn` is a function that determines whether the message is the one we're
 * waiting for.
 */
function onMessage(proc, fn, customLogger) {
    return new Promise((resolve, reject) => {
        const cleanup = () => {
            proc.off("error", onError);
            proc.off("exit", onExit);
            proc.off("message", onMessage);
            clearTimeout(timeout);
        };
        const timeout = setTimeout(() => {
            cleanup();
            reject(new Error("timed out"));
        }, timeoutInterval);
        const onError = (error) => {
            cleanup();
            reject(error);
        };
        const onExit = (code) => {
            cleanup();
            reject(new Error(`exited unexpectedly with code ${code}`));
        };
        const onMessage = (message) => {
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
class ProcessError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
/**
 * Wrapper around a process that tries to gracefully exit when a process exits
 * and provides a way to prevent `process.exit`.
 */
class Process {
    constructor() {
        /**
         * Emit this to trigger a graceful exit.
         */
        this._onDispose = new emitter_1.Emitter();
        /**
         * Emitted when the process is about to be disposed.
         */
        this.onDispose = this._onDispose.event;
        this.processExit = process.exit;
        process.on("SIGINT", () => this._onDispose.emit("SIGINT"));
        process.on("SIGTERM", () => this._onDispose.emit("SIGTERM"));
        process.on("exit", () => this._onDispose.emit(undefined));
        this.onDispose((signal, wait) => {
            // Remove listeners to avoid possibly triggering disposal again.
            process.removeAllListeners();
            // Try waiting for other handlers to run first then exit.
            this.logger.debug("disposing", logger_1.field("code", signal));
            wait.then(() => this.exit(0));
            setTimeout(() => this.exit(0), 5000);
        });
    }
    /**
     * Ensure control over when the process exits.
     */
    preventExit() {
        ;
        process.exit = (code) => {
            this.logger.warn(`process.exit() was prevented: ${code || "unknown code"}.`);
        };
    }
    /**
     * Will always exit even if normal exit is being prevented.
     */
    exit(error) {
        if (error && typeof error !== "number") {
            this.processExit(typeof error.code === "number" ? error.code : 1);
        }
        else {
            this.processExit(error);
        }
    }
}
/**
 * Child process that will clean up after itself if the parent goes away and can
 * perform a handshake with the parent and ask it to relaunch.
 */
class ChildProcess extends Process {
    constructor(parentPid) {
        super();
        this.parentPid = parentPid;
        this.logger = logger_1.logger.named(`child:${process.pid}`);
        // Kill the inner process if the parent dies. This is for the case where the
        // parent process is forcefully terminated and cannot clean up.
        setInterval(() => {
            try {
                // process.kill throws an exception if the process doesn't exist.
                process.kill(this.parentPid, 0);
            }
            catch (_) {
                // Consider this an error since it should have been able to clean up
                // the child process unless it was forcefully killed.
                this.logger.error(`parent process ${parentPid} died`);
                this._onDispose.emit(undefined);
            }
        }, 5000);
    }
    /**
     * Initiate the handshake and wait for a response from the parent.
     */
    async handshake() {
        this.send({ type: "handshake" });
        const message = await onMessage(process, (message) => {
            return message.type === "handshake";
        }, this.logger);
        return message.args;
    }
    /**
     * Notify the parent process that it should relaunch the child.
     */
    relaunch(version) {
        this.send({ type: "relaunch", version });
    }
    /**
     * Send a message to the parent.
     */
    send(message) {
        if (!process.send) {
            throw new Error("not spawned with IPC");
        }
        process.send(message);
    }
}
/**
 * Parent process wrapper that spawns the child process and performs a handshake
 * with it. Will relaunch the child if it receives a SIGUSR1 or is asked to by
 * the child. If the child otherwise exits the parent will also exit.
 */
class ParentProcess extends Process {
    constructor(currentVersion) {
        super();
        this.currentVersion = currentVersion;
        this.logger = logger_1.logger.named(`parent:${process.pid}`);
        this._onChildMessage = new emitter_1.Emitter();
        this.onChildMessage = this._onChildMessage.event;
        process.on("SIGUSR1", async () => {
            this.logger.info("Received SIGUSR1; hotswapping");
            this.relaunch();
        });
        const opts = {
            size: "10M",
            maxFiles: 10,
        };
        this.logStdoutStream = rfs.createStream(path.join(util_1.paths.data, "coder-logs", "code-server-stdout.log"), opts);
        this.logStderrStream = rfs.createStream(path.join(util_1.paths.data, "coder-logs", "code-server-stderr.log"), opts);
        this.onDispose(() => this.disposeChild());
        this.onChildMessage((message) => {
            switch (message.type) {
                case "relaunch":
                    this.logger.info(`Relaunching: ${this.currentVersion} -> ${message.version}`);
                    this.currentVersion = message.version;
                    this.relaunch();
                    break;
                default:
                    this.logger.error(`Unrecognized message ${message}`);
                    break;
            }
        });
    }
    async disposeChild() {
        this.started = undefined;
        if (this.child) {
            const child = this.child;
            child.removeAllListeners();
            child.kill();
            // Wait for the child to exit otherwise its output will be lost which can
            // be especially problematic if you're trying to debug why cleanup failed.
            await new Promise((r) => child.on("exit", r));
        }
    }
    async relaunch() {
        this.disposeChild();
        try {
            this.started = this._start();
            await this.started;
        }
        catch (error) {
            this.logger.error(error.message);
            this.exit(typeof error.code === "number" ? error.code : 1);
        }
    }
    start(args) {
        // Store for relaunches.
        this.args = args;
        if (!this.started) {
            this.started = this._start();
        }
        return this.started;
    }
    async _start() {
        const child = this.spawn();
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
        this.logger.debug(`spawned inner process ${child.pid}`);
        await this.handshake(child);
        child.once("exit", (code) => {
            this.logger.debug(`inner process ${child.pid} exited unexpectedly`);
            this.exit(code || 0);
        });
    }
    spawn() {
        // Use spawn (instead of fork) to use the new binary in case it was updated.
        return cp.spawn(process.argv[0], process.argv.slice(1), {
            env: {
                ...process.env,
                CODE_SERVER_PARENT_PID: process.pid.toString(),
                NODE_OPTIONS: `--max-old-space-size=2048 ${process.env.NODE_OPTIONS || ""}`,
            },
            stdio: ["inherit", "inherit", "inherit", "ipc"],
        });
    }
    /**
     * Wait for a handshake from the child then reply.
     */
    async handshake(child) {
        if (!this.args) {
            throw new Error("started without args");
        }
        await onMessage(child, (message) => {
            return message.type === "handshake";
        }, this.logger);
        this.send(child, { type: "handshake", args: this.args });
    }
    /**
     * Send a message to the child.
     */
    send(child, message) {
        child.send(message);
    }
}
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
    process.stdout.on("error", () => exports.wrapper.exit());
}
// Don't let uncaught exceptions crash the process.
process.on("uncaughtException", (error) => {
    exports.wrapper.logger.error(`Uncaught exception: ${error.message}`);
    if (typeof error.stack !== "undefined") {
        exports.wrapper.logger.error(error.stack);
    }
});
//# sourceMappingURL=wrapper.js.map