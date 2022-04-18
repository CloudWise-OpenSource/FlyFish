"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coderCloudBind = void 0;
var logger_1 = require("@coder/logger");
var child_process_1 = require("child_process");
var path_1 = __importDefault(require("path"));
var split2_1 = __importDefault(require("split2"));
// https://github.com/cdr/coder-cloud
var coderCloudAgent = path_1.default.resolve(__dirname, "../../lib/coder-cloud-agent");
function runAgent() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    logger_1.logger.debug("running agent with " + args);
    var agent = child_process_1.spawn(coderCloudAgent, args, {
        stdio: ["inherit", "inherit", "pipe"],
    });
    agent.stderr.pipe(split2_1.default()).on("data", function (line) {
        line = line.replace(/^[0-9-]+ [0-9:]+ [^ ]+\t/, "");
        logger_1.logger.info(line);
    });
    return new Promise(function (res, rej) {
        agent.on("error", rej);
        agent.on("close", function (code) {
            if (code !== 0) {
                rej({
                    message: "--link agent exited with " + code,
                });
                return;
            }
            res();
        });
    });
}
function coderCloudBind(csAddr, serverName) {
    if (serverName === void 0) { serverName = ""; }
    // addr needs to be in host:port format.
    // So we trim the protocol.
    csAddr = csAddr.replace(/^https?:\/\//, "");
    return runAgent("bind", "--code-server-addr=" + csAddr, serverName);
}
exports.coderCloudBind = coderCloudBind;
//# sourceMappingURL=coder_cloud.js.map