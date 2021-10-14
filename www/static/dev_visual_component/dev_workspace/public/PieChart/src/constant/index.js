/**
 * @description 图表相关常量
 */

/**
 * @description 图例类型
 */
export const LEGENDTYPE = {
  plain: '普通图例',
  scroll: '滚动图例'
}

/**
 * @description 枚举数据格式
 */
export const SERIESITEM = {
  string: 'String',
  number: 'Number',
  object: 'Object'
}

/**
 * @description 标题点击打开方式
 */
export const TITLELINKTARGET = {
  blank: '新窗口打开',
  self: '当前窗口打开'
}

/**
 * @description 文字字体风格
 */
export const FONTSTYLE = {
  normal: '普通',
  italic: '斜体',
  oblique: '倾斜体'
}

/**
 * @description 文字字体粗细
 */
export const FONTWEIGHT = {
  normal: '正常粗细',
  bold: '加粗',
  bolder: '较粗',
  lighter: '较细'
}

export const FONTWEIGHTNUMBER = {
  normal: 400,
  bold: 700,
  bolder: 800,
  lighter: 100
}

/**
 * @description 文字对齐方式
 */
export const FONTALIGIN = {
  left: 'left',
  center: 'center',
  right: 'right',
}

/**
 * @description 文字垂直对齐方式
 */
export const FONTVERTICALALIGN = {
  top: 'top',
  middle: 'middle',
  bottom: 'bottom'
}

/**
 * @description 文字超出宽度是否截断或换行
 */
export const TEXTOVERFLOW = {
  none: 'none',
  truncate: 'truncate',
  break: 'break',
  breakAll: 'breakAll'
}

/**
 * @description 文字超出高度是否截断
 */
export const LINETEXTOVERFLOW = {
  none: 'none',
  truncate: 'truncate',
}

/**
 * @description 图例布局朝向
 */
export const LEGENDORIENT = {
  horizontal: '水平布局',
  vertical: '垂直布局'
}

export function USEINSTANCEFUNCTION(instance, eventBus) {}