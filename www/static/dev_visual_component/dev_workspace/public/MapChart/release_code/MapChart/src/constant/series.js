export const SYMBOL = {
  circle: '圆形',
  rect: '矩形',
  roundRect: '圆角矩形',
  triangle: '三角形',
  diamond: '菱形',
  pin: '针型',
  arrow: '箭头',
  none: '无'
}

export const SYMBOLREPEATPOSITION = {
  start: '开始',
  end: '结束',
}

export const SYMBOLPOSITION = {
  ...SYMBOLREPEATPOSITION,
  center: '居中'
}

export const GEOROAM = {
  scale: '鼠标缩放',
  move: '平移漫游',
  both: '全部开启'
}

export const MAPLABELPOSITION = {
  top: '上方',
  left: '左方',
  right: '右方',
  bottom: '下方',
  inside: '内部',
  insideLeft: '内左',
  insideRight: '内右',
  insideTop: '内上',
  insideBottom: '内下',
  insideTopLeft: '内左上',
  insideBottomLeft: '内左下',
  insideTopRight: '内右上',
  insideBottomRight: '内右下'
}

/**
 * @description 何时显示特效
 */
 export const SHOWEFFECTON = {
  render: '绘制完毕',
  emphasis: '高亮'
}

/**
 * @description 特效类型
 */
export const EFFECTTYPE = {
  ripple: '涟漪',
}

/**
 * @description 波纹的绘制方式
 */
export const BRUSHTYPE = {
  stroke: '阴影',
  fill: '填充'
}