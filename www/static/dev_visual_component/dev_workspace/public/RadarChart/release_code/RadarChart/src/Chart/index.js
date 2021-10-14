import * as echarts from 'echarts'
import { merge } from 'data-vi/helpers'

import {
	COLORS,
	LEGEND,
	FONTCOLOR,
	FONTFAMILY,
	FONTLINEHEIGHT,
	GRID,
	BACKGROUNDCOLOR,
	INITTITLES,
	LEGENDPAGEICONCOLOR,
	LEGENDPAGEICONINACITVECOLOR,
  TOOLTIP,
  AXISPOINTER,
  ANIMATION,
  INITFONTSTYLE,
} from './theme'

const textStyle = {
  color: FONTCOLOR,
  fontFamily: FONTFAMILY,
  lineHeight: FONTLINEHEIGHT,
  ...INITFONTSTYLE,
};

export const initOptions = {
  backgroundColor: BACKGROUNDCOLOR,
  textStyle,
  legend: {
    ...LEGEND,
    textStyle: {
      ...textStyle,
      color: FONTCOLOR,
    },
    pageIconColor: LEGENDPAGEICONCOLOR,
    pageIconInactiveColor: LEGENDPAGEICONINACITVECOLOR,
    pageTextStyle: {
      color: FONTCOLOR,
    },
  },
  title: {
    ...INITTITLES,
    textStyle,
    subtextStyle: textStyle,
  },
  tooltip: {
    ...TOOLTIP,
    textStyle,
  },
  grid: {
    show: false,
    ...GRID,
  },
  axisPointer: AXISPOINTER,
  ...ANIMATION
};

export const initChart = (dom, options = {}) => {
	const mergeOptions = merge(
		{},
		{
			color: COLORS,
		},
    initOptions,
		options
	)
	const echartsRef = echarts.init(dom, mergeOptions)

	return echartsRef
}
