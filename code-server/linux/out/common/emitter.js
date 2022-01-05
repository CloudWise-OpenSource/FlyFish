"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emitter = void 0;
const logger_1 = require("@coder/logger");
/**
 * Emitter typecasts for a single event type.
 */
class Emitter {
    constructor() {
        this.listeners = [];
    }
    get event() {
        return (cb) => {
            this.listeners.push(cb);
            return {
                dispose: () => {
                    const i = this.listeners.indexOf(cb);
                    if (i !== -1) {
                        this.listeners.splice(i, 1);
                    }
                },
            };
        };
    }
    /**
     * Emit an event with a value.
     */
    async emit(value) {
        let resolve;
        const promise = new Promise((r) => (resolve = r));
        await Promise.all(this.listeners.map(async (cb) => {
            try {
                await cb(value, promise);
            }
            catch (error) {
                logger_1.logger.error(error.message);
            }
        }));
        resolve();
    }
    dispose() {
        this.listeners = [];
    }
}
exports.Emitter = Emitter;
//# sourceMappingURL=emitter.js.map