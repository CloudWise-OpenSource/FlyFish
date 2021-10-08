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
export declare function monkeyPatch(inVSCode: boolean): void;
