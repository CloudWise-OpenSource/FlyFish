import * as echarts from 'echarts';
import { merge } from "data-vi/helpers";

import { COLORS, FONTCOLOR, FONTFAMILY, FONTLINEHEIGHT, GRID, BACKGROUNDCOLOR, INITTITLES, LEGENDPAGEICONCOLOR, LEGENDPAGEICONINACITVECOLOR } from './theme';

export const initChart = (dom, options = {}) => {

  const mergeOptions = merge({}, {
    color: COLORS,
    backgroundColor: BACKGROUNDCOLOR,
    textStyle: {
      color: FONTCOLOR,
      fontFamily: FONTFAMILY,
      lineHeight: FONTLINEHEIGHT
    },
    legend: {
      textStyle: {
        color: FONTCOLOR
      },
      pageIconColor: LEGENDPAGEICONCOLOR,
      pageIconInactiveColor: LEGENDPAGEICONINACITVECOLOR,
      pageTextStyle: {
        color: FONTCOLOR
      }
    },
    title: INITTITLES,
    grid: GRID
  }, options);
  const echartsRef = echarts.init(dom, mergeOptions);

  return echartsRef;
}
