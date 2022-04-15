"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.monkeyPatch = void 0;
var logger_1 = require("@coder/logger");
var proxyAgent = __importStar(require("proxy-agent"));
var proxyFromEnv = __importStar(require("proxy-from-env"));
/**
 * This file has nothing to do with the code-server proxy.
 * It is to support $HTTP_PROXY, $HTTPS_PROXY and $NO_PROXY.
 *
 * - https://github.com/cdr/code-server/issues/124
 * - https://www.npmjs.com/package/proxy-agent
 * - https://www.npmjs.com/package/proxy-from-env
 *
 * This file exists in two locations:
 * - src/node/proxy_agent.ts
 * - lib/vscode/src/vs/base/node/proxy_agent.ts
 * The second is a symlink to the first.
 */
/**
 * monkeyPatch patches the node http,https modules to route all requests through the
 * agent we get from the proxy-agent package.
 *
 * This approach only works if there is no code specifying an explicit agent when making
 * a request.
 *
 * None of our code ever passes in a explicit agent to the http,https modules.
 * VS Code's does sometimes but only when a user sets the http.proxy configuration.
 * See https://code.visualstudio.com/docs/setup/network#_legacy-proxy-server-support
 *
 * Even if they do, it's probably the same proxy so we should be fine! And those knobs
 * are deprecated anyway.
 */
function monkeyPatch(inVSCode) {
    if (shouldEnableProxy()) {
        var http_1 = require("http");
        var https = require("https");
        // If we do not pass in a proxy URL, proxy-agent will get the URL from the environment.
        // See https://www.npmjs.com/package/proxy-from-env.
        // Also see shouldEnableProxy.
        var pa = newProxyAgent(inVSCode);
        http_1.globalAgent = pa;
        https.globalAgent = pa;
    }
}
exports.monkeyPatch = monkeyPatch;
function newProxyAgent(inVSCode) {
    // The reasoning for this split is that VS Code's build process does not have
    // esModuleInterop enabled but the code-server one does. As a result depending on where
    // we execute, we either have a default attribute or we don't.
    //
    // I can't enable esModuleInterop in VS Code's build process as it breaks and spits out
    // a huge number of errors. And we can't use require as otherwise the modules won't be
    // included in the final product.
    if (inVSCode) {
        return new proxyAgent();
    }
    else {
        return new proxyAgent.default();
    }
}
// If they have $NO_PROXY set to example.com then this check won't work!
// But that's drastically unlikely.
function shouldEnableProxy() {
    var shouldEnable = false;
    var httpProxy = proxyFromEnv.getProxyForUrl("http://example.com");
    if (httpProxy) {
        shouldEnable = true;
        logger_1.logger.debug("using $HTTP_PROXY " + httpProxy);
    }
    var httpsProxy = proxyFromEnv.getProxyForUrl("https://example.com");
    if (httpsProxy) {
        shouldEnable = true;
        logger_1.logger.debug("using $HTTPS_PROXY " + httpsProxy);
    }
    return shouldEnable;
}
//# sourceMappingURL=proxy_agent.js.map