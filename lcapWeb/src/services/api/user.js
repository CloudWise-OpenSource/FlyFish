/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2021-11-10 19:08:53
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-06-02 14:36:43
 */
/*
 * 应用
 */
const baseUrl = window.FLYFISH_CONFIG.apiDomain;
const devServerPrefix = window.FLYFISH_CONFIG.devServerPrefix;
export default {
  //用户列表
  GET_USER_MANAGELIST_API: `${baseUrl}/users/list`,
  //修改用户
  CHANGE_USER: `${baseUrl}/users/info/`,
  //获取用户信息
  GET_USERINFO: `${baseUrl}/users/info`,
  //获取分类组件列表
  GET_COMPONENT_CLASSIFY_API: `${baseUrl}/components/categoriesList`,
  //获取项目应用列表
  GET_APPLICATION_API: `${baseUrl}/applications/projectList`,
  //获取导入配置
  GET_IMPORT_CONFIG_API: `${devServerPrefix}/resources/parse/config`,
  //获取导入配置所属项目数据
  GET_PROJECTS: `${baseUrl}/projects/list`,
  //获取导入配置组件分类数据
  GET_TREEDATA: `${baseUrl}/components/categories/list`,
  // 应用列表
  GET_APPLICATION_LIST: `${baseUrl}/applications/list`,
  //获取组件分类下组件列表详情
  GET_LISTDATA: `${baseUrl}/components/list`,
  //上传代码包
  UPLOAD_RESOURCE_PACKAGE: `${devServerPrefix}/resources/upload`,
  // 查询是否有上次导入文件未上传
  CHECK_LAST_IMPORT_RESOURCE: `${devServerPrefix}/resources/check`,
  //导入配置列表选中组件或应用
  IMPORT_COM_OR_APP: `${devServerPrefix}/resources/import`,
  //导入配置组件版本信息校验
  IMPORT_VERSION_VALIDATE: `${devServerPrefix}/resources/check/version`,
};
