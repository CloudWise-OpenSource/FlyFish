/**
 * Provides a heartbeat using a local file to indicate activity.
 */
export declare class Heart {
    private readonly heartbeatPath;
    private readonly isActive;
    private heartbeatTimer?;
    private heartbeatInterval;
    lastHeartbeat: number;
    constructor(heartbeatPath: string, isActive: () => Promise<boolean>);
    alive(): boolean;
    /**
     * Write to the heartbeat file if we haven't already done so within the
     * timeout and start or reset a timer that keeps running as long as there is
     * activity. Failures are logged as warnings.
     */
    beat(): void;
    /**
     * Call to clear any heartbeatTimer for shutdown.
     */
    dispose(): void;
}
