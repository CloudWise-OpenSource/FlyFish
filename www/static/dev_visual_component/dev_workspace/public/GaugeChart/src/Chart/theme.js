import { merge } from "data-vi/helpers";
import {
  FONTSTYLE,
  FONTWEIGHT,
  TITLELINKTARGET,
  LEGENDTYPE,
  LEGENDORIENT,
  RADARSHAPE,
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
import {
  SYMBOL,
  SYMBOLREPEATPOSITION,
  SYMBOLPOSITION,
} from "../constant/series";

export const COLORS = [
  {
    type: "radial",
    x: 0.5,
    y: 0.5,
    r: 0.5,
    colorStops: [
      {
        offset: 0,
        color: "rgba(113, 217, 250, 0)",
      },
      {
        offset: 1,
        color: "rgba(113, 217, 250, 1)",
      },
    ],
    globalCoord: false,
  },
  "#5EA5FF",
  "#60B7FF",
  "#00C1FF",
  "#1FDFE9",
  "#FACF14",
  "#E36D6F",
  "#8F4EED",
  "#B8E986",
  "#FF2366",
  "#F5A623",
];

export const BACKGROUNDCOLOR = "#13183000";

export const BORDERCOLOR = "rgba(0, 0, 0, 0.1)";

export const FONTCOLOR = "#9aabbd";

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

export const INITTITLES = {
  show: true,
  top: "35%",
  textStyle: {
    fontSize: 16,
  },
  left: "center",
  text: "单位：%",
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
  type: Object.keys(LEGENDTYPE)[0],
  orient: Object.keys(LEGENDORIENT)[0],
};

export const TOOLTIP = {
  show: true,
  showContent: true,
  alwaysShowContent: false,
  confine: false,
  trigger: Object.keys(TOOLTIPTIGGER)[1],
};

export const XAXIS = {
  show: true,
  position: Object.keys(XAXISPOSITION)[0],
  type: Object.keys(AXISTYPE)[1],
  nameGap: 15,
  nameLocation: Object.keys(AXISNAMELOCATIONTYPE)[0],
};

export const YAXIS = {
  show: true,
  position: Object.keys(YAXISPOSITION)[0],
  type: Object.keys(AXISTYPE)[0],
  nameGap: 15,
  nameLocation: Object.keys(AXISNAMELOCATIONTYPE)[0],
};

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

export const AREASTYLE = {
  color: BORDERCOLOR,
  opacity: 1,
};

export const AXISLINE = {
  show: true,
  onZero: true,
  lineStyle: {
    color: "5EA5FF",
    width: 10,
  },
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

export const SERIESLABEL = merge({}, AXISLABELWITHOUTRECT, { show: false });

export const AXISLABEL = {
  ...AXISLABELWITHOUTRECT,
  ...RECT,
};

export const RADARSERIES = {
  symbol: Object.keys(SYMBOL)[0],
  symbolSize: 4,
  symbolKeepAspect: false,
  lineStyle: LINESTYLE,
  areaStyle: AREASTYLE,
};

export const RADAR = {
  radius: 75,
  startAngle: 90,
  splitNumber: 5,
  scale: false,
  shape: Object.keys(RADARSHAPE)[0],
  axisTick: {
    show: false,
  },
};

export const RADARGRID = {
  top: "50%",
  left: "50%",
  radius: "75%",
};

export const PICTORIALSERIES = {
  ...RADARSERIES,
  label: SERIESLABEL,
  symbolSize: ["100%", "100%"],
  symbolOffset: [0, 0],
  symbolRepeat: false,
  symbolRepeatDirection: Object.keys(SYMBOLREPEATPOSITION)[0],
  symbolPosition: Object.keys(SYMBOLPOSITION)[0],
  symbolClip: false,
};

export const GAUAGESPLIT = {
  show: true,
  length: 10,
  distance: 10,
  lineStyle: {
    width: 3,
  },
};
export const GAUGEAXISLINE = {
  show: true,
  onZero: true,
  lineStyle: {
    color: [
      [0.4, "#0cf14b"],
      [0.75, "#edb300"],
      [1, "#fd427b"],
    ],
    opacity: 0,
    width: 30,
  },
};
export const GAUGPOINTER = {
  show: true,
  offsetCenter: [0, 0],
  length: "60%",
  width: 6,
  itemStyle: {
    color: "auto",
  },
};

export const GAUGELINESTYLE = {
  show: true,
  roundCap: false,
  lineStyle: {
    width: 30,
  },
};

export const GUAGEPROGRESS = {
  show: true,
  overlap: true,
  width: 12,
  roundCap: false,
  clip: false,
  itemStyle: {
    color: "#54f3ff",
    opacity: 1,
    shadowColor: "#54f3ff",
    shadowBlur: 100,
    // shadowOffsetX: 0,
    shadowOffsetY: 2,
  },
};

export const GAUGEAXISTICK = {
  show: true,
  distance: -80,
  length: 15,
  splitNumber: 2,
  lineStyle: {
    color: "auto",
    width: 2,
  },
};
export const GAUGESPLITLINE = {
  show: true,
  length: 20,
  distance: -80,
  lineStyle: {
    color: "auto",
    width: 4,
  },
};
export const GAUGAXISLANBEL = {
  show: true,
  distance: 80,
  color: "#fff",
  fontWeight: 400,
  fontFamily: "PingFangSC-Regular, PingFang SC",
  fontSize: 15,
  formatter: (value) => Math.round(value),
};
export const GAUGETITLE = {
  show: true,
  offsetCenter: [0, "80%"],
  fontFamily: "PingFangSC-Regular, PingFang SC",
  fontWeight: 400,
  fontSize: 25,
  color: "#B1E8FC",
  formatter: function (value) {
    return value;
  },
};
export const GAUGEDETAILTITLE = {
  show: true,
  fontSize: 30,
  offsetCenter: [0, "50%"],
  valueAnimation: true,
  color: "#15F7FA",
  formatter: function (value) {
    return value + "%";
  },
};
export const GAUGEPOINTER = {
  show: true,
  width: 6,
  offsetCenter: [0, 0],
  icon: "rect",
  length: "100%",
  itemStyle: {
    color: "#54f3ff",
    borderWidth: 1,
    opacity: 1,
  },
};
export const GAUAGESETTING = {
	progress: GUAGEPROGRESS,
	axisLine: GAUGEAXISLINE,
	axisTick: GAUGEAXISTICK,
	splitLine: GAUGESPLITLINE,
	startAngle: 225,
	endAngle: -45,
  center: ['50%','50%'],
  radius: '75%',
	clockwise: true,
	splitNumber: 10,
	axisLabel: GAUGAXISLANBEL,
	title: GAUGETITLE,
	detail: GAUGEDETAILTITLE,
	pointer: GAUGEPOINTER,
	anchor: {
		show: true,
		showAbove: true,
		size: 50,
    icon: 'circle',
    itemStyle:{
      color: BACKGROUNDCOLOR,
      borderColor:'#54f3ff',
      opacity: 1,
      borderWidth:3
    }
	},
}

export const GAUGDETAILTITLE = {
  show: true,
  offsetCenter: [0, "20%"],
};
