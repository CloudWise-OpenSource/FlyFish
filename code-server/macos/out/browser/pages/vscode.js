"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../common/util");
var options = util_1.getOptions();
// TODO: Add proper types.
/* eslint-disable @typescript-eslint/no-explicit-any */
var nlsConfig;
try {
    nlsConfig = JSON.parse(document.getElementById("vscode-remote-nls-configuration").getAttribute("data-settings"));
    if (nlsConfig._resolvedLanguagePackCoreLocation) {
        var bundles_1 = Object.create(null);
        nlsConfig.loadBundle = function (bundle, _language, cb) {
            var result = bundles_1[bundle];
            if (result) {
                return cb(undefined, result);
            }
            // FIXME: Only works if path separators are /.
            var path = nlsConfig._resolvedLanguagePackCoreLocation + "/" + bundle.replace(/\//g, "!") + ".nls.json";
            fetch(options.base + "/vscode/resource/?path=" + encodeURIComponent(path))
                .then(function (response) { return response.json(); })
                .then(function (json) {
                bundles_1[bundle] = json;
                cb(undefined, json);
            })
                .catch(cb);
        };
    }
}
catch (error) {
    /* Probably fine. */
}
;
self.require = {
    // Without the full URL VS Code will try to load file://.
    baseUrl: "" + window.location.origin + options.csStaticBase + "/lib/vscode/out",
    recordStats: true,
    paths: {
        "vscode-textmate": "../node_modules/vscode-textmate/release/main",
        "vscode-oniguruma": "../node_modules/vscode-oniguruma/release/main",
        xterm: "../node_modules/xterm/lib/xterm.js",
        "xterm-addon-search": "../node_modules/xterm-addon-search/lib/xterm-addon-search.js",
        "xterm-addon-unicode11": "../node_modules/xterm-addon-unicode11/lib/xterm-addon-unicode11.js",
        "xterm-addon-webgl": "../node_modules/xterm-addon-webgl/lib/xterm-addon-webgl.js",
        "tas-client-umd": "../node_modules/tas-client-umd/lib/tas-client-umd.js",
        "iconv-lite-umd": "../node_modules/iconv-lite-umd/lib/iconv-lite-umd.js",
        jschardet: "../node_modules/jschardet/dist/jschardet.min.js",
    },
    "vs/nls": nlsConfig,
};
try {
    document.body.style.background = JSON.parse(localStorage.getItem("colorThemeData")).colorMap["editor.background"];
}
catch (error) {
    // Oh well.
}
//# sourceMappingURL=vscode.js.map