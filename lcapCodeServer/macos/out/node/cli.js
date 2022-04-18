"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldOpenInExistingInstance = exports.shouldRunVsCodeCli = exports.parseConfigFile = exports.readConfigFile = exports.setDefaults = exports.parse = exports.optionDescriptions = exports.OptionalString = exports.LogLevel = exports.Optional = exports.AuthType = exports.Feature = void 0;
var logger_1 = require("@coder/logger");
var fs_1 = require("fs");
var js_yaml_1 = __importDefault(require("js-yaml"));
var os = __importStar(require("os"));
var path = __importStar(require("path"));
var util_1 = require("./util");
var Feature;
(function (Feature) {
    /** Web socket compression. */
    Feature["PermessageDeflate"] = "permessage-deflate";
})(Feature = exports.Feature || (exports.Feature = {}));
var AuthType;
(function (AuthType) {
    AuthType["Password"] = "password";
    AuthType["None"] = "none";
})(AuthType = exports.AuthType || (exports.AuthType = {}));
var Optional = /** @class */ (function () {
    function Optional(value) {
        this.value = value;
    }
    return Optional;
}());
exports.Optional = Optional;
var LogLevel;
(function (LogLevel) {
    LogLevel["Trace"] = "trace";
    LogLevel["Debug"] = "debug";
    LogLevel["Info"] = "info";
    LogLevel["Warn"] = "warn";
    LogLevel["Error"] = "error";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
var OptionalString = /** @class */ (function (_super) {
    __extends(OptionalString, _super);
    function OptionalString() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return OptionalString;
}(Optional));
exports.OptionalString = OptionalString;
var options = {
    auth: { type: AuthType, description: "The type of authentication to use." },
    password: {
        type: "string",
        description: "The password for password authentication (can only be passed in via $PASSWORD or the config file).",
    },
    "hashed-password": {
        type: "string",
        description: "The password hashed with SHA-256 for password authentication (can only be passed in via $HASHED_PASSWORD or the config file). \n" +
            "Takes precedence over 'password'.",
    },
    cert: {
        type: OptionalString,
        path: true,
        description: "Path to certificate. A self signed certificate is generated if none is provided.",
    },
    "cert-host": {
        type: "string",
        description: "Hostname to use when generating a self signed certificate.",
    },
    "cert-key": { type: "string", path: true, description: "Path to certificate key when using non-generated cert." },
    "disable-telemetry": { type: "boolean", description: "Disable telemetry." },
    "disable-update-check": {
        type: "boolean",
        description: "Disable update check. Without this flag, code-server checks every 6 hours against the latest github release and \n" +
            "then notifies you once every week that a new release is available.",
    },
    // --enable can be used to enable experimental features. These features
    // provide no guarantees.
    enable: { type: "string[]" },
    help: { type: "boolean", short: "h", description: "Show this output." },
    json: { type: "boolean" },
    open: { type: "boolean", description: "Open in browser on startup. Does not work remotely." },
    "bind-addr": {
        type: "string",
        description: "Address to bind to in host:port. You can also use $PORT to override the port.",
    },
    config: {
        type: "string",
        description: "Path to yaml config file. Every flag maps directly to a key in the config file.",
    },
    // These two have been deprecated by bindAddr.
    host: { type: "string", description: "" },
    port: { type: "number", description: "" },
    socket: { type: "string", path: true, description: "Path to a socket (bind-addr will be ignored)." },
    version: { type: "boolean", short: "v", description: "Display version information." },
    _: { type: "string[]" },
    "user-data-dir": { type: "string", path: true, description: "Path to the user data directory." },
    "extensions-dir": { type: "string", path: true, description: "Path to the extensions directory." },
    "builtin-extensions-dir": { type: "string", path: true },
    "extra-extensions-dir": { type: "string[]", path: true },
    "extra-builtin-extensions-dir": { type: "string[]", path: true },
    "list-extensions": { type: "boolean", description: "List installed VS Code extensions." },
    force: { type: "boolean", description: "Avoid prompts when installing VS Code extensions." },
    "install-extension": {
        type: "string[]",
        description: "Install or update a VS Code extension by id or vsix. The identifier of an extension is `${publisher}.${name}`.\n" +
            "To install a specific version provide `@${version}`. For example: 'vscode.csharp@1.2.3'.",
    },
    "enable-proposed-api": {
        type: "string[]",
        description: "Enable proposed API features for extensions. Can receive one or more extension IDs to enable individually.",
    },
    "uninstall-extension": { type: "string[]", description: "Uninstall a VS Code extension by id." },
    "show-versions": { type: "boolean", description: "Show VS Code extension versions." },
    "proxy-domain": { type: "string[]", description: "Domain used for proxying ports." },
    "ignore-last-opened": {
        type: "boolean",
        short: "e",
        description: "Ignore the last opened directory or workspace in favor of an empty window.",
    },
    "new-window": {
        type: "boolean",
        short: "n",
        description: "Force to open a new window.",
    },
    "reuse-window": {
        type: "boolean",
        short: "r",
        description: "Force to open a file or folder in an already opened window.",
    },
    locale: { type: "string" },
    log: { type: LogLevel },
    verbose: { type: "boolean", short: "vvv", description: "Enable verbose logging." },
    link: {
        type: OptionalString,
        description: "\n      Securely bind code-server via our cloud service with the passed name. You'll get a URL like\n      https://hostname-username.cdr.co at which you can easily access your code-server instance.\n      Authorization is done via GitHub.\n    ",
        beta: true,
    },
};
var optionDescriptions = function () {
    var entries = Object.entries(options).filter(function (_a) {
        var _b = __read(_a, 2), v = _b[1];
        return !!v.description;
    });
    var widths = entries.reduce(function (prev, _a) {
        var _b = __read(_a, 2), k = _b[0], v = _b[1];
        return ({
            long: k.length > prev.long ? k.length : prev.long,
            short: v.short && v.short.length > prev.short ? v.short.length : prev.short,
        });
    }, { short: 0, long: 0 });
    return entries.map(function (_a) {
        var _b;
        var _c = __read(_a, 2), k = _c[0], v = _c[1];
        var help = "" + " ".repeat(widths.short - (v.short ? v.short.length : 0)) + (v.short ? "-" + v.short : " ") + " --" + k + " ";
        return (help +
            ((_b = v.description) === null || _b === void 0 ? void 0 : _b.trim().split(/\n/).map(function (line, i) {
                line = line.trim();
                if (i === 0) {
                    return " ".repeat(widths.long - k.length) + (v.beta ? "(beta) " : "") + line;
                }
                return " ".repeat(widths.long + widths.short + 6) + line;
            }).join("\n")) +
            (typeof v.type === "object" ? " [" + Object.values(v.type).join(", ") + "]" : ""));
    });
};
exports.optionDescriptions = optionDescriptions;
var parse = function (argv, opts) {
    var error = function (msg) {
        if (opts === null || opts === void 0 ? void 0 : opts.configFile) {
            msg = "error reading " + opts.configFile + ": " + msg;
        }
        return new Error(msg);
    };
    var args = { _: [] };
    var ended = false;
    var _loop_1 = function (i) {
        var arg = argv[i];
        // -- signals the end of option parsing.
        if (!ended && arg === "--") {
            ended = true;
            return out_i_1 = i, "continue";
        }
        // Options start with a dash and require a value if non-boolean.
        if (!ended && arg.startsWith("-")) {
            var key = void 0;
            var value = void 0;
            if (arg.startsWith("--")) {
                var split = arg.replace(/^--/, "").split("=", 2);
                key = split[0];
                value = split[1];
            }
            else {
                var short_1 = arg.replace(/^-/, "");
                var pair = Object.entries(options).find(function (_a) {
                    var _b = __read(_a, 2), v = _b[1];
                    return v.short === short_1;
                });
                if (pair) {
                    key = pair[0];
                }
            }
            if (!key || !options[key]) {
                throw error("Unknown option " + arg);
            }
            if (key === "password" && !(opts === null || opts === void 0 ? void 0 : opts.configFile)) {
                throw new Error("--password can only be set in the config file or passed in via $PASSWORD");
            }
            if (key === "hashed-password" && !(opts === null || opts === void 0 ? void 0 : opts.configFile)) {
                throw new Error("--hashed-password can only be set in the config file or passed in via $HASHED_PASSWORD");
            }
            var option = options[key];
            if (option.type === "boolean") {
                ;
                args[key] = true;
                return out_i_1 = i, "continue";
            }
            // Might already have a value if it was the --long=value format.
            if (typeof value === "undefined") {
                // A value is only valid if it doesn't look like an option.
                value = argv[i + 1] && !argv[i + 1].startsWith("-") ? argv[++i] : undefined;
            }
            if (!value && option.type === OptionalString) {
                ;
                args[key] = new OptionalString(value);
                return out_i_1 = i, "continue";
            }
            else if (!value) {
                throw error("--" + key + " requires a value");
            }
            if (option.type === OptionalString && value === "false") {
                return out_i_1 = i, "continue";
            }
            if (option.path) {
                value = path.resolve(value);
            }
            switch (option.type) {
                case "string":
                    ;
                    args[key] = value;
                    break;
                case "string[]":
                    if (!args[key]) {
                        ;
                        args[key] = [];
                    }
                    ;
                    args[key].push(value);
                    break;
                case "number":
                    ;
                    args[key] = parseInt(value, 10);
                    if (isNaN(args[key])) {
                        throw error("--" + key + " must be a number");
                    }
                    break;
                case OptionalString:
                    ;
                    args[key] = new OptionalString(value);
                    break;
                default: {
                    if (!Object.values(option.type).includes(value)) {
                        throw error("--" + key + " valid values: [" + Object.values(option.type).join(", ") + "]");
                    }
                    ;
                    args[key] = value;
                    break;
                }
            }
            return out_i_1 = i, "continue";
        }
        // Everything else goes into _.
        args._.push(arg);
        out_i_1 = i;
    };
    var out_i_1;
    for (var i = 0; i < argv.length; ++i) {
        _loop_1(i);
        i = out_i_1;
    }
    // If a cert was provided a key must also be provided.
    if (args.cert && args.cert.value && !args["cert-key"]) {
        throw new Error("--cert-key is missing");
    }
    logger_1.logger.debug(function () { return ["parsed command line", logger_1.field("args", __assign(__assign({}, args), { password: undefined }))]; });
    return args;
};
exports.parse = parse;
/**
 * Take CLI and config arguments (optional) and return a single set of arguments
 * with the defaults set. Arguments from the CLI are prioritized over config
 * arguments.
 */
function setDefaults(cliArgs, configArgs) {
    return __awaiter(this, void 0, void 0, function () {
        var args, addr, _a, cert, certKey, usingEnvPassword, usingEnvHashedPassword, proxyDomains;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    args = Object.assign({}, configArgs || {}, cliArgs);
                    if (!args["user-data-dir"]) {
                        args["user-data-dir"] = util_1.paths.data;
                    }
                    if (!args["extensions-dir"]) {
                        args["extensions-dir"] = path.join(args["user-data-dir"], "extensions");
                    }
                    // --verbose takes priority over --log and --log takes priority over the
                    // environment variable.
                    if (args.verbose) {
                        args.log = LogLevel.Trace;
                    }
                    else if (!args.log &&
                        process.env.LOG_LEVEL &&
                        Object.values(LogLevel).includes(process.env.LOG_LEVEL)) {
                        args.log = process.env.LOG_LEVEL;
                    }
                    // Sync --log, --verbose, the environment variable, and logger level.
                    if (args.log) {
                        process.env.LOG_LEVEL = args.log;
                    }
                    switch (args.log) {
                        case LogLevel.Trace:
                            logger_1.logger.level = logger_1.Level.Trace;
                            args.verbose = true;
                            break;
                        case LogLevel.Debug:
                            logger_1.logger.level = logger_1.Level.Debug;
                            args.verbose = false;
                            break;
                        case LogLevel.Info:
                            logger_1.logger.level = logger_1.Level.Info;
                            args.verbose = false;
                            break;
                        case LogLevel.Warn:
                            logger_1.logger.level = logger_1.Level.Warning;
                            args.verbose = false;
                            break;
                        case LogLevel.Error:
                            logger_1.logger.level = logger_1.Level.Error;
                            args.verbose = false;
                            break;
                    }
                    // Default to using a password.
                    if (!args.auth) {
                        args.auth = AuthType.Password;
                    }
                    addr = bindAddrFromAllSources(configArgs || { _: [] }, cliArgs);
                    args.host = addr.host;
                    args.port = addr.port;
                    // If we're being exposed to the cloud, we listen on a random address and
                    // disable auth.
                    if (args.link) {
                        args.host = "localhost";
                        args.port = 0;
                        args.socket = undefined;
                        args.cert = undefined;
                        args.auth = AuthType.None;
                    }
                    if (!(args.cert && !args.cert.value)) return [3 /*break*/, 2];
                    return [4 /*yield*/, util_1.generateCertificate(args["cert-host"] || "localhost")];
                case 1:
                    _a = _b.sent(), cert = _a.cert, certKey = _a.certKey;
                    args.cert = {
                        value: cert,
                    };
                    args["cert-key"] = certKey;
                    _b.label = 2;
                case 2:
                    usingEnvPassword = !!process.env.PASSWORD;
                    if (process.env.PASSWORD) {
                        args.password = process.env.PASSWORD;
                    }
                    usingEnvHashedPassword = !!process.env.HASHED_PASSWORD;
                    if (process.env.HASHED_PASSWORD) {
                        args["hashed-password"] = process.env.HASHED_PASSWORD;
                        usingEnvPassword = false;
                    }
                    // Ensure they're not readable by child processes.
                    delete process.env.PASSWORD;
                    delete process.env.HASHED_PASSWORD;
                    proxyDomains = new Set((args["proxy-domain"] || []).map(function (d) { return d.replace(/^\*\./, ""); }));
                    args["proxy-domain"] = Array.from(proxyDomains);
                    return [2 /*return*/, __assign(__assign({}, args), { usingEnvPassword: usingEnvPassword,
                            usingEnvHashedPassword: usingEnvHashedPassword })]; // TODO: Technically no guarantee this is fulfilled.
            }
        });
    });
}
exports.setDefaults = setDefaults;
function defaultConfigFile() {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = "bind-addr: 127.0.0.1:8080\nauth: password\npassword: ";
                    return [4 /*yield*/, util_1.generatePassword()];
                case 1: return [2 /*return*/, _a + (_b.sent()) + "\ncert: false\n"];
            }
        });
    });
}
/**
 * Reads the code-server yaml config file and returns it as Args.
 *
 * @param configPath Read the config from configPath instead of $CODE_SERVER_CONFIG or the default.
 */
