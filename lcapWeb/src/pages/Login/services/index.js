import { fetchGet, fetchPost } from "@/utils/request";
import API from "@/services/api";


export const register = (options) => {
  return fetchPost(API.REGISTER, { body: options });
};
export const login = (options) => {
  return fetchPost(API.LOGIN, { body: options });
};