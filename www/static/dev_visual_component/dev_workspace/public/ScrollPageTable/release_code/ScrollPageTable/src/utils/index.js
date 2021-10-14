import { MINCONTAINERHEIGHT, TABLEHEADERHEIGHT, BORDERWIDTH } from '../constant';
export const noop = () => { };

export const typeOf = (target, type) => {
  return [type].flat().some(v => Object.prototype.toString.call(target) === `[object ${v}]`)
}

export const replacePX = (pixel) => {
  return pixel ? +String(pixel).replace('px', '') : 0
}

export const computedTableContentHeight = (headerRef, footerRef, stickyHeaderRef, paginationRef, showHeader, bordered, containerHeight) => {
  // 不能小于最小高度(不然无法展示)
  if (containerHeight <= MINCONTAINERHEIGHT) {
    return MINCONTAINERHEIGHT;
  }

  const { height: headerHeight = 0 } = headerRef ? window.getComputedStyle(headerRef) : {};
  const { height: footerHeight = 0 } = footerRef ? window.getComputedStyle(footerRef) : {};
  const { height: stickyHeaderHeight = 0 } = stickyHeaderRef ? window.getComputedStyle(stickyHeaderRef) : {};
  const { height: paginationHeight = 0 } = paginationRef ? window.getComputedStyle(paginationRef) : {};
  const borderHeight = [headerRef, footerRef].filter(v => v).length * BORDERWIDTH;
  const tableContentHeight = containerHeight - replacePX(headerHeight) - replacePX(footerHeight) - (showHeader ? replacePX(stickyHeaderHeight) : 0) - (bordered ? borderHeight : 0) - replacePX(paginationHeight);
  return Math.max(tableContentHeight, MINCONTAINERHEIGHT);
}

/**
 * @description 匹配函数体
 * @param {string} value 
 * @returns 
 */
export const matchFunctionBody = (value = '') => {
  value = value.replace(/\n/g, '');
  const reg = /\{([\s\S]*)\}/;
  const markParam = /\(([\w]*)\)/;
  return [value.match(markParam)[1] || '', value.match(reg)[1] || ''];
}