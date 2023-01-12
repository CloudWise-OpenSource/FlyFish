import { fetchPost } from '@/utils/request';
import API from '@/services/api';
import { dataSearchTypeMappings } from '@/pages/DataSearch/constants/enum';

export const getQueryDataListService = (options) => {
  return fetchPost(
    options.queryType == dataSearchTypeMappings.timeSeriesValueGroup.id
      ? API.GET_DATA_SEARCH_GROUP_SERIES_PREVIEW_DATA
      : API.GET_DATA_SEARCH_GROUP_PREVIEW_DATA,
    {
      body: options,
    }
  );
};
