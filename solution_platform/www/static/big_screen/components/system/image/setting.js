!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/screen/components/",t(t.s=210)}({11:function(e,t){e.exports=PropTypes},186:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(5),c=r(l),f=n(11),p=r(f),s=n(6),d=function(e){function t(){return o(this,t),u(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),i(t,[{key:"getTabs",value:function(){var e=this;return{chart:{label:"图片",content:function(){return e.renderText()}}}}},{key:"renderText",value:function(){var e=this,t=this.props.options;return c.default.createElement(s.Form,null,c.default.createElement(s.FormItemGroup,{title:"图片"},c.default.createElement(s.FormItem,{full:!0},c.default.createElement(s.UploadImage,{src:t.image,onChange:function(t){return e.updateOptions({image:t})}})),c.default.createElement(s.FormItem,{label:"方式",full:!0},c.default.createElement(s.RadioGroup,{value:t.type,onChange:function(t){return e.updateOptions({type:t.target.value})}},c.default.createElement(s.Radio,{value:"full"},"铺满"),c.default.createElement(s.Radio,{value:"contain"},"适应"),c.default.createElement(s.Radio,{value:"repeat"},"填充")))))}}]),t}(s.ComponentOptionsSetting);d.propTypes={options:p.default.object.isRequired,updateOptions:p.default.func.isRequired},t.default=d},210:function(e,t,n){"use strict";var r=n(8),o=n(186),u=function(e){return e&&e.__esModule?e:{default:e}}(o);/**
 * @description
 * @author vision <vision.shi@tianjishuju.com>
 * @license www.tianjishuju.com/license
 */
(0,r.registerComponentOptionsSetting)("system/image",u.default),(0,r.registerComponentEvents)("system/image",{click:"鼠标点击"})},5:function(e,t){e.exports=React},6:function(e,t){e.exports=dvEditorAdapter.templates},8:function(e,t){e.exports=dvEditorAdapter}});