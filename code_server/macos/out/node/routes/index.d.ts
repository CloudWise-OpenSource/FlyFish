import * as express from "express";
import http from "http";
import { DefaultedArgs } from "../cli";
/**
 * Register all routes and middleware.
 */
export declare const register: (app: express.Express, wsApp: express.Express, server: http.Server, args: DefaultedArgs) => Promise<void>;
