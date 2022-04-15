import{createWebviewManager as d}from"./main.js";const r=new URL(location.toString()).searchParams,a=r.get("id");if(!a)throw new Error(`Could not resolve webview id. Webview will not work.
This is usually caused by incorrectly trying to navigate in a webview`);const i=r.get("platform")==="electron",n=new class{constructor(){this.handlers=new Map,window.addEventListener("message",e=>{const t=e.data.channel,o=this.handlers.get(t);if(o)for(const l of o)l(e,e.data.args);else console.log("no handler for ",e)})}postMessage(e,t){window.parent.postMessage({target:a,channel:e,data:t},"*")}onMessage(e,t){let o=this.handlers.get(e);o||(o=[],this.handlers.set(e,o)),o.push(t)}},c=new class{constructor(){this.confirmBeforeClose="keyboardOnly",this.isModifierKeyDown=!1,n.onMessage("set-confirm-before-close",(s,e)=>{this.confirmBeforeClose=e}),n.onMessage("content",(s,e)=>{this.confirmBeforeClose=e.confirmBeforeClose}),window.addEventListener("beforeunload",s=>{if(!i)switch(this.confirmBeforeClose){case"always":return s.preventDefault(),s.returnValue="","";case"never":break;case"keyboardOnly":default:{if(this.isModifierKeyDown)return s.preventDefault(),s.returnValue="","";break}}})}onIframeLoaded(s){s.contentWindow.addEventListener("keydown",e=>{this.isModifierKeyDown=e.metaKey||e.ctrlKey||e.altKey}),s.contentWindow.addEventListener("keyup",()=>{this.isModifierKeyDown=!1})}};d({postMessage:n.postMessage.bind(n),onMessage:n.onMessage.bind(n),onElectron:i,useParentPostMessage:!1,onIframeLoaded:s=>{c.onIframeLoaded(s)}});

//# sourceMappingURL=host.js.map
