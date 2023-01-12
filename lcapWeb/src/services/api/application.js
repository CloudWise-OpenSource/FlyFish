/*
 * @Descripttion:
 * @Author: wangpuduanhua
 * @Date: 2021-11-17 15:03:23
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-27 16:19:08
 */
/*
 * 应用管理
 */
const baseUrl = window.FLYFISH_CONFIG.apiDomain;
const devServerPrefix = window.FLYFISH_CONFIG.devServerPrefix;

export default {
  // 应用列表
  GET_APPLICATION_LIST: `${baseUrl}/applications/list`,
  // 新增应用
  ADD_APPLICATION: `${devServerPrefix}/applications`,
  // 修改应用
  CHANGE_APPLICATION: `${baseUrl}/applications/`,
  // 删除应用
  DELETE_APPLICATION: `${baseUrl}/applications/`,
  // 复制应用
  COPY_APPLICATION: `${window.FLYFISH_CONFIG.devServerPrefix}/applications/copy/`,
  //导出应用
  EXPORT_APPLICATION: `${window.FLYFISH_CONFIG.devServerPrefix}/applications/export/`,
  // 新增标签
  ADD_NEW_TAG: `${baseUrl}/tags`,
};
