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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wss = exports.Router = exports.WebsocketRouter = exports.handleUpgrade = void 0;
var express = __importStar(require("express"));
var http = __importStar(require("http"));
var ws_1 = __importDefault(require("ws"));
var handleUpgrade = function (app, server) {
    server.on("upgrade", function (req, socket, head) {
        socket.pause();
        req.ws = socket;
        req.head = head;
        req._ws_handled = false;
        app.handle(req, new http.ServerResponse(req), function () {
            if (!req._ws_handled) {
                socket.end("HTTP/1.1 404 Not Found\r\n\r\n");
            }
        });
    });
};
exports.handleUpgrade = handleUpgrade;
var WebsocketRouter = /** @class */ (function () {
    function WebsocketRouter() {
        this.router = express.Router();
    }
    /**
     * Handle a websocket at this route. Note that websockets are immediately
     * paused when they come in.
     */
    WebsocketRouter.prototype.ws = function (route) {
        var _a;
        var handlers = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            handlers[_i - 1] = arguments[_i];
        }
        (_a = this.router).get.apply(_a, __spreadArray([route], __read(handlers.map(function (handler) {
            var wrapped = function (req, res, next) {
                ;
                req._ws_handled = true;
                return handler(req, res, next);
            };
            return wrapped;
        }))));
    };
    return WebsocketRouter;
}());
exports.WebsocketRouter = WebsocketRouter;
function Router() {
    return new WebsocketRouter();
}
exports.Router = Router;
exports.wss = new ws_1.default.Server({ noServer: true });
//# sourceMappingURL=wsRouter.js.map