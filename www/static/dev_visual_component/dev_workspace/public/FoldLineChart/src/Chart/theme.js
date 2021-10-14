import {
  FONTSTYLE,
  FONTWEIGHT,
  TITLELINKTARGET,
  LEGENDTYPE,
  LEGENDORIENT,
} from "../constant";
import { XAXISPOSITION } from "../constant/xAxis";
import { YAXISPOSITION } from "../constant/yAxis";
import {
  AXISTYPE,
  AXISNAMELOCATIONTYPE,
  AXISLINETYPE,
  AXISLINECAP,
  AXISLINEJOIN,
} from "../constant/batchAxis";
import { TOOLTIPTIGGER } from "../constant/tooltip";

export const COLORS = [
	{
		type: 'linear',
		x: 0,
		y: 1,
		x2: 0,
		y2: 0,
		colorStops: [
			{
				offset: 0,
				color: 'rgba(108, 147, 249, 0.2)',
			},
			{
				offset: 1,
				color: 'rgba(108, 147, 249, 1)',
			},
		],
		globalCoord: false,
	},
	{
		type: 'linear',
		x: 0,
		y: 1,
		x2: 0,
		y2: 0,
		colorStops: [
			{
				offset: 0,
				color: 'rgba(83, 243, 255, 0.2)',
			},
			{
				offset: 1,
				color: 'rgba(83, 243, 255, 1)',
			},
		],
		globalCoord: false,
	},
	{
		type: 'linear',
		x: 0,
		y: 1,
		x2: 0,
		y2: 0,
		colorStops: [
			{
				offset: 0,
				color: 'rgba(250, 207, 20, 0)',
			},
			{
				offset: 1,
				color: 'rgba(250, 207, 20, 1)',
			},
		],
		globalCoord: false,
	},
	{
		type: 'linear',
		x: 0,
		y: 1,
		x2: 0,
		y2: 0,
		colorStops: [
			{
				offset: 0,
				color: 'rgba(227, 109, 111, 0)',
			},
			{
				offset: 1,
				color: 'rgba(227, 109, 111, 1)',
			},
		],
		globalCoord: false,
	},
	{
		type: 'linear',
		x: 0,
		y: 1,
		x2: 0,
		y2: 0,
		colorStops: [
			{
				offset: 0,
				color: 'rgba(143, 78, 237, 0)',
			},
			{
				offset: 1,
				color: 'rgba(143, 78, 237, 1)',
			},
		],
		globalCoord: false,
	},
	{
		type: 'linear',
		x: 0,
		y: 1,
		x2: 0,
		y2: 0,
		colorStops: [
			{
				offset: 0,
				color: 'rgba(184, 233, 134, 0)',
			},
			{
				offset: 1,
				color: 'rgba(184, 233, 134, 1)',
			},
		],
		globalCoord: false,
	},
	{
		type: 'linear',
		x: 0,
		y: 1,
		x2: 0,
		y2: 0,
		colorStops: [
			{
				offset: 0,
				color: 'rgba(96, 183, 255, 0)',
			},
			{
				offset: 1,
				color: 'rgba(96, 183, 255, 1)',
			},
		],
		globalCoord: false,
	},
	{
		type: 'linear',
		x: 0,
		y: 1,
		x2: 0,
		y2: 0,
		colorStops: [
			{
				offset: 0,
				color: 'rgba(255, 35, 102, 0)',
			},
			{
				offset: 1,
				color: 'rgba(255, 35, 102, 1)',
			},
		],
		globalCoord: false,
	},
	{
		type: 'linear',
		x: 0,
		y: 1,
		x2: 0,
		y2: 0,
		colorStops: [
			{
				offset: 0,
				color: 'rgba(245, 166, 35, 0)',
			},
			{
				offset: 1,
				color: 'rgba(245, 166, 35, 1)',
			},
		],
		globalCoord: false,
	},
	{
		type: 'linear',
		x: 0,
		y: 1,
		x2: 0,
		y2: 0,
		colorStops: [
			{
				offset: 0,
				color: 'rgba(0, 193, 255, 0)',
			},
			{
				offset: 1,
				color: 'rgba(0, 193, 255, 1)',
			},
		],
		globalCoord: false,
	},
]

