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
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const logger_1 = require("@coder/logger");
const express_1 = require("express");
const fs_1 = require("fs");
const path = __importStar(require("path"));
const tarFs = __importStar(require("tar-fs"));
const zlib = __importStar(require("zlib"));
const http_1 = require("../../common/http");
const util_1 = require("../../common/util");
const constants_1 = require("../constants");
const http_2 = require("../http");
const util_2 = require("../util");
exports.router = express_1.Router();
// The commit is for caching.
exports.router.get("/(:commit)(/*)?", async (req, res) => {
    // Used by VS Code to load extensions into the web worker.
    const tar = util_1.getFirstString(req.query.tar);
    if (tar) {
        await http_2.ensureAuthenticated(req);
        let stream = tarFs.pack(util_2.pathToFsPath(tar));
        if (req.headers["accept-encoding"] && req.headers["accept-encoding"].includes("gzip")) {
            logger_1.logger.debug("gzipping tar", logger_1.field("path", tar));
            const compress = zlib.createGzip();
            stream.pipe(compress);
            stream.on("error", (error) => compress.destroy(error));
            stream.on("close", () => compress.end());
            stream = compress;
            res.header("content-encoding", "gzip");
        }
        res.set("Content-Type", "application/x-tar");
        stream.on("close", () => res.end());
        return stream.pipe(res);
    }
    // If not a tar use the remainder of the path to load the resource.
    if (!req.params[0]) {
        throw new http_1.HttpError("Not Found", http_1.HttpCode.NotFound);
    }
    const resourcePath = path.resolve(req.params[0]);
    // Make sure it's in code-server if you aren't authenticated. This lets
    // unauthenticated users load the login assets.
    const isAuthenticated = await http_2.authenticated(req);
    if (!resourcePath.startsWith(constants_1.rootPath) && !isAuthenticated) {
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
    if (resourcePath.endsWith("manifest.json")) {
        const content = await fs_1.promises.readFile(resourcePath, "utf8");
        return res.send(http_2.replaceTemplates(req, content));
    }
    const content = await fs_1.promises.readFile(resourcePath);
    return res.send(content);
});
//# sourceMappingURL=static.js.map