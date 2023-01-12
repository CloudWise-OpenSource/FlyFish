/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2021-11-10 19:08:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-16 16:29:21
 */
/*
 * 应用
 */
const baseUrl = window.FLYFISH_CONFIG.apiDomain;
const devServerPrefix = window.FLYFISH_CONFIG.devServerPrefix;
export default {
  GET_TREEDATA: `${baseUrl}/components/categories/list`,
  UPDATE_TREEDATA: `${baseUrl}/components/categories`,
  GET_LISTDATA: `${baseUrl}/components/list`,
  GET_PROJECTS: `${baseUrl}/projects/list`,
  GET_TAGS: `${baseUrl}/tags/get-all`,
  ADD_COMPONENT: `${devServerPrefix}/components`,
  // 删除组件
  DELETE_ASSEMBLY: `${baseUrl}/components/`,
  GET_DETAILDATA: `${baseUrl}/components`,
  //编辑组件
  EDIT_COMPONENT: `${devServerPrefix}/components`,
  //复制组件
  COPY_COMPONENT: `${devServerPrefix}/components/copy`,
  //删除组件
  DELETE_COMPONENT: `${devServerPrefix}/components`,
  //上传代码包
  UPLOAD_COMPONENT: `${devServerPrefix}/components/import-source-code`,
  //下载代码包
  DOWNLOAD_COMPONENT: `${devServerPrefix}/components/export-source-code`,
  //安装依赖
  INSTALL_PACKAGE: `${devServerPrefix}/components/install`,
  //上传到组件库
  UPLOADTO_LIBRARY: `${baseUrl}/components/up-to-lib`,
  //编译组件
  COMPILE_COMPONENT: `${devServerPrefix}/components/compile`,
  //上线组件
  PUBLISH_COMPONENT: `${devServerPrefix}/components/release`,
  //获取组件提交记录
  GET_RECORD: `${devServerPrefix}/components/git-history`,
  //获取组件提交详情
  GET_DIFFRECORD: `${devServerPrefix}/components/git-commit-info`,
  //添加标签
  ADD_TAG: `${baseUrl}/tags`,
  // 上传组件图片
  UPLOAD_COMPONENT_COVER: `${devServerPrefix}/file/uploadFile?type=component`,
  //
  GET_USER_LIST: `${baseUrl}/users/list`,
};
