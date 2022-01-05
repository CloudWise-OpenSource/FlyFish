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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeHtml = exports.isFile = exports.canConnect = exports.pathToFsPath = exports.isObject = exports.buildAllowedMessage = exports.enumToArray = exports.open = exports.isWsl = exports.getMediaMime = exports.sanitizeString = exports.isCookieValid = exports.handlePasswordValidation = exports.getPasswordMethod = exports.isHashLegacyMatch = exports.hashLegacy = exports.isHashMatch = exports.hash = exports.generatePassword = exports.generateCertificate = exports.humanPath = exports.getEnvPaths = exports.paths = exports.onLine = void 0;
const logger_1 = require("@coder/logger");
const argon2 = __importStar(require("argon2"));
const cp = __importStar(require("child_process"));
const crypto = __importStar(require("crypto"));
const env_paths_1 = __importDefault(require("env-paths"));
const fs_1 = require("fs");
const net = __importStar(require("net"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const safe_compare_1 = __importDefault(require("safe-compare"));
const util = __importStar(require("util"));
const xdg_basedir_1 = __importDefault(require("xdg-basedir"));
const util_1 = require("../common/util");
// From https://github.com/chalk/ansi-regex
const pattern = [
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))",
].join("|");
const re = new RegExp(pattern, "g");
/**
 * Split stdout on newlines and strip ANSI codes.
 */
const onLine = (proc, callback) => {
    let buffer = "";
    if (!proc.stdout) {
        throw new Error("no stdout");
    }
    proc.stdout.setEncoding("utf8");
    proc.stdout.on("data", (d) => {
        const data = buffer + d;
        const split = data.split("\n");
        const last = split.length - 1;
        for (let i = 0; i < last; ++i) {
            callback(split[i].replace(re, ""), split[i]);
        }
        // The last item will either be an empty string (the data ended with a
        // newline) or a partial line (did not end with a newline) and we must
        // wait to parse it until we get a full line.
        buffer = split[last];
    });
};
exports.onLine = onLine;
exports.paths = getEnvPaths();
/**
 * Gets the config and data paths for the current platform/configuration.
 * On MacOS this function gets the standard XDG directories instead of using the native macOS
 * ones. Most CLIs do this as in practice only GUI apps use the standard macOS directories.
 */
