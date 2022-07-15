
import { fetchGet, fetchPut } from "@/utils/request";
import API from "@/services/api/component";
export const getDetailDataService = (id) => {
  return fetchGet(API.GET_DETAILDATA + '/' + id);
};
export const editComponentService = (id, param) => {
  return fetchPut(API.EDIT_COMPONENT + '/' + id, { body: param });
};