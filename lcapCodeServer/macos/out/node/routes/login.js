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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = exports.RateLimiter = exports.Cookie = void 0;
var express_1 = require("express");
var fs_1 = require("fs");
var limiter_1 = require("limiter");
var path = __importStar(require("path"));
var safe_compare_1 = __importDefault(require("safe-compare"));
var constants_1 = require("../constants");
var http_1 = require("../http");
var util_1 = require("../util");
var Cookie;
(function (Cookie) {
    Cookie["Key"] = "key";
})(Cookie = exports.Cookie || (exports.Cookie = {}));
// RateLimiter wraps around the limiter library for logins.
// It allows 2 logins every minute plus 12 logins every hour.
var RateLimiter = /** @class */ (function () {
    function RateLimiter() {
        this.minuteLimiter = new limiter_1.RateLimiter(2, "minute");
        this.hourLimiter = new limiter_1.RateLimiter(12, "hour");
    }
    RateLimiter.prototype.canTry = function () {
        // Note: we must check using >= 1 because technically when there are no tokens left
        // you get back a number like 0.00013333333333333334
        // which would cause fail if the logic were > 0
        return this.minuteLimiter.getTokensRemaining() >= 1 || this.hourLimiter.getTokensRemaining() >= 1;
    };
    RateLimiter.prototype.removeToken = function () {
        return this.minuteLimiter.tryRemoveTokens(1) || this.hourLimiter.tryRemoveTokens(1);
    };
    return RateLimiter;
}());
exports.RateLimiter = RateLimiter;
var getRoot = function (req, error) { return __awaiter(void 0, void 0, void 0, function () {
    var content, passwordMsg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs_1.promises.readFile(path.join(constants_1.rootPath, "src/browser/pages/login.html"), "utf8")];
            case 1:
                content = _a.sent();
                passwordMsg = "Check the config file at " + util_1.humanPath(req.args.config) + " for the password.";
                if (req.args.usingEnvPassword) {
                    passwordMsg = "Password was set from $PASSWORD.";
                }
                else if (req.args.usingEnvHashedPassword) {
                    passwordMsg = "Password was set from $HASHED_PASSWORD.";
                }
                return [2 /*return*/, http_1.replaceTemplates(req, content
                        .replace(/{{PASSWORD_MSG}}/g, passwordMsg)
                        .replace(/{{ERROR}}/, error ? "<div class=\"error\">" + error.message + "</div>" : ""))];
        }
    });
}); };
var limiter = new RateLimiter();
exports.router = express_1.Router();
exports.router.use(function (req, res, next) {
    var to = (typeof req.query.to === "string" && req.query.to) || "/";
    if (http_1.authenticated(req)) {
        return http_1.redirect(req, res, to, { to: undefined });
    }
    next();
});
exports.router.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = (_a = res).send;
                return [4 /*yield*/, getRoot(req)];
            case 1:
                _b.apply(_a, [_c.sent()]);
                return [2 /*return*/];
        }
    });
}); });
exports.router.post("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var to, error_1, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 1, , 3]);
                // Check to see if they exceeded their login attempts
                if (!limiter.canTry()) {
                    throw new Error("Login rate limited!");
                }
                if (!req.body.password) {
                    throw new Error("Missing password");
                }
                if (req.args["hashed-password"]
                    ? safe_compare_1.default(util_1.hash(req.body.password), req.args["hashed-password"])
                    : req.args.password && safe_compare_1.default(req.body.password, req.args.password)) {
                    // The hash does not add any actual security but we do it for
                    // obfuscation purposes (and as a side effect it handles escaping).
                    res.cookie(Cookie.Key, util_1.hash(req.body.password), {
                        domain: http_1.getCookieDomain(req.headers.host || "", req.args["proxy-domain"]),
                        path: req.body.base || "/",
                        sameSite: "lax",
                    });
                    to = (typeof req.query.to === "string" && req.query.to) || "/";
                    return [2 /*return*/, http_1.redirect(req, res, to, { to: undefined })];
                }
                // Note: successful logins should not count against the RateLimiter
                // which is why this logic must come after the successful login logic
                limiter.removeToken();
                console.error("Failed login attempt", JSON.stringify({
                    xForwardedFor: req.headers["x-forwarded-for"],
                    remoteAddress: req.connection.remoteAddress,
                    userAgent: req.headers["user-agent"],
                    timestamp: Math.floor(new Date().getTime() / 1000),
                }));
                throw new Error("Incorrect password");
            case 1:
                error_1 = _c.sent();
                _b = (_a = res).send;
                return [4 /*yield*/, getRoot(req, error_1)];
            case 2:
                _b.apply(_a, [_c.sent()]);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=login.js.map