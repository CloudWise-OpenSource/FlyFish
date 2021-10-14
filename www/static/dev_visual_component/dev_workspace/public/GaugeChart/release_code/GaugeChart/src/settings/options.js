import React from 'react'
import { ComponentOptionsSetting } from 'datavi-editor/templates'
import { merge } from 'data-vi/helpers'
import { initOptions } from '../Chart'
import { formatFunctionsToOption, transferDataSource } from '../utils'
import {
	Rect,
  recursionOptions,
	TitleArea,
	Legend,
	Tooltip,
  Title,
	GaugeSeries,
	AxisLabel,
	AxisLine,
	AxisTick,
	Progress,
	SplitLine,
	Pointer,
  Anchor,
	DetailTitle,
  Options,
	Data,
} from '@cloudwise-fe/chart-panel'

export default class OptionsSetting extends ComponentOptionsSetting {
	enableLoadCssFile = true

	constructor(props) {
		super(props)
		let options = props.options
		this.state = {
			title: options.title,
			style: options.style,
		}
	}

	updateOptionsByKey = (options, key) => {
		let finallyOption = options
		if (key) {
			finallyOption = {
				[key]: finallyOption,
			}
		}
		this.updateOptions(finallyOption)
	}

	updateRectOptions = (options) => {
		if (!options.color) {
			options = {
				grid: options,
			}
		}
		this.updateOptionsByKey(options)
	}

	getTabs() {
    const options = merge(
			{},
			initOptions,
			recursionOptions(this.props.options, true),
			formatFunctionsToOption(this.props.options.functions),
			this.props.options.options
		)
		const data = transferDataSource(this.props.data)
		const {
			grid = {},
			title = {},
			legend = {},
			tooltip = {},
			series = {},
			color = [],
			transferSeriesData,
		} = options
		const {
			progress = {},
			axisLabel = {},
			axisLine = {},
			axisTick = {},
			splitLine = {},
			pointer = {},
      anchor={}
		} = series
		console.log(options)

		return {
			grid: {
				label: '图表区',
				content: () => (
					<Rect
						visible
						values={{ ...grid, color }}
						onChange={(options) => this.updateRectOptions(options)}
					/>
				),
			},
			mainTitle: {
				label: '主标题',
				content: () => (
					<Title
						grid
						visible
						align
						values={title}
						onChange={(options) => this.updateOptionsByKey(options, 'title')}
					/>
				),
			},
			subTitle: {
				label: '副标题',
				content: () => (
					<Title
						keyPrefix="sub"
						values={title}
						onChange={(options) => this.updateOptionsByKey(options, 'title')}
					/>
				),
			},
			series: {
				label: '系列',
				content: () => (
					<GaugeSeries
						values={series}
						onChange={(options) => this.updateOptionsByKey(options, 'series')}
					/>
				),
			},
			axisLine: {
				label: '轴线',
				content: () => (
					<AxisLine
						series
						values={axisLine}
						onChange={(options) =>
							this.updateOptionsByKey({ axisLine: options }, 'series')
						}
					/>
				),
			},
			axisLabel: {
				label: '刻度标签',
				content: () => (
					<AxisLabel
						series
						values={axisLabel}
						onChange={(options) =>
							this.updateOptionsByKey({ axisLabel: options }, 'series')
						}
					/>
				),
			},
			axisTick: {
				label: '刻度',
				content: () => (
					<AxisTick
						series
						values={axisTick}
						onChange={(options) =>
							this.updateOptionsByKey({ axisTick: options }, 'series')
						}
					/>
				),
			},
			splitLine: {
				label: '分割线',
				content: () => (
					<SplitLine
						series
						values={splitLine}
						onChange={(options) =>
							this.updateOptionsByKey({ splitLine: options }, 'series')
						}
					/>
				),
			},
			progress: {
				label: '进度条',
				content: () => (
					<Progress
						values={progress}
						onChange={(options) =>
							this.updateOptionsByKey({ progress: options }, 'series')
						}
					/>
				),
			},
			pointer: {
				label: '指针',
				content: () => (
					<Pointer
						values={pointer}
						onChange={(options) =>
							this.updateOptionsByKey({ pointer: options }, 'series')
						}
					/>
				),
			},
      anchor: {
				label: '指针固定点',
				content: () => (
					<Anchor
						values={anchor}
						onChange={(options) =>
							this.updateOptionsByKey({ anchor: options }, 'series')
						}
					/>
				),
			},
			title: {
				label: '仪表盘标题',
				content: () => (
					<DetailTitle
						type="title"
						values={series.title}
						onChange={(options) =>
							this.updateOptionsByKey({ title: options }, 'series')
						}
					/>
				),
			},
			detail: {
				label: '仪表盘详情',
				content: () => (
					<DetailTitle
						type="detail"
						values={series.detail}
						onChange={(options) =>
							this.updateOptionsByKey({ detail: options }, 'series')
						}
					/>
				),
			},
      extend: {
				label: '自定义',
				content: () => (
					<Options
						values={options}
						onChange={(options, allValues, replaceAll = true) => this.updateOptionsByKey({ ...options, replaceAll })}
					/>
				),
			},
			data: {
				label: '数据',
				content: () => (
					<Data
						values={{ transferSeriesData }}
						onChange={(options) => {
							this.updateOptionsByKey(options)
						}}
					/>
				),
			},
		}
	}
}
