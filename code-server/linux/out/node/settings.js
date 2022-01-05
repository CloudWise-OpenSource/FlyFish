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
exports.settings = exports.SettingsProvider = void 0;
const logger_1 = require("@coder/logger");
const fs_1 = require("fs");
const path = __importStar(require("path"));
const util_1 = require("./util");
/**
 * Provides read and write access to settings.
 */
class SettingsProvider {
    constructor(settingsPath) {
        this.settingsPath = settingsPath;
    }
    /**
     * Read settings from the file. On a failure return last known settings and
     * log a warning.
     */
    async read() {
        try {
            const raw = (await fs_1.promises.readFile(this.settingsPath, "utf8")).trim();
            return raw ? JSON.parse(raw) : {};
        }
        catch (error) {
            if (error.code !== "ENOENT") {
                logger_1.logger.warn(error.message);
            }
        }
        return {};
    }
    /**
     * Write settings combined with current settings. On failure log a warning.
     * Settings will be merged shallowly.
     */
    async write(settings) {
        try {
            const oldSettings = await this.read();
            const nextSettings = { ...oldSettings, ...settings };
            await fs_1.promises.writeFile(this.settingsPath, JSON.stringify(nextSettings, null, 2));
        }
        catch (error) {
            logger_1.logger.warn(error.message);
        }
    }
}
exports.SettingsProvider = SettingsProvider;
/**
 * Global code-server settings file.
 */
exports.settings = new SettingsProvider(path.join(util_1.paths.data, "coder.json"));
//# sourceMappingURL=settings.js.map