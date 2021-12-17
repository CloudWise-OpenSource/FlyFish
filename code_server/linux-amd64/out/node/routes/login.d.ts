export declare enum Cookie {
    Key = "key"
}
export declare class RateLimiter {
    private readonly minuteLimiter;
    private readonly hourLimiter;
    canTry(): boolean;
    removeToken(): boolean;
}
export declare const router: import("express-serve-static-core").Router;
