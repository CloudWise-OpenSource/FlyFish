"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerServiceWorker = void 0;
const logger_1 = require("@coder/logger");
const util_1 = require("../common/util");
async function registerServiceWorker() {
    const options = util_1.getOptions();
    logger_1.logger.level = options.logLevel;
    const path = util_1.normalize(`${options.csStaticBase}/out/browser/serviceWorker.js`);
    try {
        await navigator.serviceWorker.register(path, {
            scope: options.base + "/",
        });
        logger_1.logger.info(`[Service Worker] registered`);
    }
    catch (error) {
        util_1.logError(logger_1.logger, `[Service Worker] registration`, error);
    }
}
exports.registerServiceWorker = registerServiceWorker;
if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
    registerServiceWorker();
}
else {
    logger_1.logger.error(`[Service Worker] navigator is undefined`);
}
//# sourceMappingURL=register.js.map