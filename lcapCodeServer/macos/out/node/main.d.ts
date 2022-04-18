import http from "http";
import { DefaultedArgs } from "./cli";
export declare const runVsCodeCli: (args: DefaultedArgs) => void;
export declare const openInExistingInstance: (args: DefaultedArgs, socketPath: string) => Promise<void>;
export declare const runCodeServer: (args: DefaultedArgs) => Promise<http.Server>;
