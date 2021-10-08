/// <reference types="node" />
import { Logger } from "@coder/logger";
import * as cp from "child_process";
import { Emitter } from "../common/emitter";
import { DefaultedArgs } from "./cli";
/**
 * Listen to a single message from a process. Reject if the process errors,
 * exits, or times out.
 *
 * `fn` is a function that determines whether the message is the one we're
 * waiting for.
 */
export declare function onMessage<M, T extends M>(proc: cp.ChildProcess | NodeJS.Process, fn: (message: M) => message is T, customLogger?: Logger): Promise<T>;
interface ChildHandshakeMessage {
    type: "handshake";
}
interface RelaunchMessage {
    type: "relaunch";
    version: string;
}
declare type ChildMessage = RelaunchMessage | ChildHandshakeMessage;
declare class ProcessError extends Error {
    readonly code: number | undefined;
    constructor(message: string, code: number | undefined);
}
/**
 * Wrapper around a process that tries to gracefully exit when a process exits
 * and provides a way to prevent `process.exit`.
 */
declare abstract class Process {
    /**
     * Emit this to trigger a graceful exit.
     */
    protected readonly _onDispose: Emitter<NodeJS.Signals | undefined>;
    /**
     * Emitted when the process is about to be disposed.
     */
    readonly onDispose: import("../common/emitter").Event<NodeJS.Signals | undefined>;
    /**
     * Uniquely named logger for the process.
     */
    abstract logger: Logger;
    constructor();
    /**
     * Ensure control over when the process exits.
     */
    preventExit(): void;
    private readonly processExit;
    /**
     * Will always exit even if normal exit is being prevented.
     */
    exit(error?: number | ProcessError): never;
}
/**
 * Child process that will clean up after itself if the parent goes away and can
 * perform a handshake with the parent and ask it to relaunch.
 */
declare class ChildProcess extends Process {
    private readonly parentPid;
    logger: Logger;
    constructor(parentPid: number);
    /**
     * Initiate the handshake and wait for a response from the parent.
     */
    handshake(): Promise<DefaultedArgs>;
    /**
     * Notify the parent process that it should relaunch the child.
     */
    relaunch(version: string): void;
    /**
     * Send a message to the parent.
     */
    private send;
}
/**
 * Parent process wrapper that spawns the child process and performs a handshake
 * with it. Will relaunch the child if it receives a SIGUSR1 or is asked to by
 * the child. If the child otherwise exits the parent will also exit.
 */
export declare class ParentProcess extends Process {
    private currentVersion;
    logger: Logger;
    private child?;
    private started?;
    private readonly logStdoutStream;
    private readonly logStderrStream;
    protected readonly _onChildMessage: Emitter<ChildMessage>;
    protected readonly onChildMessage: import("../common/emitter").Event<ChildMessage>;
    private args?;
    constructor(currentVersion: string);
    private disposeChild;
    private relaunch;
    start(args: DefaultedArgs): Promise<void>;
    private _start;
    private spawn;
    /**
     * Wait for a handshake from the child then reply.
     */
    private handshake;
    /**
     * Send a message to the child.
     */
    private send;
}
/**
 * Process wrapper.
 */
export declare const wrapper: ChildProcess | ParentProcess;
export declare function isChild(proc: ChildProcess | ParentProcess): proc is ChildProcess;
export {};
