/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2022-09-01 19:43:32
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-09-14 17:25:00
 */
/*
 * 数据源管理
 */
const baseUrl = window.FLYFISH_CONFIG.apiDomain;

export default {
  // 数据查询管理
  GET_DATA_SEARCH_LIST: `${baseUrl}/unit/findAll`,
  // 删除单个数据查询
  DELETE_DATA_SEARCH: `${baseUrl}/unit/delete`,
  // 新建数据查询
  CREATE_DATA_SEARCH: `${baseUrl}/unit`,
  // 编辑数据查询
  EDIT_DATA_SEARCH: `${baseUrl}/unit/update`,
  // 获取单个数据查询
  GET_DATA_SEARCH: `${baseUrl}/unit`,
  // 验证sql
  GET_VALID_SQL_QUERY_DATA_LIST: `${baseUrl}/datatable/sqlquery`,
  // 获取组件
  GET_COMPONENT_LIST: `${baseUrl}/components/list-with-category`,
  // 复合查询校验选中项
  VALIDATE_SELECT_ITEM_VALUE: `${baseUrl}/unit/queryTest`,
  // 复合查询时序预览
  GET_DATA_SEARCH_GROUP_SERIES_PREVIEW_DATA: `${baseUrl}/unit/combineQuerySequence`,
  // 复合查询预览
  GET_DATA_SEARCH_GROUP_PREVIEW_DATA: `${baseUrl}/unit/combineQueryNoSequence`,
};
