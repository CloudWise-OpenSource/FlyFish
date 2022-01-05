/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Start monitoring for a certain pid to exist.
 * If the process indicated by pid ceases to execute,
 * the current process will exit in 6 seconds with exit code 87
 */
export function start(pid: number): void;

/**
 * Exit the current process immediately with a certain exitCode.
 */
export function exit(exitCode: number): void;
