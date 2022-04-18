"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vm_1 = require("vm");
const supportsAsync = (() => {
    try {
        const fn = vm_1.runInNewContext('(async function () {})');
        return fn.constructor.name === 'AsyncFunction';
    }
    catch (err) {
        return false;
    }
})();
exports.default = supportsAsync;
//# sourceMappingURL=supports-async.js.map