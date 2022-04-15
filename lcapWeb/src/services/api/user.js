/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-10 19:08:53
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-02-08 11:23:38
 */
/*
 * 应用
 */
const baseUrl = window.LCAP_CONFIG.apiDomain;
export default {
  //用户列表
  GET_USER_MANAGELIST_API: `${baseUrl}/users/list`,
  //修改用户
  CHANGE_USER:`${baseUrl}/users/info/`,
  //获取用户信息
  GET_USERINFO: `${baseUrl}/users/info`,
  //获取douc菜单
  GET_USERMENU: `/api/v1/auth?module=lcap`,
};