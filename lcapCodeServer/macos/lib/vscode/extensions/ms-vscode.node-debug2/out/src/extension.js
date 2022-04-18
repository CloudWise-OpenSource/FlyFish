"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.node-debug2.toggleSkippingFile', toggleSkippingFile));
    context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider('extensionHost', new ExtensionHostDebugConfigurationProvider()));
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
function toggleSkippingFile(path) {
    if (!path) {
        const activeEditor = vscode.window.activeTextEditor;
        path = activeEditor && activeEditor.document.fileName;
    }
    if (path && vscode.debug.activeDebugSession) {
        const args = typeof path === 'string' ? { path } : { sourceReference: path };
        vscode.debug.activeDebugSession.customRequest('toggleSkipFileStatus', args);
    }
}
class ExtensionHostDebugConfigurationProvider {
    resolveDebugConfiguration(folder, debugConfiguration) {
        var _a, _b;
        const useV3 = (_b = (_a = getWithoutDefault('debug.extensionHost.useV3')) !== null && _a !== void 0 ? _a : getWithoutDefault('debug.javascript.usePreview')) !== null && _b !== void 0 ? _b : true;
        if (useV3) {
            folder = folder || (vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0] : undefined);
            debugConfiguration['__workspaceFolder'] = folder === null || folder === void 0 ? void 0 : folder.uri.fsPath;
            debugConfiguration.type = 'pwa-extensionHost';
        }
        return debugConfiguration;
    }
}
function getWithoutDefault(setting) {
    var _a;
    const info = vscode.workspace.getConfiguration().inspect(setting);
    return (_a = info === null || info === void 0 ? void 0 : info.workspaceValue) !== null && _a !== void 0 ? _a : info === null || info === void 0 ? void 0 : info.globalValue;
}

//# sourceMappingURL=extension.js.map
