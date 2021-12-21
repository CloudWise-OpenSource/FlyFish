import * as express from "express";
import * as expressCore from "express-serve-static-core";
import * as http from "http";
import Websocket from "ws";
import * as pluginapi from "../../typings/pluginapi";
export declare const handleUpgrade: (app: express.Express, server: http.Server) => void;
export declare class WebsocketRouter {
    readonly router: expressCore.Router;
    /**
     * Handle a websocket at this route. Note that websockets are immediately
     * paused when they come in.
     */
    ws(route: expressCore.PathParams, ...handlers: pluginapi.WebSocketHandler[]): void;
}
export declare function Router(): WebsocketRouter;
export declare const wss: Websocket.Server;
