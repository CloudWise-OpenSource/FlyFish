!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/screen/components/",t(t.s=198)}({11:function(e,t){e.exports=PropTypes},175:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n(5),c=r(i),f=n(11),p=r(f),s=n(6),d=["YYYY-MM-DD HH:mm:ss","YYYY/MM/DD HH:mm:ss","YYYY年MM月DD日 HH:mm:ss","YYYY年MM月DD日","dddd,  YYYY年MM月DD日  HH:mm:ss"],m=function(e){function t(){return o(this,t),u(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),l(t,[{key:"getTabs",value:function(){var e=this;return{chart:{label:"时钟",content:function(){return e.renderClock()}}}}},{key:"renderClock",value:function(){var e=this,t=this.props.options;return c.default.createElement(s.Form,null,c.default.createElement(s.FormItemGroup,{title:"基本属性"},c.default.createElement(s.FormItem,{label:"格式",cols:[5,19],full:!0},c.default.createElement(s.AutoComplete,{placeholder:"请输入显示格式",dataSource:d,value:t.format,dropdownMatchSelectWidth:!1,onChange:function(t){return e.updateOptions({format:t})}}))),c.default.createElement(s.FormItemGroup,{title:"字体"},c.default.createElement(s.FormItem,{label:"字体大小"},c.default.createElement(s.InputNumber,{placeholder:"请输入字体大小",value:t.fontSize,min:12,onChange:function(t){return e.updateOptions({fontSize:t})}})),c.default.createElement(s.FormItem,{label:"字体颜色"},c.default.createElement(s.ColorPickerInput,{value:t.color,onChange:function(t){return e.updateOptions({color:t})}}))))}}]),t}(s.ComponentOptionsSetting);m.propTypes={options:p.default.object.isRequired,updateOptions:p.default.func.isRequired},t.default=m},198:function(e,t,n){"use strict";var r=n(8),o=n(175),u=function(e){return e&&e.__esModule?e:{default:e}}(o);/**
 * @description
 * @author vision <vision.shi@tianjishuju.com>
 * @license www.tianjishuju.com/license
 */
(0,r.registerComponentOptionsSetting)("system/clock",u.default)},5:function(e,t){e.exports=React},6:function(e,t){e.exports=dvEditorAdapter.templates},8:function(e,t){e.exports=dvEditorAdapter}});