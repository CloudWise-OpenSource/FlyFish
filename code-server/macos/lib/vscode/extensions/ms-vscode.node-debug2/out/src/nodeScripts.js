"use strict";
/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeScriptContainer = void 0;
const vscode_chrome_debug_core_1 = require("vscode-chrome-debug-core");
const nodeDebugAdapter_1 = require("./nodeDebugAdapter");
const path = require("path");
class NodeScriptContainer extends vscode_chrome_debug_core_1.ScriptContainer {
    /**
     * If realPath is an absolute path or a URL, return realPath. Otherwise, prepend the node_internals marker
     */
    realPathToDisplayPath(realPath) {
        if (!realPath.match(/VM\d+/) && !path.isAbsolute(realPath)) {
            return `${nodeDebugAdapter_1.NodeDebugAdapter.NODE_INTERNALS}/${realPath}`;
        }
        return super.realPathToDisplayPath(realPath);
    }
    /**
     * If displayPath starts with the NODE_INTERNALS indicator, strip it.
     */
    displayPathToRealPath(displayPath) {
        const match = displayPath.match(new RegExp(`^${nodeDebugAdapter_1.NodeDebugAdapter.NODE_INTERNALS}[\\\\/](.*)`));
        return match ? match[1] : super.displayPathToRealPath(displayPath);
    }
}
exports.NodeScriptContainer = NodeScriptContainer;

//# sourceMappingURL=nodeScripts.js.map
