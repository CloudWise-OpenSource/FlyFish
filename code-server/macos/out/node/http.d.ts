import * as express from "express";
import * as expressCore from "express-serve-static-core";
import { DefaultedArgs } from "./cli";
import { Heart } from "./heart";
declare global {
    namespace Express {
        interface Request {
            args: DefaultedArgs;
            heart: Heart;
        }
    }
}
/**
 * Replace common variable strings in HTML templates.
 */
export declare const replaceTemplates: <T extends object>(req: express.Request, content: string, extraOpts?: Omit<T, "base" | "csStaticBase" | "logLevel"> | undefined) => string;
/**
 * Throw an error if not authorized. Call `next` if provided.
 */
export declare const ensureAuthenticated: (req: express.Request, _?: express.Response<any, Record<string, any>> | undefined, next?: express.NextFunction | undefined) => void;
/**
 * Return true if authenticated via cookies.
 */
export declare const authenticated: (req: express.Request) => boolean;
/**
 * Get the relative path that will get us to the root of the page. For each
 * slash we need to go up a directory. For example:
 * / => .
 * /foo => .
 * /foo/ => ./..
 * /foo/bar => ./..
 * /foo/bar/ => ./../..
 */
export declare const relativeRoot: (req: express.Request) => string;
/**
 * Redirect relatively to `/${to}`. Query variables will be preserved.
 * `override` will merge with the existing query (use `undefined` to unset).
 */
export declare const redirect: (req: express.Request, res: express.Response, to: string, override?: expressCore.Query) => void;
/**
 * Get the value that should be used for setting a cookie domain. This will
 * allow the user to authenticate once no matter what sub-domain they use to log
 * in. This will use the highest level proxy domain (e.g. `coder.com` over
 * `test.coder.com` if both are specified).
 */
export declare const getCookieDomain: (host: string, proxyDomains: string[]) => string | undefined;
