export interface Paths {
    data: string;
    config: string;
    runtime: string;
}
export declare const paths: Paths;
/**
 * Gets the config and data paths for the current platform/configuration.
 * On MacOS this function gets the standard XDG directories instead of using the native macOS
 * ones. Most CLIs do this as in practice only GUI apps use the standard macOS directories.
 */
export declare function getEnvPaths(): Paths;
/**
 * humanPath replaces the home directory in p with ~.
 * Makes it more readable.
 *
 * @param p
 */
export declare function humanPath(p?: string): string;
export declare const generateCertificate: (hostname: string) => Promise<{
    cert: string;
    certKey: string;
}>;
export declare const generatePassword: (length?: number) => Promise<string>;
export declare const hash: (str: string) => string;
export declare const getMediaMime: (filePath?: string | undefined) => string;
export declare const isWsl: () => Promise<boolean>;
/**
 * Try opening a URL using whatever the system has set for opening URLs.
 */
export declare const open: (url: string) => Promise<void>;
/**
 * For iterating over an enum's values.
 */
export declare const enumToArray: (t: any) => string[];
/**
 * For displaying all allowed options in an enum.
 */
export declare const buildAllowedMessage: (t: any) => string;
export declare const isObject: <T extends object>(obj: T) => obj is T;
/**
 * Compute `fsPath` for the given uri.
 * Taken from vs/base/common/uri.ts. It's not imported to avoid also importing
 * everything that file imports.
 */
export declare function pathToFsPath(path: string, keepDriveLetterCasing?: boolean): string;
/**
 * Return a promise that resolves with whether the socket path is active.
 */
export declare function canConnect(path: string): Promise<boolean>;
export declare const isFile: (path: string) => Promise<boolean>;
