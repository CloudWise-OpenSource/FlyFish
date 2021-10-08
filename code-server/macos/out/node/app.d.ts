import { Express } from "express";
import http from "http";
import { DefaultedArgs } from "./cli";
/**
 * Create an Express app and an HTTP/S server to serve it.
 */
export declare const createApp: (args: DefaultedArgs) => Promise<[Express, Express, http.Server]>;
/**
 * Get the address of a server as a string (protocol *is* included) while
 * ensuring there is one (will throw if there isn't).
 */
export declare const ensureAddress: (server: http.Server) => string;
