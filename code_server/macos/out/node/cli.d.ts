import { Args as VsArgs } from "../../typings/ipc";
export declare enum Feature {
    /** Web socket compression. */
    PermessageDeflate = "permessage-deflate"
}
export declare enum AuthType {
    Password = "password",
    None = "none"
}
export declare class Optional<T> {
    readonly value?: T | undefined;
    constructor(value?: T | undefined);
}
export declare enum LogLevel {
    Trace = "trace",
    Debug = "debug",
    Info = "info",
    Warn = "warn",
    Error = "error"
}
export declare class OptionalString extends Optional<string> {
}
export interface Args extends VsArgs {
    config?: string;
    auth?: AuthType;
    password?: string;
    "hashed-password"?: string;
    cert?: OptionalString;
    "cert-host"?: string;
    "cert-key"?: string;
    "disable-telemetry"?: boolean;
    "disable-update-check"?: boolean;
    enable?: string[];
    help?: boolean;
    host?: string;
    json?: boolean;
    log?: LogLevel;
    open?: boolean;
    port?: number;
    "bind-addr"?: string;
    socket?: string;
    version?: boolean;
    force?: boolean;
    "list-extensions"?: boolean;
    "install-extension"?: string[];
    "show-versions"?: boolean;
    "uninstall-extension"?: string[];
    "proxy-domain"?: string[];
    locale?: string;
    _: string[];
    "reuse-window"?: boolean;
    "new-window"?: boolean;
    link?: OptionalString;
}
export declare const optionDescriptions: () => string[];
export declare const parse: (argv: string[], opts?: {
    configFile?: string | undefined;
} | undefined) => Args;
export interface DefaultedArgs extends ConfigArgs {
    auth: AuthType;
    cert?: {
        value: string;
    };
    host: string;
    port: number;
    "proxy-domain": string[];
    verbose: boolean;
    usingEnvPassword: boolean;
    usingEnvHashedPassword: boolean;
    "extensions-dir": string;
    "user-data-dir": string;
}
/**
 * Take CLI and config arguments (optional) and return a single set of arguments
 * with the defaults set. Arguments from the CLI are prioritized over config
 * arguments.
 */
export declare function setDefaults(cliArgs: Args, configArgs?: ConfigArgs): Promise<DefaultedArgs>;
interface ConfigArgs extends Args {
    config: string;
}
/**
 * Reads the code-server yaml config file and returns it as Args.
 *
 * @param configPath Read the config from configPath instead of $CODE_SERVER_CONFIG or the default.
 */
export declare function readConfigFile(configPath?: string): Promise<ConfigArgs>;
/**
 * parseConfigFile parses configFile into ConfigArgs.
 * configPath is used as the filename in error messages
 */
export declare function parseConfigFile(configFile: string, configPath: string): ConfigArgs;
export declare const shouldRunVsCodeCli: (args: Args) => boolean;
/**
 * Determine if it looks like the user is trying to open a file or folder in an
 * existing instance. The arguments here should be the arguments the user
 * explicitly passed on the command line, not defaults or the configuration.
 */
export declare const shouldOpenInExistingInstance: (args: Args) => Promise<string | undefined>;
export {};
