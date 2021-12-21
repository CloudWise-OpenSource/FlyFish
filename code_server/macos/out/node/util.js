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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFile = exports.canConnect = exports.pathToFsPath = exports.isObject = exports.buildAllowedMessage = exports.enumToArray = exports.open = exports.isWsl = exports.getMediaMime = exports.hash = exports.generatePassword = exports.generateCertificate = exports.humanPath = exports.getEnvPaths = exports.paths = void 0;
var cp = __importStar(require("child_process"));
var crypto = __importStar(require("crypto"));
var env_paths_1 = __importDefault(require("env-paths"));
var fs_1 = require("fs");
var net = __importStar(require("net"));
var os = __importStar(require("os"));
var path = __importStar(require("path"));
var util = __importStar(require("util"));
var xdg_basedir_1 = __importDefault(require("xdg-basedir"));
exports.paths = getEnvPaths();
/**
 * Gets the config and data paths for the current platform/configuration.
 * On MacOS this function gets the standard XDG directories instead of using the native macOS
 * ones. Most CLIs do this as in practice only GUI apps use the standard macOS directories.
 */
function getEnvPaths() {
    var paths = env_paths_1.default("code-server", { suffix: "" });
    var append = function (p) { return path.join(p, "code-server"); };
    switch (process.platform) {
        case "darwin":
            return {
                // envPaths uses native directories so force Darwin to use the XDG spec
                // to align with other CLI tools.
                data: xdg_basedir_1.default.data ? append(xdg_basedir_1.default.data) : paths.data,
                config: xdg_basedir_1.default.config ? append(xdg_basedir_1.default.config) : paths.config,
                // Fall back to temp if there is no runtime dir.
                runtime: xdg_basedir_1.default.runtime ? append(xdg_basedir_1.default.runtime) : paths.temp,
            };
        case "win32":
            return {
                data: paths.data,
                config: paths.config,
                // Windows doesn't have a runtime dir.
                runtime: paths.temp,
            };
        default:
            return {
                data: paths.data,
                config: paths.config,
                // Fall back to temp if there is no runtime dir.
                runtime: xdg_basedir_1.default.runtime ? append(xdg_basedir_1.default.runtime) : paths.temp,
            };
    }
}
exports.getEnvPaths = getEnvPaths;
/**
 * humanPath replaces the home directory in p with ~.
 * Makes it more readable.
 *
 * @param p
 */
function humanPath(p) {
    if (!p) {
        return "";
    }
    return p.replace(os.homedir(), "~");
}
exports.humanPath = humanPath;
var generateCertificate = function (hostname) { return __awaiter(void 0, void 0, void 0, function () {
    var certPath, certKeyPath, error_1, pem_1, certs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                certPath = path.join(exports.paths.data, hostname.replace(/\./g, "_") + ".crt");
                certKeyPath = path.join(exports.paths.data, hostname.replace(/\./g, "_") + ".key");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 7]);
                return [4 /*yield*/, Promise.all([fs_1.promises.access(certPath), fs_1.promises.access(certKeyPath)])];
            case 2:
                _a.sent();
                return [3 /*break*/, 7];
            case 3:
                error_1 = _a.sent();
                pem_1 = require("pem");
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        pem_1.createCertificate({
                            selfSigned: true,
                            commonName: hostname,
                            config: "\n[req]\nreq_extensions = v3_req\n\n[ v3_req ]\nbasicConstraints = CA:true\nextendedKeyUsage = serverAuth\nsubjectAltName = @alt_names\n\n[alt_names]\nDNS.1 = " + hostname + "\n",
                        }, function (error, result) {
                            return error ? reject(error) : resolve(result);
                        });
                    })];
            case 4:
                certs = _a.sent();
                return [4 /*yield*/, fs_1.promises.mkdir(exports.paths.data, { recursive: true })];
            case 5:
                _a.sent();
                return [4 /*yield*/, Promise.all([fs_1.promises.writeFile(certPath, certs.certificate), fs_1.promises.writeFile(certKeyPath, certs.serviceKey)])];
            case 6:
                _a.sent();
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/, {
                    cert: certPath,
                    certKey: certKeyPath,
                }];
        }
    });
}); };
exports.generateCertificate = generateCertificate;
var generatePassword = function (length) {
    if (length === void 0) { length = 24; }
    return __awaiter(void 0, void 0, void 0, function () {
        var buffer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    buffer = Buffer.alloc(Math.ceil(length / 2));
                    return [4 /*yield*/, util.promisify(crypto.randomFill)(buffer)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, buffer.toString("hex").substring(0, length)];
            }
        });
    });
};
exports.generatePassword = generatePassword;
var hash = function (str) {
    return crypto.createHash("sha256").update(str).digest("hex");
};
exports.hash = hash;
var mimeTypes = {
    ".aac": "audio/x-aac",
    ".avi": "video/x-msvideo",
    ".bmp": "image/bmp",
    ".css": "text/css",
    ".flv": "video/x-flv",
    ".gif": "image/gif",
    ".html": "text/html",
    ".ico": "image/x-icon",
    ".jpe": "image/jpg",
    ".jpeg": "image/jpg",
    ".jpg": "image/jpg",
    ".js": "application/javascript",
    ".json": "application/json",
    ".m1v": "video/mpeg",
    ".m2a": "audio/mpeg",
    ".m2v": "video/mpeg",
    ".m3a": "audio/mpeg",
    ".mid": "audio/midi",
    ".midi": "audio/midi",
    ".mk3d": "video/x-matroska",
    ".mks": "video/x-matroska",
    ".mkv": "video/x-matroska",
    ".mov": "video/quicktime",
    ".movie": "video/x-sgi-movie",
    ".mp2": "audio/mpeg",
    ".mp2a": "audio/mpeg",
    ".mp3": "audio/mpeg",
    ".mp4": "video/mp4",
    ".mp4a": "audio/mp4",
    ".mp4v": "video/mp4",
    ".mpe": "video/mpeg",
    ".mpeg": "video/mpeg",
    ".mpg": "video/mpeg",
    ".mpg4": "video/mp4",
    ".mpga": "audio/mpeg",
    ".oga": "audio/ogg",
    ".ogg": "audio/ogg",
    ".ogv": "video/ogg",
    ".png": "image/png",
    ".psd": "image/vnd.adobe.photoshop",
    ".qt": "video/quicktime",
    ".spx": "audio/ogg",
    ".svg": "image/svg+xml",
    ".tga": "image/x-tga",
    ".tif": "image/tiff",
    ".tiff": "image/tiff",
    ".txt": "text/plain",
    ".wav": "audio/x-wav",
    ".wasm": "application/wasm",
    ".webm": "video/webm",
    ".webp": "image/webp",
    ".wma": "audio/x-ms-wma",
    ".wmv": "video/x-ms-wmv",
    ".woff": "application/font-woff",
};
var getMediaMime = function (filePath) {
    return (filePath && mimeTypes[path.extname(filePath)]) || "text/plain";
};
exports.getMediaMime = getMediaMime;
var isWsl = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = (process.platform === "linux" && os.release().toLowerCase().indexOf("microsoft") !== -1);
                if (_a) return [3 /*break*/, 2];
                return [4 /*yield*/, fs_1.promises.readFile("/proc/version", "utf8")];
            case 1:
                _a = (_b.sent()).toLowerCase().indexOf("microsoft") !== -1;
                _b.label = 2;
            case 2: return [2 /*return*/, (_a)];
        }
    });
}); };
exports.isWsl = isWsl;
/**
 * Try opening a URL using whatever the system has set for opening URLs.
 */
