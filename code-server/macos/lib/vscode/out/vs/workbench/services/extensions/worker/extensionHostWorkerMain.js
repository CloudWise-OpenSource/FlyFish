"use strict";(function(){var s,i;const c=self.MonacoEnvironment,f=c&&c.baseUrl?c.baseUrl:"../../../../../",t=typeof((s=self.trustedTypes)===null||s===void 0?void 0:s.createPolicy)=="function"?(i=self.trustedTypes)===null||i===void 0?void 0:i.createPolicy("amdLoader",{createScriptURL:e=>e,createScript:(e,...o)=>{const r=o.slice(0,-1).join(","),l=o.pop().toString();return`(function anonymous(${r}) {
${l}
})`}}):void 0;function u(){return new Promise((e,o)=>{if(typeof self.define=="function"&&self.define.amd)return e();const r=f+"vs/loader.js";if(!(/^((http:)|(https:)|(file:))/.test(r)&&r.substring(0,self.origin.length)!==self.origin)){fetch(r).then(n=>{if(n.status!==200)throw new Error(n.statusText);return n.text()}).then(n=>{n=`${n}
//# sourceURL=${r}`,(t?self.eval(t.createScript("",n)):new Function(n)).call(self),e()}).then(void 0,o);return}t?importScripts(t.createScriptURL(r)):importScripts(r),e()})}u().then(()=>{require.config({baseUrl:f,catchError:!0,trustedTypesPolicy:t}),require(["vs/workbench/services/extensions/worker/extensionHostWorker"],()=>{},e=>console.error(e))}).then(void 0,e=>console.error(e))})();

//# sourceMappingURL=extensionHostWorkerMain.js.map
