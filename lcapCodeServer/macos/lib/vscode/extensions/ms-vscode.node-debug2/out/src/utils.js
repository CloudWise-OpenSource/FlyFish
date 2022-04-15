"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareSemver = exports.stripBOM = exports.extendObject = exports.trimLastNewline = exports.killTree = exports.random = exports.JavaScriptDeterminant = void 0;
const path = require("path");
const fs = require("fs");
const cp = require("child_process");
const match = require("minimatch");
const NODE_SHEBANG_MATCHER = new RegExp('#! */usr/bin/env +node');
/**
 * Checks whether a file is a loadable JavaScript file.
 */
let JavaScriptDeterminant = /** @class */ (() => {
    class JavaScriptDeterminant {
        constructor() {
            this.customPatterns = [];
        }
        updatePatterns(patterns) {
            this.customPatterns = patterns;
        }
        isJavaScript(aPath) {
            const basename = path.basename(aPath);
            const matchesPattern = [
                ...JavaScriptDeterminant.defaultPatterns,
                ...this.customPatterns,
            ].some(pattern => match(basename, pattern, { nocase: true }));
            return matchesPattern || this.isShebang(aPath);
        }
        isShebang(aPath) {
            try {
                const buffer = Buffer.alloc(30);
                const fd = fs.openSync(aPath, 'r');
                fs.readSync(fd, buffer, 0, buffer.length, 0);
                fs.closeSync(fd);
                const line = buffer.toString();
                return NODE_SHEBANG_MATCHER.test(line);
            }
            catch (e) {
                return false;
            }
        }
    }
    JavaScriptDeterminant.defaultPatterns = ['*.js', '*.es6', '*.jsx', '*.mjs'];
    return JavaScriptDeterminant;
})();
exports.JavaScriptDeterminant = JavaScriptDeterminant;
function random(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
exports.random = random;
function killTree(processId) {
    if (process.platform === 'win32') {
        const windir = process.env['WINDIR'] || 'C:\\Windows';
        const TASK_KILL = path.join(windir, 'System32', 'taskkill.exe');
        // when killing a process in Windows its child processes are *not* killed but become root processes.
        // Therefore we use TASKKILL.EXE
        try {
            cp.execSync(`${TASK_KILL} /F /T /PID ${processId}`);
        }
        catch (err) {
        }
    }
    else {
        // on linux and OS X we kill all direct and indirect child processes as well
        try {
            const cmd = path.join(__dirname, './terminateProcess.sh');
            cp.spawnSync(cmd, [processId.toString()]);
        }
        catch (err) {
        }
    }
}
exports.killTree = killTree;
function trimLastNewline(msg) {
    return msg.replace(/(\n|\r\n)$/, '');
}
exports.trimLastNewline = trimLastNewline;
function extendObject(toObject, fromObject) {
    for (let key in fromObject) {
        if (fromObject.hasOwnProperty(key)) {
            toObject[key] = fromObject[key];
        }
    }
    return toObject;
}
exports.extendObject = extendObject;
function stripBOM(s) {
    if (s && s[0] === '\uFEFF') {
        s = s.substr(1);
    }
    return s;
}
exports.stripBOM = stripBOM;
const semverRegex = /v?(\d+)\.(\d+)\.(\d+)/;
function compareSemver(a, b) {
    const aNum = versionStringToNumber(a);
    const bNum = versionStringToNumber(b);
    return aNum - bNum;
}
exports.compareSemver = compareSemver;
function versionStringToNumber(str) {
    const match = str.match(semverRegex);
    if (!match) {
        throw new Error('Invalid node version string: ' + str);
    }
    return parseInt(match[1], 10) * 10000 + parseInt(match[2], 10) * 100 + parseInt(match[3], 10);
}

//# sourceMappingURL=utils.js.map
