/// <reference types="node" />
import * as net from "net";
import * as ipc from "../../typings/ipc";
export declare class VscodeProvider {
    readonly serverRootPath: string;
    readonly vsRootPath: string;
    private _vscode?;
    private readonly socketProvider;
    constructor();
    dispose(): Promise<void>;
    initialize(options: Omit<ipc.VscodeOptions, "startPath">, query: ipc.Query): Promise<ipc.WorkbenchOptions>;
    private fork;
    /**
     * VS Code expects a raw socket. It will handle all the web socket frames.
     */
    sendWebsocket(socket: net.Socket, query: ipc.Query, permessageDeflate: boolean): Promise<void>;
    private send;
    /**
     * Choose the first non-empty path from the provided array.
     *
     * Each array item consists of `url` and an optional `workspace` boolean that
     * indicates whether that url is for a workspace.
     *
     * `url` can be a fully qualified URL or just the path portion.
     *
     * `url` can also be a query object to make it easier to pass in query
     * variables directly but anything that isn't a string or string array is not
     * valid and will be ignored.
     */
    private getFirstPath;
}
