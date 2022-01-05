import { Query } from "express-serve-static-core";
export declare type Settings = {
    [key: string]: Settings | string | boolean | number;
};
/**
 * Provides read and write access to settings.
 */
export declare class SettingsProvider<T> {
    private readonly settingsPath;
    constructor(settingsPath: string);
    /**
     * Read settings from the file. On a failure return last known settings and
     * log a warning.
     */
    read(): Promise<T>;
    /**
     * Write settings combined with current settings. On failure log a warning.
     * Settings will be merged shallowly.
     */
    write(settings: Partial<T>): Promise<void>;
}
export interface UpdateSettings {
    update: {
        checked: number;
        version: string;
    };
}
/**
 * Global code-server settings.
 */
export interface CoderSettings extends UpdateSettings {
    lastVisited: {
        url: string;
        workspace: boolean;
    };
    query: Query;
}
/**
 * Global code-server settings file.
 */
export declare const settings: SettingsProvider<CoderSettings>;
