/**
 * @description 坐标类型
 */
export const AXISTYPE = {
  value: '数值轴',
  category: '类目轴',
  time: '时间轴',
  log: '对数轴'
}

/**
 * @description 坐标名称显示位置类型
 */
export const AXISNAMELOCATIONTYPE = {
  end: '居末',
  start: '居首',
  middle: '居中(一)',
  center: '居中(二)',
}

/**
 * @description 线的类型
 */
export const AXISLINETYPE = {
  solid: '实线',
  dashed: '虚线',
  dotted: '点'
}

/**
 * @description 用于指定线段末端的绘制方式
 */
export const AXISLINECAP = {
  butt: '方形',
  round: '圆形',
  square: '方形+圆形结尾'
}

/**
 * @description 用于设置2个长度不为0的相连部分
 */
export const AXISLINEJOIN = {
  bevel: '三角形',
  round: '扇形',
  miter: '菱形'
}