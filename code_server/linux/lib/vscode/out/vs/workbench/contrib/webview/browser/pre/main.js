const R=navigator.vendor&&navigator.vendor.indexOf("Apple")>-1&&navigator.userAgent&&navigator.userAgent.indexOf("CriOS")===-1&&navigator.userAgent.indexOf("FxiOS")===-1,I=new URL(location.toString()).searchParams,U=I.get("id"),K=parseInt(I.get("swVersion")),z=({onFocus:t,onBlur:m})=>{const l=50;let u=document.hasFocus();setInterval(()=>{const v=document.hasFocus();v!==u&&(u=v,v?t():m())},l)},y=()=>document.getElementById("active-frame"),C=()=>document.getElementById("pending-frame");function g(t){if(typeof t=="undefined"||t===null)throw new Error("Found unexpected null");return t}const D="__vscode_post_message__",E=document.createElement("style");E.id="_defaultStyles",E.textContent=`
	html {
		scrollbar-color: var(--vscode-scrollbarSlider-background) var(--vscode-editor-background);
	}

	body {
		background-color: transparent;
		color: var(--vscode-editor-foreground, var(--theme-foreground));
		font-family: var(--vscode-font-family, var(--theme-font-family));
		font-weight: var(--vscode-font-weight, var(--theme-font-weight));
		font-size: var(--vscode-font-size, var(--theme-font-size));
		margin: 0;
		padding: 0 20px;
	}

	img {
		max-width: 100%;
		max-height: 100%;
	}

	a {
		color: var(--vscode-textLink-foreground, var(--theme-link));
	}

	a:hover {
		color: var(--vscode-textLink-activeForeground, var(--theme-link-active));
	}

	a:focus,
	input:focus,
	select:focus,
	textarea:focus {
		outline: 1px solid -webkit-focus-ring-color;
		outline-offset: -1px;
	}

	code {
		color: var(--vscode-textPreformat-foreground, var(--theme-code-foreground));
	}

	blockquote {
		background: var(--vscode-textBlockQuote-background, var(--theme-quote-background));
		border-color: var(--vscode-textBlockQuote-border, var(--theme-quote-border));
	}

	kbd {
		color: var(--vscode-editor-foreground, var(--theme-foreground));
		border-radius: 3px;
		vertical-align: middle;
		padding: 1px 3px;

		background-color: hsla(0,0%,50%,.17);
		border: 1px solid rgba(71,71,71,.4);
		border-bottom-color: rgba(88,88,88,.4);
		box-shadow: inset 0 -1px 0 rgba(88,88,88,.4);
	}
	.vscode-light kbd {
		background-color: hsla(0,0%,87%,.5);
		border: 1px solid hsla(0,0%,80%,.7);
		border-bottom-color: hsla(0,0%,73%,.7);
		box-shadow: inset 0 -1px 0 hsla(0,0%,73%,.7);
	}

	::-webkit-scrollbar {
		width: 10px;
		height: 10px;
	}

	::-webkit-scrollbar-corner {
		background-color: var(--vscode-editor-background, var(--theme-background));
	}

	::-webkit-scrollbar-thumb {
		background-color: var(--vscode-scrollbarSlider-background, var(--theme-scrollbar-background));
	}
	::-webkit-scrollbar-thumb:hover {
		background-color: var(--vscode-scrollbarSlider-hoverBackground, var(--theme-scrollbar-hover-background));
	}
	::-webkit-scrollbar-thumb:active {
		background-color: var(--vscode-scrollbarSlider-activeBackground, var(--theme-scrollbar-active-background));
	}`;function X(t,m,l){const u=l?encodeURIComponent(l):void 0;return`
			globalThis.acquireVsCodeApi = (function() {
				const originalPostMessage = window.parent['${m?"postMessage":D}'].bind(window.parent);
				const doPostMessage = (channel, data, transfer) => {
					${m?"originalPostMessage({ command: channel, data: data }, '*', transfer);":"originalPostMessage(channel, data, transfer);"}
				};

				let acquired = false;

				let state = ${l?`JSON.parse(decodeURIComponent("${u}"))`:void 0};

				return () => {
					if (acquired && !${t}) {
						throw new Error('An instance of the VS Code API has already been acquired');
					}
					acquired = true;
					return Object.freeze({
						postMessage: function(message, transfer) {
							doPostMessage('onmessage', { message, transfer }, transfer);
						},
						setState: function(newState) {
							state = newState;
							doPostMessage('do-update-state', JSON.stringify(newState));
							return newState;
						},
						getState: function() {
							return state;
						}
					});
				};
			})();
			delete window.parent;
			delete window.top;
			delete window.frameElement;
		`}const J=new Promise(async(t,m)=>{if(!Z())return m(new Error("Service Workers are not enabled in browser. Webviews will not work."));const l=`service-worker.js${self.location.search}`;navigator.serviceWorker.register(l).then(async u=>{await navigator.serviceWorker.ready;const v=async i=>{if(i.data.channel==="version")return navigator.serviceWorker.removeEventListener("message",v),i.data.version===K?t():(console.log(`Found unexpected service worker version. Found: ${i.data.version}. Expected: ${K}`),console.log("Attempting to reload service worker"),u.unregister().then(()=>navigator.serviceWorker.register(l)).then(()=>navigator.serviceWorker.ready).finally(()=>{t()}))};navigator.serviceWorker.addEventListener("message",v),g(u.active).postMessage({channel:"version"})},u=>{m(new Error(`Could not register service workers: ${u}.`))})});export async function createWebviewManager(t){let m=!0,l,u=0,v=[];const i={initialScrollProgress:void 0,styles:void 0,activeTheme:void 0,themeName:void 0};t.onMessage("did-load-resource",(e,r)=>{navigator.serviceWorker.ready.then(n=>{g(n.active).postMessage({channel:"did-load-resource",data:r},r.data?.buffer?[r.data.buffer]:[])})}),t.onMessage("did-load-localhost",(e,r)=>{navigator.serviceWorker.ready.then(n=>{g(n.active).postMessage({channel:"did-load-localhost",data:r})})}),navigator.serviceWorker.addEventListener("message",e=>{switch(e.data.channel){case"load-resource":case"load-localhost":t.postMessage(e.data.channel,e.data);return}});const b=(e,r)=>{if(!!e&&(r&&(r.classList.remove("vscode-light","vscode-dark","vscode-high-contrast"),i.activeTheme&&r.classList.add(i.activeTheme),r.dataset.vscodeThemeKind=i.activeTheme,r.dataset.vscodeThemeName=i.themeName||""),i.styles)){const n=e.documentElement.style;for(let o=n.length-1;o>=0;o--){const c=n[o];c&&c.startsWith("--vscode-")&&n.removeProperty(c)}for(const o of Object.keys(i.styles))n.setProperty(`--${o}`,i.styles[o])}},T=e=>{if(!e||!e.view||!e.view.document)return;const r=e.view.document.getElementsByTagName("base")[0];for(const n of e.composedPath()){const o=n;if(o.tagName&&o.tagName.toLowerCase()==="a"&&o.href){if(o.getAttribute("href")==="#")e.view.scrollTo(0,0);else if(o.hash&&(o.getAttribute("href")===o.hash||r&&o.href===r.href+o.hash)){const c=e.view.document.getElementById(o.hash.substr(1,o.hash.length-1));c&&c.scrollIntoView()}else t.postMessage("did-click-link",o.href.baseVal||o.href);e.preventDefault();return}}},W=e=>{if(!(!e.view||!e.view.document)&&e.button===1)for(const r of e.composedPath()){const n=r;if(n.tagName&&n.tagName.toLowerCase()==="a"&&n.href){e.preventDefault();return}}},F=e=>{if(_(e)||$(e))e.preventDefault();else if(O(e))if(t.onElectron)e.preventDefault();else return;t.postMessage("did-keydown",{key:e.key,keyCode:e.keyCode,code:e.code,shiftKey:e.shiftKey,altKey:e.altKey,ctrlKey:e.ctrlKey,metaKey:e.metaKey,repeat:e.repeat})},N=e=>{t.postMessage("did-keyup",{key:e.key,keyCode:e.keyCode,code:e.code,shiftKey:e.shiftKey,altKey:e.altKey,ctrlKey:e.ctrlKey,metaKey:e.metaKey,repeat:e.repeat})};function O(e){const r=e.ctrlKey||e.metaKey,n=e.shiftKey&&e.key.toLowerCase()==="insert";return r&&["c","v","x"].includes(e.key.toLowerCase())||n}function _(e){return(e.ctrlKey||e.metaKey)&&["z","y"].includes(e.key.toLowerCase())}function $(e){return(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="p"}let w=!1;const q=e=>{w||t.postMessage("did-scroll-wheel",{deltaMode:e.deltaMode,deltaX:e.deltaX,deltaY:e.deltaY,deltaZ:e.deltaZ,detail:e.detail,type:e.type})},Y=e=>{if(w)return;const r=e.target,n=e.currentTarget;if(!r||!n||!r.body)return;const o=n.scrollY/r.body.clientHeight;isNaN(o)||(w=!0,window.requestAnimationFrame(()=>{try{t.postMessage("did-scroll",o)}catch(c){}w=!1}))};function B(e){const r=e.options,n=e.contents,o=new DOMParser().parseFromString(n,"text/html");if(o.querySelectorAll("a").forEach(f=>{if(!f.title){const h=f.getAttribute("href");typeof h=="string"&&(f.title=h)}}),r.allowScripts){const f=o.createElement("script");f.id="_vscodeApiScript",f.textContent=X(r.allowMultipleAPIAcquire,t.useParentPostMessage,e.state),o.head.prepend(f)}o.head.prepend(E.cloneNode(!0)),b(o,o.body);const c=o.querySelector('meta[http-equiv="Content-Security-Policy"]');if(!c)t.postMessage("no-csp-found");else try{const f=c.getAttribute("content");if(f){const h=f.replace(/(vscode-webview-resource|vscode-resource):(?=(\s|;|$))/g,e.cspSource);c.setAttribute("content",h)}}catch(f){console.error(`Could not rewrite csp: ${f}`)}return`<!DOCTYPE html>
`+o.documentElement.outerHTML}Q(()=>{if(!document.body)return;t.onMessage("styles",(r,n)=>{++u,i.styles=n.styles,i.activeTheme=n.activeTheme,i.themeName=n.themeName;const o=y();!o||o.contentDocument&&b(o.contentDocument,o.contentDocument.body)}),t.onMessage("focus",()=>{const r=y();if(!r||!r.contentWindow){window.focus();return}document.activeElement!==r&&r.contentWindow.focus()});let e=0;t.onMessage("content",async(r,n)=>{const o=++e;try{await J}catch(s){console.error(`Webview fatal error: ${s}`),t.postMessage("fatal-error",{message:s+""});return}if(o!==e)return;const c=n.options,f=B(n),h=u,k=y(),V=m;let S;if(m)m=!1,S=(s,a)=>{typeof i.initialScrollProgress=="number"&&!isNaN(i.initialScrollProgress)&&a.scrollY===0&&a.scroll(0,s.clientHeight*i.initialScrollProgress)};else{const s=k&&k.contentDocument&&k.contentDocument.body?g(k.contentWindow).scrollY:0;S=(a,d)=>{d.scrollY===0&&d.scroll(0,s)}}const x=C();x&&(x.setAttribute("id",""),document.body.removeChild(x)),V||(v=[]);const p=document.createElement("iframe");p.setAttribute("id","pending-frame"),p.setAttribute("frameborder","0"),p.setAttribute("sandbox",c.allowScripts?"allow-scripts allow-forms allow-same-origin allow-pointer-lock allow-downloads":"allow-same-origin allow-pointer-lock"),p.setAttribute("allow",c.allowScripts?"clipboard-read; clipboard-write;":""),p.src=`./fake.html?id=${U}`,p.style.cssText="display: block; margin: 0; overflow: hidden; position: absolute; width: 100%; height: 100%; visibility: hidden",document.body.appendChild(p);function L(s){setTimeout(()=>{s.open(),s.write(f),s.close(),H(p),h!==u&&b(s,s.body)},0)}if(!c.allowScripts&&R){const s=setInterval(()=>{if(!p.parentElement){clearInterval(s);return}const a=g(p.contentDocument);a.readyState!=="loading"&&(clearInterval(s),L(a))},10)}else g(p.contentWindow).addEventListener("DOMContentLoaded",s=>{const a=s.target?s.target:void 0;L(g(a))});const P=(s,a)=>{s&&s.body&&S(s.body,a);const d=C();if(d&&d.contentDocument&&d.contentDocument===s){const M=y();M&&document.body.removeChild(M),h!==u&&b(d.contentDocument,d.contentDocument.body),d.setAttribute("id","active-frame"),d.style.visibility="visible",t.focusIframeOnCreate&&g(d.contentWindow).focus(),a.addEventListener("scroll",Y),a.addEventListener("wheel",q),document.hasFocus()&&a.focus(),v.forEach(A=>{a.postMessage(A.message,"*",A.transfer)}),v=[]}t.postMessage("did-load")};function H(s){clearTimeout(l),l=void 0,l=setTimeout(()=>{clearTimeout(l),l=void 0,P(g(s.contentDocument),g(s.contentWindow))},200);const a=g(s.contentWindow);a.addEventListener("load",function(d){const M=d.target;l&&(clearTimeout(l),l=void 0,P(M,this))}),a.addEventListener("click",T),a.addEventListener("auxclick",W),a.addEventListener("keydown",F),a.addEventListener("keyup",N),a.addEventListener("contextmenu",d=>{d.defaultPrevented||(d.preventDefault(),t.postMessage("did-context-menu",{clientX:d.clientX,clientY:d.clientY}))}),t.onIframeLoaded&&t.onIframeLoaded(s)}t.postMessage("did-set-content",void 0)}),t.onMessage("message",(r,n)=>{if(!C()){const c=y();if(c){g(c.contentWindow).postMessage(n.message,"*",n.transfer);return}}v.push(n)}),t.onMessage("initial-scroll-position",(r,n)=>{i.initialScrollProgress=n}),t.onMessage("execCommand",(r,n)=>{const o=y();!o||g(o.contentDocument).execCommand(n)}),z({onFocus:()=>t.postMessage("did-focus"),onBlur:()=>t.postMessage("did-blur")}),window[D]=(r,n)=>{switch(r){case"onmessage":case"do-update-state":t.postMessage(r,n);break}},t.postMessage("webview-ready",{})})}function Q(t){document.readyState==="interactive"||document.readyState==="complete"?t():document.addEventListener("DOMContentLoaded",t)}function Z(){try{return!!navigator.serviceWorker}catch(t){return!1}}

//# sourceMappingURL=main.js.map
