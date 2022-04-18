import * as ActionTypes from '../constants/actionTypes/categories';
import T from 'utils/T';
import {
    getAllCategories,
    getCategoriesPageList,
    getCategoriesDetail,
    addCategories,
    updateCategories,
    delCategories
} from '../webAPI/categories';

/**
 * 获取所有可视化组件分类
 * @returns {Promise}
 */
export const doGetAllCategories = () => getAllCategories();

/**
 * 获取组件分类分页列表
 * @param page
 * @param type
 * @param search
 * @returns {function(*)}
 */
export const getCategoriesPageListAction = (page, type, search = {}) => dispatch => {
    // 设置加载状态
    dispatch({ type: ActionTypes.FETCHING_V_COMPONENT_CATEGORIES_LIST_STATUS });

    // 获取数据
    getCategoriesPageList(page, type, search).then((resp) => {
        dispatch({ type: ActionTypes.FETCH_DID_V_COMPONENT_CATEGORIES_LIST, categoriesList: resp.data });
    }, (resp) => {
        T.prompt.error(resp.msg);
    });
};


/**
 * 删除组件分类
 * @param {Array} categories_ids // 组件分类id
 * @returns {Promise}
 */
export const doDelCategories = (categories_ids) => delCategories(categories_ids);


/**
 * 删除状态
 * @param [Array] categories_ids
 * @returns {{type: string, categories_ids: *}}
 */
export const delCategoriesAction = (categories_ids) => ({ type: ActionTypes.DEL_V_COMPONENT_CATEGORIES, categories_ids });


/**
 * 获取组件分类详情
 * @param {Number} categories_id
 * @returns {Promise}
 */
export const doGetCategoriesDetail = (categories_id) => getCategoriesDetail(categories_id);


/**
 * 添加组件分类
 * @param {String} name
 * @param {String} type
 * @returns {Promise}
 */
export const doAddCategories = (name, type) => addCategories(name, type);


/**
 * 修改组件分类
 * @param {Number} categories_id
 * @param {String} name
 * @param {String} type
 * @returns {Promise}
 */
export const doUpdateCategories = (categories_id, name, type) => updateCategories(categories_id, name, type);
