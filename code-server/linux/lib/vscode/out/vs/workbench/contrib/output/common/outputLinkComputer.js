/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/(function(){var T=["require","exports","vs/base/common/platform","vs/base/common/extpath","vs/base/common/strings","vs/base/common/network","vs/base/common/uri","vs/base/common/path","vs/base/common/resources","vs/base/common/types","vs/workbench/contrib/output/common/outputLinkComputer","vs/editor/common/core/range"],S=function(O){for(var e=[],g=0,f=O.length;g<f;g++)e[g]=T[O[g]];return e};define(T[3],S([0,1,2,4,7,9]),function(O,e,g,f,h,w){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.parseLineAndColumnAware=e.indexOfPath=e.getDriveLetter=e.hasDriveLetter=e.isRootOrDriveLetter=e.sanitizeFilePath=e.isWindowsDriveLetter=e.isEqualOrParent=e.isEqual=e.isValidBasename=e.isUNC=e.getRoot=e.toPosixPath=e.toSlashes=e.isPathSeparator=void 0;function v(i){return i===47||i===92}e.isPathSeparator=v;function s(i){return i.replace(/[\\/]/g,h.posix.sep)}e.toSlashes=s;function l(i){return i.indexOf("/")===-1&&(i=s(i)),/^[a-zA-Z]:(\/|$)/.test(i)&&(i="/"+i),i}e.toPosixPath=l;function m(i,o=h.posix.sep){if(!i)return"";const d=i.length,C=i.charCodeAt(0);if(v(C)){if(v(i.charCodeAt(1))&&!v(i.charCodeAt(2))){let U=3;const k=U;for(;U<d&&!v(i.charCodeAt(U));U++);if(k!==U&&!v(i.charCodeAt(U+1))){for(U+=1;U<d;U++)if(v(i.charCodeAt(U)))return i.slice(0,U+1).replace(/[\\/]/g,o)}}return o}else if(u(C)&&i.charCodeAt(1)===58)return v(i.charCodeAt(2))?i.slice(0,2)+o:i.slice(0,2);let y=i.indexOf("://");if(y!==-1){for(y+=3;y<d;y++)if(v(i.charCodeAt(y)))return i.slice(0,y+1)}return""}e.getRoot=m;function b(i){if(!g.isWindows||!i||i.length<5)return!1;let o=i.charCodeAt(0);if(o!==92||(o=i.charCodeAt(1),o!==92))return!1;let d=2;const C=d;for(;d<i.length&&(o=i.charCodeAt(d),o!==92);d++);return!(C===d||(o=i.charCodeAt(d+1),isNaN(o)||o===92))}e.isUNC=b;const E=/[\\/:\*\?"<>\|]/g,P=/[\\/]/g,a=/^(con|prn|aux|clock\$|nul|lpt[0-9]|com[0-9])(\.(.*?))?$/i;function t(i,o=g.isWindows){const d=o?E:P;return!(!i||i.length===0||/^\s+$/.test(i)||(d.lastIndex=0,d.test(i))||o&&a.test(i)||i==="."||i===".."||o&&i[i.length-1]==="."||o&&i.length!==i.trim().length||i.length>255)}e.isValidBasename=t;function n(i,o,d){const C=i===o;return!d||C?C:!i||!o?!1:f.equalsIgnoreCase(i,o)}e.isEqual=n;function r(i,o,d,C=h.sep){if(i===o)return!0;if(!i||!o||o.length>i.length)return!1;if(d){if(!f.startsWithIgnoreCase(i,o))return!1;if(o.length===i.length)return!0;let U=o.length;return o.charAt(o.length-1)===C&&U--,i.charAt(U)===C}return o.charAt(o.length-1)!==C&&(o+=C),i.indexOf(o)===0}e.isEqualOrParent=r;function u(i){return i>=65&&i<=90||i>=97&&i<=122}e.isWindowsDriveLetter=u;function c(i,o){return g.isWindows&&i.endsWith(":")&&(i+=h.sep),h.isAbsolute(i)||(i=h.join(o,i)),i=h.normalize(i),g.isWindows?(i=f.rtrim(i,h.sep),i.endsWith(":")&&(i+=h.sep)):(i=f.rtrim(i,h.sep),i||(i=h.sep)),i}e.sanitizeFilePath=c;function A(i){const o=h.normalize(i);return g.isWindows?i.length>3?!1:R(o)&&(i.length===2||o.charCodeAt(2)===92):o===h.posix.sep}e.isRootOrDriveLetter=A;function R(i){return g.isWindows?u(i.charCodeAt(0))&&i.charCodeAt(1)===58:!1}e.hasDriveLetter=R;function L(i){return R(i)?i[0]:void 0}e.getDriveLetter=L;function I(i,o,d){return o.length>i.length?-1:i===o?0:(d&&(i=i.toLowerCase(),o=o.toLowerCase()),i.indexOf(o))}e.indexOfPath=I;function q(i){const o=i.split(":");let d,C,y;if(o.forEach(U=>{const k=Number(U);w.isNumber(k)?C===void 0?C=k:y===void 0&&(y=k):d=d?[d,U].join(":"):U}),!d)throw new Error("Format for `--goto` should be: `FILE:LINE(:COLUMN)`");return{path:d,line:C!==void 0?C:void 0,column:y!==void 0?y:C!==void 0?1:void 0}}e.parseLineAndColumnAware=q}),define(T[5],S([0,1,6,2]),function(O,e,g,f){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.FileAccess=e.RemoteAuthorities=e.Schemas=void 0;var h;(function(s){s.inMemory="inmemory",s.vscode="vscode",s.internal="private",s.walkThrough="walkThrough",s.walkThroughSnippet="walkThroughSnippet",s.http="http",s.https="https",s.file="file",s.mailto="mailto",s.untitled="untitled",s.data="data",s.command="command",s.vscodeRemote="vscode-remote",s.vscodeRemoteResource="vscode-remote-resource",s.userData="vscode-userdata",s.vscodeCustomEditor="vscode-custom-editor",s.vscodeNotebook="vscode-notebook",s.vscodeNotebookCell="vscode-notebook-cell",s.vscodeNotebookCellMetadata="vscode-notebook-cell-metadata",s.vscodeNotebookCellOutput="vscode-notebook-cell-output",s.vscodeSettings="vscode-settings",s.vscodeWorkspaceTrust="vscode-workspace-trust",s.vscodeTerminal="vscode-terminal",s.webviewPanel="webview-panel",s.vscodeWebview="vscode-webview",s.extension="extension",s.vscodeFileResource="vscode-file",s.tmp="tmp"})(h=e.Schemas||(e.Schemas={}));class w{constructor(){this._hosts=Object.create(null),this._ports=Object.create(null),this._connectionTokens=Object.create(null),this._preferredWebSchema="http",this._delegate=null}setPreferredWebSchema(l){this._preferredWebSchema=l}setDelegate(l){this._delegate=l}set(l,m,b){this._hosts[l]=m,this._ports[l]=b}setConnectionToken(l,m){this._connectionTokens[l]=m}rewrite(l){if(this._delegate)return this._delegate(l);const m=l.authority;let b=this._hosts[m];b&&b.indexOf(":")!==-1&&(b=`[${b}]`);const E=this._connectionTokens[m];let P=`path=${encodeURIComponent(l.path)}`;return typeof E=="string"&&(P+=`&tkn=${encodeURIComponent(E)}`),g.URI.from({scheme:f.isWeb?this._preferredWebSchema:h.vscodeRemoteResource,authority:window.location.host,path:`${window.location.pathname.replace(/\/+$/,"")}/vscode-remote-resource`,query:P})}}e.RemoteAuthorities=new w;class v{constructor(){this.FALLBACK_AUTHORITY="vscode-app"}asBrowserUri(l,m,b){const E=this.toUri(l,m);return E.scheme===h.vscodeRemote?e.RemoteAuthorities.rewrite(E):f.isNative&&(b||f.isPreferringBrowserCodeLoad)&&E.scheme===h.file?E.with({scheme:h.vscodeFileResource,authority:E.authority||this.FALLBACK_AUTHORITY,query:null,fragment:null}):E}asFileUri(l,m){const b=this.toUri(l,m);return b.scheme===h.vscodeFileResource?b.with({scheme:h.file,authority:b.authority!==this.FALLBACK_AUTHORITY?b.authority:null,query:null,fragment:null}):b}toUri(l,m){return g.URI.isUri(l)?l:g.URI.parse(m.toUrl(l))}}e.FileAccess=new v}),define(T[8],S([0,1,3,7,6,4,5,2]),function(O,e,g,f,h,w,v,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.toLocalResource=e.DataUri=e.distinctParents=e.addTrailingPathSeparator=e.removeTrailingPathSeparator=e.hasTrailingPathSeparator=e.isEqualAuthority=e.isAbsolutePath=e.resolvePath=e.relativePath=e.normalizePath=e.joinPath=e.dirname=e.extname=e.basename=e.basenameOrAuthority=e.getComparisonKey=e.isEqualOrParent=e.isEqual=e.extUriIgnorePathCase=e.extUriBiasedIgnorePathCase=e.extUri=e.ExtUri=e.originalFSPath=void 0;function l(a){return h.uriToFsPath(a,!0)}e.originalFSPath=l;class m{constructor(t){this._ignorePathCasing=t}compare(t,n,r=!1){return t===n?0:w.compare(this.getComparisonKey(t,r),this.getComparisonKey(n,r))}isEqual(t,n,r=!1){return t===n?!0:!t||!n?!1:this.getComparisonKey(t,r)===this.getComparisonKey(n,r)}getComparisonKey(t,n=!1){return t.with({path:this._ignorePathCasing(t)?t.path.toLowerCase():void 0,fragment:n?null:void 0}).toString()}ignorePathCasing(t){return this._ignorePathCasing(t)}isEqualOrParent(t,n,r=!1){if(t.scheme===n.scheme){if(t.scheme===v.Schemas.file)return g.isEqualOrParent(l(t),l(n),this._ignorePathCasing(t))&&t.query===n.query&&(r||t.fragment===n.fragment);if(e.isEqualAuthority(t.authority,n.authority))return g.isEqualOrParent(t.path,n.path,this._ignorePathCasing(t),"/")&&t.query===n.query&&(r||t.fragment===n.fragment)}return!1}joinPath(t,...n){return h.URI.joinPath(t,...n)}basenameOrAuthority(t){return e.basename(t)||t.authority}basename(t){return f.posix.basename(t.path)}extname(t){return f.posix.extname(t.path)}dirname(t){if(t.path.length===0)return t;let n;return t.scheme===v.Schemas.file?n=h.URI.file(f.dirname(l(t))).path:(n=f.posix.dirname(t.path),t.authority&&n.length&&n.charCodeAt(0)!==47&&(console.error(`dirname("${t.toString})) resulted in a relative path`),n="/")),t.with({path:n})}normalizePath(t){if(!t.path.length)return t;let n;return t.scheme===v.Schemas.file?n=h.URI.file(f.normalize(l(t))).path:n=f.posix.normalize(t.path),t.with({path:n})}relativePath(t,n){if(t.scheme!==n.scheme||!e.isEqualAuthority(t.authority,n.authority))return;if(t.scheme===v.Schemas.file){const c=f.relative(l(t),l(n));return s.isWindows?g.toSlashes(c):c}let r=t.path||"/",u=n.path||"/";if(this._ignorePathCasing(t)){let c=0;for(const A=Math.min(r.length,u.length);c<A&&!(r.charCodeAt(c)!==u.charCodeAt(c)&&r.charAt(c).toLowerCase()!==u.charAt(c).toLowerCase());c++);r=u.substr(0,c)+r.substr(c)}return f.posix.relative(r,u)}resolvePath(t,n){if(t.scheme===v.Schemas.file){const r=h.URI.file(f.resolve(l(t),n));return t.with({authority:r.authority,path:r.path})}return n=g.toPosixPath(n),t.with({path:f.posix.resolve(t.path,n)})}isAbsolutePath(t){return!!t.path&&t.path[0]==="/"}isEqualAuthority(t,n){return t===n||w.equalsIgnoreCase(t,n)}hasTrailingPathSeparator(t,n=f.sep){if(t.scheme===v.Schemas.file){const r=l(t);return r.length>g.getRoot(r).length&&r[r.length-1]===n}else{const r=t.path;return r.length>1&&r.charCodeAt(r.length-1)===47&&!/^[a-zA-Z]:(\/$|\\$)/.test(t.fsPath)}}removeTrailingPathSeparator(t,n=f.sep){return e.hasTrailingPathSeparator(t,n)?t.with({path:t.path.substr(0,t.path.length-1)}):t}addTrailingPathSeparator(t,n=f.sep){let r=!1;if(t.scheme===v.Schemas.file){const u=l(t);r=u!==void 0&&u.length===g.getRoot(u).length&&u[u.length-1]===n}else{n="/";const u=t.path;r=u.length===1&&u.charCodeAt(u.length-1)===47}return!r&&!e.hasTrailingPathSeparator(t,n)?t.with({path:t.path+"/"}):t}}e.ExtUri=m,e.extUri=new m(()=>!1),e.extUriBiasedIgnorePathCase=new m(a=>a.scheme===v.Schemas.file?!s.isLinux:!0),e.extUriIgnorePathCase=new m(a=>!0),e.isEqual=e.extUri.isEqual.bind(e.extUri),e.isEqualOrParent=e.extUri.isEqualOrParent.bind(e.extUri),e.getComparisonKey=e.extUri.getComparisonKey.bind(e.extUri),e.basenameOrAuthority=e.extUri.basenameOrAuthority.bind(e.extUri),e.basename=e.extUri.basename.bind(e.extUri),e.extname=e.extUri.extname.bind(e.extUri),e.dirname=e.extUri.dirname.bind(e.extUri),e.joinPath=e.extUri.joinPath.bind(e.extUri),e.normalizePath=e.extUri.normalizePath.bind(e.extUri),e.relativePath=e.extUri.relativePath.bind(e.extUri),e.resolvePath=e.extUri.resolvePath.bind(e.extUri),e.isAbsolutePath=e.extUri.isAbsolutePath.bind(e.extUri),e.isEqualAuthority=e.extUri.isEqualAuthority.bind(e.extUri),e.hasTrailingPathSeparator=e.extUri.hasTrailingPathSeparator.bind(e.extUri),e.removeTrailingPathSeparator=e.extUri.removeTrailingPathSeparator.bind(e.extUri),e.addTrailingPathSeparator=e.extUri.addTrailingPathSeparator.bind(e.extUri);function b(a,t){const n=[];for(let r=0;r<a.length;r++){const u=t(a[r]);a.some((c,A)=>A===r?!1:e.isEqualOrParent(u,t(c)))||n.push(a[r])}return n}e.distinctParents=b;var E;(function(a){a.META_DATA_LABEL="label",a.META_DATA_DESCRIPTION="description",a.META_DATA_SIZE="size",a.META_DATA_MIME="mime";function t(n){const r=new Map;n.path.substring(n.path.indexOf(";")+1,n.path.lastIndexOf(";")).split(";").forEach(A=>{const[R,L]=A.split(":");R&&L&&r.set(R,L)});const c=n.path.substring(0,n.path.indexOf(";"));return c&&r.set(a.META_DATA_MIME,c),r}a.parseMetaData=t})(E=e.DataUri||(e.DataUri={}));function P(a,t,n){if(t){let r=a.path;return r&&r[0]!==f.posix.sep&&(r=f.posix.sep+r),a.with({scheme:n,authority:t,path:r})}return a.with({scheme:n})}e.toLocalResource=P}),define(T[10],S([0,1,6,3,8,4,11,2,5]),function(O,e,g,f,h,w,v,s,l){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.create=e.OutputLinkComputer=void 0;class m{constructor(P,a){this.ctx=P,this.patterns=new Map,this.computePatterns(a)}computePatterns(P){const a=P.workspaceFolders.sort((t,n)=>n.length-t.length).map(t=>g.URI.parse(t));for(const t of a){const n=m.createPatterns(t);this.patterns.set(t,n)}}getModel(P){return this.ctx.getMirrorModels().find(t=>t.uri.toString()===P)}computeLinks(P){const a=this.getModel(P);if(!a)return[];const t=[],n=w.splitLines(a.getValue());for(const[r,u]of this.patterns){const c={toResource:A=>typeof A=="string"?h.joinPath(r,A):null};for(let A=0,R=n.length;A<R;A++)t.push(...m.detectLinks(n[A],A+1,u,c))}return t}static createPatterns(P){const a=[],t=P.scheme===l.Schemas.file?P.fsPath:P.path,n=[t];s.isWindows&&P.scheme===l.Schemas.file&&n.push(f.toSlashes(t));for(const r of n){const u='[^\\s\\(\\):<>"]',A=`${`(?:${u}| ${u})`}+\\.${u}+`,R=`${u}+`;a.push(new RegExp(w.escapeRegExpCharacters(r)+`(${A}) on line ((\\d+)(, column (\\d+))?)`,"gi")),a.push(new RegExp(w.escapeRegExpCharacters(r)+`(${A}):line ((\\d+)(, column (\\d+))?)`,"gi")),a.push(new RegExp(w.escapeRegExpCharacters(r)+`(${A})(\\s?\\((\\d+)(,(\\d+))?)\\)`,"gi")),a.push(new RegExp(w.escapeRegExpCharacters(r)+`(${R})(:(\\d+))?(:(\\d+))?`,"gi"))}return a}static detectLinks(P,a,t,n){const r=[];return t.forEach(u=>{u.lastIndex=0;let c,A=0;for(;(c=u.exec(P))!==null;){const R=w.rtrim(c[1],".").replace(/\\/g,"/");let L;try{const o=n.toResource(R);o&&(L=o.toString())}catch(o){continue}if(c[3]){const o=c[3];if(c[5]){const d=c[5];L=w.format("{0}#{1},{2}",L,o,d)}else L=w.format("{0}#{1}",L,o)}const I=w.rtrim(c[0],"."),q=P.indexOf(I,A);A=q+I.length;const i={startColumn:q+1,startLineNumber:a,endColumn:q+1+I.length,endLineNumber:a};if(r.some(o=>v.Range.areIntersectingOrTouching(o.range,i)))return;r.push({range:i,url:L})}}),r}}e.OutputLinkComputer=m;function b(E,P){return new m(E,P)}e.create=b})}).call(this);

//# sourceMappingURL=outputLinkComputer.js.map
