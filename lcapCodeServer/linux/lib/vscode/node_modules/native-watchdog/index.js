/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

var watchdog = require('./build/Release/watchdog');

var hasStarted = false;

exports.start = function(pid) {
    if (typeof pid !== 'number' || Math.round(pid) !== pid) {
        throw new Error(`Expected integer pid!`);
    }
    if (hasStarted) {
        throw new Error(`Can only monitor a single process!`);
    }
    hasStarted = true;
    watchdog.start(pid);
}

exports.exit = function(code) {
    watchdog.exit(code || 0);
}
