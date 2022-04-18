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
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@coder/logger");
const cli_1 = require("./cli");
const constants_1 = require("./constants");
const main_1 = require("./main");
const proxyAgent = __importStar(require("./proxy_agent"));
const wrapper_1 = require("./wrapper");
async function entry() {
    proxyAgent.monkeyPatch(false);
    // There's no need to check flags like --help or to spawn in an existing
    // instance for the child process because these would have already happened in
    // the parent and the child wouldn't have been spawned. We also get the
    // arguments from the parent so we don't have to parse twice and to account
    // for environment manipulation (like how PASSWORD gets removed to avoid
    // leaking to child processes).
    if (wrapper_1.isChild(wrapper_1.wrapper)) {
        const args = await wrapper_1.wrapper.handshake();
        wrapper_1.wrapper.preventExit();
        await main_1.runCodeServer(args);
        return;
    }
    const cliArgs = cli_1.parse(process.argv.slice(2));
    const configArgs = await cli_1.readConfigFile(cliArgs.config);
    const args = await cli_1.setDefaults(cliArgs, configArgs);
    if (args.help) {
        console.log("code-server", constants_1.version, constants_1.commit);
        console.log("");
        console.log(`Usage: code-server [options] [path]`);
        console.log("");
        console.log("Options");
        cli_1.optionDescriptions().forEach((description) => {
            console.log("", description);
        });
        return;
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
        return;
    }
    if (cli_1.shouldRunVsCodeCli(args)) {
        return main_1.runVsCodeCli(args);
    }
    const socketPath = await cli_1.shouldOpenInExistingInstance(cliArgs);
    if (socketPath) {
        return main_1.openInExistingInstance(args, socketPath);
    }
    return wrapper_1.wrapper.start(args);
}
entry().catch((error) => {
    logger_1.logger.error(error.message);
    wrapper_1.wrapper.exit(error);
});
//# sourceMappingURL=entry.js.map