import ReactComponent from 'data-vi/ReactComponent'
import WaterWaveBall from './WaterWaveBall.js'
import { RECTSTYLE, VALUESTYLE, NAMESTYLE, formatter } from './constant/text'

export default class Index extends ReactComponent {
	// 默认配置
	getDefaultConfig() {
		return {
			left: 534,
			top: 200,
			width: 450,
			height: 280,
			visible: true,
		}
	}

	// 默认选项
	static defaultOptions = {
		textShow: true,
		textValue: '水波球',
		textCustom: false,
		textFontSize: 24,
		ballShape: 'theDefault',
		waterColor: {
			type: 'linear',
			x: 0,
			y: 0,
			x2: 0,
			y2: 1,
			colorStops: [
				{
					offset: 0,
					color: '#57E9FC',
				},
				{
					offset: 1,
					color: '#8045F8',
				},
			],
		},
		waterOpacity: 0.8,
		waterShadowBlur: 10,
		waterShadowColor: '#FFB931',
		waterSize: 100,
		waterNumber: 1,
		waterDirection: false,
		isOuterRaceShow: true,
		isOuterTickShow: true,
		textTop: '40%',
		textColor: '#70f4f8',
		nameTextStyle: NAMESTYLE,
		valueTextStyle: VALUESTYLE,
		textRectStyle: RECTSTYLE,
		textLocation: 'center',
		outerRaceColor: '#1f3343',
		outlineBorderWidth: 10,
		outerRaceWidth: ['70%', '80%'],
		outerTickRadius: '100%',
		outerTickColor: '#182a40',
		outerTickSplitNum: 3,
		outerTickLength: 15,
		outerTickWidth: 30,
		// progressColor: '#A1E2FA,#3097D5',
		formatterValue: formatter,
		formatterName: formatter,
		functions: {},
	}
	// 系统事件
	static events = {}
	// 是否加载css文件 如当前组件没有样式文件，设置为false
	static enableLoadCssFile = false
	getDefaultData() {
		return {
			data: {
				value: 75,
				name: '消费水平',
			},
		}
	}
	getReactComponent() {
		return WaterWaveBall
	}
}