function readConfigFile(configPath) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c, error_1, configFile;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!configPath) {
                        configPath = process.env.CODE_SERVER_CONFIG;
                        if (!configPath) {
                            configPath = path.join(util_1.paths.config, "config.yaml");
                        }
                    }
                    return [4 /*yield*/, fs_1.promises.mkdir(path.dirname(configPath), { recursive: true })];
                case 1:
                    _d.sent();
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 5, , 6]);
                    _b = (_a = fs_1.promises).writeFile;
                    _c = [configPath];
                    return [4 /*yield*/, defaultConfigFile()];
                case 3: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.sent(), {
                            flag: "wx", // wx means to fail if the path exists.
                        }]))];
                case 4:
                    _d.sent();
                    logger_1.logger.info("Wrote default config file to " + util_1.humanPath(configPath));
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _d.sent();
                    // EEXIST is fine; we don't want to overwrite existing configurations.
                    if (error_1.code !== "EEXIST") {
                        throw error_1;
                    }
                    return [3 /*break*/, 6];
                case 6: return [4 /*yield*/, fs_1.promises.readFile(configPath, "utf8")];
                case 7:
                    configFile = _d.sent();
                    return [2 /*return*/, parseConfigFile(configFile, configPath)];
            }
        });
    });
}
exports.readConfigFile = readConfigFile;
/**
 * parseConfigFile parses configFile into ConfigArgs.
 * configPath is used as the filename in error messages
 */
