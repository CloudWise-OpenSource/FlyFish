"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coderCloudBind = void 0;
const logger_1 = require("@coder/logger");
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const split2_1 = __importDefault(require("split2"));
// https://github.com/cdr/coder-cloud
const coderCloudAgent = path_1.default.resolve(__dirname, "../../lib/coder-cloud-agent");
function runAgent(...args) {
    logger_1.logger.debug(`running agent with ${args}`);
    const agent = child_process_1.spawn(coderCloudAgent, args, {
        stdio: ["inherit", "inherit", "pipe"],
    });
    agent.stderr.pipe(split2_1.default()).on("data", (line) => {
        line = line.replace(/^[0-9-]+ [0-9:]+ [^ ]+\t/, "");
        logger_1.logger.info(line);
    });
    return new Promise((res, rej) => {
        agent.on("error", rej);
        agent.on("close", (code) => {
            if (code !== 0) {
                rej({
                    message: `--link agent exited with ${code}`,
                });
                return;
            }
            res();
        });
    });
}
function coderCloudBind(csAddr, serverName = "") {
    // addr needs to be in host:port format.
    // So we trim the protocol.
    csAddr = csAddr.replace(/^https?:\/\//, "");
    return runAgent("bind", `--code-server-addr=${csAddr}`, serverName);
}
exports.coderCloudBind = coderCloudBind;
//# sourceMappingURL=coder_cloud.js.map