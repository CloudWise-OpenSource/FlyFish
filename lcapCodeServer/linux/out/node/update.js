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
exports.UpdateProvider = void 0;
const logger_1 = require("@coder/logger");
const http = __importStar(require("http"));
const https = __importStar(require("https"));
const semver = __importStar(require("semver"));
const url = __importStar(require("url"));
const constants_1 = require("./constants");
const settings_1 = require("./settings");
/**
 * Provide update information.
 */
class UpdateProvider {
    constructor(
    /**
     * The URL for getting the latest version of code-server. Should return JSON
     * that fulfills `LatestResponse`.
     */
    latestUrl = "https://api.github.com/repos/cdr/code-server/releases/latest", 
    /**
     * Update information will be stored here. If not provided, the global
     * settings will be used.
     */
    settings = settings_1.settings) {
        this.latestUrl = latestUrl;
        this.settings = settings;
        this.updateInterval = 1000 * 60 * 60 * 24; // Milliseconds between update checks.
    }
    /**
     * Query for and return the latest update.
     */
    async getUpdate(force) {
        // Don't run multiple requests at a time.
        if (!this.update) {
            this.update = this._getUpdate(force);
            this.update.then(() => (this.update = undefined));
        }
        return this.update;
    }
    async _getUpdate(force) {
        const now = Date.now();
        try {
            let { update } = !force ? await this.settings.read() : { update: undefined };
            if (!update || update.checked + this.updateInterval < now) {
                const buffer = await this.request(this.latestUrl);
                const data = JSON.parse(buffer.toString());
                update = { checked: now, version: data.name.replace(/^v/, "") };
                await this.settings.write({ update });
            }
            logger_1.logger.debug("got latest version", logger_1.field("latest", update.version));
            return update;
        }
        catch (error) {
            logger_1.logger.error("Failed to get latest version", logger_1.field("error", error.message));
            return {
                checked: now,
                version: "unknown",
            };
        }
    }
    /**
     * Return true if the currently installed version is the latest.
     */
    isLatestVersion(latest) {
        logger_1.logger.debug("comparing versions", logger_1.field("current", constants_1.version), logger_1.field("latest", latest.version));
        try {
            return semver.lte(latest.version, constants_1.version);
        }
        catch (error) {
            return true;
        }
    }
    async request(uri) {
        const response = await this.requestResponse(uri);
        return new Promise((resolve, reject) => {
            const chunks = [];
            let bufferLength = 0;
            response.on("data", (chunk) => {
                bufferLength += chunk.length;
                chunks.push(chunk);
            });
            response.on("error", reject);
            response.on("end", () => {
                resolve(Buffer.concat(chunks, bufferLength));
            });
        });
    }
    async requestResponse(uri) {
        let redirects = 0;
        const maxRedirects = 10;
        return new Promise((resolve, reject) => {
            const request = (uri) => {
                logger_1.logger.debug("Making request", logger_1.field("uri", uri));
                const httpx = uri.startsWith("https") ? https : http;
                const client = httpx.get(uri, { headers: { "User-Agent": "code-server" } }, (response) => {
                    if (!response.statusCode || response.statusCode < 200 || response.statusCode >= 400) {
                        response.destroy();
                        return reject(new Error(`${uri}: ${response.statusCode || "500"}`));
                    }
                    if (response.statusCode >= 300) {
                        response.destroy();
                        ++redirects;
                        if (redirects > maxRedirects) {
                            return reject(new Error("reached max redirects"));
                        }
                        if (!response.headers.location) {
                            return reject(new Error("received redirect with no location header"));
                        }
                        return request(url.resolve(uri, response.headers.location));
                    }
                    resolve(response);
                });
                client.on("error", reject);
            };
            request(uri);
        });
    }
}
exports.UpdateProvider = UpdateProvider;
//# sourceMappingURL=update.js.map