/**
 * Created by chencheng on 2017/8/24.
 */
const EnumPermissionSubjectType = require('../../constants/app/rbac/permission').EnumPermissionSubjectType;

/**
 * 获取菜单权限的where条件
 * @param subject_type
 * @param subject_id
 * @return {*}
 */
const getMenuPermissionWhere = (subject_type, subject_id) => {
    const subject = {
        [EnumPermissionSubjectType.user]: {user_id: subject_id},
        [EnumPermissionSubjectType.role]: {role_id: subject_id},
        [EnumPermissionSubjectType.group]: {group_id: subject_id},
    };

    return subject[subject_type];
};

module.exports = class extends think.Service {
    /**
     *
     * @param db //db链接方式
     */
    constructor(db) {
        super();
        // 角色model实例
        this.modelenMenuPermissionIns = db ? think.model('menuPermission').db(db) : think.model('menuPermission');
    }

    /**
     * 获取所有菜单权限
     * @param {Number} account_id
     * @param {Number} user_id
     * @param {Array<Number>} group_ids
     * @param {Array<Number>} role_ids
     * @param {String} field
     * @return {Promise<any>}
     */
    async getMenuAllPermission(account_id, user_id, group_ids, role_ids, field = '*'){
        let complexWhere = {
            user_id,
            group_id: ['IN', group_ids],
            role_id: ['IN', role_ids],
            _logic: 'OR'
        };

        if (think.isEmpty(group_ids)) delete complexWhere.group_id;
        if (think.isEmpty(role_ids)) delete complexWhere.role_id;

        return await this.modelenMenuPermissionIns
            .where({
                account_id,
                _complex: complexWhere
            })
            .field(field)
            .select()
            .catch(err => {
                think.logger.error(err);
                return think.isError(err) ? err : new Error(err)
            });
    }

    /**
     * 获取菜单权限
     * @param {Number} account_id
     * @param {Number} subject_id
     * @param {Number} subject_type
     * @param {String} field
     * @return {Promise<*>}
     */
    async getMenuPermissionById(account_id, subject_id, subject_type, field = "*") {
        const where =  Object.assign(getMenuPermissionWhere(subject_type, subject_id), {account_id});
        return await this.modelenMenuPermissionIns.where(where).field(field).find().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }


    /**
     * 添加或更新菜单权限
     * @param {Number} account_id
     * @param {Number} subject_id
     * @param {Number} subject_type
     * @param {Array} permission
     * @return {Promise<*>}
     */
    async addOrUpdateMenuPermission(account_id, subject_id, subject_type, permission = []) {
        const where =  Object.assign(getMenuPermissionWhere(subject_type, subject_id), {account_id});
        const data = Object.assign({permission: JSON.stringify(permission)}, where);

        return await this.modelenMenuPermissionIns.thenUpdate(data, where).catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 删除菜单权限
     * @param {Number} account_id
     * @param {Array<Number>} subject_ids
     * @param {Number} subject_type
     * @return {Promise<*>}
     */
    async delMenuPermissionByIds(account_id, subject_ids, subject_type) {
        const subject = {
            [EnumPermissionSubjectType.user]: {user_id: ['IN', subject_ids]},
            [EnumPermissionSubjectType.role]: {role_id: ['IN', subject_ids]},
            [EnumPermissionSubjectType.group]: {group_id: ['IN', subject_ids]},
        };
        // where 条件
        const where =  Object.assign(subject[subject_type], {account_id});

        return await this.modelenMenuPermissionIns.where(where).delete().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /*
     |-----------------------------------------------------------------------------
     | 以下处理数据权限
     |-----------------------------------------------------------------------------
     */
}
