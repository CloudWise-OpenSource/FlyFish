parcelRequire = function(e, r, t, n) {
    var i, o = "function" == typeof parcelRequire && parcelRequire,
    u = "function" == typeof require && require;

    function geturl(name) {
        var reg = new RegExp("[^\?&]?" + encodeURI(name) + "=[^&]+");
        var paramsArr = window.location.search.match(reg) || [];
        const params = ((paramsArr[0] || '').split('&')) || [];
        const paramsSplit = ((params[0] || '').split('=')) || [];

        return paramsSplit[1] || '';
    }

    // save
    document.onkeydown = function (event = {}) {
        // Command + S
        if (event.keyCode == 83 && event.metaKey) {
            const host = 'http://127.0.0.1:8363';
            const target = host + '/visual/component/create';

            const component_id = geturl('component_id');
            if (component_id >= 0) {
                top.postMessage({method: "codeCompile", action: "prepare"}, target)
                const _top = top;

                (async () => {
                    const result = await fetch(host + '/web/visualComponents/devComponentIO/compileDevComponent', {
                        headers: { 
                            'Content-Type': 'application/json' 
                        },
                        method: 'PUT',
                        body: JSON.stringify({component_id})
                    });

                    if (result.ok) {
                        _top.postMessage({method: "codeCompile", action: "success"}, target)
                    } else {
                        _top.postMessage({method: "codeCompile", action: "fail"}, target)
                    }
                })();
            } else {
                top.postMessage({method: "codeCompile", action: "fail"}, target)
            }
        } 
    }
    function f(t, n) {
        if (!r[t]) {
            if (!e[t]) {
                var i = "function" == typeof parcelRequire && parcelRequire;
                if (!n && i) return i(t, !0);
                if (o) return o(t, !0);
                if (u && "string" == typeof t) return u(t);
                var c = new Error("Cannot find module '" + t + "'");
                throw c.code = "MODULE_NOT_FOUND",
                c
            }
            p.resolve = function(r) {
                return e[t][1][r] || r
            },
            p.cache = {};
            var l = r[t] = new f.Module(t);
            e[t][0].call(l.exports, p, l, l.exports, this)
        }
        return r[t].exports;
        function p(e) {
            return f(p.resolve(e))
        }
    }
    f.isParcelRequire = !0,
    f.Module = function(e) {
        this.id = e,
        this.bundle = f,
        this.exports = {}
    },
    f.modules = e,
    f.cache = r,
    f.parent = o,
    f.register = function(r, t) {
        e[r] = [function(e, r) {
            r.exports = t
        },
        {}]
    };
    for (var c = 0; c < t.length; c++) try {
        f(t[c])
    } catch(e) {
        i || (i = e)
    }
    if (t.length) {
        var l = f(t[t.length - 1]);
        "object" == typeof exports && "undefined" != typeof module ? module.exports = l: "function" == typeof define && define.amd ? define(function() {
            return l
        }) : n && (this[n] = l)
    }
    if (parcelRequire = f, i) throw i;
    return f
} ({
    "TCzD": [function(require, module, exports) {
        "use strict";
        var r = this && this.__assign ||
        function() {
            return (r = Object.assign ||
            function(r) {
                for (var t, e = 1,
                o = arguments.length; e < o; e++) for (var s in t = arguments[e]) Object.prototype.hasOwnProperty.call(t, s) && (r[s] = t[s]);
                return r
            }).apply(this, arguments)
        };
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }),
        exports.logError = exports.getFirstString = exports.arrayify = exports.getOptions = exports.resolveBase = exports.trimSlashes = exports.normalize = exports.generateUuid = exports.plural = exports.split = void 0;
        var t = function(r, t) {
            var e = r.indexOf(t);
            return - 1 !== e ? [r.substring(0, e).trim(), r.substring(e + 1)] : [r, ""]
        };
        exports.split = t;
        var e = function(r, t) {
            return 1 === r ? t: t + "s"
        };
        exports.plural = e;
        var o = function(r) {
            void 0 === r && (r = 24);
            var t = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            return Array(r).fill(1).map(function() {
                return t[Math.floor(Math.random() * t.length)]
            }).join("")
        };
        exports.generateUuid = o;
        var s = function(r, t) {
            return void 0 === t && (t = !1),
            r.replace(/\/\/+/g, "/").replace(/\/+$/, t ? "/": "")
        };
        exports.normalize = s;
        var a = function(r) {
            return r.replace(/^\/+|\/+$/g, "")
        };
        exports.trimSlashes = a;
        var n = function(r) {
            if (!r || r.startsWith("/")) return null != r ? r: "";
            var t = location.pathname.split("/");
            t[t.length - 1] = r;
            var e = new URL(location.origin + "/" + t.join("/"));
            return exports.normalize(e.pathname)
        };
        exports.resolveBase = n;
        var i = function() {
            var t;
            try {
                t = JSON.parse(document.getElementById("coder-options").getAttribute("data-settings"))
            } catch(o) {
                t = {}
            }
            var e = new URLSearchParams(location.search).get("options");
            return e && (t = r(r({},
            t), JSON.parse(e))),
            t.base = exports.resolveBase(t.base),
            t.csStaticBase = exports.resolveBase(t.csStaticBase),
            t
        };
        exports.getOptions = i;
        var p = function(r) {
            return Array.isArray(r) ? r: void 0 === r ? [] : [r]
        };
        exports.arrayify = p;
        var l = function(r) {
            return Array.isArray(r) ? r[0] : "string" == typeof r ? r: void 0
        };
        function u(r, t, e) {
            e instanceof Error ? r.error(t + ": " + e.message + " " + e.stack) : r.error(t + ": " + e)
        }
        exports.getFirstString = l,
        exports.logError = u;
    },
    {}],
    "SUDs": [function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var e, o = require("../../common/util"),
        t = o.getOptions();
        try {
            if ((e = JSON.parse(document.getElementById("vscode-remote-nls-configuration").getAttribute("data-settings")))._resolvedLanguagePackCoreLocation) {
                var d = Object.create(null);
                e.loadBundle = function(o, n, a) {
                    var r = d[o];
                    if (r) return a(void 0, r);
                    var s = e._resolvedLanguagePackCoreLocation + "/" + o.replace(/\//g, "!") + ".nls.json";
                    fetch(t.base + "/vscode/resource/?path=" + encodeURIComponent(s)).then(function(e) {
                        return e.json()
                    }).then(function(e) {
                        d[o] = e,
                        a(void 0, e)
                    }).
                    catch(a)
                }
            }
        } catch(n) {}
        self.require = {
            baseUrl: "" + window.location.origin + t.csStaticBase + "/lib/vscode/out",
            recordStats: !0,
            paths: {
                "vscode-textmate": "../node_modules/vscode-textmate/release/main",
                "vscode-oniguruma": "../node_modules/vscode-oniguruma/release/main",
                xterm: "../node_modules/xterm/lib/xterm.js",
                "xterm-addon-search": "../node_modules/xterm-addon-search/lib/xterm-addon-search.js",
                "xterm-addon-unicode11": "../node_modules/xterm-addon-unicode11/lib/xterm-addon-unicode11.js",
                "xterm-addon-webgl": "../node_modules/xterm-addon-webgl/lib/xterm-addon-webgl.js",
                "tas-client-umd": "../node_modules/tas-client-umd/lib/tas-client-umd.js",
                "iconv-lite-umd": "../node_modules/iconv-lite-umd/lib/iconv-lite-umd.js",
                jschardet: "../node_modules/jschardet/dist/jschardet.min.js"
            },
            "vs/nls": e
        };
        try {
            document.body.style.background = JSON.parse(localStorage.getItem("colorThemeData")).colorMap["editor.background"]
        } catch(n) {}
    },
    {
        "../../common/util": "TCzD"
    }]
},
{},
["SUDs"], null)