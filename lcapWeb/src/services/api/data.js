
/*
 * 数据源管理
 */
const baseUrl = window.LCAP_CONFIG.javaApiDomain;
export default {
  //数据源管理
  GET_DATA_MANAGE_LIST: `${baseUrl}/api/dataplateform/datasource/findAll`,
  //新增数据源
  SAVE_ONE_DATA: `${baseUrl}/api/dataplateform/datasource`,
  //修改数据源
  CHANGE_ONE_DATA: `${baseUrl}/api/dataplateform/datasource/update`,
  //删除数据源
  DELETE_DATA: `${baseUrl}/api/dataplateform/datasource/deleteById`,
  //编辑数据源
  CHANGE_DATA: `${baseUrl}/api/dataplateform/datasource/update`,
  //链接测试
  DATA_USABILITY: `${baseUrl}/api/dataplateform/datasource/connect`,
  //详情左侧树
  TREE_LIST: `${baseUrl}/api/dataplateform/datatable`,
  //右侧树筛选
  TABLE_LIST: `${baseUrl}/api/dataplateform/datatable/tableMeta`,
  //新增数据表
  NEW_OUTSIDE:`${baseUrl}/api/dataplateform/datatable`,
  //数据源详情
  DETAIL:`${baseUrl}/api/dataplateform/datasource`,

  //修改数据表
  CHANGE_OUTSIDE:`${baseUrl}/api/dataplateform/datatable/update`,
  //删除数据表
  DELETE_OUTSIDE:`${baseUrl}/api/dataplateform/datatable/delete`,
  //http查询
  HTTP_LINK:`${baseUrl}/api/dataplateform/datatable/query`
};