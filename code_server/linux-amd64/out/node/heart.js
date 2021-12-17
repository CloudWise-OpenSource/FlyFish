"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Heart = void 0;
var logger_1 = require("@coder/logger");
var fs_1 = require("fs");
/**
 * Provides a heartbeat using a local file to indicate activity.
 */
var Heart = /** @class */ (function () {
    function Heart(heartbeatPath, isActive) {
        this.heartbeatPath = heartbeatPath;
        this.isActive = isActive;
        this.heartbeatInterval = 60000;
        this.lastHeartbeat = 0;
    }
    Heart.prototype.alive = function () {
        var now = Date.now();
        return now - this.lastHeartbeat < this.heartbeatInterval;
    };
    /**
     * Write to the heartbeat file if we haven't already done so within the
     * timeout and start or reset a timer that keeps running as long as there is
     * activity. Failures are logged as warnings.
     */
    Heart.prototype.beat = function () {
        var _this = this;
        if (this.alive()) {
            return;
        }
        logger_1.logger.trace("heartbeat");
        fs_1.promises.writeFile(this.heartbeatPath, "").catch(function (error) {
            logger_1.logger.warn(error.message);
        });
        this.lastHeartbeat = Date.now();
        if (typeof this.heartbeatTimer !== "undefined") {
            clearTimeout(this.heartbeatTimer);
        }
        this.heartbeatTimer = setTimeout(function () {
            _this.isActive()
                .then(function (active) {
                if (active) {
                    _this.beat();
                }
            })
                .catch(function (error) {
                logger_1.logger.warn(error.message);
            });
        }, this.heartbeatInterval);
    };
    /**
     * Call to clear any heartbeatTimer for shutdown.
     */
    Heart.prototype.dispose = function () {
        if (typeof this.heartbeatTimer !== "undefined") {
            clearTimeout(this.heartbeatTimer);
        }
    };
    return Heart;
}());
exports.Heart = Heart;
//# sourceMappingURL=heart.js.map