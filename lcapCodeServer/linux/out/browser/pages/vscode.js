"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.setBodyBackgroundToThemeBackgroundColor = exports.getConfigurationForLoader = exports._createScriptURL = exports.getNlsConfiguration = exports.createBundlePath = exports.nlsConfigElementId = void 0;
const util_1 = require("../../common/util");
require("../register");
// NOTE@jsjoeio
// This lives here ../../../lib/vscode/src/vs/base/common/platform.ts#L106
exports.nlsConfigElementId = "vscode-remote-nls-configuration";
/**
 * Helper function to create the path to the bundle
 * for getNlsConfiguration.
 */
function createBundlePath(_resolvedLanguagePackCoreLocation, bundle) {
    // NOTE@jsjoeio - this comment was here before me
    // Refers to operating systems that use a different path separator.
    // Probably just Windows but we're not sure if "/" breaks on Windows
    // so we'll leave it alone for now.
    // FIXME: Only works if path separators are /.
    return _resolvedLanguagePackCoreLocation + "/" + bundle.replace(/\//g, "!") + ".nls.json";
}
exports.createBundlePath = createBundlePath;
/**
 * A helper function to get the NLS Configuration settings.
 *
 * This is used by VSCode for localizations (i.e. changing
 * the display language).
 *
 * Make sure to wrap this in a try/catch block when you call it.
 **/
function getNlsConfiguration(_document, base) {
    const errorMsgPrefix = "[vscode]";
    const nlsConfigElement = _document?.getElementById(exports.nlsConfigElementId);
    const dataSettings = nlsConfigElement?.getAttribute("data-settings");
    if (!nlsConfigElement) {
        throw new Error(`${errorMsgPrefix} Could not parse NLS configuration. Could not find nlsConfigElement with id: ${exports.nlsConfigElementId}`);
    }
    if (!dataSettings) {
        throw new Error(`${errorMsgPrefix} Could not parse NLS configuration. Found nlsConfigElement but missing data-settings attribute.`);
    }
    const nlsConfig = JSON.parse(dataSettings);
    if (nlsConfig._resolvedLanguagePackCoreLocation) {
        // NOTE@jsjoeio
        // Not sure why we use Object.create(null) instead of {}
        // They are not the same
        // See: https://stackoverflow.com/a/15518712/3015595
        // We copied this from ../../../lib/vscode/src/bootstrap.js#L143
        const bundles = Object.create(null);
        nlsConfig.loadBundle = (bundle, _language, cb) => {
            const result = bundles[bundle];
            if (result) {
                return cb(undefined, result);
            }
            // FIXME: Only works if path separators are /.
            const path = createBundlePath(nlsConfig._resolvedLanguagePackCoreLocation || "", bundle);
            fetch(`${base}/vscode/resource/?path=${encodeURIComponent(path)}`)
                .then((response) => response.json())
                .then((json) => {
                bundles[bundle] = json;
                cb(undefined, json);
            })
                .catch(cb);
        };
    }
    return nlsConfig;
}
exports.getNlsConfiguration = getNlsConfiguration;
/**
 * A helper function which creates a script url if the value
 * is valid.
 *
 * Extracted into a function to make it easier to test
 */
function _createScriptURL(value, origin) {
    if (value.startsWith(origin)) {
        return value;
    }
    throw new Error(`Invalid script url: ${value}`);
}
exports._createScriptURL = _createScriptURL;
/**
 * A helper function to get the require loader
 *
 * This used by VSCode/code-server
 * to load files.
 *
 * We extracted the logic into a function so that
 * it's easier to test.
 **/
function getConfigurationForLoader({ nlsConfig, options, _window }) {
    const loader = {
        // Without the full URL VS Code will try to load file://.
        baseUrl: `${window.location.origin}${options.csStaticBase}/lib/vscode/out`,
        recordStats: true,
        trustedTypesPolicy: _window.trustedTypes?.createPolicy("amdLoader", {
            createScriptURL(value) {
                return _createScriptURL(value, window.location.origin);
            },
        }),
        paths: {
            "vscode-textmate": `../node_modules/vscode-textmate/release/main`,
            "vscode-oniguruma": `../node_modules/vscode-oniguruma/release/main`,
            xterm: `../node_modules/xterm/lib/xterm.js`,
            "xterm-addon-search": `../node_modules/xterm-addon-search/lib/xterm-addon-search.js`,
            "xterm-addon-unicode11": `../node_modules/xterm-addon-unicode11/lib/xterm-addon-unicode11.js`,
            "xterm-addon-webgl": `../node_modules/xterm-addon-webgl/lib/xterm-addon-webgl.js`,
            "tas-client-umd": `../node_modules/tas-client-umd/lib/tas-client-umd.js`,
            "iconv-lite-umd": `../node_modules/iconv-lite-umd/lib/iconv-lite-umd.js`,
            jschardet: `../node_modules/jschardet/dist/jschardet.min.js`,
        },
        "vs/nls": nlsConfig,
    };
    return loader;
}
exports.getConfigurationForLoader = getConfigurationForLoader;
/**
 * Sets the body background color to match the theme.
 */
function setBodyBackgroundToThemeBackgroundColor(_document, _localStorage) {
    const errorMsgPrefix = "[vscode]";
    const colorThemeData = _localStorage.getItem("colorThemeData");
    if (!colorThemeData) {
        throw new Error(`${errorMsgPrefix} Could not set body background to theme background color. Could not find colorThemeData in localStorage.`);
    }
    let _colorThemeData;
    try {
        // We wrap this JSON.parse logic in a try/catch
        // because it can throw if the JSON is invalid.
        // and instead of throwing a random error
        // we can throw our own error, which will be more helpful
        // to the end user.
        _colorThemeData = JSON.parse(colorThemeData);
    }
    catch {
        throw new Error(`${errorMsgPrefix} Could not set body background to theme background color. Could not parse colorThemeData from localStorage.`);
    }
    const hasColorMapProperty = Object.prototype.hasOwnProperty.call(_colorThemeData, "colorMap");
    if (!hasColorMapProperty) {
        throw new Error(`${errorMsgPrefix} Could not set body background to theme background color. colorThemeData is missing colorMap.`);
    }
    const editorBgColor = _colorThemeData.colorMap["editor.background"];
    if (!editorBgColor) {
        throw new Error(`${errorMsgPrefix} Could not set body background to theme background color. colorThemeData.colorMap["editor.background"] is undefined.`);
    }
    _document.body.style.background = editorBgColor;
    return null;
}
exports.setBodyBackgroundToThemeBackgroundColor = setBodyBackgroundToThemeBackgroundColor;
/**
 * A helper function to encapsulate all the
 * logic used in this file.
 *
 * We purposely include all of this in a single function
 * so that it's easier to test.
 */
function main(_document, _window, _localStorage) {
    if (!_document) {
        throw new Error(`document is undefined.`);
    }
    if (!_window) {
        throw new Error(`window is undefined.`);
    }
    if (!_localStorage) {
        throw new Error(`localStorage is undefined.`);
    }
    const options = util_1.getOptions();
    const nlsConfig = getNlsConfiguration(_document, options.base);
    const loader = getConfigurationForLoader({
        nlsConfig,
        options,
        _window,
    });
    self.require = loader;
    setBodyBackgroundToThemeBackgroundColor(_document, _localStorage);
    function geturl(name) {
        var reg = new RegExp("[^\?&]?" + encodeURI(name) + "=[^&]+");
        var paramsArr = window.location.search.match(reg) || [];
        const params = ((paramsArr[0] || '').split('&')) || [];
        const paramsSplit = ((params[0] || '').split('=')) || [];
        return paramsSplit[1] || -1;
    }
    // save
    _document.onkeydown = function (event) {
        // Command + S
        if (event.keyCode == 83 && (event.metaKey || event.ctrlKey)) {
          console.log('linux-vscode.js触发');
          top.postMessage({ event:'vscode_compile' }, '*');
            // const host = 'http://127.0.0.1:8363';
            // const target = host + '/visual/component/create';
            // const component_id = geturl('component_id');
            // if (component_id >= 0) {
            //     top.postMessage({ method: "codeCompile", action: "prepare" }, target);
            //     const _top = top;
            //     (async () => {
            //         const result = await fetch(host + '/web/visualComponents/devComponentIO/compileDevComponent', {
            //             headers: {
            //                 'Content-Type': 'application/json'
            //             },
            //             method: 'PUT',
            //             body: JSON.stringify({ component_id })
            //         });
            //         if (result.ok) {
            //             _top.postMessage({ method: "codeCompile", action: "success" }, target);
            //         }
            //         else {
            //             _top.postMessage({ method: "codeCompile", action: "fail" }, target);
            //         }
            //     })();
            // }
        }
    };
}
exports.main = main;
try {
    main(document, window, localStorage);
}
catch (error) {
    console.error("[vscode] failed to initialize VS Code");
    console.error(error);
}
//# sourceMappingURL=vscode.js.map