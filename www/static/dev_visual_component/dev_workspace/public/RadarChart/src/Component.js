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
import { GRID, TOOLTIP } from './Chart/theme'

class Chart extends Component {
	static propTypes = {
		/**
		 * @description 图例配置内容(层级较高, 可使用echarts的所有配置项)
		 * @default: auto
		 */
		options: PropTypes.object,
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
		 * @description 填充配置
		 * @default {}
		 */
		series: PropTypes.object,
		/**
		 * @description 所有函数配置保存
		 * @default {}
		 */
		functions: PropTypes.object,
		/**
		 * @description 坐标系配置
		 * @default {}
		 */
		radar: PropTypes.object,
		/**
		 * @description 透传图表实例(避规一下ref, ref的话还是透传当前的组件实例)
		 */
		forwardRef: PropTypes.func,
		/**
		 * @description 格式化Indicator数据
		 * @default transferData
		 */
		transferIndicatorData: PropTypes.func,
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
	batchOptions = (indicator, seriesData, props = this.props) => {
		let {
			title = {},
			transferSeriesData,
			transferIndicatorData,
			options = {},
			grid = {},
			legend = {},
			tooltip = {},
			radar = {},
			color,
			functions,
			parent,
			data,
			axisPointer = {},
			series: seriesExtra = {},
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
		const realTransferIndicatorData =
			formatFunctions.transferIndicatorData || transferIndicatorData
		const realTransferSeriesData =
			formatFunctions.transferSeriesData || transferSeriesData

		if (!indicator.length) {
			return {}
		}
		const formatIndicator = realTransferIndicatorData(indicator)
		const { series: extraSeries = {}, ...restOptions } = options
		// 必须设置雷达指示器
		if (!formatIndicator.length) {
			return {}
		}
		// 组装radar
		const radarConfig = {
			indicator: realTransferIndicatorData(indicator),
			...radar,
		}

		// 组装图形类型
		const { series = [], type } = generateSeriesAndLegend(
			realTransferSeriesData(seriesData)
		)
		let seriesConfig = []

		if (!type || [SERIESITEM.string, SERIESITEM.number].includes(type)) {
			const [extra = {}] = seriesExtra
			seriesConfig = {
				type: 'radar',
				data: series,
				areaStyle: {},
				...extraSeries,
				...extra,
			}
		} else if (type === SERIESITEM.object) {
			seriesConfig = [
				{
					type: 'radar',
					data: series.map((v) => {
						const extra = seriesExtra[v.name] || {}
						return {
							...v,
							areaStyle: {},
							value: v.data,
							...extraSeries,
							...extra,
						}
					}),
				},
			]
		}

		// 组装legend
		const legendConfig = {
			data: series.map((v) => v.name),
		}

		configOptions = {
			series: seriesConfig,
			title,
			legend: merge({}, legendConfig, legend),
			grid,
			tooltip,
			radar: radarConfig,
			axisPointer,
			...(color && color.length ? { color } : {}),
		}

		return merge(
			{},
			configOptions,
			formatFunctions,
			restOptions,
			restChartOptions,
      {
        useInstance
      }
		)
	}

	/**
	 * @description 计算当前图例样式
	 * @returns {{}}
	 */
	computedChartStyle = () => {
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
		console.log(options, this.chart.getOption())
		this.chart.dispose();
    this.init();
		setTimeout(() => {
      this.chart.setOption(options);
      console.log('useInstance', useInstance);
      useInstance(this.chart, this.props.parent);
    }, 500)
	}

	/**
	 * @description 增加事件总线
	 */
	addEventListener = () => {
		const eventBus = this.props.parent
		eventBus.bind('dataChange', (dataChange) => {
			const { indicator = [], data = [] } = transferDataSource(dataChange)
			const {useInstance, ...option} = this.batchOptions(indicator, data)
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
		const { indicator = [], data = [] } = transferDataSource(nextProps.data)
		const { useInstance, ...option } = this.batchOptions(indicator, data, nextProps)
		this.setOption(option, useInstance)
	}

	componentWillUnmount() {
		this.removeEventListener()
	}

	render() {
		const chartStyle = this.computedChartStyle()
		return <div style={chartStyle} ref={(ref) => (this.chartDOM = ref)}></div>
	}
}

const transferData = (data) => data

export default class ChartComponent extends ReactComponent {
	/**
	 * @description 默认选项(默认值 => defaultProps)
	 */
	static defaultOptions = {
		options: {},
		title: {},
		grid: GRID,
		legend: {},
		tooltip: TOOLTIP,
		series: {},
		radar: {},
		functions: {},
		axisPointer: {},
		series: {},
		functions: {},
		color: [],
		// 事件
		forwardRef: noop,
		transferIndicatorData: transferData,
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
				indicator: [
					{ name: '销售', max: 6500 },
					{ name: '管理', max: 16000 },
					{ name: '信息技术', max: 30000 },
					{ name: '客服', max: 38000 },
					{ name: '研发', max: 52000 },
					{ name: '市场', max: 25000 },
				],
				data: [
					{
						data: [4200, 3000, 20000, 35000, 50000, 18000],
						name: '预算分配',
					},
					{
						data: [5000, 14000, 28000, 26000, 42000, 21000],
						name: '实际开销',
					},
				],
			},
		}
	}

	getReactComponent() {
		return Chart
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
}
