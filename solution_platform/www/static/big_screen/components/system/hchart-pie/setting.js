!function(e){function t(r){if(n[r])return n[r].exports;var a=n[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,t),a.l=!0,a.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/screen/components/",t(t.s=206)}({11:function(e,t){e.exports=PropTypes},182:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n(5),c=r(i),s=n(33),p=r(s),f=n(6),d=n(3),m=function(e){function t(){return a(this,t),l(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return o(t,e),u(t,[{key:"getTabs",value:function(){var e=p.default.prototype.getTabs.call(this);return e.graph.label="饼图",delete e.xAxis,delete e.yAxis,e}},{key:"renderGraph",value:function(){var e=this,t=this.props.options;return c.default.createElement(f.Form,null,c.default.createElement(f.FormItemGroup,{title:"数值标签"},c.default.createElement(f.FormItem,{label:"显示"},c.default.createElement(f.RadioBooleanGroup,{value:t.plotOptions.series.dataLabels.enabled,onChange:function(t){return e.updateOptions({plotOptions:{series:{dataLabels:{enabled:t.target.value}}}})}})),c.default.createElement(f.FormItem,{label:"字体大小"},c.default.createElement(f.InputNumber,{value:(0,d.parseInt)(t.plotOptions.series.dataLabels.style.fontSize),min:12,onChange:function(t){return e.updateOptions({plotOptions:{series:{dataLabels:{style:{fontSize:t+"px"}}}}})}})),c.default.createElement(f.FormItem,{label:"字体颜色"},c.default.createElement(f.ColorPickerInput,{value:t.plotOptions.series.dataLabels.style.color,onChange:function(t){return e.updateOptions({plotOptions:{series:{dataLabels:{style:{color:t}}}}})}})),c.default.createElement(f.FormItem,{label:"位置"},c.default.createElement(f.RadioBooleanGroup,{value:t.plotOptions.series.dataLabels.inside,trueLabel:"内部",falseLabel:"外部",onChange:function(t){return e.updateOptions({plotOptions:{series:{dataLabels:{inside:t.target.value}}}})}}))),c.default.createElement(f.FormItemGroup,{title:"标签连接线"},c.default.createElement(f.FormItem,{label:"线宽"},c.default.createElement(f.InputNumber,{value:t.plotOptions.series.dataLabels.connectorWidth,min:0,onChange:function(t){return e.updateOptions({plotOptions:{series:{dataLabels:{connectorWidth:t}}}})}})),c.default.createElement(f.FormItem,{label:"颜色"},c.default.createElement(f.ColorPickerInput,{value:t.plotOptions.series.dataLabels.connectorColor,onChange:function(t){return e.updateOptions({plotOptions:{series:{dataLabels:{connectorColor:t}}}})}})),c.default.createElement(f.FormItem,{label:"与标签距离",cols:[9,15]},c.default.createElement(f.InputNumber,{value:t.plotOptions.series.dataLabels.connectorPadding,onChange:function(t){return e.updateOptions({plotOptions:{series:{dataLabels:{connectorPadding:t}}}})}})),c.default.createElement(f.FormItem,{label:"与饼图距离",cols:[9,15]},c.default.createElement(f.InputNumber,{value:t.plotOptions.series.dataLabels.distance,onChange:function(t){return e.updateOptions({plotOptions:{series:{dataLabels:{distance:t}}}})}}))),c.default.createElement(f.FormItemGroup,{title:"边框"},c.default.createElement(f.FormItem,{label:"宽度"},c.default.createElement(f.InputNumber,{value:t.plotOptions.series.borderWidth,min:0,onChange:function(t){return e.updateOptions({plotOptions:{series:{borderWidth:t}}})}})),c.default.createElement(f.FormItem,{label:"颜色"},c.default.createElement(f.ColorPickerInput,{value:t.plotOptions.series.borderColor,onChange:function(t){return e.updateOptions({plotOptions:{series:{borderColor:t}}})}}))))}}]),t}(p.default);t.default=m},206:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}var a=n(8),l=n(182),o=r(l),u=n(68),i=r(u);(0,a.registerComponentOptionsSetting)("system/hchart-pie",o.default),/**
                                                                                        * @description 注册组件的设置面板
                                                                                        * @author vision <vision.shi@tianjishuju.com>
                                                                                        * @license www.tianjishuju.com/license
                                                                                        */
(0,a.registerComponentDataSetting)("system/hchart-pie",i.default),(0,a.registerComponentEvents)("system/hchart-pie",{pointSelect:"扇形被选中"})},3:function(e,t){e.exports=dv.adapter._},33:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=n(5),s=r(c),p=n(11),f=r(p),d=n(6),m=n(3),b=n(34),h=r(b),v=function(e){function t(){return l(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return u(t,e),i(t,[{key:"getTabs",value:function(){var e=this;return{chart:{label:"图表区",content:function(){return e.renderChart()}},title:{label:"标题",content:function(){return e.renderTitle()}},legend:{label:"图例",content:function(){return e.renderLegend()}},toolbox:{label:"提示框",content:function(){return e.renderTooltip()}},graph:{label:"线图",content:function(){return e.renderGraph()}},xAxis:{label:"X轴",content:function(){return e.renderXAxis()}},yAxis:{label:"Y轴",content:function(){return e.renderYAxis()}}}}},{key:"renderChart",value:function(){var e=this,t=this.props.options;return s.default.createElement(d.Form,null,s.default.createElement(d.FormItemGroup,{title:"边距"},(0,m.map)({spacingTop:"上边距",spacingBottom:"下边距",spacingLeft:"左边距",spacingRight:"右边距"},function(n,r){return s.default.createElement(d.FormItem,{label:n,key:r},s.default.createElement(d.InputNumber,{value:t.chart[r],onChange:function(t){return e.updateOptions({chart:a({},r,t)})}}))})))}},{key:"renderTitle",value:function(){var e=this,t=this.props.options;return s.default.createElement(d.Form,null,s.default.createElement(d.FormItemGroup,{title:"主标题"},s.default.createElement(d.FormItem,{label:"显示",style:{marginBottom:0}},s.default.createElement(d.RadioBooleanGroup,{value:t.title.enabled,onChange:function(t){return e.updateOptions({title:{enabled:t.target.value}})}})),s.default.createElement(d.FormItem,null,s.default.createElement(d.Input,{placeholder:"标题名称",value:t.title.text,onChange:function(t){return e.updateOptions({title:{text:t.target.value}})}})),s.default.createElement(d.FormItem,{label:"字体大小"},s.default.createElement(d.InputNumber,{value:(0,m.parseInt)(t.title.style.fontSize),min:12,onChange:function(t){return e.updateOptions({title:{style:{fontSize:t+"px"}}})}})),s.default.createElement(d.FormItem,{label:"字体颜色"},s.default.createElement(d.ColorPickerInput,{value:t.title.style.color,onChange:function(t){return e.updateOptions({title:{style:{color:t}}})}})),s.default.createElement(d.FormItem,{label:"位置",cols:[6,18],full:!0},s.default.createElement(d.RadioGroup,{value:t.title.align,onChange:function(t){return e.updateOptions({title:{align:t.target.value}})}},s.default.createElement(d.Radio,{value:"left"},"居左"),s.default.createElement(d.Radio,{value:"center"},"居中"),s.default.createElement(d.Radio,{value:"right"},"居右"))),s.default.createElement(d.FormItem,{label:"偏移量"},s.default.createElement(d.InputNumber,{value:t.title.x,onChange:function(t){return e.updateOptions({title:{x:t}})}}))),s.default.createElement(d.FormItemGroup,{title:"副标题"},s.default.createElement(d.FormItem,{label:"显示",style:{marginBottom:0}},s.default.createElement(d.RadioBooleanGroup,{value:t.subtitle.enabled,onChange:function(t){return e.updateOptions({subtitle:{enabled:t.target.value}})}})),s.default.createElement(d.FormItem,null,s.default.createElement(d.Input,{placeholder:"标题名称",value:t.subtitle.text,onChange:function(t){return e.updateOptions({subtitle:{text:t.target.value}})}})),s.default.createElement(d.FormItem,{label:"字体大小"},s.default.createElement(d.InputNumber,{value:(0,m.parseInt)(t.subtitle.style.fontSize),min:12,onChange:function(t){return e.updateOptions({subtitle:{style:{fontSize:t+"px"}}})}})),s.default.createElement(d.FormItem,{label:"字体颜色"},s.default.createElement(d.ColorPickerInput,{value:t.subtitle.style.color,onChange:function(t){return e.updateOptions({subtitle:{style:{color:t}}})}})),s.default.createElement(d.FormItem,{label:"位置",cols:[6,18],full:!0},s.default.createElement(d.RadioGroup,{value:t.subtitle.align,onChange:function(t){return e.updateOptions({subtitle:{align:t.target.value}})}},s.default.createElement(d.Radio,{value:"left"},"居左"),s.default.createElement(d.Radio,{value:"center"},"居中"),s.default.createElement(d.Radio,{value:"right"},"居右"))),s.default.createElement(d.FormItem,{label:"偏移量"},s.default.createElement(d.InputNumber,{value:t.subtitle.x,onChange:function(t){return e.updateOptions({subtitle:{x:t}})}}))))}},{key:"renderLegend",value:function(){var e=this,t=this.props.options;return s.default.createElement(d.Form,null,s.default.createElement(d.FormItemGroup,{title:"基本属性"},s.default.createElement(d.FormItem,{label:"显示"},s.default.createElement(d.RadioBooleanGroup,{value:t.legend.enabled,onChange:function(t){return e.updateOptions({legend:{enabled:t.target.value}})}})),s.default.createElement(d.FormItem,{label:"浮动"},s.default.createElement(d.RadioBooleanGroup,{value:t.legend.floating,onChange:function(t){return e.updateOptions({legend:{floating:t.target.value}})}})),s.default.createElement(d.FormItem,{label:"布局"},s.default.createElement(d.RadioGroup,{value:t.legend.layout,onChange:function(t){return e.updateOptions({legend:{layout:t.target.value}})}},s.default.createElement(d.Radio,{value:"horizontal"},"水平"),s.default.createElement(d.Radio,{value:"vertical"},"垂直"))),s.default.createElement(d.FormItem,{label:"位置"},s.default.createElement(h.default,{value:t.legend.verticalAlign+"-"+t.legend.align,onChange:function(t){var n=(0,m.split)(t,"-");e.updateOptions({legend:{verticalAlign:n[0],align:n[1]}})}}))),s.default.createElement(d.FormItemGroup,{title:"偏移量"},s.default.createElement(d.FormItem,{label:"水平"},s.default.createElement(d.InputNumber,{value:t.legend.x,onChange:function(t){return e.updateOptions({legend:{x:t}})}})),s.default.createElement(d.FormItem,{label:"垂直"},s.default.createElement(d.InputNumber,{value:t.legend.y,onChange:function(t){return e.updateOptions({legend:{y:t}})}}))),s.default.createElement(d.FormItemGroup,{title:"图例间距"},s.default.createElement(d.FormItem,{label:"间距"},s.default.createElement(d.InputNumber,{value:t.legend.itemDistance,onChange:function(t){return e.updateOptions({legend:{itemDistance:t}})}}))),s.default.createElement(d.FormItemGroup,{title:"字体"},s.default.createElement(d.FormItem,{label:"大小"},s.default.createElement(d.InputNumber,{value:(0,m.parseInt)(t.legend.itemStyle.fontSize),min:12,onChange:function(t){return e.updateOptions({legend:{itemStyle:{fontSize:t+"px"}}})}})),s.default.createElement(d.FormItem,{label:"颜色"},s.default.createElement(d.ColorPickerInput,{value:t.legend.itemStyle.color,onChange:function(t){return e.updateOptions({legend:{itemStyle:{color:t}}})}}))))}},{key:"renderTooltip",value:function(){var e=this,t=this.props.options;return s.default.createElement(d.Form,null,s.default.createElement(d.FormItemGroup,{title:"基本属性"},s.default.createElement(d.FormItem,{label:"显示"},s.default.createElement(d.RadioBooleanGroup,{value:t.tooltip.enabled,onChange:function(t){return e.updateOptions({tooltip:{enabled:t.target.value}})}}))),s.default.createElement(d.FormItemGroup,{title:"内容"},s.default.createElement(d.FormItem,{label:"前缀"},s.default.createElement(d.Input,{value:t.tooltip.valuePrefix,onChange:function(t){return e.updateOptions({tooltip:{valuePrefix:t.target.value}})}})),s.default.createElement(d.FormItem,{label:"后缀"},s.default.createElement(d.Input,{value:t.tooltip.valueSuffix,onChange:function(t){return e.updateOptions({tooltip:{valueSuffix:t.target.value}})}})),s.default.createElement(d.FormItem,{label:"小数位数"},s.default.createElement(d.InputNumber,{value:t.tooltip.valueDecimals,min:-1,onChange:function(t){return e.updateOptions({tooltip:{valueDecimals:t}})}}))))}},{key:"renderGraph",value:function(){var e=this,t=this.props.options;return s.default.createElement(d.Form,null,s.default.createElement(d.FormItemGroup,{title:"数值标签"},s.default.createElement(d.FormItem,{label:"显示"},s.default.createElement(d.RadioBooleanGroup,{value:t.plotOptions.series.dataLabels.enabled,onChange:function(t){return e.updateOptions({plotOptions:{series:{dataLabels:{enabled:t.target.value}}}})}})),s.default.createElement(d.FormItem,{label:"字体大小"},s.default.createElement(d.InputNumber,{value:(0,m.parseInt)(t.plotOptions.series.dataLabels.style.fontSize),min:12,onChange:function(t){return e.updateOptions({plotOptions:{series:{dataLabels:{style:{fontSize:t+"px"}}}}})}})),s.default.createElement(d.FormItem,{label:"字体颜色"},s.default.createElement(d.ColorPickerInput,{value:t.plotOptions.series.dataLabels.style.color,onChange:function(t){return e.updateOptions({plotOptions:{series:{dataLabels:{style:{color:t}}}}})}}))),s.default.createElement(d.FormItemGroup,{title:"线图类型"},s.default.createElement(d.FormItem,null,s.default.createElement(d.RadioGroup,{value:t.chart.type,onChange:function(t){return e.updateOptions({chart:{type:t.target.value}})}},s.default.createElement(d.Radio,{value:"line"},"折线"),s.default.createElement(d.Radio,{value:"spline"},"曲线")))),s.default.createElement(d.FormItemGroup,{title:"翻转坐标轴"},s.default.createElement(d.FormItem,null,s.default.createElement(d.RadioBooleanGroup,{value:t.chart.inverted,onChange:function(t){return e.updateOptions({chart:{inverted:t.target.value}})}}))))}},{key:"renderXAxis",value:function(){var e=this,t=this.props.options;return s.default.createElement(d.Form,null,s.default.createElement(d.FormItemGroup,{title:"标题"},s.default.createElement(d.FormItem,{label:"显示",style:{marginBottom:0}},s.default.createElement(d.RadioBooleanGroup,{value:t.xAxis.title.enabled,onChange:function(t){return e.updateOptions({xAxis:{title:{enabled:t.target.value}}})}})),s.default.createElement(d.FormItem,null,s.default.createElement(d.Input,{placeholder:"标题名称",value:t.xAxis.title.text,onChange:function(t){return e.updateOptions({xAxis:{title:{text:t.target.value}}})}})),s.default.createElement(d.FormItem,{label:"字体大小"},s.default.createElement(d.InputNumber,{value:(0,m.parseInt)(t.xAxis.title.style.fontSize),min:12,onChange:function(t){return e.updateOptions({xAxis:{title:{style:{fontSize:t+"px"}}}})}})),s.default.createElement(d.FormItem,{label:"字体颜色"},s.default.createElement(d.ColorPickerInput,{value:t.xAxis.title.style.color,onChange:function(t){return e.updateOptions({xAxis:{title:{style:{color:t}}}})}}))),s.default.createElement(d.FormItemGroup,{title:"标签"},s.default.createElement(d.FormItem,{label:"显示",style:{marginBottom:0}},s.default.createElement(d.RadioBooleanGroup,{value:t.xAxis.labels.enabled,onChange:function(t){return e.updateOptions({xAxis:{labels:{enabled:t.target.value}}})}})),s.default.createElement(d.FormItem,{label:"字体大小"},s.default.createElement(d.InputNumber,{value:(0,m.parseInt)(t.xAxis.labels.style.fontSize),min:12,onChange:function(t){return e.updateOptions({xAxis:{labels:{style:{fontSize:t+"px"}}}})}})),s.default.createElement(d.FormItem,{label:"字体颜色"},s.default.createElement(d.ColorPickerInput,{value:t.xAxis.title.style.color,onChange:function(t){return e.updateOptions({xAxis:{labels:{style:{color:t}}}})}}))),s.default.createElement(d.FormItemGroup,{title:"轴线"},s.default.createElement(d.FormItem,{label:"线宽"},s.default.createElement(d.InputNumber,{value:t.xAxis.lineWidth,min:0,onChange:function(t){return e.updateOptions({xAxis:{lineWidth:t}})}})),s.default.createElement(d.FormItem,{label:"颜色"},s.default.createElement(d.ColorPickerInput,{value:t.xAxis.lineColor,onChange:function(t){return e.updateOptions({xAxis:{lineColor:t}})}}))),s.default.createElement(d.FormItemGroup,{title:"刻度线"},s.default.createElement(d.FormItem,{label:"长度"},s.default.createElement(d.InputNumber,{value:t.xAxis.tickLength,min:0,onChange:function(t){return e.updateOptions({xAxis:{tickLength:t}})}})),s.default.createElement(d.FormItem,{label:"宽度"},s.default.createElement(d.InputNumber,{value:t.xAxis.tickWidth,min:0,onChange:function(t){return e.updateOptions({xAxis:{tickWidth:t}})}})),s.default.createElement(d.FormItem,{label:"颜色"},s.default.createElement(d.ColorPickerInput,{value:t.xAxis.tickColor,onChange:function(t){return e.updateOptions({xAxis:{tickColor:t}})}}))),s.default.createElement(d.FormItemGroup,{title:"网格线"},s.default.createElement(d.FormItem,{label:"宽度"},s.default.createElement(d.InputNumber,{value:t.xAxis.gridLineWidth,min:0,onChange:function(t){return e.updateOptions({xAxis:{gridLineWidth:t}})}})),s.default.createElement(d.FormItem,{label:"颜色"},s.default.createElement(d.ColorPickerInput,{value:t.xAxis.gridLineColor,onChange:function(t){return e.updateOptions({xAxis:{gridLineColor:t}})}})),s.default.createElement(d.FormItem,{label:"类型"},s.default.createElement(d.RadioGroup,{value:t.xAxis.gridLineDashStyle,onChange:function(t){return e.updateOptions({xAxis:{gridLineDashStyle:t.target.value}})}},s.default.createElement(d.Radio,{value:"solid"},"实线"),s.default.createElement(d.Radio,{value:"dash"},"虚线")))))}},{key:"renderYAxis",value:function(){var e=this,t=this.props.options;return s.default.createElement(d.Form,null,s.default.createElement(d.FormItemGroup,{title:"标题"},s.default.createElement(d.FormItem,{label:"显示",style:{marginBottom:0}},s.default.createElement(d.RadioBooleanGroup,{value:t.yAxis.title.enabled,onChange:function(t){return e.updateOptions({yAxis:{title:{enabled:t.target.value}}})}})),s.default.createElement(d.FormItem,null,s.default.createElement(d.Input,{placeholder:"标题名称",value:t.yAxis.title.text,onChange:function(t){return e.updateOptions({yAxis:{title:{text:t.target.value}}})}})),s.default.createElement(d.FormItem,{label:"字体大小"},s.default.createElement(d.InputNumber,{value:(0,m.parseInt)(t.yAxis.title.style.fontSize),min:12,onChange:function(t){return e.updateOptions({yAxis:{title:{style:{fontSize:t+"px"}}}})}})),s.default.createElement(d.FormItem,{label:"字体颜色"},s.default.createElement(d.ColorPickerInput,{value:t.yAxis.title.style.color,onChange:function(t){return e.updateOptions({yAxis:{title:{style:{color:t}}}})}}))),s.default.createElement(d.FormItemGroup,{title:"标签"},s.default.createElement(d.FormItem,{label:"显示",style:{marginBottom:0}},s.default.createElement(d.RadioBooleanGroup,{value:t.yAxis.labels.enabled,onChange:function(t){return e.updateOptions({yAxis:{labels:{enabled:t.target.value}}})}})),s.default.createElement(d.FormItem,{label:"字体大小"},s.default.createElement(d.InputNumber,{value:(0,m.parseInt)(t.yAxis.labels.style.fontSize),min:12,onChange:function(t){return e.updateOptions({yAxis:{labels:{style:{fontSize:t+"px"}}}})}})),s.default.createElement(d.FormItem,{label:"字体颜色"},s.default.createElement(d.ColorPickerInput,{value:t.yAxis.title.style.color,onChange:function(t){return e.updateOptions({yAxis:{labels:{style:{color:t}}}})}})),s.default.createElement(d.FormItem,{label:"最大值"},s.default.createElement(d.InputNumber,{nullable:!0,value:t.yAxis.max,onChange:function(t){return e.updateOptions({yAxis:{max:t}})}})),s.default.createElement(d.FormItem,{label:"最小值"},s.default.createElement(d.InputNumber,{nullable:!0,value:t.yAxis.min,onChange:function(t){return e.updateOptions({yAxis:{min:t}})}})),s.default.createElement(d.FormItem,{label:"允许小数"},s.default.createElement(d.RadioBooleanGroup,{value:t.yAxis.allowDecimals,onChange:function(t){return e.updateOptions({yAxis:{allowDecimals:t.target.value}})}}))),s.default.createElement(d.FormItemGroup,{title:"轴线"},s.default.createElement(d.FormItem,{label:"线宽"},s.default.createElement(d.InputNumber,{value:t.yAxis.lineWidth,min:0,onChange:function(t){return e.updateOptions({yAxis:{lineWidth:t}})}})),s.default.createElement(d.FormItem,{label:"颜色"},s.default.createElement(d.ColorPickerInput,{value:t.yAxis.lineColor,onChange:function(t){return e.updateOptions({yAxis:{lineColor:t}})}}))),s.default.createElement(d.FormItemGroup,{title:"刻度线"},s.default.createElement(d.FormItem,{label:"长度"},s.default.createElement(d.InputNumber,{value:t.yAxis.tickLength,min:0,onChange:function(t){return e.updateOptions({yAxis:{tickLength:t}})}})),s.default.createElement(d.FormItem,{label:"宽度"},s.default.createElement(d.InputNumber,{value:t.yAxis.tickWidth,min:0,onChange:function(t){return e.updateOptions({yAxis:{tickWidth:t}})}})),s.default.createElement(d.FormItem,{label:"颜色"},s.default.createElement(d.ColorPickerInput,{value:t.yAxis.tickColor,onChange:function(t){return e.updateOptions({yAxis:{tickColor:t}})}}))),s.default.createElement(d.FormItemGroup,{title:"网格线"},s.default.createElement(d.FormItem,{label:"宽度"},s.default.createElement(d.InputNumber,{value:t.yAxis.gridLineWidth,min:0,onChange:function(t){return e.updateOptions({yAxis:{gridLineWidth:t}})}})),s.default.createElement(d.FormItem,{label:"颜色"},s.default.createElement(d.ColorPickerInput,{value:t.xAxis.gridLineColor,onChange:function(t){return e.updateOptions({xAxis:{gridLineColor:t}})}})),s.default.createElement(d.FormItem,{label:"类型"},s.default.createElement(d.RadioGroup,{value:t.yAxis.gridLineDashStyle,onChange:function(t){return e.updateOptions({yAxis:{gridLineDashStyle:t.target.value}})}},s.default.createElement(d.Radio,{value:"solid"},"实线"),s.default.createElement(d.Radio,{value:"dash"},"虚线")))))}}]),t}(d.ComponentOptionsSetting);v.propTypes={options:f.default.object.isRequired,updateOptions:f.default.func.isRequired},t.default=v},34:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n(5),c=r(i),s=n(11),p=r(s),f=n(6),d=n(3);n(37);/**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @description
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author vision <vision.shi@tianjishuju.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @license www.tianjishuju.com/license
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
var m=function(e){function t(){return a(this,t),l(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return o(t,e),u(t,[{key:"render",value:function(){var e=this.props,t=e.value,n=e.onChange,r=e.showCenter;return c.default.createElement(f.RadioGroup,{value:t,onChange:function(e){return n(e.target.value)},className:(0,d.classNames)("position-selection",{"no-center":!r})},c.default.createElement(f.Radio,{value:"top-left"}),c.default.createElement(f.Radio,{value:"top-center"}),c.default.createElement(f.Radio,{value:"top-right"}),c.default.createElement(f.Radio,{value:"middle-left"}),c.default.createElement(f.Radio,{value:"middle-center"}),c.default.createElement(f.Radio,{value:"middle-right"}),c.default.createElement(f.Radio,{value:"bottom-left"}),c.default.createElement(f.Radio,{value:"bottom-center"}),c.default.createElement(f.Radio,{value:"bottom-right"}),c.default.createElement("div",{className:"position-selection-connector"},c.default.createElement("div",{className:"position-selection-connector-horizontal"}),c.default.createElement("div",{className:"position-selection-connector-vertical"})))}}]),t}(i.Component);m.propTypes={value:p.default.string,onChange:p.default.func,showCenter:p.default.bool},m.defaultProps={value:null,onChange:d.noop,showCenter:!1},t.default=m},35:function(e,t,n){t=e.exports=n(36)(void 0),t.push([e.i,".position-selection{width:81px;margin-left:-4px}.position-selection .ant-radio-wrapper{width:23px;text-align:center;z-index:2}.position-selection .position-selection-connector{border:1px solid #ccc;position:absolute;width:56px;height:66px;top:0;left:0;margin:15px 6px;z-index:1}.position-selection .position-selection-connector .position-selection-connector-vertical{width:1px;position:absolute;top:0;left:50%;height:100%;background-color:#ccc}.position-selection .position-selection-connector .position-selection-connector-horizontal{height:1px;position:absolute;left:0;top:50%;width:100%;background-color:#ccc}.position-selection.no-center .ant-radio-wrapper:nth-child(5){opacity:0;pointer-events:none}.position-selection.no-center .position-selection-connector .position-selection-connector-horizontal,.position-selection.no-center .position-selection-connector .position-selection-connector-vertical{display:none}",""])},36:function(e,t){function n(e,t){var n=e[1]||"",a=e[3];if(!a)return n;if(t&&"function"==typeof btoa){var l=r(a);return[n].concat(a.sources.map(function(e){return"/*# sourceURL="+a.sourceRoot+e+" */"})).concat([l]).join("\n")}return[n].join("\n")}function r(e){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(e))))+" */"}e.exports=function(e){var t=[];return t.toString=function(){return this.map(function(t){var r=n(t,e);return t[2]?"@media "+t[2]+"{"+r+"}":r}).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var r={},a=0;a<this.length;a++){var l=this[a][0];"number"==typeof l&&(r[l]=!0)}for(a=0;a<e.length;a++){var o=e[a];"number"==typeof o[0]&&r[o[0]]||(n&&!o[2]?o[2]=n:n&&(o[2]="("+o[2]+") and ("+n+")"),t.push(o))}},t}},37:function(e,t,n){var r=n(39);e.exports="string"==typeof r?r:r.toString()},39:function(e,t,n){var r=n(35);"string"==typeof r&&(r=[[e.i,r,""]]);var a={};a.transform=void 0;n(40)(r,a);r.locals&&(e.exports=r.locals)},40:function(e,t,n){function r(e,t){for(var n=0;n<e.length;n++){var r=e[n],a=m[r.id];if(a){a.refs++;for(var l=0;l<a.parts.length;l++)a.parts[l](r.parts[l]);for(;l<r.parts.length;l++)a.parts.push(s(r.parts[l],t))}else{for(var o=[],l=0;l<r.parts.length;l++)o.push(s(r.parts[l],t));m[r.id]={id:r.id,refs:1,parts:o}}}}function a(e,t){for(var n=[],r={},a=0;a<e.length;a++){var l=e[a],o=t.base?l[0]+t.base:l[0],u=l[1],i=l[2],c=l[3],s={css:u,media:i,sourceMap:c};r[o]?r[o].parts.push(s):n.push(r[o]={id:o,parts:[s]})}return n}function l(e,t){var n=h(e.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var r=E[E.length-1];if("top"===e.insertAt)r?r.nextSibling?n.insertBefore(t,r.nextSibling):n.appendChild(t):n.insertBefore(t,n.firstChild),E.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(t)}}function o(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=E.indexOf(e);t>=0&&E.splice(t,1)}function u(e){var t=document.createElement("style");return e.attrs.type="text/css",c(t,e.attrs),l(e,t),t}function i(e){var t=document.createElement("link");return e.attrs.type="text/css",e.attrs.rel="stylesheet",c(t,e.attrs),l(e,t),t}function c(e,t){Object.keys(t).forEach(function(n){e.setAttribute(n,t[n])})}function s(e,t){var n,r,a,l;if(t.transform&&e.css){if(!(l=t.transform(e.css)))return function(){};e.css=l}if(t.singleton){var c=g++;n=v||(v=u(t)),r=p.bind(null,n,c,!1),a=p.bind(null,n,c,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=i(t),r=d.bind(null,n,t),a=function(){o(n),n.href&&URL.revokeObjectURL(n.href)}):(n=u(t),r=f.bind(null,n),a=function(){o(n)});return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else a()}}function p(e,t,n,r){var a=n?"":r.css;if(e.styleSheet)e.styleSheet.cssText=x(t,a);else{var l=document.createTextNode(a),o=e.childNodes;o[t]&&e.removeChild(o[t]),o.length?e.insertBefore(l,o[t]):e.appendChild(l)}}function f(e,t){var n=t.css,r=t.media;if(r&&e.setAttribute("media",r),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}function d(e,t,n){var r=n.css,a=n.sourceMap,l=void 0===t.convertToAbsoluteUrls&&a;(t.convertToAbsoluteUrls||l)&&(r=y(r)),a&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(a))))+" */");var o=new Blob([r],{type:"text/css"}),u=e.href;e.href=URL.createObjectURL(o),u&&URL.revokeObjectURL(u)}var m={},b=function(e){var t;return function(){return void 0===t&&(t=e.apply(this,arguments)),t}}(function(){return window&&document&&document.all&&!window.atob}),h=function(e){var t={};return function(n){return void 0===t[n]&&(t[n]=e.call(this,n)),t[n]}}(function(e){return document.querySelector(e)}),v=null,g=0,E=[],y=n(41);e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");t=t||{},t.attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||(t.singleton=b()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var n=a(e,t);return r(n,t),function(e){for(var l=[],o=0;o<n.length;o++){var u=n[o],i=m[u.id];i.refs--,l.push(i)}if(e){r(a(e,t),t)}for(var o=0;o<l.length;o++){var i=l[o];if(0===i.refs){for(var c=0;c<i.parts.length;c++)i.parts[c]();delete m[i.id]}}}};var x=function(){var e=[];return function(t,n){return e[t]=n,e.filter(Boolean).join("\n")}}()},41:function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var n=t.protocol+"//"+t.host,r=n+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(e,t){var a=t.trim().replace(/^"(.*)"$/,function(e,t){return t}).replace(/^'(.*)'$/,function(e,t){return t});if(/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(a))return e;var l;return l=0===a.indexOf("//")?a:0===a.indexOf("/")?n+a:r+a.replace(/^\.\//,""),"url("+JSON.stringify(l)+")"})}},5:function(e,t){e.exports=React},6:function(e,t){e.exports=dvEditorAdapter.templates},68:function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(5),i=function(e){return e&&e.__esModule?e:{default:e}}(u),c=n(6),s=n(3),p=function(e){function t(){return r(this,t),a(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return l(t,e),o(t,[{key:"render",value:function(){var e=this,t=this.props,n=t.fields,r=t.config,a=r.mapping||{},l=r.metrics||[];return i.default.createElement("div",null,i.default.createElement(c.FormItem,{label:"维度",full:!0},i.default.createElement(c.AutoComplete,{placeholder:"请输入或选择字段",dataSource:(0,s.map)(n,function(e){return e.value}),value:a.x,onChange:function(t){return e.updateConfig({mapping:{x:t}})}})),i.default.createElement(c.FormItem,{label:"指标",full:!0},i.default.createElement(c.Select,{placeholder:"请输入或选择字段",mode:"tags",value:l,onSelect:function(t){return e.updateConfig({metrics:(0,s.concat)(l,t)})},onDeselect:function(t){return e.updateConfig({metrics:(0,s.pull)(l,t)})}},(0,s.map)(n,function(e){return i.default.createElement(c.Option,{value:e.value,key:e.value},e.value)}))),i.default.createElement(c.FormItem,{label:"分组",full:!0},i.default.createElement(c.AutoComplete,{placeholder:"请输入或选择字段",dataSource:(0,s.map)(n,function(e){return e.value}),value:r.dimension,onChange:function(t){return e.updateConfig({dimension:t})}})))}}]),t}(c.ComponentDataSetting);t.default=p},8:function(e,t){e.exports=dvEditorAdapter}});