export const BACKGROUNDCOLOR = "#13183000";

export const BORDERCOLOR = "rgba(0, 0, 0, 0.1)";

export const FONTCOLOR = "#9AABBD";

export const FONTFAMILY = '"Helvetica Neue", "Helvetica", "Arial", sans-serif';

export const FONTLINEHEIGHT = 1.5;

export const TOOLTIPTRIGGER = "axis";

export const LEGENDPAGEICONCOLOR = "#aaa";

export const LEGENDPAGEICONINACITVECOLOR = "#2f4554";

export const GRID = {
  top: "10%",
  bottom: "10%",
  left: "10%",
  right: "10%",
};

export const INITFONTSTYLE = {
  color: FONTCOLOR,
  fontStyle: Object.keys(FONTSTYLE)[0],
  fontWeight: Object.keys(FONTWEIGHT)[0],
  fontFamily: "sans-serif",
  fontSize: 18,
  ...GRID,
};

export const AXISPOINTER = {
  show: false,
  type: 'line',
  triggerTooltip: true,
  triggerOn: 'mousemove|click'
}

export const INITTITLES = {
  show: true,
  top: 10,
  left: 10,
  target: Object.keys(TITLELINKTARGET)[0],
  subtarget: Object.keys(TITLELINKTARGET)[0],
};

export const RECT = {
  width: "auto",
  height: "auto",
  backgroundColor: "transparent",
};

export const LEGEND = {
	show: true,
	left: 'right',
	top: '3%',
	icon: 'circle',
	itemGap: 15,
	type: Object.keys(LEGENDTYPE)[0],
	orient: Object.keys(LEGENDORIENT)[0],
}

export const TOOLTIP = {
  show: true,
  showContent: true,
  alwaysShowContent: false,
  confine: false,
  enterable: false,
  hideDelay: 100,
  trigger: Object.keys(TOOLTIPTIGGER)[1],
  triggerOn: 'mousemove|click'
};

export const XAXIS = {
  show: true,
  position: Object.keys(XAXISPOSITION)[0],
  type: Object.keys(AXISTYPE)[1],
  nameGap: 15,
  nameLocation: Object.keys(AXISNAMELOCATIONTYPE)[0],
  axisLabel: {
    formatter: (value, index) => value,
  },
}

export const YAXIS = {
  show: true,
  position: Object.keys(YAXISPOSITION)[0],
  type: Object.keys(AXISTYPE)[0],
  nameGap: 15,
  nameLocation: Object.keys(AXISNAMELOCATIONTYPE)[0],
  axisLabel: {
    formatter: (value, index) => value,
  },
  splitLine: {
    show: true,
    lineStyle: {
      color: ["#315070"],
    },
  },
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
};

export const AXISLINE = {
  show: true,
  onZero: true,
  lineStyle: LINESTYLE,
};

export const AXISTICK = {
  show: true,
  alignWithLabel: false,
  length: 5,
  inside: false,
  lineStyle: LINESTYLE,
};

export const SPLITLINE = {
  show: true,
  lineStyle: LINESTYLE,
};

export const AXISLABELWITHOUTRECT = {
  show: true,
  inside: false,
  margin: 8,
  ...INITFONTSTYLE,
};

export const AXISLABEL = {
  ...AXISLABELWITHOUTRECT,
  ...RECT,
};


export const ANIMATION = {
  animation: true,
  animationThreshold: 2000,
  animationDuration: 1000,
  animationDurationUpdate: 300,
  animationEasing: 'cubicOut',
  animationEasingUpdate: 'cubicInOut',
  animationDelay: 0,
  animationDelayUpdate: 0,
}