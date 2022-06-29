import app from "./app";
import user from './user';
import rule from './role';
import data from './data';
import dataSearch from "./dataSearch";
import newApi from './newApi';
import appApi from "./appApi";
export default {
  ...app,
  ...user,
  ...rule,
  ...data,
  ...dataSearch,
  ...appApi,
  ...newApi
};