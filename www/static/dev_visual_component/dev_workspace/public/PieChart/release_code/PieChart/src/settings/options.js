import React from 'react'
import { ComponentOptionsSetting } from 'datavi-editor/templates'

import { merge } from 'data-vi/helpers'
import { initOptions } from '../Chart'
import { formatFunctionsToOption } from '../utils'
import {
	Rect,
	Legend,
	Tooltip,
	Title,
	Options,
	Data,
	recursionOptions,
	Series,
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
		const [updateKey] = Object.keys(options)
		if (
			!['color', 'backgroundColor'].includes(updateKey) &&
			!updateKey.startsWith('animation')
		) {
			options = {
				[updateKey === 'show' ? 'grid' : 'series']:  options,
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
		const {
			backgroundColor,
			animation,
			animationThreshold,
			animationDuration,
			animationDurationUpdate,
			animationEasing,
			animationEasingUpdate,
			animationDelay,
			animationDelayUpdate,
      grid = {},
			title = {},
			legend = {},
			tooltip = {},
			series = {},
      color = [],
      transferSeriesData,
		} = options;

    const { radius, center } = series;

    const rectValues = {
			...grid,
			color,
			backgroundColor,
			animation,
			animationThreshold,
			animationDuration,
			animationDurationUpdate,
			animationEasing,
			animationEasingUpdate,
			animationDelay,
			animationDelayUpdate,
      radius,
      center
		}

		const { label = {} } = series
		console.log(options)
		return {
			grid: {
				label: '图表区',
				content: () => (
					<Rect
						radius
            radiusInputType="string"
						gridTip="series"
						values={rectValues}
						onChange={(options) => this.updateRectOptions(options, 'series')}
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
			legend: {
				label: '图例',
				content: () => (
					<Legend
						values={legend}
						onChange={(options) => this.updateOptionsByKey(options, 'legend')}
					/>
				),
			},
			tooltip: {
				label: '提示框',
				content: () => (
					<Tooltip
						values={tooltip}
						onChange={(options) => this.updateOptionsByKey(options, 'tooltip')}
					/>
				),
			},
			series: {
				label: '系列',
				content: () => (
					<Series
						values={series}
						onChange={(options) => this.updateOptionsByKey(options, 'series')}
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
