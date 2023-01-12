/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2022-08-25 17:09:03
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-09-23 11:40:51
 */

/*
 * 数据源管理
 */
const baseUrl = window.FLYFISH_CONFIG.apiDomain;
export default {
  //数据源管理
  GET_DATA_MANAGE_LIST: `${baseUrl}/datasource/findAll`,
  //新增数据源
  SAVE_ONE_DATA: `${baseUrl}/datasource`,
  //修改数据源
  CHANGE_ONE_DATA: `${baseUrl}/datasource/update`,
  //删除数据源
  DELETE_DATA: `${baseUrl}/datasource/deleteById`,
  //编辑数据源
  CHANGE_DATA: `${baseUrl}/datasource/update`,
  //链接测试
  DATA_USABILITY: `${baseUrl}/datasource/connect`,
  //详情左侧树
  TREE_LIST: `${baseUrl}/datatable`,
  //右侧树筛选
  TABLE_LIST: `${baseUrl}/datatable/tableMeta`,
  //新增数据表
  NEW_OUTSIDE: `${baseUrl}/datatable`,
  //数据源详情
  DETAIL: `${baseUrl}/datasource`,

  //修改数据表
  CHANGE_OUTSIDE: `${baseUrl}/datatable/update`,
  //删除数据表
  DELETE_OUTSIDE: `${baseUrl}/datatable/delete`,
  //http查询
  HTTP_LINK: `${baseUrl}/datatable/query`,
  //监控项下拉框
  ZABBIX_SEARCHITEM: `${baseUrl}/zabbix/searchItem`,
  //zabbix连接测试
  ZABBIX_QUERY: `${baseUrl}/zabbix/query`,
  //zabbix调用api下拉框
  ZABBIX_API_SELECT: `${baseUrl}/zabbix/getUrlList`,
};
