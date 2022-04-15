import { fetchGet, fetchPost } from "@/utils/request";
import API from "@/services/api/application";
import APII from '@/services/api/app';

export const reqApplicationList = (options) => {
  return fetchPost(API.GET_APPLICATION_LIST, { body: options });
};

// 行业列表
export const industryList = () => {
  return fetchGet(APII.INDUSTRY_LIST);
};
