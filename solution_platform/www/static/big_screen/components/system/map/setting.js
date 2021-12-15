!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/screen/components/",t(t.s=215)}({11:function(e,t){e.exports=PropTypes},188:function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(5),i=function(e){return e&&e.__esModule?e:{default:e}}(u),p=n(6),c=n(3),f=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return l(t,e),a(t,[{key:"render",value:function(){var e=this,t=this.props,n=t.fields,r=t.config,o=r.mapping||{};return i.default.createElement("div",null,i.default.createElement(p.FormItem,{label:"维度",full:!0},i.default.createElement(p.AutoComplete,{placeholder:"请输入或选择字段",dataSource:(0,c.map)(n,function(e){return e.value}),value:o.x,onChange:function(t){return e.updateConfig({mapping:{x:t}})}})),i.default.createElement(p.FormItem,{label:"指标",full:!0},i.default.createElement(p.AutoComplete,{placeholder:"请输入或选择字段",dataSource:(0,c.map)(n,function(e){return e.value}),value:o.y,onChange:function(t){return e.updateConfig({mapping:{y:t}})}})))}}]),t}(p.ComponentDataSetting);t.default=f},189:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n(5),p=r(i),c=n(11),f=r(c),m=n(6),s=function(e){function t(){return o(this,t),l(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),u(t,[{key:"getTabs",value:function(){var e=this;return{title:{label:"标题",content:function(){return e.renderTitle()}},legend:{label:"图例",content:function(){return e.renderLegend()}},toolbox:{label:"提示框",content:function(){return e.renderTooltip()}},graph:{label:"地图",content:function(){return e.renderGraph()}}}}},{key:"renderTitle",value:function(){var e=this,t=this.props.options;return p.default.createElement(m.Form,null,p.default.createElement(m.FormItemGroup,{title:"主标题"},p.default.createElement(m.FormItem,{label:"显示",style:{marginBottom:0}},p.default.createElement(m.RadioBooleanGroup,{value:t.title.show,onChange:function(t){return e.updateOptions({title:{show:t.target.value}})}})),p.default.createElement(m.FormItem,null,p.default.createElement(m.Input,{placeholder:"标题名称",value:t.title.text,onChange:function(t){return e.updateOptions({title:{text:t.target.value}})}})),p.default.createElement(m.FormItem,{label:"字体大小"},p.default.createElement(m.InputNumber,{value:t.title.textStyle.fontSize,min:12,onChange:function(t){return e.updateOptions({title:{textStyle:{fontSize:t}}})}})),p.default.createElement(m.FormItem,{label:"字体颜色"},p.default.createElement(m.ColorPickerInput,{value:t.title.textStyle.color,onChange:function(t){return e.updateOptions({title:{textStyle:{color:t}}})}}))),p.default.createElement(m.FormItemGroup,{title:"副标题"},p.default.createElement(m.FormItem,{label:"显示",style:{marginBottom:0}},p.default.createElement(m.RadioBooleanGroup,{value:t.title.showSubtext,onChange:function(t){return e.updateOptions({title:{showSubtext:t.target.value}})}})),p.default.createElement(m.FormItem,null,p.default.createElement(m.Input,{placeholder:"标题名称",value:t.title.subtext,onChange:function(t){return e.updateOptions({title:{subtext:t.target.value}})}})),p.default.createElement(m.FormItem,{label:"字体大小"},p.default.createElement(m.InputNumber,{value:t.title.subtextStyle.fontSize,min:12,onChange:function(t){return e.updateOptions({title:{subtextStyle:{fontSize:t}}})}})),p.default.createElement(m.FormItem,{label:"字体颜色"},p.default.createElement(m.ColorPickerInput,{value:t.title.subtextStyle.color,onChange:function(t){return e.updateOptions({title:{subtextStyle:{color:t}}})}}))))}},{key:"renderLegend",value:function(){var e=this,t=this.props.options;return p.default.createElement(m.Form,null,p.default.createElement(m.FormItemGroup,{title:"数值范围"},p.default.createElement(m.FormItem,{label:"最大值"},p.default.createElement(m.InputNumber,{value:t.visualMap.max,nullable:!0,onChange:function(t){return e.updateOptions({visualMap:{max:t}})}})),p.default.createElement(m.FormItem,{label:"最小值"},p.default.createElement(m.InputNumber,{value:t.visualMap.min,nullable:!0,onChange:function(t){return e.updateOptions({visualMap:{min:t}})}}))),p.default.createElement(m.FormItemGroup,{title:"组件配色"},p.default.createElement(m.FormItem,{label:"最大值颜色"},p.default.createElement(m.ColorPickerInput,{value:t.visualMap.inRange.color[1],onChange:function(n){return e.updateOptions({visualMap:{inRange:{color:[t.visualMap.inRange.color[0],n]}}})}})),p.default.createElement(m.FormItem,{label:"最小值颜色"},p.default.createElement(m.ColorPickerInput,{value:t.visualMap.inRange.color[0],onChange:function(n){return e.updateOptions({visualMap:{inRange:{color:[n,t.visualMap.inRange.color[1]]}}})}}))))}},{key:"renderTooltip",value:function(){var e=this,t=this.props.options;return p.default.createElement(m.Form,null,p.default.createElement(m.FormItemGroup,{title:"基本属性"},p.default.createElement(m.FormItem,{label:"显示"},p.default.createElement(m.RadioBooleanGroup,{value:t.tooltip.show,onChange:function(t){return e.updateOptions({tooltip:{show:t.target.value}})}}))),p.default.createElement(m.FormItemGroup,{title:"内容"},p.default.createElement(m.FormItem,{label:"前缀"},p.default.createElement(m.Input,{value:t.tooltip.valuePrefix,onChange:function(t){return e.updateOptions({tooltip:{valuePrefix:t.target.value}})}})),p.default.createElement(m.FormItem,{label:"后缀"},p.default.createElement(m.Input,{value:t.tooltip.valueSuffix,onChange:function(t){return e.updateOptions({tooltip:{valueSuffix:t.target.value}})}})),p.default.createElement(m.FormItem,{label:"小数位数"},p.default.createElement(m.InputNumber,{value:t.tooltip.valueDecimals,min:-1,onChange:function(t){return e.updateOptions({tooltip:{valueDecimals:t}})}}))))}},{key:"renderGraph",value:function(){var e=this,t=this.props.options;return p.default.createElement(m.Form,null,p.default.createElement(m.FormItemGroup,{title:"组件属性"},p.default.createElement(m.FormItem,{label:"类型"},p.default.createElement(m.Select,{value:t.seriesOptions.map,onChange:function(t){return e.updateOptions({seriesOptions:{map:t}})}},p.default.createElement(m.Option,{value:"中国"},"中国"),p.default.createElement(m.Option,{value:"大兴"},"大兴")))),p.default.createElement(m.FormItemGroup,{title:"鼠标移入颜色"},p.default.createElement(m.FormItem,{label:"区域颜色"},p.default.createElement(m.ColorPickerInput,{value:t.seriesOptions.itemStyle.emphasis.areaColor,onChange:function(t){return e.updateOptions({seriesOptions:{itemStyle:{emphasis:{areaColor:t}}}})}})),p.default.createElement(m.FormItem,{label:"边界颜色"},p.default.createElement(m.ColorPickerInput,{value:t.seriesOptions.itemStyle.emphasis.borderColor,onChange:function(t){return e.updateOptions({seriesOptions:{itemStyle:{emphasis:{borderColor:t}}}})}}))),p.default.createElement(m.FormItemGroup,{title:"标签"},p.default.createElement(m.FormItem,{label:"显示",style:{marginBottom:0}},p.default.createElement(m.RadioBooleanGroup,{value:t.seriesOptions.label.normal.show,onChange:function(t){return e.updateOptions({seriesOptions:{label:{normal:{show:t.target.value}}}})}})),p.default.createElement(m.FormItem,{label:"字体大小"},p.default.createElement(m.InputNumber,{value:t.seriesOptions.label.normal.textStyle.fontSize,min:12,onChange:function(t){return e.updateOptions({seriesOptions:{label:{normal:{textStyle:{fontSize:t}}}}})}})),p.default.createElement(m.FormItem,{label:"字体颜色"},p.default.createElement(m.ColorPickerInput,{value:t.seriesOptions.label.normal.textStyle.color,onChange:function(t){return e.updateOptions({seriesOptions:{label:{normal:{textStyle:{color:t}}}}})}}))))}}]),t}(m.ComponentOptionsSetting);s.propTypes={options:f.default.object.isRequired,updateOptions:f.default.func.isRequired},t.default=s},215:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}var o=n(8),l=n(189),a=r(l),u=n(188),i=r(u);(0,o.registerComponentOptionsSetting)("system/map",a.default),/**
                                                                                 * @description
                                                                                 * @author vision <vision.shi@tianjishuju.com>
                                                                                 * @license www.tianjishuju.com/license
                                                                                 */
(0,o.registerComponentDataSetting)("system/map",i.default),(0,o.registerComponentEvents)("system/map",{pointSelect:"地区被选中"})},3:function(e,t){e.exports=dv.adapter._},5:function(e,t){e.exports=React},6:function(e,t){e.exports=dvEditorAdapter.templates},8:function(e,t){e.exports=dvEditorAdapter}});