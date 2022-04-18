import { fetchGet, fetchPost,fetchPut } from "@/utils/request";
import API from "@/services/api/application";
import APP from "@/services/api/app";
import COMPONENTS from "@/services/api/component";

//应用列表
export const getApplicationTemplateService = (options) => {
  return fetchPost(API.GET_APPLICATION_LIST, { body: options });

};
//行业列表
export const getTradesService = (options) => {
  return fetchGet(APP.INDUSTRY_LIST, { params: options });
};

//标签列表
export const changeApplication = (id,options) => {
  return fetchPut(API.CHANGE_APPLICATION+id+'/basic', { body: options });
};
export const reqTagsList = (options) => {
  return fetchGet(COMPONENTS.GET_TAGS,{ params: options } );
};
// 编辑应用
export const getTagsService = (options) => {
  return fetchGet(API.CHANGE_APPLICATION, { params: options });
};
export const reqProjectList = () => {
  return fetchGet(APP.GET_PROJECT_MANAGELIST_API );
};
export const copyApplication = (id,options) => {
  return fetchPost(API.COPY_APPLICATION+id,{ body: options });
};