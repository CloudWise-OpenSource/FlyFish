const B=navigator.vendor&&navigator.vendor.indexOf("Apple")>-1&&navigator.userAgent&&navigator.userAgent.indexOf("CriOS")===-1&&navigator.userAgent.indexOf("FxiOS")===-1,U=new URL(location.toString()).searchParams,V=U.get("id"),Y=({onFocus:o,onBlur:m})=>{const i=50;let l=document.hasFocus();setInterval(()=>{const v=document.hasFocus();v!==l&&(l=v,v?o():m())},i)},p=()=>document.getElementById("active-frame"),S=()=>document.getElementById("pending-frame"),A="__vscode_post_message__",x=document.createElement("style");x.id="_defaultStyles",x.textContent=`
	html {
		scrollbar-color: var(--vscode-scrollbarSlider-background) var(--vscode-editor-background);
	}

	body {
		background-color: transparent;
		color: var(--vscode-editor-foreground);
		font-family: var(--vscode-font-family);
		font-weight: var(--vscode-font-weight);
		font-size: var(--vscode-font-size);
		margin: 0;
		padding: 0 20px;
	}

	img {
		max-width: 100%;
		max-height: 100%;
	}

	a {
		color: var(--vscode-textLink-foreground);
	}

	a:hover {
		color: var(--vscode-textLink-activeForeground);
	}

	a:focus,
	input:focus,
	select:focus,
	textarea:focus {
		outline: 1px solid -webkit-focus-ring-color;
		outline-offset: -1px;
	}

	code {
		color: var(--vscode-textPreformat-foreground);
	}

	blockquote {
		background: var(--vscode-textBlockQuote-background);
		border-color: var(--vscode-textBlockQuote-border);
	}

	kbd {
		color: var(--vscode-editor-foreground);
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
		background-color: var(--vscode-editor-background);
	}

	::-webkit-scrollbar-thumb {
		background-color: var(--vscode-scrollbarSlider-background);
	}
	::-webkit-scrollbar-thumb:hover {
		background-color: var(--vscode-scrollbarSlider-hoverBackground);
	}
	::-webkit-scrollbar-thumb:active {
		background-color: var(--vscode-scrollbarSlider-activeBackground);
	}`;function H(o,m,i){const l=i?encodeURIComponent(i):void 0;return`
			globalThis.acquireVsCodeApi = (function() {
				const originalPostMessage = window.parent['${m?"postMessage":A}'].bind(window.parent);
				const doPostMessage = (channel, data, transfer) => {
					${m?"originalPostMessage({ command: channel, data: data }, '*', transfer);":"originalPostMessage(channel, data, transfer);"}
				};

				let acquired = false;

				let state = ${i?`JSON.parse(decodeURIComponent("${l}"))`:void 0};

				return () => {
					if (acquired && !${o}) {
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
		`}const R=new Promise(async(o,m)=>{if(!j())return m(new Error("Service Workers are not enabled in browser. Webviews will not work."));const i=1;navigator.serviceWorker.register(`service-worker.js${self.location.search}`).then(async l=>{await navigator.serviceWorker.ready;const v=c=>{if(c.data.channel==="version")return navigator.serviceWorker.removeEventListener("message",v),c.data.version===i?o():l.update().then(()=>navigator.serviceWorker.ready).finally(o)};navigator.serviceWorker.addEventListener("message",v),l.active.postMessage({channel:"version"})},l=>{m(new Error(`Could not register service workers: ${l}.`))})});export async function createWebviewManager(o){let m=!0,i,l=0,v=[];const c={initialScrollProgress:void 0,styles:void 0,activeTheme:void 0,themeName:void 0};o.onMessage("did-load-resource",(e,r)=>{navigator.serviceWorker.ready.then(n=>{var t;n.active.postMessage({channel:"did-load-resource",data:r},((t=r.data)==null?void 0:t.buffer)?[r.data.buffer]:[])})}),o.onMessage("did-load-localhost",(e,r)=>{navigator.serviceWorker.ready.then(n=>{n.active.postMessage({channel:"did-load-localhost",data:r})})}),navigator.serviceWorker.addEventListener("message",e=>{switch(e.data.channel){case"load-resource":case"load-localhost":o.postMessage(e.data.channel,e.data);return}});const y=(e,r)=>{if(!!e&&(r&&(r.classList.remove("vscode-light","vscode-dark","vscode-high-contrast"),r.classList.add(c.activeTheme),r.dataset.vscodeThemeKind=c.activeTheme,r.dataset.vscodeThemeName=c.themeName||""),c.styles)){const n=e.documentElement.style;for(let t=n.length-1;t>=0;t--){const a=n[t];a&&a.startsWith("--vscode-")&&n.removeProperty(a)}for(const t of Object.keys(c.styles))n.setProperty(`--${t}`,c.styles[t])}},W=e=>{if(!(!e||!e.view||!e.view.document)){const r=e.view.document.getElementsByTagName("base")[0];for(const n of e.composedPath()){const t=n;if(t.tagName&&t.tagName.toLowerCase()==="a"&&t.href){if(t.getAttribute("href")==="#")e.view.scrollTo(0,0);else if(t.hash&&(t.getAttribute("href")===t.hash||r&&t.href===r.href+t.hash)){const a=e.view.document.getElementById(t.hash.substr(1,t.hash.length-1));a&&a.scrollIntoView()}else o.postMessage("did-click-link",t.href.baseVal||t.href);e.preventDefault();return}}}},I=e=>{if(!(!e.view||!e.view.document)&&e.button===1)for(const r of e.composedPath()){const n=r;if(n.tagName&&n.tagName.toLowerCase()==="a"&&n.href){e.preventDefault();return}}},K=e=>{if(N(e))e.preventDefault();else if(T(e))if(o.onElectron)e.preventDefault();else return;o.postMessage("did-keydown",{key:e.key,keyCode:e.keyCode,code:e.code,shiftKey:e.shiftKey,altKey:e.altKey,ctrlKey:e.ctrlKey,metaKey:e.metaKey,repeat:e.repeat})},D=e=>{o.postMessage("did-keyup",{key:e.key,keyCode:e.keyCode,code:e.code,shiftKey:e.shiftKey,altKey:e.altKey,ctrlKey:e.ctrlKey,metaKey:e.metaKey,repeat:e.repeat})};function T(e){const r=e.ctrlKey||e.metaKey,n=e.shiftKey&&e.key.toLowerCase()==="insert";return r&&["c","v","x"].includes(e.key.toLowerCase())||n}function N(e){return(e.ctrlKey||e.metaKey)&&["z","y"].includes(e.key.toLowerCase())}let h=!1;const O=e=>{h||o.postMessage("did-scroll-wheel",{deltaMode:e.deltaMode,deltaX:e.deltaX,deltaY:e.deltaY,deltaZ:e.deltaZ,detail:e.detail,type:e.type})},_=e=>{if(!(!e.target||!e.target.body)&&!h){const r=e.currentTarget.scrollY/e.target.body.clientHeight;isNaN(r)||(h=!0,window.requestAnimationFrame(()=>{try{o.postMessage("did-scroll",r)}catch(n){}h=!1}))}};function F(e){const r=e.options,n=e.contents,t=new DOMParser().parseFromString(n,"text/html");if(t.querySelectorAll("a").forEach(u=>{u.title||(u.title=u.getAttribute("href"))}),r.allowScripts){const u=t.createElement("script");u.id="_vscodeApiScript",u.textContent=H(r.allowMultipleAPIAcquire,o.useParentPostMessage,e.state),t.head.prepend(u)}t.head.prepend(x.cloneNode(!0)),y(t,t.body);const a=t.querySelector('meta[http-equiv="Content-Security-Policy"]');if(!a)o.postMessage("no-csp-found");else try{const u=new URL(e.resourceEndpoint),b=a.getAttribute("content").replace(/(vscode-webview-resource|vscode-resource):(?=(\s|;|$))/g,u.origin);a.setAttribute("content",b)}catch(u){console.error(`Could not rewrite csp: ${u}`)}return`<!DOCTYPE html>
`+t.documentElement.outerHTML}z(()=>{if(!!document.body){o.onMessage("styles",(r,n)=>{++l,c.styles=n.styles,c.activeTheme=n.activeTheme,c.themeName=n.themeName;const t=p();!t||t.contentDocument&&y(t.contentDocument,t.contentDocument.body)}),o.onMessage("focus",()=>{const r=p();if(!r||!r.contentWindow){window.focus();return}document.activeElement!==r&&r.contentWindow.focus()});let e=0;o.onMessage("content",async(r,n)=>{const t=++e;try{await R}catch(s){console.error(`Webview fatal error: ${s}`),o.postMessage("fatal-error",{message:s+""});return}if(t===e){const a=n.options,u=F(n),b=l,w=p(),$=m;let k;if(m)m=!1,k=(s,d)=>{isNaN(c.initialScrollProgress)||d.scrollY===0&&d.scroll(0,s.clientHeight*c.initialScrollProgress)};else{const s=w&&w.contentDocument&&w.contentDocument.body?w.contentWindow.scrollY:0;k=(d,f)=>{f.scrollY===0&&f.scroll(0,s)}}const M=S();M&&(M.setAttribute("id",""),document.body.removeChild(M)),$||(v=[]);const g=document.createElement("iframe");g.setAttribute("id","pending-frame"),g.setAttribute("frameborder","0"),g.setAttribute("sandbox",a.allowScripts?"allow-scripts allow-forms allow-same-origin allow-pointer-lock allow-downloads":"allow-same-origin allow-pointer-lock"),g.setAttribute("allow",a.allowScripts?"clipboard-read; clipboard-write;":""),g.src=`./fake.html?id=${V}`,g.style.cssText="display: block; margin: 0; overflow: hidden; position: absolute; width: 100%; height: 100%; visibility: hidden",document.body.appendChild(g);function E(s){setTimeout(()=>{s.open(),s.write(u),s.close(),q(g),b!==l&&y(s,s.body)},0)}if(!a.allowScripts&&B){const s=setInterval(()=>{if(!g.parentElement){clearInterval(s);return}g.contentDocument.readyState!=="loading"&&(clearInterval(s),E(g.contentDocument))},10)}else g.contentWindow.addEventListener("DOMContentLoaded",s=>{const d=s.target?s.target:void 0;E(d)});const C=(s,d)=>{s&&s.body&&k(s.body,d);const f=S();if(f&&f.contentDocument&&f.contentDocument===s){const L=p();L&&document.body.removeChild(L),b!==l&&y(f.contentDocument,f.contentDocument.body),f.setAttribute("id","active-frame"),f.style.visibility="visible",o.focusIframeOnCreate&&f.contentWindow.focus(),d.addEventListener("scroll",_),d.addEventListener("wheel",O),document.hasFocus()&&d.focus(),v.forEach(P=>{d.postMessage(P.message,"*",P.transfer)}),v=[]}o.postMessage("did-load")};function q(s){clearTimeout(i),i=void 0,i=setTimeout(()=>{clearTimeout(i),i=void 0,C(s.contentDocument,s.contentWindow)},200),s.contentWindow.addEventListener("load",function(d){const f=d.target;i&&(clearTimeout(i),i=void 0,C(f,this))}),s.contentWindow.addEventListener("click",W),s.contentWindow.addEventListener("auxclick",I),s.contentWindow.addEventListener("keydown",K),s.contentWindow.addEventListener("keyup",D),s.contentWindow.addEventListener("contextmenu",d=>d.preventDefault()),o.onIframeLoaded&&o.onIframeLoaded(s)}o.postMessage("did-set-content",void 0)}}),o.onMessage("message",(r,n)=>{if(!S()){const a=p();if(a){a.contentWindow.postMessage(n.message,"*",n.transfer);return}}v.push(n)}),o.onMessage("initial-scroll-position",(r,n)=>{c.initialScrollProgress=n}),o.onMessage("execCommand",(r,n)=>{const t=p();!t||t.contentDocument.execCommand(n)}),Y({onFocus:()=>o.postMessage("did-focus"),onBlur:()=>o.postMessage("did-blur")}),window[A]=(r,n,t)=>{switch(r){case"onmessage":case"do-update-state":o.postMessage(r,n);break}},o.postMessage("webview-ready",{})}})}function z(o){document.readyState==="interactive"||document.readyState==="complete"?o():document.addEventListener("DOMContentLoaded",o)}function j(){try{return!!navigator.serviceWorker}catch(o){return!1}}

//# sourceMappingURL=main.js.map
