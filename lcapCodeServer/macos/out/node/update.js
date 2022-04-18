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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProvider = void 0;
var logger_1 = require("@coder/logger");
var http = __importStar(require("http"));
var https = __importStar(require("https"));
var semver = __importStar(require("semver"));
var url = __importStar(require("url"));
var constants_1 = require("./constants");
var settings_1 = require("./settings");
/**
 * Provide update information.
 */
var UpdateProvider = /** @class */ (function () {
    function UpdateProvider(
    /**
     * The URL for getting the latest version of code-server. Should return JSON
     * that fulfills `LatestResponse`.
     */
    latestUrl, 
    /**
     * Update information will be stored here. If not provided, the global
     * settings will be used.
     */
    settings) {
        if (latestUrl === void 0) { latestUrl = "https://api.github.com/repos/cdr/code-server/releases/latest"; }
        if (settings === void 0) { settings = settings_1.settings; }
        this.latestUrl = latestUrl;
        this.settings = settings;
        this.updateInterval = 1000 * 60 * 60 * 24; // Milliseconds between update checks.
    }
    /**
     * Query for and return the latest update.
     */
    UpdateProvider.prototype.getUpdate = function (force) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // Don't run multiple requests at a time.
                if (!this.update) {
                    this.update = this._getUpdate(force);
                    this.update.then(function () { return (_this.update = undefined); });
                }
                return [2 /*return*/, this.update];
            });
        });
    };
    UpdateProvider.prototype._getUpdate = function (force) {
        return __awaiter(this, void 0, void 0, function () {
            var now, update, _a, buffer, data, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        now = Date.now();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 8, , 9]);
                        if (!!force) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.settings.read()];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = { update: undefined };
                        _b.label = 4;
                    case 4:
                        update = (_a).update;
                        if (!(!update || update.checked + this.updateInterval < now)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.request(this.latestUrl)];
                    case 5:
                        buffer = _b.sent();
                        data = JSON.parse(buffer.toString());
                        update = { checked: now, version: data.name.replace(/^v/, "") };
                        return [4 /*yield*/, this.settings.write({ update: update })];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7:
                        logger_1.logger.debug("got latest version", logger_1.field("latest", update.version));
                        return [2 /*return*/, update];
                    case 8:
                        error_1 = _b.sent();
                        logger_1.logger.error("Failed to get latest version", logger_1.field("error", error_1.message));
                        return [2 /*return*/, {
                                checked: now,
                                version: "unknown",
                            }];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Return true if the currently installed version is the latest.
     */
    UpdateProvider.prototype.isLatestVersion = function (latest) {
        logger_1.logger.debug("comparing versions", logger_1.field("current", constants_1.version), logger_1.field("latest", latest.version));
        try {
            return semver.lte(latest.version, constants_1.version);
        }
        catch (error) {
            return true;
        }
    };
    UpdateProvider.prototype.request = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestResponse(uri)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                var chunks = [];
                                var bufferLength = 0;
                                response.on("data", function (chunk) {
                                    bufferLength += chunk.length;
                                    chunks.push(chunk);
                                });
                                response.on("error", reject);
                                response.on("end", function () {
                                    resolve(Buffer.concat(chunks, bufferLength));
                                });
                            })];
                }
            });
        });
    };
    UpdateProvider.prototype.requestResponse = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            var redirects, maxRedirects;
            return __generator(this, function (_a) {
                redirects = 0;
                maxRedirects = 10;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var request = function (uri) {
                            logger_1.logger.debug("Making request", logger_1.field("uri", uri));
                            var httpx = uri.startsWith("https") ? https : http;
                            var client = httpx.get(uri, { headers: { "User-Agent": "code-server" } }, function (response) {
                                if (!response.statusCode || response.statusCode < 200 || response.statusCode >= 400) {
                                    response.destroy();
                                    return reject(new Error(uri + ": " + (response.statusCode || "500")));
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
                    })];
            });
        });
    };
    return UpdateProvider;
}());
exports.UpdateProvider = UpdateProvider;
//# sourceMappingURL=update.js.map