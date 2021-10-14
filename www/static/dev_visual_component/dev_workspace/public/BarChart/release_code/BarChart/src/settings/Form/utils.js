/**
 * 校验是否为react组件
 * @param {string} elementType 
 * @returns 
 */
export const validElementType = (elementType) => {
  const reg = /^([A-Z]{1})/;
  return typeof elementType === 'function' || reg.test(elementType);
}

export const noop = () => { }