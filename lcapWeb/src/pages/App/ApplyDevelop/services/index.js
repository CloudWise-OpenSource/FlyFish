import { fetchGet, fetchPost,fetchPut,fetchDelete } from "@/utils/request";
import API from "@/services/api/application";
import APII from "@/services/api/component";
import APIII from "@/services/api/app";



export const reqApplicationList = (options) => {
  return fetchPost(API.GET_APPLICATION_LIST, { body: options });
};
export const reqTagsList = (options) => {
  return fetchGet(APII.GET_TAGS,{ params: options } );
};
export const addApplication = (options) => {
  return fetchPost(API.ADD_APPLICATION, { body: options });
};
export const changeApplication = (id,options) => {
  return fetchPut(API.CHANGE_APPLICATION+id+'/basic', { body: options });
};
export const deleteApplication = (id) => {
  return fetchDelete(API.DELETE_APPLICATION+id);
};
export const copyApplication = (id,options) => {
  return fetchPost(API.COPY_APPLICATION+id,{ body: options });
};
export const exportApplication = (id) => {
  return fetchGet(API.EXPORT_APPLICATION+id);
};
export const reqProjectList = () => {
  return fetchGet(APIII.GET_PROJECT_MANAGELIST_API );
};