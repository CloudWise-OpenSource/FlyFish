import { mockInstance } from '@chaoswise/request';
import { demoListData } from './demoListConfig';

mockInstance.onGet("/get/basictablelist", {

}).reply((config) => {
  let filterData = demoListData;
  let resultData = [];
  let totalNum = 0;
  let curPage = config.params.curPage;
  let pageSize = config.params.pageSize;

  totalNum = filterData.length;
  resultData = filterData.slice((curPage - 1) * pageSize, curPage * pageSize);

  return [200, {
    data: resultData,
    total: totalNum
  }];
});