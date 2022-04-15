"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unicode11Addon = void 0;
const UnicodeV11_1 = require("./UnicodeV11");
class Unicode11Addon {
    activate(terminal) {
        terminal.unicode.register(new UnicodeV11_1.UnicodeV11());
    }
    dispose() { }
}
exports.Unicode11Addon = Unicode11Addon;
//# sourceMappingURL=Unicode11Addon.js.map