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
exports.shouldOpenInExistingInstance = exports.shouldRunVsCodeCli = exports.parseConfigFile = exports.readConfigFile = exports.setDefaults = exports.parse = exports.splitOnFirstEquals = exports.optionDescriptions = exports.OptionalString = exports.LogLevel = exports.Optional = exports.AuthType = exports.Feature = void 0;
const logger_1 = require("@coder/logger");
const fs_1 = require("fs");
const js_yaml_1 = __importDefault(require("js-yaml"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const util_1 = require("./util");
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
class Optional {
    constructor(value) {
        this.value = value;
    }
}
exports.Optional = Optional;
var LogLevel;
(function (LogLevel) {
    LogLevel["Trace"] = "trace";
    LogLevel["Debug"] = "debug";
    LogLevel["Info"] = "info";
    LogLevel["Warn"] = "warn";
    LogLevel["Error"] = "error";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
class OptionalString extends Optional {
}
exports.OptionalString = OptionalString;
const options = {
    auth: { type: AuthType, description: "The type of authentication to use." },
    password: {
        type: "string",
        description: "The password for password authentication (can only be passed in via $PASSWORD or the config file).",
    },
    "hashed-password": {
        type: "string",
        description: "The password hashed with argon2 for password authentication (can only be passed in via $HASHED_PASSWORD or the config file). \n" +
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
        description: `
      Securely bind code-server via our cloud service with the passed name. You'll get a URL like
      https://hostname-username.cdr.co at which you can easily access your code-server instance.
      Authorization is done via GitHub.
    `,
        beta: true,
    },
};
const optionDescriptions = () => {
    const entries = Object.entries(options).filter(([, v]) => !!v.description);
    const widths = entries.reduce((prev, [k, v]) => ({
        long: k.length > prev.long ? k.length : prev.long,
        short: v.short && v.short.length > prev.short ? v.short.length : prev.short,
    }), { short: 0, long: 0 });
    return entries.map(([k, v]) => {
        const help = `${" ".repeat(widths.short - (v.short ? v.short.length : 0))}${v.short ? `-${v.short}` : " "} --${k} `;
        return (help +
            v.description
                ?.trim()
                .split(/\n/)
                .map((line, i) => {
                line = line.trim();
                if (i === 0) {
                    return " ".repeat(widths.long - k.length) + (v.beta ? "(beta) " : "") + line;
                }
                return " ".repeat(widths.long + widths.short + 6) + line;
            })
                .join("\n") +
            (typeof v.type === "object" ? ` [${Object.values(v.type).join(", ")}]` : ""));
    });
};
exports.optionDescriptions = optionDescriptions;
function splitOnFirstEquals(str) {
    // we use regex instead of "=" to ensure we split at the first
    // "=" and return the following substring with it
    // important for the hashed-password which looks like this
    // $argon2i$v=19$m=4096,t=3,p=1$0qR/o+0t00hsbJFQCKSfdQ$oFcM4rL6o+B7oxpuA4qlXubypbBPsf+8L531U7P9HYY
    // 2 means return two items
    // Source: https://stackoverflow.com/a/4607799/3015595
    // We use the ? to say the the substr after the = is optional
    const split = str.split(/=(.+)?/, 2);
    return split;
}
exports.splitOnFirstEquals = splitOnFirstEquals;
const parse = (argv, opts) => {
    const error = (msg) => {
        if (opts?.configFile) {
            msg = `error reading ${opts.configFile}: ${msg}`;
        }
        return new Error(msg);
    };
    const args = { _: [] };
    let ended = false;
    for (let i = 0; i < argv.length; ++i) {
        const arg = argv[i];
        // -- signals the end of option parsing.
        if (!ended && arg === "--") {
            ended = true;
            continue;
        }
        // Options start with a dash and require a value if non-boolean.
        if (!ended && arg.startsWith("-")) {
            let key;
            let value;
            if (arg.startsWith("--")) {
                const split = splitOnFirstEquals(arg.replace(/^--/, ""));
                key = split[0];
                value = split[1];
            }
            else {
                const short = arg.replace(/^-/, "");
                const pair = Object.entries(options).find(([, v]) => v.short === short);
                if (pair) {
                    key = pair[0];
                }
            }
            if (!key || !options[key]) {
                throw error(`Unknown option ${arg}`);
            }
            if (key === "password" && !opts?.configFile) {
                throw new Error("--password can only be set in the config file or passed in via $PASSWORD");
            }
            if (key === "hashed-password" && !opts?.configFile) {
                throw new Error("--hashed-password can only be set in the config file or passed in via $HASHED_PASSWORD");
            }
            const option = options[key];
            if (option.type === "boolean") {
                ;
                args[key] = true;
                continue;
            }
            // Might already have a value if it was the --long=value format.
            if (typeof value === "undefined") {
                // A value is only valid if it doesn't look like an option.
                value = argv[i + 1] && !argv[i + 1].startsWith("-") ? argv[++i] : undefined;
            }
            if (!value && option.type === OptionalString) {
                ;
                args[key] = new OptionalString(value);
                continue;
            }
            else if (!value) {
                throw error(`--${key} requires a value`);
            }
            if (option.type === OptionalString && value === "false") {
                continue;
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
                        throw error(`--${key} must be a number`);
                    }
                    break;
                case OptionalString:
                    ;
                    args[key] = new OptionalString(value);
                    break;
                default: {
                    if (!Object.values(option.type).includes(value)) {
                        throw error(`--${key} valid values: [${Object.values(option.type).join(", ")}]`);
                    }
                    ;
                    args[key] = value;
                    break;
                }
            }
            continue;
        }
        // Everything else goes into _.
        args._.push(arg);
    }
    // If a cert was provided a key must also be provided.
    if (args.cert && args.cert.value && !args["cert-key"]) {
        throw new Error("--cert-key is missing");
    }
    logger_1.logger.debug(() => ["parsed command line", logger_1.field("args", { ...args, password: undefined })]);
    return args;
};
exports.parse = parse;
/**
 * Take CLI and config arguments (optional) and return a single set of arguments
 * with the defaults set. Arguments from the CLI are prioritized over config
 * arguments.
 */
async function setDefaults(cliArgs, configArgs) {
    const args = Object.assign({}, configArgs || {}, cliArgs);
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
    const addr = bindAddrFromAllSources(configArgs || { _: [] }, cliArgs);
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
    if (args.cert && !args.cert.value) {
        const { cert, certKey } = await util_1.generateCertificate(args["cert-host"] || "localhost");
        args.cert = {
            value: cert,
        };
        args["cert-key"] = certKey;
    }
    let usingEnvPassword = !!process.env.PASSWORD;
    if (process.env.PASSWORD) {
        args.password = process.env.PASSWORD;
    }
    const usingEnvHashedPassword = !!process.env.HASHED_PASSWORD;
    if (process.env.HASHED_PASSWORD) {
        args["hashed-password"] = process.env.HASHED_PASSWORD;
        usingEnvPassword = false;
    }
    // Ensure they're not readable by child processes.
    delete process.env.PASSWORD;
    delete process.env.HASHED_PASSWORD;
    // Filter duplicate proxy domains and remove any leading `*.`.
    const proxyDomains = new Set((args["proxy-domain"] || []).map((d) => d.replace(/^\*\./, "")));
    args["proxy-domain"] = Array.from(proxyDomains);
    return {
        ...args,
        usingEnvPassword,
        usingEnvHashedPassword,
    }; // TODO: Technically no guarantee this is fulfilled.
}
exports.setDefaults = setDefaults;
async function defaultConfigFile() {
    return `bind-addr: 127.0.0.1:8080
auth: password
password: ${await util_1.generatePassword()}
cert: false
`;
}
/**
 * Reads the code-server yaml config file and returns it as Args.
 *
 * @param configPath Read the config from configPath instead of $CODE_SERVER_CONFIG or the default.
 */
async function readConfigFile(configPath) {
    if (!configPath) {
        configPath = process.env.CODE_SERVER_CONFIG;
        if (!configPath) {
            configPath = path.join(util_1.paths.config, "config.yaml");
        }
    }
    await fs_1.promises.mkdir(path.dirname(configPath), { recursive: true });
    try {
        await fs_1.promises.writeFile(configPath, await defaultConfigFile(), {
            flag: "wx", // wx means to fail if the path exists.
        });
        logger_1.logger.info(`Wrote default config file to ${util_1.humanPath(configPath)}`);
    }
    catch (error) {
        // EEXIST is fine; we don't want to overwrite existing configurations.
        if (error.code !== "EEXIST") {
            throw error;
        }
    }
    const configFile = await fs_1.promises.readFile(configPath, "utf8");
    return parseConfigFile(configFile, configPath);
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
    const config = js_yaml_1.default.load(configFile, {
        filename: configPath,
    });
    if (!config || typeof config === "string") {
        throw new Error(`invalid config: ${config}`);
    }
    // We convert the config file into a set of flags.
    // This is a temporary measure until we add a proper CLI library.
    const configFileArgv = Object.entries(config).map(([optName, opt]) => {
        if (opt === true) {
            return `--${optName}`;
        }
        return `--${optName}=${opt}`;
    });
    const args = exports.parse(configFileArgv, {
        configFile: configPath,
    });
    return {
        ...args,
        config: configPath,
    };
}
exports.parseConfigFile = parseConfigFile;
function parseBindAddr(bindAddr) {
    const u = new URL(`http://${bindAddr}`);
    return {
        host: u.hostname,
        // With the http scheme 80 will be dropped so assume it's 80 if missing.
        // This means --bind-addr <addr> without a port will default to 80 as well
        // and not the code-server default.
        port: u.port ? parseInt(u.port, 10) : 80,
    };
}
function bindAddrFromArgs(addr, args) {
    addr = { ...addr };
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
function bindAddrFromAllSources(...argsConfig) {
    let addr = {
        host: "localhost",
        port: 8080,
    };
    for (const args of argsConfig) {
        addr = bindAddrFromArgs(addr, args);
    }
    return addr;
}
const shouldRunVsCodeCli = (args) => {
    return !!args["list-extensions"] || !!args["install-extension"] || !!args["uninstall-extension"];
};
exports.shouldRunVsCodeCli = shouldRunVsCodeCli;
/**
 * Determine if it looks like the user is trying to open a file or folder in an
 * existing instance. The arguments here should be the arguments the user
 * explicitly passed on the command line, not defaults or the configuration.
 */
const shouldOpenInExistingInstance = async (args) => {
    // Always use the existing instance if we're running from VS Code's terminal.
    if (process.env.VSCODE_IPC_HOOK_CLI) {
        return process.env.VSCODE_IPC_HOOK_CLI;
    }
    const readSocketPath = async () => {
        try {
            return await fs_1.promises.readFile(path.join(os.tmpdir(), "vscode-ipc"), "utf8");
        }
        catch (error) {
            if (error.code !== "ENOENT") {
                throw error;
            }
        }
        return undefined;
    };
    // If these flags are set then assume the user is trying to open in an
    // existing instance since these flags have no effect otherwise.
    const openInFlagCount = ["reuse-window", "new-window"].reduce((prev, cur) => {
        return args[cur] ? prev + 1 : prev;
    }, 0);
    if (openInFlagCount > 0) {
        return readSocketPath();
    }
    // It's possible the user is trying to spawn another instance of code-server.
    // Check if any unrelated flags are set (check against one because `_` always
    // exists), that a file or directory was passed, and that the socket is
    // active.
    if (Object.keys(args).length === 1 && args._.length > 0) {
        const socketPath = await readSocketPath();
        if (socketPath && (await util_1.canConnect(socketPath))) {
            return socketPath;
        }
    }
    return undefined;
};
exports.shouldOpenInExistingInstance = shouldOpenInExistingInstance;
//# sourceMappingURL=cli.js.map