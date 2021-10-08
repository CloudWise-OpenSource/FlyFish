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
exports.router = void 0;
var logger_1 = require("@coder/logger");
var express_1 = require("express");
var fs_1 = require("fs");
var path = __importStar(require("path"));
var tarFs = __importStar(require("tar-fs"));
var zlib = __importStar(require("zlib"));
var http_1 = require("../../common/http");
var util_1 = require("../../common/util");
var constants_1 = require("../constants");
var http_2 = require("../http");
var util_2 = require("../util");
exports.router = express_1.Router();
// The commit is for caching.
exports.router.get("/(:commit)(/*)?", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tar, stream, compress_1, resourcePath, content_1, content;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tar = util_1.getFirstString(req.query.tar);
                if (tar) {
                    http_2.ensureAuthenticated(req);
                    stream = tarFs.pack(util_2.pathToFsPath(tar));
                    if (req.headers["accept-encoding"] && req.headers["accept-encoding"].includes("gzip")) {
                        logger_1.logger.debug("gzipping tar", logger_1.field("path", tar));
                        compress_1 = zlib.createGzip();
                        stream.pipe(compress_1);
                        stream.on("error", function (error) { return compress_1.destroy(error); });
                        stream.on("close", function () { return compress_1.end(); });
                        stream = compress_1;
                        res.header("content-encoding", "gzip");
                    }
                    res.set("Content-Type", "application/x-tar");
                    stream.on("close", function () { return res.end(); });
                    return [2 /*return*/, stream.pipe(res)];
                }
                // If not a tar use the remainder of the path to load the resource.
                if (!req.params[0]) {
                    throw new http_1.HttpError("Not Found", http_1.HttpCode.NotFound);
                }
                resourcePath = path.resolve(req.params[0]);
                // Make sure it's in code-server if you aren't authenticated. This lets
                // unauthenticated users load the login assets.
                if (!resourcePath.startsWith(constants_1.rootPath) && !http_2.authenticated(req)) {
                    throw new http_1.HttpError("Unauthorized", http_1.HttpCode.Unauthorized);
                }
                // Don't cache during development. - can also be used if you want to make a
                // static request without caching.
                if (req.params.commit !== "development" && req.params.commit !== "-") {
                    res.header("Cache-Control", "public, max-age=31536000");
                }
                // Without this the default is to use the directory the script loaded from.
                if (req.headers["service-worker"]) {
                    res.header("service-worker-allowed", "/");
                }
                res.set("Content-Type", util_2.getMediaMime(resourcePath));
                if (!resourcePath.endsWith("manifest.json")) return [3 /*break*/, 2];
                return [4 /*yield*/, fs_1.promises.readFile(resourcePath, "utf8")];
            case 1:
                content_1 = _a.sent();
                return [2 /*return*/, res.send(http_2.replaceTemplates(req, content_1))];
            case 2: return [4 /*yield*/, fs_1.promises.readFile(resourcePath)];
            case 3:
                content = _a.sent();
                return [2 /*return*/, res.send(content)];
        }
    });
}); });
//# sourceMappingURL=static.js.map