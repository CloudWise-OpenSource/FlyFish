import {
	FONTSTYLE,
	FONTWEIGHT,
	TITLELINKTARGET,
	LEGENDTYPE,
	LEGENDORIENT,
} from '../constant'
import { XAXISPOSITION } from '../constant/xAxis'
import { YAXISPOSITION } from '../constant/yAxis'
import {
	AXISTYPE,
	AXISNAMELOCATIONTYPE,
	AXISLINETYPE,
	AXISLINECAP,
	AXISLINEJOIN,
} from '../constant/batchAxis'
import { TOOLTIPTIGGER } from '../constant/tooltip'

export const COLORS = [
	{
		type: 'linear',
		x: 0,
		y: 0,
		x2: 0,
		y2: 1,
		colorStops: [
			{
				offset: 0,
				color: 'rgba(149, 245, 208, 1)',
			},
			{
				offset: 1,
				color: 'rgba(23, 213, 227, 1)',
			},
		],
		globalCoord: false,
	},
	{
		type: 'linear',
		x: 0,
		y: 0,
		x2: 0,
		y2: 1,
		colorStops: [
			{
				offset: 0,
				color: 'rgba(87, 233, 252, 1)',
			},
			{
				offset: 1,
				color: 'rgba(128, 69, 248, 1)',
			},
		],
		globalCoord: false,
	},
	{
		type: 'linear',
		x: 0,
		y: 0,
		x2: 0,
		y2: 1,
		colorStops: [
			{
				offset: 0,
				color: 'rgba(117, 220, 251, 1)',
			},
			{
				offset: 1,
				color: 'rgba(13, 122, 228, 1)',
			},
		],
		globalCoord: false,
	},
	{
		type: 'linear',
		x: 0,
		y: 0,
		x2: 0,
		y2: 1,
		colorStops: [
			{
				offset: 0,
				color: 'rgba(128, 69, 248, 1)',
			},
			{
				offset: 1,
				color: 'rgba(87, 233, 252, 1)',
			},
		],
		globalCoord: false,
	},
	{
		type: 'linear',
		x: 0,
		y: 0,
		x2: 0,
		y2: 1,
		colorStops: [
			{
				offset: 0,
				color: 'rgba(128, 69, 248, 1)',
			},
			{
				offset: 1,
				color: 'rgba(87, 233, 252, 1)',
			},
		],
		globalCoord: false,
	},
	{
		type: 'linear',
		x: 0,
		y: 0,
		x2: 0,
		y2: 1,
		colorStops: [
			{
				offset: 0,
				color: 'rgba(0, 200, 129, 94)',
			},
			{
				offset: 1,
				color: 'rgba(0, 200, 129, 94)',
			},
		],
		globalCoord: false,
	},
	{
		type: 'linear',
		x: 0,
		y: 0,
		x2: 0,
		y2: 1,
		colorStops: [
			{
				offset: 0,
				color: 'rgba(21, 250, 248, 1)',
			},
			{
				offset: 1,
				color: 'rgba(21, 250, 248, 1)',
			},
		],
		globalCoord: false,
	},
	{
		type: 'linear',
		x: 1,
		y: 0,
		x2: 0,
		y2: 0,
		colorStops: [
			{
				offset: 0,
				color: 'rgba(128, 68, 244, 1)',
			},
			{
				offset: 1,
				color: 'rgba(84, 243, 255, 1)',
			},
		],
		globalCoord: false,
	},
	{
		type: 'linear',
		x: 1,
		y: 0,
		x2: 0,
		y2: 0,
		colorStops: [
			{
				offset: 0,
				color: 'rgba(118, 221, 251, 1)',
			},
			{
				offset: 1,
				color: 'rgba(10, 120, 227, 1)',
			},
		],
		globalCoord: false,
	},
	{
		type: 'linear',
		x: 1,
		y: 0,
		x2: 0,
		y2: 0,
		colorStops: [
			{
				offset: 0,
				color: 'rgba(31, 223, 233, 1)',
			},
			{
				offset: 1,
				color: 'rgba(150, 250, 255, 1)',
			},
		],
		globalCoord: false,
	},
]

export const BACKGROUNDCOLOR = '#13183000'

export const BORDERCOLOR = 'rgba(0, 0, 0, 0.1)'

export const FONTCOLOR = '#9aabbd'

export const FONTFAMILY = '"Helvetica Neue", "Helvetica", "Arial", sans-serif'

export const FONTLINEHEIGHT = 1.5

export const TOOLTIPTRIGGER = 'axis'

export const LEGENDPAGEICONCOLOR = '#aaa'

export const LEGENDPAGEICONINACITVECOLOR = '#2f4554'

export const GRID = {
	top: '10%',
	bottom: '10%',
	left: '10%',
	right: '10%',
}

export const INITFONTSTYLE = {
	color: FONTCOLOR,
	fontStyle: Object.keys(FONTSTYLE)[0],
	fontWeight: Object.keys(FONTWEIGHT)[0],
	fontFamily: 'sans-serif',
	fontSize: 18,
	...GRID,
}

export const INITTITLES = {
	show: true,
	top: 10,
	left: 10,
	target: Object.keys(TITLELINKTARGET)[0],
	subtarget: Object.keys(TITLELINKTARGET)[0],
}

export const RECT = {
	width: 'auto',
	height: 'auto',
	backgroundColor: 'transparent',
}

export const LEGEND = {
	show: true,
	type: Object.keys(LEGENDTYPE)[0],
	orient: Object.keys(LEGENDORIENT)[0],
}

export const TOOLTIP = {
	show: true,
	showContent: true,
	alwaysShowContent: false,
	trigger: Object.keys(TOOLTIPTIGGER)[1],
}

export const XAXIS = {
	show: false,
	position: Object.keys(XAXISPOSITION)[0],
	type: Object.keys(AXISTYPE)[1],
	nameGap: 15,
	nameLocation: Object.keys(AXISNAMELOCATIONTYPE)[0],
}

export const YAXIS = {
	show: false,
	position: Object.keys(YAXISPOSITION)[0],
	type: Object.keys(AXISTYPE)[0],
	nameGap: 15,
	nameLocation: Object.keys(AXISNAMELOCATIONTYPE)[0],
}

export const LINESTYLE = {
	color: BORDERCOLOR,
	width: 1,
	type: Object.keys(AXISLINETYPE)[0],
	dashOffset: 0,
	cap: Object.keys(AXISLINECAP)[0],
	join: Object.keys(AXISLINEJOIN)[0],
	miterLimit: 10,
	opacity: 1,
}

export const AXISLINE = {
	show: true,
	onZero: true,
	lineStyle: LINESTYLE,
}

export const AXISTICK = {
	show: true,
	alignWithLabel: false,
	length: 5,
	inside: false,
	lineStyle: LINESTYLE,
}

export const SPLITLINE = {
	show: true,
	lineStyle: LINESTYLE,
}

export const AXISLABELWITHOUTRECT = {
	show: true,
	inside: false,
	margin: 8,
	...INITFONTSTYLE,
}

export const AXISLABEL = {
	...AXISLABELWITHOUTRECT,
	...RECT,
}

export const PIEGRID = {
	top: '50%',
	left: '50%',
	innerRadius: 0,
	outRadius: '75%',
}
