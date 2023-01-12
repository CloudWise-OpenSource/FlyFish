import { fetchGet } from "@/utils/request";
import API from "@/services/api";
import { dataSearchTypeMappings } from "@/pages/DataSearch/constants/enum";
// 获取数据源列表
export const getDataSearchListService = (queryName) => {
  return fetchGet(API.GET_DATA_SEARCH_LIST, {
    params: {
      queryType: dataSearchTypeMappings.basic.id,
      queryName,
      pageNo: 1,
      pageSize: 20,
    },
  });
};

export const validateSelectItemValueService = (settingId, queryType) => {
  return fetchGet(API.VALIDATE_SELECT_ITEM_VALUE, {
    params: {
      settingId,
      queryType
    },
  });
};
