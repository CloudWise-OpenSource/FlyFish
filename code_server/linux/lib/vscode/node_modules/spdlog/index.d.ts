/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for
 *  license information.
 *--------------------------------------------------------------------------------------------*/

export const version: number;
export function setLevel(level: number): void;
export function setFlushOn(level: number): void;
export function createRotatingLogger(name: string, filename: string, filesize: number, filecount: number): Promise<Logger>;
export function createAsyncRotatingLogger(name: string, filename: string, filesize: number, filecount: number): Promise<Logger>;

export class Logger {
    constructor(loggerType: "rotating" | "rotating_async" | "stdout_async", name: string, filename: string, filesize: number, filecount: number);

    trace(message: string): void;
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    critical(message: string): void;
    getLevel(): number;
    setLevel(level: number): void;
    setPattern(pattern: string): void;
    clearFormatters(): void;
    /**
     * A synchronous operation to flush the contents into file
    */
    flush(): void;
    drop(): void;
}
