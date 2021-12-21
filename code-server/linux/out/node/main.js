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
exports.runCodeServer = exports.openInExistingInstance = exports.runVsCodeCli = void 0;
const logger_1 = require("@coder/logger");
const cp = __importStar(require("child_process"));
const http_1 = __importDefault(require("http"));
const path = __importStar(require("path"));
const util_1 = require("../common/util");
const app_1 = require("./app");
const cli_1 = require("./cli");
const coder_cloud_1 = require("./coder_cloud");
const constants_1 = require("./constants");
const routes_1 = require("./routes");
const util_2 = require("./util");
const runVsCodeCli = (args) => {
    logger_1.logger.debug("forking vs code cli...");
    const vscode = cp.fork(path.resolve(__dirname, "../../lib/vscode/out/vs/server/fork"), [], {
        env: {
            ...process.env,
            CODE_SERVER_PARENT_PID: process.pid.toString(),
        },
    });
    vscode.once("message", (message) => {
        logger_1.logger.debug("got message from VS Code", logger_1.field("message", message));
        if (message.type !== "ready") {
            logger_1.logger.error("Unexpected response waiting for ready response", logger_1.field("type", message.type));
            process.exit(1);
        }
        const send = { type: "cli", args };
        vscode.send(send);
    });
    vscode.once("error", (error) => {
        logger_1.logger.error("Got error from VS Code", logger_1.field("error", error));
        process.exit(1);
    });
    vscode.on("exit", (code) => process.exit(code || 0));
};
exports.runVsCodeCli = runVsCodeCli;
const openInExistingInstance = async (args, socketPath) => {
    const pipeArgs = {
        type: "open",
        folderURIs: [],
        fileURIs: [],
        forceReuseWindow: args["reuse-window"],
        forceNewWindow: args["new-window"],
    };
    for (let i = 0; i < args._.length; i++) {
        const fp = path.resolve(args._[i]);
        if (await util_2.isFile(fp)) {
            pipeArgs.fileURIs.push(fp);
        }
        else {
            pipeArgs.folderURIs.push(fp);
        }
    }
    if (pipeArgs.forceNewWindow && pipeArgs.fileURIs.length > 0) {
        logger_1.logger.error("--new-window can only be used with folder paths");
        process.exit(1);
    }
    if (pipeArgs.folderURIs.length === 0 && pipeArgs.fileURIs.length === 0) {
        logger_1.logger.error("Please specify at least one file or folder");
        process.exit(1);
    }
    const vscode = http_1.default.request({
        path: "/",
        method: "POST",
        socketPath,
    }, (response) => {
        response.on("data", (message) => {
            logger_1.logger.debug("got message from VS Code", logger_1.field("message", message.toString()));
        });
    });
    vscode.on("error", (error) => {
        logger_1.logger.error("got error from VS Code", logger_1.field("error", error));
    });
    vscode.write(JSON.stringify(pipeArgs));
    vscode.end();
};
exports.openInExistingInstance = openInExistingInstance;
const runCodeServer = async (args) => {
    logger_1.logger.info(`code-server ${constants_1.version} ${constants_1.commit}`);
    logger_1.logger.info(`Using user-data-dir ${util_2.humanPath(args["user-data-dir"])}`);
    logger_1.logger.trace(`Using extensions-dir ${util_2.humanPath(args["extensions-dir"])}`);
    if (args.auth === cli_1.AuthType.Password && !args.password && !args["hashed-password"]) {
        throw new Error("Please pass in a password via the config file or environment variable ($PASSWORD or $HASHED_PASSWORD)");
    }
    const [app, wsApp, server] = await app_1.createApp(args);
    const serverAddress = app_1.ensureAddress(server);
    await routes_1.register(app, wsApp, server, args);
    logger_1.logger.info(`Using config file ${util_2.humanPath(args.config)}`);
    logger_1.logger.info(`HTTP server listening on ${serverAddress} ${args.link ? "(randomized by --link)" : ""}`);
    if (args.auth === cli_1.AuthType.Password) {
        logger_1.logger.info("  - Authentication is enabled");
        if (args.usingEnvPassword) {
            logger_1.logger.info("    - Using password from $PASSWORD");
        }
        else if (args.usingEnvHashedPassword) {
            logger_1.logger.info("    - Using password from $HASHED_PASSWORD");
        }
        else {
            logger_1.logger.info(`    - Using password from ${util_2.humanPath(args.config)}`);
        }
    }
    else {
        logger_1.logger.info(`  - Authentication is disabled ${args.link ? "(disabled by --link)" : ""}`);
    }
    if (args.cert) {
        logger_1.logger.info(`  - Using certificate for HTTPS: ${util_2.humanPath(args.cert.value)}`);
    }
    else {
        logger_1.logger.info(`  - Not serving HTTPS ${args.link ? "(disabled by --link)" : ""}`);
    }
    if (args["proxy-domain"].length > 0) {
        logger_1.logger.info(`  - ${util_1.plural(args["proxy-domain"].length, "Proxying the following domain")}:`);
        args["proxy-domain"].forEach((domain) => logger_1.logger.info(`    - *.${domain}`));
    }
    if (args.link) {
        await coder_cloud_1.coderCloudBind(serverAddress.replace(/^https?:\/\//, ""), args.link.value);
        logger_1.logger.info("  - Connected to cloud agent");
    }
    if (args.enable && args.enable.length > 0) {
        logger_1.logger.info("Enabling the following experimental features:");
        args.enable.forEach((feature) => {
            if (Object.values(cli_1.Feature).includes(feature)) {
                logger_1.logger.info(`  - "${feature}"`);
            }
            else {
                logger_1.logger.error(`  X "${feature}" (unknown feature)`);
            }
        });
        // TODO: Could be nice to add wrapping to the logger?
        logger_1.logger.info("  The code-server project does not provide stability guarantees or commit to fixing bugs relating to these experimental features. When filing bug reports, please ensure that you can reproduce the bug with all experimental features turned off.");
    }
    if (!args.socket && args.open) {
        // The web socket doesn't seem to work if browsing with 0.0.0.0.
        const openAddress = serverAddress.replace("://0.0.0.0", "://localhost");
        try {
            await util_2.open(openAddress);
            logger_1.logger.info(`Opened ${openAddress}`);
        }
        catch (error) {
            logger_1.logger.error("Failed to open", logger_1.field("address", openAddress), logger_1.field("error", error));
        }
    }
    return server;
};
exports.runCodeServer = runCodeServer;
//# sourceMappingURL=main.js.map