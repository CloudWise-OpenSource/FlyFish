import T from 'utils/T';
import EnumAPI from 'constants/EnumAPI';
const { get, postJSON, del, put } = T.request;

/**
 * 处理菜单权限
 * @param {Number} subject_id
 * @param {Number} subject_type
 * @return {*}
 */
export const getMenuPermission = (subject_id, subject_type) => get(EnumAPI.permission_getMenuPermission, {subject_id, subject_type});


/**
 * 处理菜单权限
 * @param {Number} subject_id
 * @param {Number} subject_type
 * @param {Array} permission
 * @return {*}
 */
export const disposeMenuPermission = (subject_id, subject_type, permission) => put(EnumAPI.permission_disposeMenuPermission, {subject_id, subject_type, permission});
