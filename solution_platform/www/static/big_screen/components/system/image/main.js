!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/screen/components/",t(t.s=209)}({16:function(e,t){e.exports=dv.adapter.Component},185:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var c=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n(16),s=r(i),A=n(3),f=n(211),l=r(f),p=function(e){function t(){return o(this,t),a(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return u(t,e),c(t,[{key:"_render",value:function(){var e=this.getOptions(),t=e.image,n=e.type,r={backgroundImage:t?"url("+(0,A.transformImageUrl)(t)+")":"url("+l.default+")"};switch(n){case"full":r.backgroundRepeat="no-repeat",r.backgroundSize="100% 100%";break;case"contain":r.backgroundRepeat="no-repeat",r.backgroundSize="contain",r.backgroundPosition="center";break;case"repeat":r.backgroundRepeat="repeat",r.backgroundSize="auto",r.backgroundPosition="left top"}return this.getContainer().css(r),this}}]),t}(s.default);p.defaultOptions={image:"",type:"full"},p.defaultConfig={width:153,height:102},t.default=p},209:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(7),o=n(185),a=function(e){return e&&e.__esModule?e:{default:e}}(o);/**
 * @description 图片组件入口
 * @author vision <vision.shi@tianjishuju.com>
 * @license www.tianjishuju.com/license
 */
(0,r.registerComponent)("system/image",a.default),t.default=a.default},211:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),/**
 * @description
 * @author vision <vision.shi@tianjishuju.com>
 * @license www.tianjishuju.com/license
 */
t.default="data:image/png;base64,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"},3:function(e,t){e.exports=dv.adapter._},7:function(e,t){e.exports=dv.adapter}});