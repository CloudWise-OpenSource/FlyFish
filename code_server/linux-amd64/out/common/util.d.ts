/**
 * Base options included on every page.
 */
export interface Options {
    base: string;
    csStaticBase: string;
    logLevel: number;
}
/**
 * Split a string up to the delimiter. If the delimiter doesn't exist the first
 * item will have all the text and the second item will be an empty string.
 */
export declare const split: (str: string, delimiter: string) => [string, string];
/**
 * Appends an 's' to the provided string if count is greater than one;
 * otherwise the string is returned
 */
export declare const plural: (count: number, str: string) => string;
export declare const generateUuid: (length?: number) => string;
/**
 * Remove extra slashes in a URL.
 */
export declare const normalize: (url: string, keepTrailing?: boolean) => string;
/**
 * Remove leading and trailing slashes.
 */
export declare const trimSlashes: (url: string) => string;
/**
 * Resolve a relative base against the window location. This is used for
 * anything that doesn't work with a relative path.
 */
export declare const resolveBase: (base?: string | undefined) => string;
/**
 * Get options embedded in the HTML or query params.
 */
export declare const getOptions: <T extends Options>() => T;
/**
 * Wrap the value in an array if it's not already an array. If the value is
 * undefined return an empty array.
 */
export declare const arrayify: <T>(value?: T | T[] | undefined) => T[];
/**
 * Get the first string. If there's no string return undefined.
 */
export declare const getFirstString: (value: string | string[] | object | undefined) => string | undefined;
export declare function logError(logger: {
    error: (msg: string) => void;
}, prefix: string, err: Error | string): void;
