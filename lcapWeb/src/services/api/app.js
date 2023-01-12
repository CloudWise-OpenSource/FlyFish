/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2021-11-10 19:08:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-26 16:32:37
 */
/*
 * 应用
 */
const baseUrl = window.FLYFISH_CONFIG.apiDomain;
const devServerPrefix = window.FLYFISH_CONFIG.devServerPrefix;

export default {
  LOGIN: `${baseUrl}/users/login`,
  LOGINOUT: `${baseUrl}/users/logout`,
  REGISTER: `${baseUrl}/users/register`,
  //项目管理
  GET_PROJECT_MANAGELIST_API: `${baseUrl}/projects/list`,
  // 新增项目
  SAVE_PROJECT_API: `${baseUrl}/projects`,
  // 编辑项目
  CHANGE_PROJECT_API: `${baseUrl}/projects/`,
  // 删除项目
  DETLETE_PROJECT_API: `${baseUrl}/projects/`,
  // 新增行业
  ADD_INDUSTRY: `${baseUrl}/trades`,
  // 行业列表
  INDUSTRY_LIST: `${baseUrl}/trades`,
  //编辑组件
  CHANGE_ASSEMBLY: `${devServerPrefix}/components/`,
  //获取nodeServer版本
  GET_VERSION_NODE: `${baseUrl}/system/getVersion`,
  //获取dataServer版本
  GET_VERSION_JAVA: `${baseUrl}/system/getVersion`,
};
