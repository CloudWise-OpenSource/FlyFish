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
const baseUrl = window.LCAP_CONFIG.javaApiDomain;
export default {
    GETBINDAPPLIST: `${baseUrl}/api/dataplateform/apiauth`,
    GETAPPLICATIONLIST: `${baseUrl}/api/interface/add_app`,
    CHANGEAPISTATE: `${baseUrl}/api/interface/edit_app`,

    //api列表
    APINEW_API_LIST:`${baseUrl}/api/dataplateform/project/list`,

    //应用管理
    APPLICATION_MANAGE: `${baseUrl}/api/dataplateform/appauth/list`,
    NEW_APPLICATION: `${baseUrl}/api/dataplateform/appauth`,
    CHANGE_APPLIXCATION: `${baseUrl}/api/dataplateform/appauth`,
    ADD_APPLICATION: `${baseUrl}/api/dataplateform/apiauth/saveappauth`,
    GETALLAOPPILIST: `${baseUrl}/api/dataplateform/apimanager/list`,
    GETAPPLICATIONBINDLIST: `${baseUrl}/api/dataplateform/apimanager/listbind`,
    GET_MANAGE_APPLICATION_LIST: `${baseUrl}/api/dataplateform/apimanager/listubind`,
    APP_BLIND_IDS: `${baseUrl}/api/dataplateform/apiauth/saveapiauth`,

    //授权关系
    AUTHORIZATION_CHANGE: `${baseUrl}/api/dataplateform/apiauth`,
};
