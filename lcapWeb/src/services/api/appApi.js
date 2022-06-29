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
const baseUrl = window.LCAP_CONFIG.javaApiDomain;
export default {
  // 根据Id获取api详情
  GET_API_DETAIL_BY_ID: `${baseUrl}/api/dataplateform/apimanager`,
  // 新建
  CREATE_API_RECORD: `${baseUrl}/api/dataplateform/apimanager`,
  // 编辑
  EDIT_API_RECORD: `${baseUrl}/api/dataplateform/apimanager/edit`,

  //分组
  API_GROUP:`${baseUrl}/api/dataplateform/apigroup`,
  //分类
  API_CATALOG:`${baseUrl}/api/dataplateform/apicatalog`,
  //接口
  API_INTERFACE:`${baseUrl}/api/dataplateform/apimanager`,
};
