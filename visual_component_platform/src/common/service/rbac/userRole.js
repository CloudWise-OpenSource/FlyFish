/**
 * Created by chencheng on 2017/8/24.
 */
const EnumUserRoleType = require('../../constants/app/rbac/userRole').EnumUserRoleType;

/**
 * 格式化过滤条件
 * @param search
 * @returns {*}
 */
const formatSearchParams = (search) => {
    search = think.isEmpty(search) ? {} : JSON.parse(search);
    if (search.hasOwnProperty('role_name')) search.role_name = ['like','%' + search.role_name + '%'];

    return search;
};

module.exports = class extends think.Service{
	constructor(){
		super();
		// 角色model实例
		this.modelUserRoleIns = think.model('userRole');
		this.modelUserRoleRelationIns = think.model('userRoleRelation').db(this.modelUserRoleIns.db());
	}

    /**
     * 校验是否存在
     * @param {Number} account_id
     * @param {Object} params
     * @param {Mixed} [role_id]    // 存在具体的id是用于验证更新数据， 不存在id是验证创建数据
     */
    async isExist(account_id, params = {}, role_id = null) {
        const where = Object.assign({account_id}, params);
        if(role_id) where.role_id = ['!=', role_id];

        const result = await this.modelUserRoleIns.where(where).softCount().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err);
        });

        return result > 0 ?  true : false;
    }

	/**
	 * 添加角色
	 *
	 * @param {Number} account_id
	 * @param {Object} params
	 * @param {string} params.role_name
	 * @param {string} params.description
	 * @returns {Promise.<*>}
	 */
	async addRole(account_id, params) {
		Object.assign(params, { account_id,  role_type: EnumUserRoleType.custom});

		return await this.modelUserRoleIns.add(params).catch(err => {
            think.logger.error(err);
			return think.isError(err) ? err : new Error(err)
		});
	}


    /**
     * 获取角色列表
     * @param {Number} account_id
     * @param {Number} page         // 当前分页数
     * @param {Number} pageSize     // 每页显示的数量
     * @param {Object} search       // 搜索条件
     * @param {Array} [fields]
     * @returns {Promise<void>}
     */
    async getRolePageList(account_id, page, pageSize = 15, search = {}, fields = "*") {
        const where = Object.assign({account_id}, formatSearchParams(search));
        fields = Array.isArray(fields) ? fields.join(',') : fields;

        return await this.modelUserRoleIns.where(where).page(page, pageSize).field(fields).softCountSelect().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err);
        });
    }

    /**
     * 获取所有角色列表
     * @param {Number} account_id
     * @param {Array} [fields]
     * @returns {Promise<void>}
     */
    async getAllRole(account_id, fields = "*") {
        fields = Array.isArray(fields) ? fields.join(',') : fields;

        return await this.modelUserRoleIns.where({account_id}).field(fields).softSelect().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err);
        });
    }

    /**
     * 获取单个角色详情
     * @param {Number} account_id
     * @param {Number} role_id
     * @param {Array} [fields]
     * @returns {Promise<any>}
     */
    async getRoleById(account_id, role_id, fields = "*"){
        fields = Array.isArray(fields) ? fields.join(',') : fields;
        return await this.modelUserRoleIns.where({account_id, role_id}).field(fields).softFind().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 更新角色
     * @param {Number} account_id
     * @param {Number} role_id
     * @param {Object} data
     * @param {String} [data.role_name]
     * @param {String} [data.description]
     * @returns {Promise<void>}
     */
    async updateRole(account_id, role_id, data) {
        return await this.modelUserRoleIns.where({account_id, role_id}).update(data).catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 删除角色
     * @param {Number} account_id
     * @param {Array} role_ids
     * @returns {Promise<void>}
     */
    async delRole(account_id, role_ids) {
        return await this.modelUserRoleIns.transaction(async () => {
            // 删除角色
            await this.modelUserRoleIns.where({account_id, role_id: ['IN', role_ids] }).delete();
            // 删除角色用户关系
            await this.modelUserRoleRelationIns.where({account_id, role_id: ['IN', role_ids] }).delete();

        }).catch(err => {
            this.modelUserRoleIns.rollback();
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 获取role_id依据user_id
     * @param {Number} account_id
     * @param {Number} user_id
     * @param {String} field
     * @return {Promise<any>}
     */
    async getRoleIdsByUserId(account_id, user_id, field = '*') {
        return await this.modelUserRoleRelationIns.field(field).where({user_id}).select().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 获取rolesInfo by roleIds
     * @param {Number} account_id
     * @param {Number} role_ids
     * @param {String} field
     * @return {Promise<any>}
     */
     async getRolesInfoByRoleIds(account_id, role_ids, field = '*') {
        return await this.modelUserRoleIns.where({account_id, role_id: ['IN', role_ids] }).field(field).select();
    }

    /**
     * 获取user_id依据role_id
     * @param {Number} account_id
     * @param {Number} role_id
     * @param {String} field
     * @return {Promise<any>}
     */
    async getUserIdsByRoleId(account_id, role_id, field = '*') {
        return await this.modelUserRoleRelationIns.field(field).where({role_id}).select().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 更新角色中的成员
     * @param {Number} account_id
     * @param {Number} role_id
     * @param {Array} addUsers
     * @param {Array} delUsers
     * @return {Promise<T>}
     */
    async updateRoleMember(account_id, role_id, addUsers = [], delUsers = []){
        return await this.modelUserRoleIns.transaction(async () => {
            // 删除角色成员
           if(delUsers.length > 0) await this.modelUserRoleRelationIns.where({role_id, account_id, user_id: ['IN', delUsers]}).delete();

            // 添加角色成员
            if(addUsers.length > 0) await this.modelUserRoleRelationIns.addMany(addUsers.map(user_id => ({user_id, role_id, account_id})));

        }).catch(err => {
            think.logger.error(err);
            this.modelUserRoleIns.rollback();
            return think.isError(err) ? err : new Error(err)
        });
    }

}
