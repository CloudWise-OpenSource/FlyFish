import { Request, Response } from "express";
import * as pluginapi from "../../../typings/pluginapi";
export declare function proxy(req: Request, res: Response, opts?: {
    passthroughPath?: boolean;
}): void;
export declare function wsProxy(req: pluginapi.WebsocketRequest, opts?: {
    passthroughPath?: boolean;
}): void;
