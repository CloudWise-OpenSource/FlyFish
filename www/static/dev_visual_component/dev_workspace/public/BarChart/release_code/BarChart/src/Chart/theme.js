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
    type: "linear",
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: "rgba(149, 245, 208, 1)",
      },
      {
        offset: 1,
        color: "rgba(23, 213, 227, 1)",
      },
    ],
    globalCoord: false,
  },
  {
    type: "linear",
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: "rgba(87, 233, 252, 1)",
      },
      {
        offset: 1,
        color: "rgba(128, 69, 248, 1)",
      },
    ],
    globalCoord: false,
  },
  {
    type: "linear",
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: "rgba(117, 220, 251, 1)",
      },
      {
        offset: 1,
        color: "rgba(13, 122, 228, 1)",
      },
    ],
    globalCoord: false,
  },
  {
    type: "linear",
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: "rgba(128, 69, 248, 1)",
      },
      {
        offset: 1,
        color: "rgba(87, 233, 252, 1)",
      },
    ],
    globalCoord: false,
  },
  {
    type: "linear",
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: "rgba(128, 69, 248, 1)",
      },
      {
        offset: 1,
        color: "rgba(87, 233, 252, 1)",
      },
    ],
    globalCoord: false,
  },
  {
    type: "linear",
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: "rgba(0, 200, 129, 94)",
      },
      {
        offset: 1,
        color: "rgba(0, 200, 129, 94)",
      },
    ],
    globalCoord: false,
  },
  {
    type: "linear",
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: "rgba(21, 250, 248, 1)",
      },
      {
        offset: 1,
        color: "rgba(21, 250, 248, 1)",
      },
    ],
    globalCoord: false,
  },
  {
    type: "linear",
    x: 1,
    y: 0,
    x2: 0,
    y2: 0,
    colorStops: [
      {
        offset: 0,
        color: "rgba(128, 68, 244, 1)",
      },
      {
        offset: 1,
        color: "rgba(84, 243, 255, 1)",
      },
    ],
    globalCoord: false,
  },
  {
    type: "linear",
    x: 1,
    y: 0,
    x2: 0,
    y2: 0,
    colorStops: [
      {
        offset: 0,
        color: "rgba(118, 221, 251, 1)",
      },
      {
        offset: 1,
        color: "rgba(10, 120, 227, 1)",
      },
    ],
    globalCoord: false,
  },
  {
    type: "linear",
    x: 1,
    y: 0,
    x2: 0,
    y2: 0,
    colorStops: [
      {
        offset: 0,
        color: "rgba(31, 223, 233, 1)",
      },
      {
        offset: 1,
        color: "rgba(150, 250, 255, 1)",
      },
    ],
    globalCoord: false,
  },
];

export const BACKGROUNDCOLOR = "#13183000";

export const BORDERCOLOR = "rgba(0, 0, 0, 0.1)";

export const FONTCOLOR = "#9aabbd";

export const FONTFAMILY = '"Helvetica Neue", "Helvetica", "Arial", sans-serif';

export const FONTLINEHEIGHT = 1.5;

export const TOOLTIPTRIGGER = "axis";

export const LEGENDPAGEICONCOLOR = "#aaa";

export const LEGENDPAGEICONINACITVECOLOR = "#2f4554";
export const LEDGENDPOSITION = "right";
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
  textAlign: 'auto',
  textVerticalAlign: 'auto',
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
  top: "1%",
  // right: "10%",
  left:'center',
  type: Object.keys(LEGENDTYPE)[0],
  orient: Object.keys(LEGENDORIENT)[0],
};

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
};

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
    width: 10,
  },
};

export const GUAGEPROGRESS = {
  show: true,
  overlap: true,
  width: 10,
  roundCap: false,
  clip: false,
};

export const GAUAGESETTING = {
  progress: GUAGEPROGRESS,
  startAngle: 225,
  endAngle: -45,
  clockwise: true,
  splitNumber: 10,
};

export const GAUGDETAILTITLE = {
  show: true,
  offsetCenter: [0, "20%"],
};

export const GEO = {
  map: "China",
  zoom: 1,
  roam: false,
  show: true,
  silent: false,
};

export const MAPSERIES = {
  label: {
    show: false,
    distance: 5,
    fontSize: 12,
  },
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
