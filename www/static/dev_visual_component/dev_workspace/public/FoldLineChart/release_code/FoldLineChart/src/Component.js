import React, { Component } from 'react'
import ReactComponent from 'data-vi/ReactComponent'

import PropTypes from 'prop-types'
import { merge, defaultsDeep } from 'data-vi/helpers'

import {
	noop,
	generateSeriesAndLegend,
	formatFunctionsToOption,
	transferDataSource,
} from './utils'
import { SERIESITEM, USEINSTANCEFUNCTION } from './constant'
import { recursionOptions } from '@cloudwise-fe/chart-panel'

import { initChart } from './Chart'
import { GRID, TOOLTIP, XAXIS, YAXIS } from './Chart/theme'

class FoldLineChart extends Component {
	static propTypes = {
		/**
		 * @description 图例配置内容(层级较高, 可使用echarts的所有配置项)
		 * @default: auto
		 */
		options: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
		/**
		 * @description 矩阵配置
		 * @default GRID
		 */
		grid: PropTypes.object,
		/**
		 * @description 图表标题
		 * @default ''
		 */
		title: PropTypes.object,
		/**
		 * @description 图例配置
		 * @default {}
		 */
		legend: PropTypes.object,
		/**
		 * @description 提示框配置
		 * @default {}
		 */
		tooltip: PropTypes.object,
		/**
		 * @description 指示器配置
		 * @default {}
		 */
		axisPointer: PropTypes.object,
		/**
		 * @description x轴配置
		 * @default {}
		 */
		xAxis: PropTypes.object,
		/**
		 * @description y轴配置
		 * @default {}
		 */
		yAxis: PropTypes.object,
		/**
		 * @description 所有函数配置保存
		 * @default {}
		 */
		functions: PropTypes.object,
		/**
		 * @description 透传图表实例(避规一下ref, ref的话还是透传当前的组件实例)
		 */
		forwardRef: PropTypes.func,
		/**
		 * @description 格式化xAxis数据
		 * @default transferData
		 */
		transferXAxisData: PropTypes.func,
		/**
		 * @description 格式化数据
		 * @default transferData
		 */
		transferSeriesData: PropTypes.func,
	}

	constructor(props) {
		super(props)

		this.addEventListener()
	}

	/**
	 * @description 图例DOM实例
	 */
	chartDOM = null
	/**
	 * @description 图表实例
	 */
	chart = null

	componentDidMount() {
		this.init()
	}

	/**
	 * @description 初始化图表
	 */
	init = () => {
		this.chart = initChart(this.chartDOM)
		this.props.forwardRef(this.getInstance())
	}

	/**
	 * @description 获取最终合并options(注意和飞鱼本身的options做区分)
	 * @returns {{[_: string]: any}}
	 */
	batchOptions = (xAxisData, seriesData, props = this.props) => {
		let {
			title = {},
			transferSeriesData,
			transferXAxisData,
			options = {},
			grid = {},
			legend = {},
			tooltip = {},
			axisPointer = {},
			xAxis = {},
			yAxis = {},
			color,
			functions,
			parent,
			data,
			series: propsSeries,
			useInstance,
			...restChartOptions
		} = recursionOptions(props, true)

		let configOptions = {}
		if (Object.prototype.toString.call(options) !== '[object Object]') {
			if (Object.prototype.toString.call(options) === '[object Function]') {
				// 新版的函数配置
				options = recursionOptions(options(), true)
			} else {
				console.warn('options is not a valid options')
				options = {}
			}
		}
		const formatFunctions = formatFunctionsToOption(functions)
		const realTransferXAxisData =
			formatFunctions.transferXAxisData || transferXAxisData
		const realTransferSeriesData =
			formatFunctions.transferSeriesData || transferSeriesData
		// 组装(x|yAxis)数据
		const xAxisConfig = {
			data: realTransferXAxisData(xAxisData),
			...xAxis,
		}

		// 组装图形类型
		const { series = [], type } = generateSeriesAndLegend(
			realTransferSeriesData(seriesData)
		)
		let seriesConfig = []
		if (!type || [SERIESITEM.string, SERIESITEM.number].includes(type)) {
			seriesConfig = {
				type: 'line',
				data: series,
				symbol: 'circle',
				symbolSize: 10,
				areaStyle: {
					opacity: 1,
				},
				...propsSeries,
			}
		} else if (type === SERIESITEM.object) {
			seriesConfig = series.map((v) => ({
				type: 'line',
				symbol: 'circle',
				symbolSize: 10,
				areaStyle: { opacity: 1 },
				...v,
				...propsSeries,
			}))
		}

		configOptions = {
			xAxis: xAxisConfig,
			yAxis,
			series: seriesConfig,
			title,
			legend,
			grid,
			tooltip,
			axisPointer,
			...(color && color.length ? { color } : {}),
		}

		return merge(
			{},
			configOptions,
			formatFunctions,
			options,
			restChartOptions,
			{
				useInstance,
			}
		)
	}

