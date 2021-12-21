(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./logger"));

},{"./logger":2}],2:[function(require,module,exports){
(function (process){(function (){
"use strict";
// tslint:disable no-console
Object.defineProperty(exports, "__esModule", { value: true });
var Level;
(function (Level) {
    Level[Level["Trace"] = 0] = "Trace";
    Level[Level["Debug"] = 1] = "Debug";
    Level[Level["Info"] = 2] = "Info";
    Level[Level["Warning"] = 3] = "Warning";
    Level[Level["Error"] = 4] = "Error";
})(Level = exports.Level || (exports.Level = {}));
class Field {
    constructor(identifier, value) {
        this.identifier = identifier;
        this.value = value;
    }
    toJSON() {
        return {
            identifier: this.identifier,
            value: this.value,
        };
    }
}
exports.Field = Field;
class Time {
    constructor(expected, ms) {
        this.expected = expected;
        this.ms = ms;
    }
}
exports.Time = Time;
exports.time = (expected) => {
    return new Time(expected, Date.now());
};
exports.field = (name, value) => {
    return new Field(name, value);
};
/**
 * Format and build a *single* log entry at a time.
 */
class Formatter {
    /**
     * formatType is used for the strings returned from style() and reset().
     */
    constructor(formatType = "%s", colors = true) {
        this.formatType = formatType;
        this.colors = colors;
        this.format = "";
        this.args = [];
        this.fields = [];
        this.minimumTagWidth = 5;
    }
    /**
     * Add a tag.
     */
    tag(name, color) {
        for (let i = name.length; i < this.minimumTagWidth; ++i) {
            name += " ";
        }
        this.push(name + " ", color);
    }
    push(arg, color, weight) {
        if (Array.isArray(arg) && arg.every((a) => a instanceof Field)) {
            return void this.fields.push(...arg);
        }
        if (this.colors) {
            this.format += `${this.formatType}${this.getType(arg)}${this.formatType}`;
            this.args.push(this.style(color, weight), arg, this.reset());
        }
        else {
            this.format += `${this.getType(arg)}`;
            this.args.push(arg);
        }
    }
    /**
     * Write everything out and reset state.
     */
    write() {
        this.doWrite(...this.flush());
    }
    /**
     * Return current values and reset state.
     */
    flush() {
        const args = [this.format, this.args, this.fields];
        this.format = "";
        this.args = [];
        this.fields = [];
        return args;
    }
    /**
     * Get the format string for the value type.
     */
    getType(arg) {
        switch (typeof arg) {
            case "object": return "%o";
            case "number": return "%d";
            default: return "%s";
        }
    }
}
exports.Formatter = Formatter;
/**
 * Display logs in the browser using CSS in the output. Fields are displayed on
 * individual lines within a group.
 */
class BrowserFormatter extends Formatter {
    constructor() {
        super("%c");
    }
    style(color, weight) {
        return (color ? `color: ${color};` : "")
            + (weight ? `font-weight: ${weight};` : "");
    }
    reset() {
        return this.style("inherit", "normal");
    }
    doWrite(format, args, fields) {
        console.groupCollapsed(format, ...args);
        fields.forEach((field) => {
            this.push(field.identifier, "#3794ff", "bold");
            if (typeof field.value !== "undefined" && field.value.constructor && field.value.constructor.name) {
                this.push(` (${field.value.constructor.name})`);
            }
            this.push(": ");
            this.push(field.value);
            const flushed = this.flush();
            console.log(flushed[0], ...flushed[1]);
        });
        console.groupEnd();
    }
}
exports.BrowserFormatter = BrowserFormatter;
/**
 * Display logs on the command line using ANSI color codes. Fields are displayed
 * in a single stringified object inline.
 */
class ServerFormatter extends Formatter {
    constructor() {
        super("%s", !!process.stdout.isTTY);
    }
    style(color, weight) {
        return (weight === "bold" ? "\u001B[1m" : "")
            + (color ? this.hex(color) : "");
    }
    reset() {
        return "\u001B[0m";
    }
    hex(hex) {
        const [r, g, b] = this.hexToRgb(hex);
        return `\u001B[38;2;${r};${g};${b}m`;
    }
    hexToRgb(hex) {
        const integer = parseInt(hex.substr(1), 16);
        return [
            (integer >> 16) & 0xFF,
            (integer >> 8) & 0xFF,
            integer & 0xFF,
        ];
    }
    doWrite(format, args, fields) {
        if (fields.length === 0) {
            return console.log("[%s] " + format, new Date().toISOString(), ...args);
        }
        const obj = {};
        fields.forEach((field) => obj[field.identifier] = field.value);
        console.log("[%s] " + format + " %s%s%s", new Date().toISOString(), ...args, this.style("#8c8c8c"), JSON.stringify(obj), this.reset());
    }
}
exports.ServerFormatter = ServerFormatter;
class Logger {
    constructor(_formatter, name, defaultFields, extenders = []) {
        this._formatter = _formatter;
        this.name = name;
        this.defaultFields = defaultFields;
        this.extenders = extenders;
        this.level = Level.Info;
        this.muted = false;
        if (name) {
            this.nameColor = this.hashStringToColor(name);
        }
        if (typeof process !== "undefined" && typeof process.env !== "undefined") {
            switch (process.env.LOG_LEVEL) {
                case "trace":
                    this.level = Level.Trace;
                    break;
                case "debug":
                    this.level = Level.Debug;
                    break;
                case "info":
                    this.level = Level.Info;
                    break;
                case "warn":
                    this.level = Level.Warning;
                    break;
                case "error":
                    this.level = Level.Error;
                    break;
            }
        }
    }
    set formatter(formatter) {
        this._formatter = formatter;
    }
    /**
     * Supresses all output
     */
    mute() {
        this.muted = true;
    }
    extend(extender) {
        this.extenders.push(extender);
    }
    info(message, ...fields) {
        this.handle({
            type: "info",
            message,
            fields,
            tagColor: "#008FBF",
            level: Level.Info,
        });
    }
    warn(message, ...fields) {
        this.handle({
            type: "warn",
            message,
            fields,
            tagColor: "#FF9D00",
            level: Level.Warning,
        });
    }
    trace(message, ...fields) {
        this.handle({
            type: "trace",
            message,
            fields,
            tagColor: "#888888",
            level: Level.Trace,
        });
    }
    debug(message, ...fields) {
        this.handle({
            type: "debug",
            message,
            fields,
            tagColor: "#84009E",
            level: Level.Debug,
        });
    }
    error(message, ...fields) {
        this.handle({
            type: "error",
            message,
            fields,
            tagColor: "#B00000",
            level: Level.Error,
        });
    }
    /**
     * Returns a sub-logger with a name.
     * Each name is deterministically generated a color.
     */
    named(name, ...fields) {
        const l = new Logger(this._formatter, name, fields, this.extenders);
        if (this.muted) {
            l.mute();
        }
        return l;
    }
    handle(options) {
        if (this.level > options.level || this.muted) {
            return;
        }
        let passedFields = options.fields || [];
        if (typeof options.message === "function") {
            const values = options.message();
            options.message = values.shift();
            passedFields = values;
        }
        const fields = (this.defaultFields
            ? passedFields.filter((f) => !!f).concat(this.defaultFields)
            : passedFields.filter((f) => !!f));
        const now = Date.now();
        let times = [];
        const hasFields = fields && fields.length > 0;
        if (hasFields) {
            times = fields.filter((f) => f.value instanceof Time);
            this._formatter.push(fields);
        }
        this._formatter.tag(options.type, options.tagColor);
        if (this.name && this.nameColor) {
            this._formatter.tag(this.name, this.nameColor);
        }
        this._formatter.push(options.message);
        if (times.length > 0) {
            times.forEach((time) => {
                const diff = now - time.value.ms;
                const expPer = diff / time.value.expected;
                const min = 125 * (1 - expPer);
                const max = 125 + min;
                const green = expPer < 1 ? max : min;
                const red = expPer >= 1 ? max : min;
                this._formatter.push(` ${time.identifier}=`, "#3794ff");
                this._formatter.push(`${diff}ms`, this.rgbToHex(red > 0 ? red : 0, green > 0 ? green : 0, 0));
            });
        }
        this._formatter.write();
        this.extenders.forEach((extender) => {
            extender({
                section: this.name,
                fields: options.fields,
                level: options.level,
                message: options.message,
                type: options.type,
            });
        });
    }
    /**
     * Hashes a string.
     */
    djb2(str) {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
        }
        return hash;
    }
    rgbToHex(r, g, b) {
        const integer = ((Math.round(r) & 0xFF) << 16)
            + ((Math.round(g) & 0xFF) << 8)
            + (Math.round(b) & 0xFF);
        const str = integer.toString(16);
        return "#" + "000000".substring(str.length) + str;
    }
    /**
     * Generates a deterministic color from a string using hashing.
     */
    hashStringToColor(str) {
        const hash = this.djb2(str);
        return this.rgbToHex((hash & 0xFF0000) >> 16, (hash & 0x00FF00) >> 8, hash & 0x0000FF);
    }
}
exports.Logger = Logger;
exports.logger = new Logger(typeof process === "undefined" || typeof process.stdout === "undefined"
    ? new BrowserFormatter()
    : new ServerFormatter());

}).call(this)}).call(this,require('_process'))
},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerServiceWorker = void 0;
const logger_1 = require("@coder/logger");
const util_1 = require("../common/util");
async function registerServiceWorker() {
    const options = util_1.getOptions();
    logger_1.logger.level = options.logLevel;
    const path = util_1.normalize(`${options.csStaticBase}/out/browser/serviceWorker.js`);
    try {
        await navigator.serviceWorker.register(path, {
            scope: options.base + "/",
        });
        logger_1.logger.info(`[Service Worker] registered`);
    }
    catch (error) {
        util_1.logError(logger_1.logger, `[Service Worker] registration`, error);
    }
}
exports.registerServiceWorker = registerServiceWorker;
if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
    registerServiceWorker();
}
else {
    logger_1.logger.error(`[Service Worker] navigator is undefined`);
}

},{"../common/util":5,"@coder/logger":1}],5:[function(require,module,exports){
"use strict";
/*
 * This file exists in two locations:
 * - src/common/util.ts
 * - lib/vscode/src/vs/server/common/util.ts
 * The second is a symlink to the first.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = exports.getFirstString = exports.arrayify = exports.getOptions = exports.resolveBase = exports.trimSlashes = exports.normalize = exports.generateUuid = exports.plural = exports.split = void 0;
/**
 * Split a string up to the delimiter. If the delimiter doesn't exist the first
 * item will have all the text and the second item will be an empty string.
 */
const split = (str, delimiter) => {
    const index = str.indexOf(delimiter);
    return index !== -1 ? [str.substring(0, index).trim(), str.substring(index + 1)] : [str, ""];
};
exports.split = split;
/**
 * Appends an 's' to the provided string if count is greater than one;
 * otherwise the string is returned
 */
const plural = (count, str) => (count === 1 ? str : `${str}s`);
exports.plural = plural;
const generateUuid = (length = 24) => {
    const possible = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    return Array(length)
        .fill(1)
        .map(() => possible[Math.floor(Math.random() * possible.length)])
        .join("");
};
exports.generateUuid = generateUuid;
/**
 * Remove extra slashes in a URL.
 */
const normalize = (url, keepTrailing = false) => {
    return url.replace(/\/\/+/g, "/").replace(/\/+$/, keepTrailing ? "/" : "");
};
exports.normalize = normalize;
/**
 * Remove leading and trailing slashes.
 */
const trimSlashes = (url) => {
    return url.replace(/^\/+|\/+$/g, "");
};
exports.trimSlashes = trimSlashes;
/**
 * Resolve a relative base against the window location. This is used for
 * anything that doesn't work with a relative path.
 */
const resolveBase = (base) => {
    // After resolving the base will either start with / or be an empty string.
    if (!base || base.startsWith("/")) {
        return base ?? "";
    }
    const parts = location.pathname.split("/");
    parts[parts.length - 1] = base;
    const url = new URL(location.origin + "/" + parts.join("/"));
    return exports.normalize(url.pathname);
};
exports.resolveBase = resolveBase;
/**
 * Get options embedded in the HTML or query params.
 */
const getOptions = () => {
    let options;
    try {
        options = JSON.parse(document.getElementById("coder-options").getAttribute("data-settings"));
    }
    catch (error) {
        options = {};
    }
    // You can also pass options in stringified form to the options query
    // variable. Options provided here will override the ones in the options
    // element.
    const params = new URLSearchParams(location.search);
    const queryOpts = params.get("options");
    if (queryOpts) {
        options = {
            ...options,
            ...JSON.parse(queryOpts),
        };
    }
    options.base = exports.resolveBase(options.base);
    options.csStaticBase = exports.resolveBase(options.csStaticBase);
    return options;
};
exports.getOptions = getOptions;
/**
 * Wrap the value in an array if it's not already an array. If the value is
 * undefined return an empty array.
 */
const arrayify = (value) => {
    if (Array.isArray(value)) {
        return value;
    }
    if (typeof value === "undefined") {
        return [];
    }
    return [value];
};
exports.arrayify = arrayify;
/**
 * Get the first string. If there's no string return undefined.
 */
const getFirstString = (value) => {
    if (Array.isArray(value)) {
        return value[0];
    }
    return typeof value === "string" ? value : undefined;
};
exports.getFirstString = getFirstString;
// TODO: Might make sense to add Error handling to the logger itself.
function logError(logger, prefix, err) {
    if (err instanceof Error) {
        logger.error(`${prefix}: ${err.message} ${err.stack}`);
    }
    else {
        logger.error(`${prefix}: ${err}`);
    }
}
exports.logError = logError;

},{}]},{},[4]);
