import * as ActionTypes from '../constants/actionTypes/component';
import T from 'utils/T';
import {
    getComponentPageList,
    getComponentDetail,
    addComponent,
    updateComponent,
    delComponent,
    putawayComponent,
    downloadComponentCode,
    importComponentCode,
    copyComponent,
    initDevComponentSpace,
    readDevFile,
    saveDevFileContent,
    addDevFileOrDir,
    updateDevFileOrDir,
    delDevFileOrDir,
    npmDevComponent,
    compileDevComponent,
    uploadFile,
} from '../webAPI/component';

/**
 * 获取组件分类分页列表
 * @param page
 * @param search
 * @returns {function(*)}
 */
export const getComponentPageListAction = (page, pageSize, search = {}) => dispatch => {
    // 设置加载状态
    dispatch({ type: ActionTypes.FETCHING_V_COMPONENT_LIST_STATUS });

    // 获取数据
    getComponentPageList(page, pageSize, search).then((resp) => {
        dispatch({ type: ActionTypes.FETCH_DID_V_COMPONENT_LIST, componentList: resp.data });
    }, (resp) => {
        T.prompt.error(resp.msg);
    });
};


/**
 * 删除组件
 * @param {Array} component_ids // 组件id
 * @returns {Promise}
 */
export const doDelComponent = (component_ids) => delComponent(component_ids);


/**
 * 删除状态
 * @param [Array] component_ids
 * @returns {{type: string, component_ids: *}}
 */
export const delComponentAction = (component_ids) => ({ type: ActionTypes.DEL_V_COMPONENT, component_ids });


/**
 * 获取组件详情
 * @param {Number} component_id
 * @returns {Promise}
 */
export const doGetComponentDetail = (component_id) => getComponentDetail(component_id);


/**
 * 添加组件
 * @param {Object} params
 * @param {String} params.name                // 组件名称
 * @param {String} params.component_mark      // 组件标识
 * @param {Number} params.categories_id       // 组件分类
 * @param {Number} params.org_id              // 组织
 * @returns {Promise}
 */
export const doAddComponent = (params) => addComponent(params);


/**
 * 修改组件
 * @param {Object} params
 * @param {String} params.name  组件名称
 * @param {Number} params.categories_id     组件分类
 * @param {Number} params.component_id     组件ID
 * @returns {Promise}
 */
export const doUpdateComponent = (params) => updateComponent(params);

/**
 * 下载可视化组件
 * @param component_id
 * @return {Promise}
 */
export const doPutawayComponent = (component_id, shelf_status) =>
    putawayComponent(component_id, shelf_status);

/**
 * 下载可视化组件源代码
 * @param component_id
 * @return {Promise}
 */
export const doDownloadComponentCode = (component_id) => downloadComponentCode(component_id);

/**
 * 导入可视化组件源代码
 * @param {Object} params
 * @param {Object} params.component  组件包
 * @param {Number} params.component_id
 * @return {Promise}
 */
export const doImportComponentCode = (parma) => importComponentCode(parma);


/**
 * 复制组件
 * @param {Object} params
 * @param {Number} params.component_id
 * @param {String} params.target_component_mark
 * @param {Number} params.target_org_id
 * @return {Promise}
 */
export const doCopyComponent = (params) => copyComponent(params);


/*
 |-----------------------------------------------------------------------
 | 组件IO的API相关操作
 |-----------------------------------------------------------------------
 */


/**
 * 初始化组件开发空间
 * @param component_id
 * @returns {Promise}
 */
export const doInitDevComponentSpace = (component_id) => initDevComponentSpace(component_id);

/**
 * 读取开发组件文件内容
 * @param {Number} component_id
 * @param {String} filePath
 * @return {Promise}
 */
export const doReadDevFile = (component_id, filePath) => readDevFile(component_id, filePath);

/**
 * 添加开发组件文件或目录
 * @param {Number} component_id
 * @param {String} filePath
 * @param {String} fileContent
 * @return {Promise}
 */
export const doSaveDevFileContent = (component_id, filePath, fileContent) => saveDevFileContent(component_id, filePath, fileContent);

/**
 * 添加开发组件文件或目录
 * @param {Number} component_id
 * @param {String} filePath
 * @param {String} name
 * @param {Number} type
 * @return {Promise}
 */
export const doAddDevFileOrDir = (component_id, filePath, name, type) => addDevFileOrDir(component_id, filePath, name, type);

/**
 * 更新开发组件文件或目录
 * @param {Number} component_id
 * @param {String} filePath
 * @param {String} name
 * @return {Promise}
 */
export const doUpdateDevFileOrDir = (component_id, filePath, name) => updateDevFileOrDir(component_id, filePath, name);

/**
 * 删除开发组件文件或目录
 * @param {Number} component_id
 * @param {String} filePath
 * @return {Promise}
 */
export const doDelDevFileOrDir = (component_id, filePath) => delDevFileOrDir(component_id, filePath);

/**
 * npm install 开发组件
 * @param component_id
 * @return {Promise}
 */
export const doNpmDevComponent = (component_id) => npmDevComponent(component_id);

/**
 * 编译组件
 * @param component_id
 * @return {Promise}
 */
export const doCompileDevComponent = (component_id) => compileDevComponent(component_id);


/**
 * 上传文件
 * @param {Number} component_id
 * @param {String} filePath
 * @param {Array} uploadFileList
 * @return {Promise}
 */
export const doUploadFile = (component_id, filePath, uploadFileList) => uploadFile(component_id, filePath, uploadFileList);
