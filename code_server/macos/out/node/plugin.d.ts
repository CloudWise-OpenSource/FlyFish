/// <reference types="qs" />
/// <reference types="http-proxy" />
/// <reference types="ws" />
import { Level, Logger } from "@coder/logger";
import * as express from "express";
import * as pluginapi from "../../typings/pluginapi";
import { HttpCode, HttpError } from "../common/http";
import { Router as WsRouter } from "./wsRouter";
/**
 * The module you get when importing "code-server".
 */
export declare const codeServer: {
    HttpCode: typeof HttpCode;
    HttpError: typeof HttpError;
    Level: typeof Level;
    authenticated: (req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>) => boolean;
    ensureAuthenticated: (req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, _?: express.Response<any, Record<string, any>> | undefined, next?: express.NextFunction | undefined) => void;
    express: typeof express;
    field: <T>(name: string, value: T) => import("@coder/logger").Field<T>;
    proxy: import("http-proxy");
    replaceTemplates: <T_1 extends object>(req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, content: string, extraOpts?: Omit<T_1, "base" | "csStaticBase" | "logLevel"> | undefined) => string;
    WsRouter: typeof WsRouter;
    wss: import("ws").Server;
};
interface Plugin extends pluginapi.Plugin {
    /**
     * These fields are populated from the plugin's package.json
     * and now guaranteed to exist.
     */
    name: string;
    version: string;
    /**
     * path to the node module on the disk.
     */
    modulePath: string;
}
interface Application extends pluginapi.Application {
    plugin: Omit<Plugin, "init" | "deinit" | "router" | "applications">;
}
/**
 * PluginAPI implements the plugin API described in typings/pluginapi.d.ts
 * Please see that file for details.
 */
export declare class PluginAPI {
    /**
     * These correspond to $CS_PLUGIN_PATH and $CS_PLUGIN respectively.
     */
    private readonly csPlugin;
    private readonly csPluginPath;
    private readonly workingDirectory;
    private readonly plugins;
    private readonly logger;
    constructor(logger: Logger, 
    /**
     * These correspond to $CS_PLUGIN_PATH and $CS_PLUGIN respectively.
     */
    csPlugin?: string, csPluginPath?: string, workingDirectory?: string | undefined);
    /**
     * applications grabs the full list of applications from
     * all loaded plugins.
     */
    applications(): Promise<Application[]>;
    /**
     * mount mounts all plugin routers onto r and websocket routers onto wr.
     */
    mount(r: express.Router, wr: express.Router): void;
    /**
     * loadPlugins loads all plugins based on this.csPlugin,
     * this.csPluginPath and the built in plugins.
     */
    loadPlugins(loadBuiltin?: boolean): Promise<void>;
    /**
     * _loadPlugins is the counterpart to loadPlugins.
     *
     * It differs in that it loads all plugins in a single
     * directory whereas loadPlugins uses all available directories
     * as documented.
     */
    private _loadPlugins;
    private loadPlugin;
    /**
     * _loadPlugin is the counterpart to loadPlugin and actually
     * loads the plugin now that we know there is no duplicate
     * and that the package.json has been read.
     */
    private _loadPlugin;
    dispose(): Promise<void>;
}
export {};