function parseConfigFile(configFile, configPath) {
    if (!configFile) {
        return { _: [], config: configPath };
    }
    var config = js_yaml_1.default.load(configFile, {
        filename: configPath,
    });
    if (!config || typeof config === "string") {
        throw new Error("invalid config: " + config);
    }
    // We convert the config file into a set of flags.
    // This is a temporary measure until we add a proper CLI library.
    var configFileArgv = Object.entries(config).map(function (_a) {
        var _b = __read(_a, 2), optName = _b[0], opt = _b[1];
        if (opt === true) {
            return "--" + optName;
        }
        return "--" + optName + "=" + opt;
    });
    var args = exports.parse(configFileArgv, {
        configFile: configPath,
    });
    return __assign(__assign({}, args), { config: configPath });
}
exports.parseConfigFile = parseConfigFile;
function parseBindAddr(bindAddr) {
    var u = new URL("http://" + bindAddr);
    return {
        host: u.hostname,
        // With the http scheme 80 will be dropped so assume it's 80 if missing.
        // This means --bind-addr <addr> without a port will default to 80 as well
        // and not the code-server default.
        port: u.port ? parseInt(u.port, 10) : 80,
    };
}
function bindAddrFromArgs(addr, args) {
    addr = __assign({}, addr);
    if (args["bind-addr"]) {
        addr = parseBindAddr(args["bind-addr"]);
    }
    if (args.host) {
        addr.host = args.host;
    }
    if (process.env.PORT) {
        addr.port = parseInt(process.env.PORT, 10);
    }
    if (args.port !== undefined) {
        addr.port = args.port;
    }
    return addr;
}
function bindAddrFromAllSources() {
    var e_1, _a;
    var argsConfig = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        argsConfig[_i] = arguments[_i];
    }
    var addr = {
        host: "localhost",
        port: 8080,
    };
    try {
        for (var argsConfig_1 = __values(argsConfig), argsConfig_1_1 = argsConfig_1.next(); !argsConfig_1_1.done; argsConfig_1_1 = argsConfig_1.next()) {
            var args = argsConfig_1_1.value;
            addr = bindAddrFromArgs(addr, args);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (argsConfig_1_1 && !argsConfig_1_1.done && (_a = argsConfig_1.return)) _a.call(argsConfig_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return addr;
}
var shouldRunVsCodeCli = function (args) {
    return !!args["list-extensions"] || !!args["install-extension"] || !!args["uninstall-extension"];
};
exports.shouldRunVsCodeCli = shouldRunVsCodeCli;
/**
 * Determine if it looks like the user is trying to open a file or folder in an
 * existing instance. The arguments here should be the arguments the user
 * explicitly passed on the command line, not defaults or the configuration.
 */
var shouldOpenInExistingInstance = function (args) { return __awaiter(void 0, void 0, void 0, function () {
    var readSocketPath, openInFlagCount, socketPath, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                // Always use the existing instance if we're running from VS Code's terminal.
                if (process.env.VSCODE_IPC_HOOK_CLI) {
                    return [2 /*return*/, process.env.VSCODE_IPC_HOOK_CLI];
                }
                readSocketPath = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var error_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, fs_1.promises.readFile(path.join(os.tmpdir(), "vscode-ipc"), "utf8")];
                            case 1: return [2 /*return*/, _a.sent()];
                            case 2:
                                error_2 = _a.sent();
                                if (error_2.code !== "ENOENT") {
                                    throw error_2;
                                }
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/, undefined];
                        }
                    });
                }); };
                openInFlagCount = ["reuse-window", "new-window"].reduce(function (prev, cur) {
                    return args[cur] ? prev + 1 : prev;
                }, 0);
                if (openInFlagCount > 0) {
                    return [2 /*return*/, readSocketPath()];
                }
                if (!(Object.keys(args).length === 1 && args._.length > 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, readSocketPath()];
            case 1:
                socketPath = _b.sent();
                _a = socketPath;
                if (!_a) return [3 /*break*/, 3];
                return [4 /*yield*/, util_1.canConnect(socketPath)];
            case 2:
                _a = (_b.sent());
                _b.label = 3;
            case 3:
                if (_a) {
                    return [2 /*return*/, socketPath];
                }
                _b.label = 4;
            case 4: return [2 /*return*/, undefined];
        }
    });
}); };
exports.shouldOpenInExistingInstance = shouldOpenInExistingInstance;
//# sourceMappingURL=cli.js.map