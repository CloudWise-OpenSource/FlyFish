
import { getAllUser } from '../webAPI/user';
import { getAllRole } from '../webAPI/role';
import { getAllGroupTree } from '../webAPI/group';

import { disposeMenuPermission, getMenuPermission } from '../webAPI/permission';

import { EnumPermissionSubjectType } from 'constants/app/rbac/permission';
import { EnumUserStatusType } from 'constants/app/rbac/user';

/**
 * 获取权限主体列表
 * @param {Number} targetType
 * @param {Number} page
 * @param {Object} search
 * @returns {Promise}
 */
export const doGetPermissionTargetList = (targetType, page = 1, search = {}) => {
    switch (targetType) {
        case EnumPermissionSubjectType.user.value:
            return getAllUser(page, EnumUserStatusType.all.value, search);

        case EnumPermissionSubjectType.role.value:
            return getAllRole(page, search);

        case EnumPermissionSubjectType.group.value:
            return getAllGroupTree(page, search);
    }
}

/**
 * 获取菜单权限
 * @param {Number} subject_id
 * @param {Number} subject_type
 * @return {*}
 */
export const doGetMenuPermission = (subject_id, subject_type) => getMenuPermission(subject_id, subject_type);


/**
 * 处理菜单权限
 * @param {Number} subject_id
 * @param {Number} subject_type
 * @param {Array} permission
 * @return {*}
 */
export const doDisposeMenuPermission = (subject_id, subject_type, permission) => disposeMenuPermission(subject_id, subject_type, permission);

