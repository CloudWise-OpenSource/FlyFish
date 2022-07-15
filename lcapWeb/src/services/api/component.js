/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-10 19:08:53
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-06-25 16:36:18
 */
/*
 * 应用
 */
const baseUrl = window.LCAP_CONFIG.apiDomain;
const componentSplitApiPrefix = window.LCAP_CONFIG.componentSplitApiPrefix;
export default {
  GET_TREEDATA: `${baseUrl}/components/categories/list`,
  UPDATE_TREEDATA:`${baseUrl}/components/categories`,
  GET_LISTDATA: `${baseUrl}/components/list`,
  GET_PROJECTS: `${baseUrl}/projects/list`,
  GET_TAGS: `${baseUrl}/tags/get-all`,
  ADD_COMPONENT: `${componentSplitApiPrefix}/components`,
   // 删除组件 
   DELETE_ASSEMBLY:`${baseUrl}/components/`,
  GET_DETAILDATA: `${baseUrl}/components`,
  //编辑组件
  EDIT_COMPONENT: `${baseUrl}/components`,
  //复制组件
  COPY_COMPONENT: `${componentSplitApiPrefix}/components/copy`,
  //删除组件
  DELETE_COMPONENT: `${baseUrl}/components`,
  //上传代码包
  UPLOAD_COMPONENT: `${componentSplitApiPrefix}/components/import-source-code`,
  //下载代码包
  DOWNLOAD_COMPONENT: `${componentSplitApiPrefix}/components/export-source-code`,
  //安装依赖
  INSTALL_PACKAGE: `${componentSplitApiPrefix}/components/install`,
  //上传到组件库
  UPLOADTO_LIBRARY: `${baseUrl}/components/up-to-lib`,
  //编译组件
  COMPILE_COMPONENT: `${componentSplitApiPrefix}/components/compile`,
  //上线组件
  PUBLISH_COMPONENT: `${componentSplitApiPrefix}/components/release`,
  //获取组件提交记录
  GET_RECORD: `${componentSplitApiPrefix}/components/git-history`,
  //获取组件提交详情
  GET_DIFFRECORD:`${componentSplitApiPrefix}/components/git-commit-info`,
  //添加标签
  ADD_TAG: `${baseUrl}/tags`,
  // 上传组件图片
  UPLOAD_COMPONENT_COVER: `${componentSplitApiPrefix}/components/uploadComponentImg`
};
