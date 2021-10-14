/**
 * @description tooltip 触发类型
 */
export const TOOLTIPTIGGER = {
  axis: "axis",
  item: "item",
  none: "none",
};

/**
 * @description 指示器类型
 */
export const TOOLTIPAXISPOINTERTYPE = {
  line: "line",
  shadow: "shadow",
  none: "none",
  cross: "cross",
};

export const TOOLTIPDEFAULTFUNCTION = (params, ticket, callback) => {
  return params.name + "<br/>" + (params.value || 0);
};
