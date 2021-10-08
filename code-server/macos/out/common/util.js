"use strict";
/*
 * This file exists in two locations:
 * - src/common/util.ts
 * - lib/vscode/src/vs/server/common/util.ts
 * The second is a symlink to the first.
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = exports.getFirstString = exports.arrayify = exports.getOptions = exports.resolveBase = exports.trimSlashes = exports.normalize = exports.generateUuid = exports.plural = exports.split = void 0;
/**
 * Split a string up to the delimiter. If the delimiter doesn't exist the first
 * item will have all the text and the second item will be an empty string.
 */
var split = function (str, delimiter) {
    var index = str.indexOf(delimiter);
    return index !== -1 ? [str.substring(0, index).trim(), str.substring(index + 1)] : [str, ""];
};
exports.split = split;
/**
 * Appends an 's' to the provided string if count is greater than one;
 * otherwise the string is returned
 */
var plural = function (count, str) { return (count === 1 ? str : str + "s"); };
exports.plural = plural;
var generateUuid = function (length) {
    if (length === void 0) { length = 24; }
    var possible = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    return Array(length)
        .fill(1)
        .map(function () { return possible[Math.floor(Math.random() * possible.length)]; })
        .join("");
};
exports.generateUuid = generateUuid;
/**
 * Remove extra slashes in a URL.
 */
var normalize = function (url, keepTrailing) {
    if (keepTrailing === void 0) { keepTrailing = false; }
    return url.replace(/\/\/+/g, "/").replace(/\/+$/, keepTrailing ? "/" : "");
};
exports.normalize = normalize;
/**
 * Remove leading and trailing slashes.
 */
var trimSlashes = function (url) {
    return url.replace(/^\/+|\/+$/g, "");
};
exports.trimSlashes = trimSlashes;
/**
 * Resolve a relative base against the window location. This is used for
 * anything that doesn't work with a relative path.
 */
var resolveBase = function (base) {
    // After resolving the base will either start with / or be an empty string.
    if (!base || base.startsWith("/")) {
        return base !== null && base !== void 0 ? base : "";
    }
    var parts = location.pathname.split("/");
    parts[parts.length - 1] = base;
    var url = new URL(location.origin + "/" + parts.join("/"));
    return exports.normalize(url.pathname);
};
exports.resolveBase = resolveBase;
/**
 * Get options embedded in the HTML or query params.
 */
var getOptions = function () {
    var options;
    try {
        options = JSON.parse(document.getElementById("coder-options").getAttribute("data-settings"));
    }
    catch (error) {
        options = {};
    }
    // You can also pass options in stringified form to the options query
    // variable. Options provided here will override the ones in the options
    // element.
    var params = new URLSearchParams(location.search);
    var queryOpts = params.get("options");
    if (queryOpts) {
        options = __assign(__assign({}, options), JSON.parse(queryOpts));
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
var arrayify = function (value) {
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
var getFirstString = function (value) {
    if (Array.isArray(value)) {
        return value[0];
    }
    return typeof value === "string" ? value : undefined;
};
exports.getFirstString = getFirstString;
// TODO: Might make sense to add Error handling to the logger itself.
function logError(logger, prefix, err) {
    if (err instanceof Error) {
        logger.error(prefix + ": " + err.message + " " + err.stack);
    }
    else {
        logger.error(prefix + ": " + err);
    }
}
exports.logError = logError;
//# sourceMappingURL=util.js.map