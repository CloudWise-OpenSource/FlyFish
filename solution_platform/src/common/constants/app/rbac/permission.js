
/**
 * 枚举权限类型
 * @type {{is_only_read: string, is_write: string}}
 */
exports.EnumPermissionType = {
    is_only_read: 'is_only_read',       // 只读
    is_write: 'is_write'                // 可写
};


/**
 * 枚举主体类型
 * @type {{role: number, group: number, user: number}}
 */
exports.EnumPermissionSubjectType = {
    user: 1,        // 用户
    role: 2,        // 角色
    group: 3,       // 分组
};



