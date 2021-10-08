import * as ActionTypes from '../constants/actionTypes/file';
import T from 'utils/T';

import {
    getImgGroupPageList,
    addImgGroup,
    delImgGroup,
    updateImgGroup
} from '../webAPI/file';

/**
 * 获取图片分组列表
 * @param page  分页
 * @param name 搜索内容
 * @param is_all 是否是全部
 * @returns {function(*)}
 */
export const getImgGroupListAction = (page = 1, is_all = false, name = '') => dispatch => {
    // 设置加载状态
    dispatch({ type: ActionTypes.FETCHING_GROUP_PAGE_LIST_STATUS });

    // 获取数据
    getImgGroupPageList(page, is_all, name).then((resp) => {
        dispatch({ type: ActionTypes.SET_IMG_GROUP_LIST, imgGroupList: resp.data });
    }, (resp) => {
        T.prompt.error(resp.msg);
    });
};

/**
 * 添加图片分组
 * @param name 分组名称
 * @param flag 分组标识符
 * @returns {function(*)}
 */
export const addImgGroupAction = (name = '', flag = '', callback) => dispatch => {
    // 获取数据
    addImgGroup(name, flag).then((resp) => {
        T.prompt.success(resp.msg);
        if(callback)callback();
        dispatch(getImgGroupListAction());
    }, (resp) => {
        T.prompt.error(resp.msg);
    });
};

/**
 * 删除图片分组
 * @param id 分组id
 * @returns {function(*)}
 */
export const delImgGroupAction = (id, callback) => dispatch => {
    // 获取数据
    delImgGroup(id).then((resp) => {
        T.prompt.success(resp.msg);
        if(callback)callback();
        dispatch(getImgGroupListAction());
    }, (resp) => {
        T.prompt.error(resp.msg);
    });
};

/**
 * 更新图片分组
 * @param id 分组id
 * @returns {function(*)}
 */
export const updateImgGroupAction = (id, name, callback) => dispatch => {
    // 获取数据
    updateImgGroup(id, name).then((resp) => {
        T.prompt.success(resp.msg);
        if(callback)callback();
        dispatch(getImgGroupListAction());
    }, (resp) => {
        T.prompt.error(resp.msg);
    });
};

