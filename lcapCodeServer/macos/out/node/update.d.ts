import { SettingsProvider, UpdateSettings } from "./settings";
export interface Update {
    checked: number;
    version: string;
}
export interface LatestResponse {
    name: string;
}
/**
 * Provide update information.
 */
export declare class UpdateProvider {
    /**
     * The URL for getting the latest version of code-server. Should return JSON
     * that fulfills `LatestResponse`.
     */
    private readonly latestUrl;
    /**
     * Update information will be stored here. If not provided, the global
     * settings will be used.
     */
    private readonly settings;
    private update?;
    private updateInterval;
    constructor(
    /**
     * The URL for getting the latest version of code-server. Should return JSON
     * that fulfills `LatestResponse`.
     */
    latestUrl?: string, 
    /**
     * Update information will be stored here. If not provided, the global
     * settings will be used.
     */
    settings?: SettingsProvider<UpdateSettings>);
    /**
     * Query for and return the latest update.
     */
    getUpdate(force?: boolean): Promise<Update>;
    private _getUpdate;
    /**
     * Return true if the currently installed version is the latest.
     */
    isLatestVersion(latest: Update): boolean;
    private request;
    private requestResponse;
}
