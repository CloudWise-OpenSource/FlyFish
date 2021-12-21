"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = exports.HttpCode = void 0;
var HttpCode;
(function (HttpCode) {
    HttpCode[HttpCode["Ok"] = 200] = "Ok";
    HttpCode[HttpCode["Redirect"] = 302] = "Redirect";
    HttpCode[HttpCode["NotFound"] = 404] = "NotFound";
    HttpCode[HttpCode["BadRequest"] = 400] = "BadRequest";
    HttpCode[HttpCode["Unauthorized"] = 401] = "Unauthorized";
    HttpCode[HttpCode["LargePayload"] = 413] = "LargePayload";
    HttpCode[HttpCode["ServerError"] = 500] = "ServerError";
})(HttpCode = exports.HttpCode || (exports.HttpCode = {}));
/**
 * Represents an error with a message and an HTTP status code. This code will be
 * used in the HTTP response.
 */
class HttpError extends Error {
    constructor(message, status, details) {
        super(message);
        this.status = status;
        this.details = details;
        this.name = this.constructor.name;
    }
}
exports.HttpError = HttpError;
//# sourceMappingURL=http.js.map