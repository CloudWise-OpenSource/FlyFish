import T from 'utils/T';
import EnumAPI from 'constants/EnumAPI';
const { get, formatUrlParams, post } = T.request;

/**
 * @description 获取标签列表
 * @param {object} params 请求参数
 * @returns {Promise<T>}
 */
export const getTagList = ({ page = 1, search, status = 1, pageSize = 10, not_default } = {}) => {
    const params = {
        page,
        pageSize,
    };
    if (status) {
        params.status = status;
    }
    if (search) {
        params.search = search;
    }
    if (not_default) {
        params.not_default = not_default;
    }
    const url = formatUrlParams(EnumAPI.system_componentTagList, params);
    return get(url);
};

/**
 * @description 新增标签
 * @param {object} params 标签内容
 * @returns {Promise<T>}
 */
export const addTag = (params = {}) => {
    return post(EnumAPI.system_addComponentTag, params);
};

/**
 * @description 编辑标签
 * @param {object} params 标签内容
 * @returns {Promise<T>}
 */
export const editTag = (params = {}) => {
    return post(EnumAPI.system_editComponentTag, params);
};

/**
 * @description 删除标签
 * @param {object} params 删除标签id列表
 * @returns {Promise<T>}
 */
export const deleteTag = (params = {}) => {
    return post(EnumAPI.system_deleteComponentTag, params);
};

/**
 * @description 根据大屏id获取标签
 * @param {number} screen_id 大屏id
 * @returns {Promise<T>}
 */
export const getTagListByScreenId = (screen_id) => {
    return get(EnumAPI.dvScreen_getTagList, { screen_id });
};

/**
 * @description 根据组件id获取标签
 * @param {number} component_id 组件id
 * @returns {Promise<T>}
 */
export const getTagListByComponentId = (component_id) => {
    return get(EnumAPI.dvComponents_getTagList, { component_id });
};
