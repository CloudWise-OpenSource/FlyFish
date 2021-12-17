"use strict";
/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeBreakpoints = void 0;
const vscode_chrome_debug_core_1 = require("vscode-chrome-debug-core");
class NodeBreakpoints extends vscode_chrome_debug_core_1.Breakpoints {
    constructor(nodeDebugAdapter, chromeConnection) {
        super(nodeDebugAdapter, chromeConnection);
        this.nodeDebugAdapter = nodeDebugAdapter;
    }
    /**
     * Override addBreakpoints, which is called by setBreakpoints to make the actual call to Chrome.
     */
    addBreakpoints(url, breakpoints, scripts) {
        const _super = Object.create(null, {
            addBreakpoints: { get: () => super.addBreakpoints }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const responses = yield _super.addBreakpoints.call(this, url, breakpoints, scripts);
            if (this.nodeDebugAdapter.entryPauseEvent && !this.nodeDebugAdapter.finishedConfig) {
                const entryLocation = this.nodeDebugAdapter.entryPauseEvent.callFrames[0].location;
                const bpAtEntryLocationIdx = responses.findIndex(response => {
                    // Don't compare column location, because you can have a bp at col 0, then break at some other column
                    return response && response.actualLocation && response.actualLocation.lineNumber === entryLocation.lineNumber &&
                        response.actualLocation.scriptId === entryLocation.scriptId;
                });
                const bpAtEntryLocation = bpAtEntryLocationIdx >= 0 && breakpoints[bpAtEntryLocationIdx];
                if (bpAtEntryLocation) {
                    let conditionPassed = true;
                    if (bpAtEntryLocation.condition) {
                        const evalConditionResponse = yield this.nodeDebugAdapter.evaluateOnCallFrame(bpAtEntryLocation.condition, this.nodeDebugAdapter.entryPauseEvent.callFrames[0]);
                        conditionPassed = !evalConditionResponse.exceptionDetails && (!!evalConditionResponse.result.objectId || !!evalConditionResponse.result.value);
                    }
                    if (conditionPassed) {
                        // There is some initial breakpoint being set to the location where we stopped on entry, so need to pause even if
                        // the stopOnEntry flag is not set
                        vscode_chrome_debug_core_1.logger.log('Got a breakpoint set in the entry location, so will stop even though stopOnEntry is not set');
                        this.nodeDebugAdapter.continueAfterConfigDone = false;
                        this.nodeDebugAdapter.expectingStopReason = 'breakpoint';
                    }
                    else {
                        vscode_chrome_debug_core_1.logger.log('Breakpoint condition at entry location did not evaluate to truthy value');
                    }
                }
            }
            return responses;
        });
    }
    validateBreakpointsPath(args) {
        return super.validateBreakpointsPath(args).catch(e => {
            if (!this.nodeDebugAdapter.launchAttachArgs.disableOptimisticBPs && args.source.path && this.nodeDebugAdapter.jsDeterminant.isJavaScript(args.source.path)) {
                return undefined;
            }
            else {
                return Promise.reject(e);
            }
        });
    }
}
exports.NodeBreakpoints = NodeBreakpoints;

//# sourceMappingURL=nodeBreakpoints.js.map
