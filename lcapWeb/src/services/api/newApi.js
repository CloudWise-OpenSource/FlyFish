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
const baseUrl = window.FLYFISH_CONFIG.apiDomain;
export default {
  GETBINDAPPLIST: `${baseUrl}/apiauth`,
  GETAPPLICATIONLIST: `${baseUrl}/api/interface/add_app`,
  CHANGEAPISTATE: `${baseUrl}/api/interface/edit_app`,

  //api列表
  APINEW_API_LIST: `${baseUrl}/project/list`,

  //应用管理
  APPLICATION_MANAGE: `${baseUrl}/appauth/list`,
  NEW_APPLICATION: `${baseUrl}/appauth`,
  CHANGE_APPLIXCATION: `${baseUrl}/appauth`,
  ADD_APPLICATION: `${baseUrl}/apiauth/saveappauth`,
  GETALLAOPPILIST: `${baseUrl}/apimanager/list`,
  GETAPPLICATIONBINDLIST: `${baseUrl}/apimanager/listbind`,
  GET_MANAGE_APPLICATION_LIST: `${baseUrl}/apimanager/listubind`,
  APP_BLIND_IDS: `${baseUrl}/apiauth/saveapiauth`,

  //授权关系
  AUTHORIZATION_CHANGE: `${baseUrl}/apiauth`,
};