var open = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var args, options, platform, command, proc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                args = [];
                options = {};
                return [4 /*yield*/, exports.isWsl()];
            case 1:
                platform = (_a.sent()) ? "wsl" : process.platform;
                command = platform === "darwin" ? "open" : "xdg-open";
                if (platform === "win32" || platform === "wsl") {
                    command = platform === "wsl" ? "cmd.exe" : "cmd";
                    args.push("/c", "start", '""', "/b");
                    url = url.replace(/&/g, "^&");
                }
                proc = cp.spawn(command, __spreadArray(__spreadArray([], __read(args)), [url]), options);
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        proc.on("error", reject);
                        proc.on("close", function (code) {
                            return code !== 0 ? reject(new Error("Failed to open with code " + code)) : resolve();
                        });
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.open = open;
/**
 * For iterating over an enum's values.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
var enumToArray = function (t) {
    var values = [];
    for (var k in t) {
        values.push(t[k]);
    }
    return values;
};
exports.enumToArray = enumToArray;
/**
 * For displaying all allowed options in an enum.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
var buildAllowedMessage = function (t) {
    var values = exports.enumToArray(t);
    return "Allowed value" + (values.length === 1 ? " is" : "s are") + " " + values.map(function (t) { return "'" + t + "'"; }).join(", ");
};
exports.buildAllowedMessage = buildAllowedMessage;
var isObject = function (obj) {
    return !Array.isArray(obj) && typeof obj === "object" && obj !== null;
};
exports.isObject = isObject;
/**
 * Compute `fsPath` for the given uri.
 * Taken from vs/base/common/uri.ts. It's not imported to avoid also importing
 * everything that file imports.
 */
function pathToFsPath(path, keepDriveLetterCasing) {
    if (keepDriveLetterCasing === void 0) { keepDriveLetterCasing = false; }
    var isWindows = process.platform === "win32";
    var uri = { authority: undefined, path: path, scheme: "file" };
    var value;
    if (uri.authority && uri.path.length > 1 && uri.scheme === "file") {
        // unc path: file://shares/c$/far/boo
        value = "//" + uri.authority + uri.path;
    }
    else if (uri.path.charCodeAt(0) === 47 /* Slash */ &&
        ((uri.path.charCodeAt(1) >= 65 /* A */ && uri.path.charCodeAt(1) <= 90 /* Z */) ||
            (uri.path.charCodeAt(1) >= 97 /* a */ && uri.path.charCodeAt(1) <= 122 /* z */)) &&
        uri.path.charCodeAt(2) === 58 /* Colon */) {
        if (!keepDriveLetterCasing) {
            // windows drive letter: file:///c:/far/boo
            value = uri.path[1].toLowerCase() + uri.path.substr(2);
        }
        else {
            value = uri.path.substr(1);
        }
    }
    else {
        // other path
        value = uri.path;
    }
    if (isWindows) {
        value = value.replace(/\//g, "\\");
    }
    return value;
}
exports.pathToFsPath = pathToFsPath;
/**
 * Return a promise that resolves with whether the socket path is active.
 */
function canConnect(path) {
    return new Promise(function (resolve) {
        var socket = net.connect(path);
        socket.once("error", function () { return resolve(false); });
        socket.once("connect", function () {
            socket.destroy();
            resolve(true);
        });
    });
}
exports.canConnect = canConnect;
var isFile = function (path) { return __awaiter(void 0, void 0, void 0, function () {
    var stat, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, fs_1.promises.stat(path)];
            case 1:
                stat = _a.sent();
                return [2 /*return*/, stat.isFile()];
            case 2:
                error_2 = _a.sent();
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.isFile = isFile;
//# sourceMappingURL=util.js.map