function getEnvPaths() {
    const paths = env_paths_1.default("code-server", { suffix: "" });
    const append = (p) => path.join(p, "code-server");
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
const generateCertificate = async (hostname) => {
    const certPath = path.join(exports.paths.data, `${hostname.replace(/\./g, "_")}.crt`);
    const certKeyPath = path.join(exports.paths.data, `${hostname.replace(/\./g, "_")}.key`);
    // Try generating the certificates if we can't access them (which probably
    // means they don't exist).
    try {
        await Promise.all([fs_1.promises.access(certPath), fs_1.promises.access(certKeyPath)]);
    }
    catch (error) {
        // Require on demand so openssl isn't required if you aren't going to
        // generate certificates.
        const pem = require("pem");
        const certs = await new Promise((resolve, reject) => {
            pem.createCertificate({
                selfSigned: true,
                commonName: hostname,
                config: `
[req]
req_extensions = v3_req

[ v3_req ]
basicConstraints = CA:true
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = ${hostname}
`,
            }, (error, result) => {
                return error ? reject(error) : resolve(result);
            });
        });
        await fs_1.promises.mkdir(exports.paths.data, { recursive: true });
        await Promise.all([fs_1.promises.writeFile(certPath, certs.certificate), fs_1.promises.writeFile(certKeyPath, certs.serviceKey)]);
    }
    return {
        cert: certPath,
        certKey: certKeyPath,
    };
};
exports.generateCertificate = generateCertificate;
const generatePassword = async (length = 24) => {
    const buffer = Buffer.alloc(Math.ceil(length / 2));
    await util.promisify(crypto.randomFill)(buffer);
    return buffer.toString("hex").substring(0, length);
};
exports.generatePassword = generatePassword;
/**
 * Used to hash the password.
 */
const hash = async (password) => {
    try {
        return await argon2.hash(password);
    }
    catch (error) {
        logger_1.logger.error(error);
        return "";
    }
};
exports.hash = hash;
/**
 * Used to verify if the password matches the hash
 */
const isHashMatch = async (password, hash) => {
    if (password === "" || hash === "" || !hash.startsWith("$")) {
        return false;
    }
    try {
        return await argon2.verify(hash, password);
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.isHashMatch = isHashMatch;
/**
 * Used to hash the password using the sha256
 * algorithm. We only use this to for checking
 * the hashed-password set in the config.
 *
 * Kept for legacy reasons.
 */
const hashLegacy = (str) => {
    return crypto.createHash("sha256").update(str).digest("hex");
};
exports.hashLegacy = hashLegacy;
/**
 * Used to check if the password matches the hash using
 * the hashLegacy function
 */
const isHashLegacyMatch = (password, hashPassword) => {
    const hashedWithLegacy = exports.hashLegacy(password);
    return safe_compare_1.default(hashedWithLegacy, hashPassword);
};
exports.isHashLegacyMatch = isHashLegacyMatch;
/**
 * Used to determine the password method.
 *
 * There are three options for the return value:
 * 1. "SHA256" -> the legacy hashing algorithm
 * 2. "ARGON2" -> the newest hashing algorithm
 * 3. "PLAIN_TEXT" -> regular ol' password with no hashing
 *
 * @returns {PasswordMethod} "SHA256" | "ARGON2" | "PLAIN_TEXT"
 */
function getPasswordMethod(hashedPassword) {
    if (!hashedPassword) {
        return "PLAIN_TEXT";
    }
    // This is the new hashing algorithm
    if (hashedPassword.includes("$argon")) {
        return "ARGON2";
    }
    // This is the legacy hashing algorithm
    return "SHA256";
}
exports.getPasswordMethod = getPasswordMethod;
/**
 * Checks if a password is valid and also returns the hash
 * using the PasswordMethod
 */
async function handlePasswordValidation({ passwordMethod, passwordFromArgs, passwordFromRequestBody, hashedPasswordFromArgs, }) {
    const passwordValidation = {
        isPasswordValid: false,
        hashedPassword: "",
    };
    switch (passwordMethod) {
        case "PLAIN_TEXT": {
            const isValid = passwordFromArgs ? safe_compare_1.default(passwordFromRequestBody, passwordFromArgs) : false;
            passwordValidation.isPasswordValid = isValid;
            const hashedPassword = await exports.hash(passwordFromRequestBody);
            passwordValidation.hashedPassword = hashedPassword;
            break;
        }
        case "SHA256": {
            const isValid = exports.isHashLegacyMatch(passwordFromRequestBody, hashedPasswordFromArgs || "");
            passwordValidation.isPasswordValid = isValid;
            passwordValidation.hashedPassword = hashedPasswordFromArgs || (await exports.hashLegacy(passwordFromRequestBody));
            break;
        }
        case "ARGON2": {
            const isValid = await exports.isHashMatch(passwordFromRequestBody, hashedPasswordFromArgs || "");
            passwordValidation.isPasswordValid = isValid;
            passwordValidation.hashedPassword = hashedPasswordFromArgs || "";
            break;
        }
        default:
            break;
    }
    return passwordValidation;
}
exports.handlePasswordValidation = handlePasswordValidation;
/** Checks if a req.cookies.key is valid using the PasswordMethod */
async function isCookieValid({ passwordFromArgs = "", cookieKey, hashedPasswordFromArgs = "", passwordMethod, }) {
    let isValid = false;
    switch (passwordMethod) {
        case "PLAIN_TEXT":
            isValid = await exports.isHashMatch(passwordFromArgs, cookieKey);
            break;
        case "ARGON2":
        case "SHA256":
            isValid = safe_compare_1.default(cookieKey, hashedPasswordFromArgs);
            break;
        default:
            break;
    }
    return isValid;
}
exports.isCookieValid = isCookieValid;
/** Ensures that the input is sanitized by checking
 * - it's a string
 * - greater than 0 characters
 * - trims whitespace
 */
function sanitizeString(str) {
    // Very basic sanitization of string
    // Credit: https://stackoverflow.com/a/46719000/3015595
    return typeof str === "string" && str.trim().length > 0 ? str.trim() : "";
}
exports.sanitizeString = sanitizeString;
const mimeTypes = {
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
const getMediaMime = (filePath) => {
    return (filePath && mimeTypes[path.extname(filePath)]) || "text/plain";
};
exports.getMediaMime = getMediaMime;
const isWsl = async () => {
    return ((process.platform === "linux" && os.release().toLowerCase().indexOf("microsoft") !== -1) ||
        (await fs_1.promises.readFile("/proc/version", "utf8")).toLowerCase().indexOf("microsoft") !== -1);
};
exports.isWsl = isWsl;
/**
 * Try opening a URL using whatever the system has set for opening URLs.
 */
const open = async (url) => {
    const args = [];
    const options = {};
    const platform = (await exports.isWsl()) ? "wsl" : process.platform;
    let command = platform === "darwin" ? "open" : "xdg-open";
    if (platform === "win32" || platform === "wsl") {
        command = platform === "wsl" ? "cmd.exe" : "cmd";
        args.push("/c", "start", '""', "/b");
        url = url.replace(/&/g, "^&");
    }
    const proc = cp.spawn(command, [...args, url], options);
    await new Promise((resolve, reject) => {
        proc.on("error", reject);
        proc.on("close", (code) => {
            return code !== 0 ? reject(new Error(`Failed to open with code ${code}`)) : resolve();
        });
    });
};
exports.open = open;
/**
 * For iterating over an enum's values.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const enumToArray = (t) => {
    const values = [];
    for (const k in t) {
        values.push(t[k]);
    }
    return values;
};
exports.enumToArray = enumToArray;
/**
 * For displaying all allowed options in an enum.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const buildAllowedMessage = (t) => {
    const values = exports.enumToArray(t);
    return `Allowed value${values.length === 1 ? " is" : "s are"} ${values.map((t) => `'${t}'`).join(", ")}`;
};
exports.buildAllowedMessage = buildAllowedMessage;
const isObject = (obj) => {
    return !Array.isArray(obj) && typeof obj === "object" && obj !== null;
};
exports.isObject = isObject;
/**
 * Taken from vs/base/common/charCode.ts. Copied for now instead of importing so
 * we don't have to set up a `vs` alias to be able to import with types (since
 * the alternative is to directly import from `out`).
 */
var CharCode;
(function (CharCode) {
    CharCode[CharCode["Slash"] = 47] = "Slash";
    CharCode[CharCode["A"] = 65] = "A";
    CharCode[CharCode["Z"] = 90] = "Z";
    CharCode[CharCode["a"] = 97] = "a";
    CharCode[CharCode["z"] = 122] = "z";
    CharCode[CharCode["Colon"] = 58] = "Colon";
})(CharCode || (CharCode = {}));
/**
 * Compute `fsPath` for the given uri.
 * Taken from vs/base/common/uri.ts. It's not imported to avoid also importing
 * everything that file imports.
 */
function pathToFsPath(path, keepDriveLetterCasing = false) {
    const isWindows = process.platform === "win32";
    const uri = { authority: undefined, path: util_1.getFirstString(path) || "", scheme: "file" };
    let value;
    if (uri.authority && uri.path.length > 1 && uri.scheme === "file") {
        // unc path: file://shares/c$/far/boo
        value = `//${uri.authority}${uri.path}`;
    }
    else if (uri.path.charCodeAt(0) === CharCode.Slash &&
        ((uri.path.charCodeAt(1) >= CharCode.A && uri.path.charCodeAt(1) <= CharCode.Z) ||
            (uri.path.charCodeAt(1) >= CharCode.a && uri.path.charCodeAt(1) <= CharCode.z)) &&
        uri.path.charCodeAt(2) === CharCode.Colon) {
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
    return new Promise((resolve) => {
        const socket = net.connect(path);
        socket.once("error", () => resolve(false));
        socket.once("connect", () => {
            socket.destroy();
            resolve(true);
        });
    });
}
exports.canConnect = canConnect;
const isFile = async (path) => {
    try {
        const stat = await fs_1.promises.stat(path);
        return stat.isFile();
    }
    catch (error) {
        return false;
    }
};
exports.isFile = isFile;
/**
 * Escapes any HTML string special characters, like &, <, >, ", and '.
 *
 * Source: https://stackoverflow.com/a/6234804/3015595
 **/
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}
exports.escapeHtml = escapeHtml;
//# sourceMappingURL=util.js.map