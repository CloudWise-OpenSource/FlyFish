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
exports.isDevMode = exports.tmpdir = exports.rootPath = exports.commit = exports.version = exports.getPackageJson = void 0;
var logger_1 = require("@coder/logger");
var os = __importStar(require("os"));
var path = __importStar(require("path"));
function getPackageJson(relativePath) {
    var pkg = {};
    try {
        pkg = require(relativePath);
    }
    catch (error) {
        logger_1.logger.warn(error.message);
    }
    return pkg;
}
exports.getPackageJson = getPackageJson;
var pkg = getPackageJson("../../package.json");
exports.version = pkg.version || "development";
exports.commit = pkg.commit || "development";
exports.rootPath = path.resolve(__dirname, "../..");
exports.tmpdir = path.join(os.tmpdir(), "code-server");
exports.isDevMode = exports.commit === "development";
//# sourceMappingURL=constants.js.map