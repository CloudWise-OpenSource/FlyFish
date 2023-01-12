/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2021-11-10 19:08:53
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-05-27 14:41:59
 */
/*
 * 应用
 */
const baseUrl = window.FLYFISH_CONFIG.apiDomain;
export default {
  // 根据Id获取api详情
  GET_API_DETAIL_BY_ID: `${baseUrl}/apimanager`,
  // 新建
  CREATE_API_RECORD: `${baseUrl}/apimanager`,
  // 编辑
  EDIT_API_RECORD: `${baseUrl}/apimanager/edit`,

  //分组
  API_GROUP: `${baseUrl}/apigroup`,
  //分类
  API_CATALOG: `${baseUrl}/apicatalog`,
  //接口
  API_INTERFACE: `${baseUrl}/apimanager`,
};
