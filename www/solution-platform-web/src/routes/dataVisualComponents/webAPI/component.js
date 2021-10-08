import T from 'utils/T';
import EnumAPI from 'constants/EnumAPI';
const { get, postJSON, del, put, download, upload } = T.request;

/**
 * 获取可视化组件分页列表
 * @param {Number} page
 * @param {Object} search
 * @returns {Promise}
 */
export const getComponentPageList = (page, pageSize, search = {}) => get(EnumAPI.dvComponents_getPageList, { page, pageSize, search });


/**
 * 获取单个可视化组件详情
 * @param {Number} component_id
 * @returns {Promise}
 */
export const getComponentDetail = (component_id) => get(EnumAPI.dvComponents_getDetail, { component_id });

/**
 * 添加可视化组件
 * @param {Object} params
 * @param {String} params.name  组件名称
 * @param {String} params.component_mark    组件标识
 * @param {Number} params.categories_id     组件分类
 * @param {Number} params.org_id            组织
 * @returns {Promise}
 */
export const addComponent = (params = {}) => {
    return postJSON(EnumAPI.dvComponents_addComponent, params);
};

/**
 * 更新可视化组件
 * @param {Object} params
 * @param {String} params.name  组件名称
 * @param {Number} params.categories_id     组件分类
 * @param {Number} params.component_id     组件ID
 * @returns {Promise}
 */
export const updateComponent = (params) => put(EnumAPI.dvComponents_updateComponent, params);

/**
 * 删除可视化组件
 * @param {Array} component_ids
 * @returns {Promise}
 */
export const delComponent = (component_ids) => del(EnumAPI.dvComponents_delComponent, { component_ids });

/**
 * 上架可视化组件
 * @param component_id
 * @return {Promise}
 */
export const putawayComponent = (component_id, shelf_status) =>
    put(EnumAPI.dvComponents_putaway, { component_id, shelf_status });

/**
 * 下载可视化组件源代码
 * @param component_id
 * @return {Promise}
 */
export const downloadComponentCode = (component_id) => download(EnumAPI.dvComponents_downloadComponentCode, { component_id }, { responseType: 'blob' });

/**
 * 导入可视化组件源代码
 * @param {Object} params
 * @param {Object} params.component  组件包
 * @param {Number} params.component_id     组件ID
 * @param {Function} onUploadProgress
 * @returns {Promise}
 */
export const importComponentCode = (params = {}) => {
	return upload(EnumAPI.dvComponents_importComponentCode, params);
};

/**
 * 复制组件
 * @param {Object} params
 * @param {Number} params.component_id
 * @param {String} params.target_component_mark
 * @param {Number} params.target_org_id
 * @return {Promise}
 */
export const copyComponent = (params) => postJSON(EnumAPI.dvComponents_copy, params);


/*
 |-----------------------------------------------------------------------
 | 组件IO的API相关操作
 |-----------------------------------------------------------------------
 */

/**
 * 初始化组件开发空间
 * @param {Number} component_id
 * @returns {Promise}
 */
export const initDevComponentSpace = (component_id) => postJSON(EnumAPI.dvComponents_dev_initDevSpace, { component_id });

/**
 * 读取开发组件文件内容
 * @param {Number} component_id
 * @param {String} filePath
 * @return {Promise}
 */
export const readDevFile = (component_id, filePath) => get(EnumAPI.dvComponents_dev_readDevFile, { component_id, filePath });

/**
 * 添加开发组件文件或目录
 * @param {Number} component_id
 * @param {String} filePath
 * @param {String} fileContent
 * @return {Promise}
 */
export const saveDevFileContent = (component_id, filePath, fileContent) => put(EnumAPI.dvComponents_dev_saveDevFileContent, { component_id, filePath, fileContent });

/**
 * 添加开发组件文件或目录
 * @param {Number} component_id
 * @param {String} filePath
 * @param {String} name
 * @param {Number} type
 * @return {Promise}
 */
export const addDevFileOrDir = (component_id, filePath, name, type) => postJSON(EnumAPI.dvComponents_dev_addDevFileOrDir, { component_id, filePath, name, type });

/**
 * 更新开发组件文件或目录
 * @param {Number} component_id
 * @param {String} filePath
 * @param {String} name
 * @return {Promise}
 */
export const updateDevFileOrDir = (component_id, filePath, name) => put(EnumAPI.dvComponents_dev_updateDevFileOrDir, { component_id, filePath, name });

/**
 * 删除开发组件文件或目录
 * @param {Number} component_id
 * @param {String} filePath
 * @return {Promise}
 */
export const delDevFileOrDir = (component_id, filePath) => del(EnumAPI.dvComponents_dev_delDevFileOrDir, { component_id, filePath });

/**
 * npm install 开发组件
 * @param component_id
 * @return {Promise}
 */
export const npmDevComponent = (component_id) => postJSON(EnumAPI.dvComponents_dev_npmDevComponent, { component_id });

/**
 * 编译组件
 * @param component_id
 * @return {Promise}
 */
export const compileDevComponent = (component_id) => put(EnumAPI.dvComponents_dev_compileDevComponent, { component_id });


/**
 * 上传文件
 * @param {Number} component_id
 * @param {String} filePath
 * @param {Array} uploadFileList
 * @return {Promise}
 */
export const uploadFile = (component_id, filePath, uploadFileList) => upload(EnumAPI.dvComponents_dev_uploadFile, { component_id, filePath, uploadFileList });

