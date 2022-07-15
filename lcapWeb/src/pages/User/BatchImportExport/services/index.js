import { fetchGet, fetchPost, fetchPut, fetchDelete } from '@/utils/request';
import API from '@/services/api';

//获取导入配置
export const getImportConfigService = (options) => {
  return fetchGet(API.GET_IMPORT_CONFIG_API, { params: options });
};
//获取导入配置所属项目数据
export const getProjectsService = (param) => {
  return fetchGet(API.GET_PROJECTS, { params: param });
};
//获取导入配置组件分类数据
export const getComponentClassifyTreeDataService = () => {
  return fetchPost(API.GET_TREEDATA, {});
};
export const reqApplicationList = (options) => {
  return fetchPost(API.GET_APPLICATION_LIST, { body: options });
};
export const getListDataService = (param) => {
  return fetchPost(API.GET_LISTDATA, { body: param });
};
export const checkLastImportResourceService = (param) => {
  return fetchGet(API.CHECK_LAST_IMPORT_RESOURCE);
};
export const importComOrAppService = (options) => {
  return fetchPost(API.IMPORT_COM_OR_APP, { body: options });
};
export const importVersionValidateService = (param) => {
  return fetchGet(API.IMPORT_VERSION_VALIDATE, { params: param });
};
