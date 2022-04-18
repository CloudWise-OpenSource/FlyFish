export declare enum HttpCode {
    Ok = 200,
    Redirect = 302,
    NotFound = 404,
    BadRequest = 400,
    Unauthorized = 401,
    LargePayload = 413,
    ServerError = 500
}
/**
 * Represents an error with a message and an HTTP status code. This code will be
 * used in the HTTP response.
 */
export declare class HttpError extends Error {
    readonly status: HttpCode;
    readonly details?: object | undefined;
    constructor(message: string, status: HttpCode, details?: object | undefined);
}
