import React, { Component } from 'react'
import Echarts from './Base'
import echarts from 'echarts'
import 'echarts-liquidfill'
import { formatFunctionsToOption } from './utils';
import { recursionOptions, getGradientPreview } from '@cloudwise-fe/chart-panel'

export default class WaterWaveBall extends Component {
	constructor(props) {
		super(props)
		this.state = {
			echartOptions: {},
		}
	}

	componentDidMount() {
		this.addEventListener()
	}
	addEventListener = () => {
		const eventBus = this.props.parent
		if (eventBus) {
			console.log(this.echartsDome)
			eventBus.bind('resized', ({ width, height }) => {
				this.echartsDome.echartsAPI.resize({
					width,
					height,
				})
			})
		}
	}
	/**
	 * 更改水波纹数量和是否反向滚动的方法
	 */
	newWaterListFunc = (number = 1, value, waterDirection) => {
		const obj = []
		for (let i = 0; i < (number > 10 ? 10 : number < 0 ? 1 : number); i++) {
			obj.push({
				value,
				direction: waterDirection ? (i % 2 ? 'left' : 'right') : 'left',
			})
		}
		return obj
	}
	checkIsColorFunc = (bgVal) => {
		let type = ''
		if (/^rgb\(/.test(bgVal)) {
			//如果是rgb开头，200-249，250-255，0-199
			type =
				'^[rR][gG][Bb][(]([\\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)[\\s]*,){2}[\\s]*(2[0-4]\\d|25[0-5]|[01]?\\d\\d?)[\\s]*[)]{1}$'
		} else if (/^rgba\(/.test(bgVal)) {
			//如果是rgba开头，判断0-255:200-249，250-255，0-199 判断0-1：0 1 1.0 0.0-0.9
			type =
				'^[rR][gG][Bb][Aa][(]([\\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)[\\s]*,){3}[\\s]*(1|1.0|0|0.[0-9])[\\s]*[)]{1}$'
		} else if (/^#/.test(bgVal)) {
			//六位或者三位
			type = '^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$'
		} else if (/^hsl\(/.test(bgVal)) {
			//判断0-360 判断0-100%(0可以没有百分号)
			type =
				'^[hH][Ss][Ll][(]([\\s]*(2[0-9][0-9]|360｜3[0-5][0-9]|[01]?[0-9][0-9]?)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*)[)]$'
		} else if (/^hsla\(/.test(bgVal)) {
			type =
				'^[hH][Ss][Ll][Aa][(]([\\s]*(2[0-9][0-9]|360｜3[0-5][0-9]|[01]?[0-9][0-9]?)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*,){2}([\\s]*(1|1.0|0|0.[0-9])[\\s]*)[)]$'
		}
		let re = new RegExp(type)
		if (bgVal.match(re) == null) {
			return 'invalid'
		} else {
			return 'valid'
		}
	}
	/**
	 * 水波球渐变色
	 */
	DEAFULT_GET_BALL_COLOR = (color = '') => {
		if (typeof color !== 'string' || !color.split(',')[1]) {
			return color
		} else {
			if (this.checkIsColorFunc(color.split(',')[1]) !== 'valid') {
				return
			} else {
				return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
					{
						offset: 0,
						color: color.split(',')[0] || '',
					},
					{
						offset: 1,
						color: color.split(',')[1] || '',
					},
				])
			}
		}
	}

	safeEvalFormatter = (value, formatter) => {
		let result = ''
		try {
			result = formatter(value)
		} catch (e) {
			console.warn(e)
			result = ''
		}
		return result
	}

	render() {
		const { data = {}, ...options } = this.props

		let {
			outlineBorderColor = 'transparent',
			textShow, //是否显示数据
			valueTextStyle, //自定义文本样式
			nameTextStyle, //自定义文本样式
			ballShape, //整体形状
			ballBackgoundColor = '#13183000', //整体背景色
			waterNumber, //水波数量
			waterDirection, //水波是否反向
			waterColor, //水波颜色（支持渐变色）
			waterOpacity, //水波透明度
			waterShadowBlur, //水波阴影范围
			waterShadowColor, //水波阴影颜色
			waterSize, //水波大小
			outlineBorderWidth, //水波的轮廓
			outerRaceColor, //外环线颜色
			isOuterRaceShow, //外环线是否显示
			outerRaceWidth, //外环线宽度
      // progressColor,
      outerTickRadius, //刻度线宽度
      isOuterTickShow, //是否显示刻度线
      outerTickColor, //刻度线颜色
      outerTickSplitNum, //刻度分割段数
      outerTickLength, //刻度分割长度
      outerTickWidth, //刻度分割宽度
			textRectStyle = {}, // 矩阵信息
			formatterValue,
			formatterName,
      functions = {},
		} = recursionOptions(options || {}, true)
		let { value = 0, name = '' } =
			(Array.isArray(data) ? data[0] : data.data) || {}
		if (value == null) {
			value = 0
		}
    const formatFuntions = formatFunctionsToOption(functions);
    const realFormatterValue = formatFuntions.formatterValue || formatterValue;
    const realFormatterName = formatFuntions.formatterName || formatterName;
		let newWaterList = this.newWaterListFunc(
			waterNumber,
			(realFormatterValue(value) / 100).toFixed(3),
			waterDirection
		)
		let echartOptions = {
			series: [
				{
					type: 'liquidFill',
					itemStyle: {
						opacity: waterOpacity, //波浪的透明度
						shadowBlur: waterShadowBlur, //波浪的阴影范围
						shadowColor: waterShadowColor, //阴影颜色
					},
					radius: waterSize + '%',
					color: [this.DEAFULT_GET_BALL_COLOR(waterColor)], //水波
					data: newWaterList,
					center: ['50%', '50%'],
					radius: '65%',
					itemStyle: {
						color: this.DEAFULT_GET_BALL_COLOR(waterColor),
					},
					silent: true,
					emphasis: {
						itemStyle: {
							color: this.DEAFULT_GET_BALL_COLOR(waterColor),
						},
					},
					backgroundStyle: {
						color: '#131830',
					},
					label: {
						normal: {
							formatter: '',
						},
					},
					outline: {
						itemStyle: {
							borderColor: outlineBorderColor,
							borderWidth: outlineBorderWidth,
						},
						borderDistance: 0,
					},
				},
			],
		}
		console.log(isOuterTickShow,outerTickColor,outerTickWidth, 'isOuterTickShow')
		echartOptions.series.push(
			{
				type: 'pie',
				center: ['50%', '50%'],
				radius: outerRaceWidth,
				hoverAnimation: false,
				cursor: 'auto',
				tooltip: {
					show: false, //显示提示框
				},
				data: [
					{
						name: '',
						value: isOuterRaceShow ? realFormatterValue(value) : 0,
						label: {
							show: false,
						},
						labelLine: {
							show: false,
							position: 'center',
						},
						tooltip: {
							show: false, //显示提示框
						},
						itemStyle: {
							color: this.DEAFULT_GET_BALL_COLOR(waterColor) || {
								type: 'linear',
								x: 0,
								y: 0,
								x2: 1,
								y2: 0,
								colorStops: [
									{
										offset: 1,
										color: 'rgba(48, 151, 213, 1)',
									},
									{
										offset: 0,
										color: 'rgba(165, 229, 252, 1)',
									},
								],
							},
						},
					},
					{
						name: '',
						value: isOuterRaceShow ? 100 -  realFormatterValue(value) : 100,
						label: {
							show: false,
						},
						labelLine: {
							show: false,
						},
						tooltip: {
							show: false, //显示提示框
						},
						itemStyle: {
							color: isOuterRaceShow
								? outerRaceColor
								: 'transparent',
						},
					},
				],
			},
      {
				type: 'gauge',
				center: ['50%', '50%'],
				radius: outerTickRadius,
				startAngle: 0,
				endAngle: 359.999,
				splitNumber: outerTickSplitNum,
				// itemStyle: {
				// 	color: '#FD7347',
				// },
				pointer: {
					show: false,
				},
				axisLine: {
					show: false,
				},
				axisTick: {
					show: isOuterTickShow,
					// splitNumber: 2,
					distance: '-150',
					length: outerTickLength,
					lineStyle: {
						width: outerTickWidth,
						color: outerTickColor,
					},
				},
				splitLine: {
					show: false,
				},
				axisLabel: {
					show: false,
				},
				detail: {
					show: false,
				},
				data: [],
			},
		)
		console.log(echartOptions, realFormatterValue(value))

		/**
		 * 定义的水波球形状
		 */
		const ballShapeData = {
			theDefault: '',
			round: 'circle(40%)',
			aSquare: 'polygon(100% 100%, 100% 0%, 0% 0%, 0% 100%)',
			fourDiamond: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
			oneFour: 'ellipse(50% 50% at 10% 20%)',
		}
		const { top, left } = textRectStyle

		return (
			<div
				style={{
					clipPath: ballShapeData[ballShape],
					width: '100%',
					height: '100%',
          transition: 'all .3s',
					backgroundColor: ballBackgoundColor,
				}}
			>
				<Echarts
					height="100%"
					width="100%"
					type="liquidFill"
					options={echartOptions}
					ref={(ref) => {
						this.echartsDome = ref
					}}
				/>
				{textShow ? (
					<div
						style={{
							display: 'inline-block',
							width: 'max-content',
							maxWidth: '100%',
							position: 'absolute',
							top: '50%',
							left: '50%',
              transition: 'all .3s',
							transform: `translate(${left}, ${top})`,
							textAlign: 'center',
						}}
					>
						<span
							style={nameTextStyle}
							dangerouslySetInnerHTML={{
								__html: this.safeEvalFormatter(
									name,
									realFormatterName
								),
							}}
						/>
						<br />
						<span
							style={valueTextStyle}
							dangerouslySetInnerHTML={{
								__html: this.safeEvalFormatter(
									value,
									realFormatterValue
								),
							}}
						/>
					</div>
				) : null}
			</div>
		)
	}
}
