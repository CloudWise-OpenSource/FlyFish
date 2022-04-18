/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-10 19:08:53
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-02-08 11:23:05
 */
/*
 * 应用
 */
const baseUrl = window.LCAP_CONFIG.apiDomain;
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
  CHANGE_ASSEMBLY: `${baseUrl}/components/`,
};
