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
exports.wss = exports.Router = exports.WebsocketRouter = exports.handleUpgrade = void 0;
const express = __importStar(require("express"));
const http = __importStar(require("http"));
const ws_1 = __importDefault(require("ws"));
const handleUpgrade = (app, server) => {
    server.on("upgrade", (req, socket, head) => {
        socket.pause();
        req.ws = socket;
        req.head = head;
        req._ws_handled = false;
        app.handle(req, new http.ServerResponse(req), () => {
            if (!req._ws_handled) {
                socket.end("HTTP/1.1 404 Not Found\r\n\r\n");
            }
        });
    });
};
exports.handleUpgrade = handleUpgrade;
class WebsocketRouter {
    constructor() {
        this.router = express.Router();
    }
    /**
     * Handle a websocket at this route. Note that websockets are immediately
     * paused when they come in.
     */
    ws(route, ...handlers) {
        this.router.get(route, ...handlers.map((handler) => {
            const wrapped = (req, res, next) => {
                ;
                req._ws_handled = true;
                return handler(req, res, next);
            };
            return wrapped;
        }));
    }
}
exports.WebsocketRouter = WebsocketRouter;
function Router() {
    return new WebsocketRouter();
}
exports.Router = Router;
exports.wss = new ws_1.default.Server({ noServer: true });
//# sourceMappingURL=wsRouter.js.map