	/**
	 * @description 计算当前图例样式
	 * @returns {{}}
	 */
	computedBarChartStyle = () => {
		const { style = {} } = this.props

		return {
			width: '100%',
			height: '100%',
			...style,
		}
	}

	/**
	 * @description 外部获取图表实例以及DOM(暴露给外部去操作当前的实例, 不要滥用)
	 * @returns {{ current: echarts, container: HTMLDivElement }}
	 */
	getInstance = () => {
		return {
			current: this.chart,
			container: this.chartDOM,
		}
	}

	/**
	 * 暴露出Option API
	 * @param {[_: string]: any} options
	 * @returns
	 */
	setOption = (options, useInstance = USEINSTANCEFUNCTION) => {
		console.log('setOption', options, this.chart.getOption())
		this.chart.dispose()
		this.init()
		setTimeout(() => {
      this.chart.setOption(options);
      useInstance(this.chart, this.props.parent);
    }, 500)
	}

	/**
	 * @description 增加事件总线
	 */
	addEventListener = () => {
		const eventBus = this.props.parent
		eventBus.bind('dataChange', (changeData) => {
			const { xAxis = [], data = [] } = transferDataSource(changeData)
			const {useInstance, ...option} = this.batchOptions(xAxis, data)
			this.setOption(option, useInstance)
		})
		eventBus.bind('resized', ({ width, height }) => {
			this.chart.resize({
				width,
				height,
			})
		})
	}

	/**
	 * @description 注销事件总线
	 */
	removeEventListener = () => {
		const eventBus = this.props.parent
		eventBus.unbind('loaded')
		eventBus.unbind('resized')
	}

	componentWillReceiveProps(nextProps) {
		const { xAxis = [], data = [] } = transferDataSource(nextProps.data)
		const { useInstance, ...option } = this.batchOptions(xAxis, data, nextProps);
    console.log('nextProps', nextProps);
		this.setOption(option, useInstance);
	}

	componentWillUnmount() {
		this.removeEventListener()
	}

	render() {
		const chartStyle = this.computedBarChartStyle()
		return <div style={chartStyle} ref={(ref) => (this.chartDOM = ref)}></div>
	}
}

const transferData = (data) => data

export default class FoldLineChartComponent extends ReactComponent {
	/**
	 * @description 默认选项(默认值 => defaultProps)
	 */
	static defaultOptions = {
		options: {},
		title: {},
		grid: GRID,
		legend: {},
		tooltip: TOOLTIP,
		xAxis: XAXIS,
		yAxis: YAXIS,
		axisPointer: {},
		series: {},
		functions: {},
		color: [],
		// 事件
		forwardRef: noop,
		transferXAxisData: transferData,
		transferSeriesData: transferData,
    useInstance: USEINSTANCEFUNCTION
	}

	getDefaultConfig() {
		return {
			left: 534,
			top: 200,
			width: 450,
			height: 280,
			visible: true,
		}
	}

	getDefaultData() {
		return {
			data: {
				xAxis: [
					'1月',
					'2月',
					'3月',
					'4月',
					'5月',
					'6月',
					'7月',
					'8月',
					'9月',
					'10月',
					'11月',
					'12月',
				],
				data: [
					{
						name: '降水量',
						data: [150, 230, 224, 218, 135, 147, 260, 320, 230, 120, 240, 280],
					},
					{
						name: '降雨量',
						data: [50, 100, 230, 124, 118, 235, 347, 160, 120, 210, 180, 60],
					},
				],
			},
		}
	}

	setOptions(options = {}, merge = true) {
		const { replaceAll, ...mergeOptions } = options
		const replaceKeys = ['color']
		// 魔改一下部分结果处理
		if (replaceAll) {
			this.options = mergeOptions
		} else if (merge) {
			let cloneOption = defaultsDeep({}, mergeOptions, this.options)
			if (replaceKeys.find((v) => typeof mergeOptions[v] !== 'undefined')) {
				cloneOption = {
					...cloneOption,
					...mergeOptions,
				}
			}
			this.options = cloneOption
		} else {
			this.options = defaultsDeep({}, mergeOptions, this.getDefaultOptions())
		}

		// 渲染事件
		this.trigger('optionsChange', this.options)

		return this
	}

	getReactComponent() {
		return FoldLineChart
	}
}
