parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"i8TM":[function(require,module,exports) {

var t,e,n=module.exports={};function r(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function i(e){if(t===setTimeout)return setTimeout(e,0);if((t===r||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(n){try{return t.call(null,e,0)}catch(n){return t.call(this,e,0)}}}function u(t){if(e===clearTimeout)return clearTimeout(t);if((e===o||!e)&&clearTimeout)return e=clearTimeout,clearTimeout(t);try{return e(t)}catch(n){try{return e.call(null,t)}catch(n){return e.call(this,t)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:r}catch(n){t=r}try{e="function"==typeof clearTimeout?clearTimeout:o}catch(n){e=o}}();var c,s=[],l=!1,a=-1;function f(){l&&c&&(l=!1,c.length?s=c.concat(s):a=-1,s.length&&h())}function h(){if(!l){var t=i(f);l=!0;for(var e=s.length;e;){for(c=s,s=[];++a<e;)c&&c[a].run();a=-1,e=s.length}c=null,l=!1,u(t)}}function m(t,e){this.fun=t,this.array=e}function p(){}n.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];s.push(new m(t,e)),1!==s.length||l||i(h)},m.prototype.run=function(){this.fun.apply(null,this.array)},n.title="browser",n.env={},n.argv=[],n.version="",n.versions={},n.on=p,n.addListener=p,n.once=p,n.off=p,n.removeListener=p,n.removeAllListeners=p,n.emit=p,n.prependListener=p,n.prependOnceListener=p,n.listeners=function(t){return[]},n.binding=function(t){throw new Error("process.binding is not supported")},n.cwd=function(){return"/"},n.chdir=function(t){throw new Error("process.chdir is not supported")},n.umask=function(){return 0};
},{}],"BGHZ":[function(require,module,exports) {
var process = require("process");
var e,t=require("process");Object.defineProperty(exports,"__esModule",{value:!0}),function(e){e[e.Trace=0]="Trace",e[e.Debug=1]="Debug",e[e.Info=2]="Info",e[e.Warning=3]="Warning",e[e.Error=4]="Error"}(e=exports.Level||(exports.Level={}));class s{constructor(e,t){this.identifier=e,this.value=t}toJSON(){return{identifier:this.identifier,value:this.value}}}exports.Field=s;class r{constructor(e,t){this.expected=e,this.ms=t}}exports.Time=r,exports.time=(e=>new r(e,Date.now())),exports.field=((e,t)=>new s(e,t));class o{constructor(e="%s",t=!0){this.formatType=e,this.colors=t,this.format="",this.args=[],this.fields=[],this.minimumTagWidth=5}tag(e,t){for(let s=e.length;s<this.minimumTagWidth;++s)e+=" ";this.push(e+" ",t)}push(e,t,r){Array.isArray(e)&&e.every(e=>e instanceof s)?this.fields.push(...e):this.colors?(this.format+=`${this.formatType}${this.getType(e)}${this.formatType}`,this.args.push(this.style(t,r),e,this.reset())):(this.format+=`${this.getType(e)}`,this.args.push(e))}write(){this.doWrite(...this.flush())}flush(){const e=[this.format,this.args,this.fields];return this.format="",this.args=[],this.fields=[],e}getType(e){switch(typeof e){case"object":return"%o";case"number":return"%d";default:return"%s"}}}exports.Formatter=o;class i extends o{constructor(){super("%c")}style(e,t){return(e?`color: ${e};`:"")+(t?`font-weight: ${t};`:"")}reset(){return this.style("inherit","normal")}doWrite(e,t,s){console.groupCollapsed(e,...t),s.forEach(e=>{this.push(e.identifier,"#3794ff","bold"),void 0!==e.value&&e.value.constructor&&e.value.constructor.name&&this.push(` (${e.value.constructor.name})`),this.push(": "),this.push(e.value);const t=this.flush();console.log(t[0],...t[1])}),console.groupEnd()}}exports.BrowserFormatter=i;class h extends o{constructor(){super("%s",!!t.stdout.isTTY)}style(e,t){return("bold"===t?"[1m":"")+(e?this.hex(e):"")}reset(){return"[0m"}hex(e){const[t,s,r]=this.hexToRgb(e);return`[38;2;${t};${s};${r}m`}hexToRgb(e){const t=parseInt(e.substr(1),16);return[t>>16&255,t>>8&255,255&t]}doWrite(e,t,s){if(0===s.length)return console.log("[%s] "+e,(new Date).toISOString(),...t);const r={};s.forEach(e=>r[e.identifier]=e.value),console.log("[%s] "+e+" %s%s%s",(new Date).toISOString(),...t,this.style("#8c8c8c"),JSON.stringify(r),this.reset())}}exports.ServerFormatter=h;class n{constructor(s,r,o,i=[]){this._formatter=s,this.name=r,this.defaultFields=o,this.extenders=i,this.level=e.Info,this.muted=!1,r&&(this.nameColor=this.hashStringToColor(r)),void 0!==t&&t.env}set formatter(e){this._formatter=e}mute(){this.muted=!0}extend(e){this.extenders.push(e)}info(t,...s){this.handle({type:"info",message:t,fields:s,tagColor:"#008FBF",level:e.Info})}warn(t,...s){this.handle({type:"warn",message:t,fields:s,tagColor:"#FF9D00",level:e.Warning})}trace(t,...s){this.handle({type:"trace",message:t,fields:s,tagColor:"#888888",level:e.Trace})}debug(t,...s){this.handle({type:"debug",message:t,fields:s,tagColor:"#84009E",level:e.Debug})}error(t,...s){this.handle({type:"error",message:t,fields:s,tagColor:"#B00000",level:e.Error})}named(e,...t){const s=new n(this._formatter,e,t,this.extenders);return this.muted&&s.mute(),s}handle(e){if(this.level>e.level||this.muted)return;let t=e.fields||[];if("function"==typeof e.message){const s=e.message();e.message=s.shift(),t=s}const s=this.defaultFields?t.filter(e=>!!e).concat(this.defaultFields):t.filter(e=>!!e),o=Date.now();let i=[];s&&s.length>0&&(i=s.filter(e=>e.value instanceof r),this._formatter.push(s)),this._formatter.tag(e.type,e.tagColor),this.name&&this.nameColor&&this._formatter.tag(this.name,this.nameColor),this._formatter.push(e.message),i.length>0&&i.forEach(e=>{const t=o-e.value.ms,s=t/e.value.expected,r=125*(1-s),i=125+r,h=s<1?i:r,n=s>=1?i:r;this._formatter.push(` ${e.identifier}=`,"#3794ff"),this._formatter.push(`${t}ms`,this.rgbToHex(n>0?n:0,h>0?h:0,0))}),this._formatter.write(),this.extenders.forEach(t=>{t({section:this.name,fields:e.fields,level:e.level,message:e.message,type:e.type})})}djb2(e){let t=5381;for(let s=0;s<e.length;s++)t=(t<<5)+t+e.charCodeAt(s);return t}rgbToHex(e,t,s){const r=(((255&Math.round(e))<<16)+((255&Math.round(t))<<8)+(255&Math.round(s))).toString(16);return"#"+"000000".substring(r.length)+r}hashStringToColor(e){const t=this.djb2(e);return this.rgbToHex((16711680&t)>>16,(65280&t)>>8,255&t)}}exports.Logger=n,exports.logger=new n(void 0===t||void 0===t.stdout?new i:new h);
},{"process":"i8TM"}],"PYIK":[function(require,module,exports) {
"use strict";function e(e){for(var r in e)exports.hasOwnProperty(r)||(exports[r]=e[r])}Object.defineProperty(exports,"__esModule",{value:!0}),e(require("./logger"));
},{"./logger":"BGHZ"}],"TCzD":[function(require,module,exports) {
"use strict";var r=this&&this.__assign||function(){return(r=Object.assign||function(r){for(var t,e=1,o=arguments.length;e<o;e++)for(var s in t=arguments[e])Object.prototype.hasOwnProperty.call(t,s)&&(r[s]=t[s]);return r}).apply(this,arguments)};Object.defineProperty(exports,"__esModule",{value:!0}),exports.logError=exports.getFirstString=exports.arrayify=exports.getOptions=exports.resolveBase=exports.trimSlashes=exports.normalize=exports.generateUuid=exports.plural=exports.split=void 0;var t=function(r,t){var e=r.indexOf(t);return-1!==e?[r.substring(0,e).trim(),r.substring(e+1)]:[r,""]};exports.split=t;var e=function(r,t){return 1===r?t:t+"s"};exports.plural=e;var o=function(r){void 0===r&&(r=24);var t="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";return Array(r).fill(1).map(function(){return t[Math.floor(Math.random()*t.length)]}).join("")};exports.generateUuid=o;var s=function(r,t){return void 0===t&&(t=!1),r.replace(/\/\/+/g,"/").replace(/\/+$/,t?"/":"")};exports.normalize=s;var a=function(r){return r.replace(/^\/+|\/+$/g,"")};exports.trimSlashes=a;var n=function(r){if(!r||r.startsWith("/"))return null!=r?r:"";var t=location.pathname.split("/");t[t.length-1]=r;var e=new URL(location.origin+"/"+t.join("/"));return exports.normalize(e.pathname)};exports.resolveBase=n;var i=function(){var t;try{t=JSON.parse(document.getElementById("coder-options").getAttribute("data-settings"))}catch(o){t={}}var e=new URLSearchParams(location.search).get("options");return e&&(t=r(r({},t),JSON.parse(e))),t.base=exports.resolveBase(t.base),t.csStaticBase=exports.resolveBase(t.csStaticBase),t};exports.getOptions=i;var p=function(r){return Array.isArray(r)?r:void 0===r?[]:[r]};exports.arrayify=p;var l=function(r){return Array.isArray(r)?r[0]:"string"==typeof r?r:void 0};function u(r,t,e){e instanceof Error?r.error(t+": "+e.message+" "+e.stack):r.error(t+": "+e)}exports.getFirstString=l,exports.logError=u;
},{}],"YqCm":[function(require,module,exports) {

},{}],"O6cr":[function(require,module,exports) {
"use strict";var e=this&&this.__awaiter||function(e,r,t,n){return new(t||(t=Promise))(function(o,i){function a(e){try{c(n.next(e))}catch(r){i(r)}}function s(e){try{c(n.throw(e))}catch(r){i(r)}}function c(e){var r;e.done?o(e.value):(r=e.value,r instanceof t?r:new t(function(e){e(r)})).then(a,s)}c((n=n.apply(e,r||[])).next())})},r=this&&this.__generator||function(e,r){var t,n,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(t)throw new TypeError("Generator is already executing.");for(;a;)try{if(t=1,n&&(o=2&i[0]?n.return:i[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,i[1])).done)return o;switch(n=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,n=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!(o=(o=a.trys).length>0&&o[o.length-1])&&(6===i[0]||2===i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=r.call(e,a)}catch(s){i=[6,s],n=0}finally{t=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.registerServiceWorker=void 0;var t=require("@coder/logger"),n=require("../common/util");function o(){return e(this,void 0,Promise,function(){var e,o,i;return r(this,function(r){switch(r.label){case 0:e=n.getOptions(),t.logger.level=e.logLevel,o=n.normalize(e.csStaticBase+"/dist/serviceWorker.js"),r.label=1;case 1:return r.trys.push([1,3,,4]),[4,navigator.serviceWorker.register(o,{scope:e.base+"/"})];case 2:return r.sent(),t.logger.info("[Service Worker] registered"),[3,4];case 3:return i=r.sent(),n.logError(t.logger,"[Service Worker] registration",i),[3,4];case 4:return[2]}})})}require("./pages/error.css"),require("./pages/global.css"),require("./pages/login.css"),exports.registerServiceWorker=o,"undefined"!=typeof navigator&&"serviceWorker"in navigator?o():t.logger.error("[Service Worker] navigator is undefined");
},{"@coder/logger":"PYIK","../common/util":"TCzD","./pages/error.css":"YqCm","./pages/global.css":"YqCm","./pages/login.css":"YqCm"}]},{},["O6cr"], null)
//# sourceMappingURL=register.js.map