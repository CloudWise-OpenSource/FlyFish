"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Heart = void 0;
const logger_1 = require("@coder/logger");
const fs_1 = require("fs");
/**
 * Provides a heartbeat using a local file to indicate activity.
 */
class Heart {
    constructor(heartbeatPath, isActive) {
        this.heartbeatPath = heartbeatPath;
        this.isActive = isActive;
        this.heartbeatInterval = 60000;
        this.lastHeartbeat = 0;
    }
    alive() {
        const now = Date.now();
        return now - this.lastHeartbeat < this.heartbeatInterval;
    }
    /**
     * Write to the heartbeat file if we haven't already done so within the
     * timeout and start or reset a timer that keeps running as long as there is
     * activity. Failures are logged as warnings.
     */
    beat() {
        if (this.alive()) {
            return;
        }
        logger_1.logger.trace("heartbeat");
        fs_1.promises.writeFile(this.heartbeatPath, "").catch((error) => {
            logger_1.logger.warn(error.message);
        });
        this.lastHeartbeat = Date.now();
        if (typeof this.heartbeatTimer !== "undefined") {
            clearTimeout(this.heartbeatTimer);
        }
        this.heartbeatTimer = setTimeout(() => {
            this.isActive()
                .then((active) => {
                if (active) {
                    this.beat();
                }
            })
                .catch((error) => {
                logger_1.logger.warn(error.message);
            });
        }, this.heartbeatInterval);
    }
    /**
     * Call to clear any heartbeatTimer for shutdown.
     */
    dispose() {
        if (typeof this.heartbeatTimer !== "undefined") {
            clearTimeout(this.heartbeatTimer);
        }
    }
}
exports.Heart = Heart;
//# sourceMappingURL=heart.js.map