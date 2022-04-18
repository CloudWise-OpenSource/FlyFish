/*
 * @Descripttion: 
 * @Author: wangpuduanhua
 * @Date: 2021-11-17 15:03:23
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-02-08 11:23:12
 */
/*
 * 应用管理
 */
const baseUrl = window.LCAP_CONFIG.apiDomain;
export default {
  // 应用列表
  GET_APPLICATION_LIST: `${baseUrl}/applications/list`,
  // 新增应用
  ADD_APPLICATION: `${baseUrl}/applications`,
  // 修改应用
  CHANGE_APPLICATION: `${baseUrl}/applications/`,
  // 删除应用
  DELETE_APPLICATION: `${baseUrl}/applications/`,
  // 复制应用
  COPY_APPLICATION: `${baseUrl}/applications/copy/`,
  //导出应用
  EXPORT_APPLICATION: `${baseUrl}/applications/export/`,
  // 新增标签
  ADD_NEW_TAG: `${baseUrl}/tags`,
};
