/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

const { join, isAbsolute, basename } = require('path');
const { writeFile } = require('fs');
const cdp = require('chrome-remote-interface');

async function wait(n) {
    return new Promise(resolve => setTimeout(resolve, n));
}

async function connectWithRetry(port, tries = 10, retryWait = 50, errors = [], target) {
    if (typeof target === 'undefined') {
        target = function (targets) {
            const target = targets.find(target => {
                if (target.webSocketDebuggerUrl) {
                    if (target.type === 'page') {
                        return target.url.indexOf('bootstrap/index.html') > 0
                    } else {
                        return true;
                    }
                }
            });
            if (!target) {
                throw new class extends Error {
                    constructor() {
                        super('no target');
                        this.code = 'ECONNREFUSED';
                    }
                };
            }
            return target;
        };
    }

    try {
        return await cdp({
            port,
            target,
            local: true,
        });
    } catch (e) {
        errors.push(e);
        if (tries <= 1) {
            throw new class extends Error {
                constructor() {
                    super('failed to connect');
                    this.errors = errors;
                }
            }
        }
        await wait(retryWait);
        return connectWithRetry(port, tries - 1, retryWait, errors, target);
    }
}

async function startProfiling(options) {

    const client = await connectWithRetry(options.port, options.tries, options.retryWait, [], options.target);
    const { Runtime, Profiler } = client;

    if (options.checkForPaused) {
        // ensure the runtime isn't being debugged
        let { Debugger } = client;
        let isPaused = false;
        client.on('event', message => {
            if (message.method === 'Debugger.paused') {
                isPaused = true;
            }
        })
        await Debugger.enable();
        if (isPaused) {
            // client.close();
            // ⬆︎ this leaks the connection but there is an issue in 
            // chrome that it will resume the runtime whenever a client
            // disconnects. Because things are relatively short-lived
            // we trade the leakage for being able to debug
            return Promise.reject('runtime is paused');
        }
    } else {
        // resume form inspect-brk
        await Runtime.runIfWaitingForDebugger();
    }

    // now start profiling
    await Profiler.enable();
    await Profiler.setSamplingInterval({ interval: 100 });
    await Profiler.start();

    return {
        stop: async function (n = 0) {
            if (n > 0) {
                await wait(n);
            }
            const data = await Profiler.stop();
            await client.close();
            return data;
        }
    }
}

function rewriteAbsolutePaths(profile, replace = 'noAbsolutePaths') {
    for (const node of profile.profile.nodes) {
        if (node.callFrame && node.callFrame.url) {
            if (isAbsolute(node.callFrame.url)) {
                node.callFrame.url = join(replace, basename(node.callFrame.url));
            }
        }
    }
    return profile;
}

async function writeProfile(profile, filename = `profile-${Date.now()}.cpuprofile`) {
    await new Promise((resolve, reject) => {
        const data = JSON.stringify(profile.profile, null, 4);
        writeFile(filename, data, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    });
}

module.exports = {
    startProfiling,
    writeProfile,
    rewriteAbsolutePaths,
}
