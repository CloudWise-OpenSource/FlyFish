/*
 * 数据源管理
 */
const baseUrl = window.LCAP_CONFIG.apiDomain;
const javaBaseUrl = window.LCAP_CONFIG.javaApiDomain;

export default {
  // 数据查询管理
  GET_DATA_SEARCH_LIST: `${javaBaseUrl}/api/dataplateform/unit/findAll`,
  // 删除单个数据查询
  DELETE_DATA_SEARCH: `${javaBaseUrl}/api/dataplateform/unit/delete/`,
  // 新建数据查询
  CREATE_DATA_SEARCH: `${javaBaseUrl}/api/dataplateform/unit`,
  // 编辑数据查询
  EDIT_DATA_SEARCH: `${javaBaseUrl}/api/dataplateform/unit/update`,
  // 获取单个数据查询
  GET_DATA_SEARCH: `${javaBaseUrl}/api/dataplateform/unit`,
  // 验证sql
  GET_VALID_SQL_QUERY_DATA_LIST: `${javaBaseUrl}/api/dataplateform/datatable/sqlquery`,
  // 获取组件
  GET_COMPONENT_LIST: `${baseUrl}/applications/components/list`,
  // 复合查询校验选中项
  VALIDATE_SELECT_ITEM_VALUE: `${javaBaseUrl}/api/dataplateform/unit/queryTest`,
  // 复合查询时序预览
  GET_DATA_SEARCH_GROUP_SERIES_PREVIEW_DATA: `${javaBaseUrl}/api/dataplateform/unit/combineQuerySequence`,
  // 复合查询预览
  GET_DATA_SEARCH_GROUP_PREVIEW_DATA: `${javaBaseUrl}/api/dataplateform/unit/combineQueryNoSequence`,
};