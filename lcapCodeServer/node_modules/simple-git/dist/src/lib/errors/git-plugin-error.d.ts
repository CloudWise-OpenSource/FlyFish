import { GitError } from './git-error';
export declare class GitPluginError extends GitError {
    task?: import("../tasks/task").EmptyTask | import("../types").StringTask<any> | import("../types").BufferTask<any> | undefined;
    readonly plugin?: "progress" | "timeout" | "completion" | "errors" | "spawnOptions" | "baseDir" | "binary" | "maxConcurrentProcesses" | "config" | undefined;
    constructor(task?: import("../tasks/task").EmptyTask | import("../types").StringTask<any> | import("../types").BufferTask<any> | undefined, plugin?: "progress" | "timeout" | "completion" | "errors" | "spawnOptions" | "baseDir" | "binary" | "maxConcurrentProcesses" | "config" | undefined, message?: string);
}
