/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-06-22 16:55:59
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-09-10 15:30:28
 */
import T from 'utils/T';
import EnumAPI from 'constants/EnumAPI';
const { get, postJSON, del, put, download, upload } = T.request;

/*
 |-----------------------------------------------------------------------
 | 场景管理的API相关操作
 |-----------------------------------------------------------------------
 */


/**
 * 检查场景信息
 * @param {Number} component_id
 * @param {String} filePath
 * @param {String} name
 * @param {Number} type
 * @return {Promise}
 */
export const checkScene = (fileInfo) => postJSON(EnumAPI.scene_checkScene, fileInfo);
export const checkSceneEdit = (fileInfo) => postJSON(EnumAPI.scene_checkSceneEdit, fileInfo);
/**
 * 添加场景
 * @param {Number} component_id
 * @param {String} filePath
 * @param {String} name
 * @param {Number} type
 * @return {Promise}
 */
export const addScene = (fileInfo) => postJSON(EnumAPI.scene_addScene, fileInfo);

/**
 * 编辑场景
 */
export const editScene = (params) => postJSON(EnumAPI.scene_editScene, params);

/**
 * 删除场景
 * @param {Number} sceneId
 * @return {Promise}
 */
export const delScene = (sceneId) => postJSON(EnumAPI.scene_delScene, {sceneId});

/**
 * 分页查询场景
 * @param {Number} pageSize
 * @param {String} current
 * @return {Promise}
 */
export const queryScene = (params) => postJSON(EnumAPI.scene_queryScene, params);

/**
 * 查询全部场景
 * @return {Promise}
 */
export const queryAllScene = () => postJSON(EnumAPI.scene_queryAllScene);

/**
 * 上传文件
 * @param {Number} formData
 * @return {Promise}
 */
export const uploadScene = ( formData ,callback) => upload(EnumAPI.scene_upload, formData ,callback);

