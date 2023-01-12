/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2022-01-07 15:49:35
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-02-08 11:23:32
 */
/*
 * 应用
 */
const baseUrl = window.FLYFISH_CONFIG.apiDomain;
export default {
  //角色列表
  GET_ROLE_MANAGELIST_API: `${baseUrl}/roles/list`,
  //修改角色基础信息
  CHANGE_ROLE: `${baseUrl}/roles/`,
  //   新增角色
  NEW_ROLE: `${baseUrl}/roles`,
  //删除角色
  DELETE_ROLE: `${baseUrl}/roles/`,
  //获取角色详情信息
  ROLE_DETAIL: `${baseUrl}/roles/info/`,
  // 修改角色权限
  ROLE_AUTH: `${baseUrl}/roles/`,
  MENU_LIST: `${baseUrl}/menus/list`,
};
