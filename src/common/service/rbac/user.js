/**
 * Created by chencheng on 2017/8/24.
 */
const EnumUserStatus = require('../../constants/app/rbac/user').EnumUserStatus;
const mkUserPassword = require('../../constants/app/rbac/user').mkUserPassword;

/**
 * 格式化过滤条件
 * @param search
 * @returns {*}
 */
const formatSearchParams = (search) => {
    search = think.isEmpty(search) ? {} : JSON.parse(search);
    if (search.hasOwnProperty('user_name')) search.user_name = ['like','%' + search.user_name + '%'];
    if (search.hasOwnProperty('user_phone')) search.user_phone = ['like','%' + search.user_phone + '%'];
    if (search.hasOwnProperty('user_email')) search.user_email = ['like','%' + search.user_email + '%'];

    return search;
};

module.exports = class extends think.Service{
	constructor(){
		super();
		this.cacheService = think.service('cache');

		// 用户model实例
		this.modelUserIns = think.model('user');
	}

    /**
     * 是否允许登录
     * @returns {Promise<void>}
     */
    async isAllowLogin(user_email, user_password) {
        return await this.modelUserIns.where({user_status: EnumUserStatus.normal, user_email, user_password: mkUserPassword(user_password)}).find().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 校验是否存在
     * @param {Object} params
     * @param {Mixed} user_id    // 存在具体的id是用于验证更新数据， 不存在id是验证创建数据
     */
    async isExist(account_id, params = {}, user_id = null) {
        const where = Object.assign({account_id}, params);
        if(user_id) where.user_id = ['!=', user_id];

        const result = await this.modelUserIns.where(where).softCount().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err);
        });

        return result > 0 ?  true : false;
    }

	/**
	 * 注册用户
	 *
	 * @param {Number} account_id
	 * @param {Object} params
	 * @param {string} params.user_email
	 * @param {string} params.user_name
	 * @param {string} params.user_password
	 * @param {string} params.user_phone
	 * @param {string} params.user_status
	 *
	 * @returns {Promise.<*>}
	 */
	async addUser(account_id, params) {
		Object.assign(params, {
            user_password: mkUserPassword(params['user_password']),
			account_id: account_id,
		});

		return await this.modelUserIns.add(params).catch(err => {
            think.logger.error(err);
			return think.isError(err) ? err : new Error(err)
		});
	}


    /**
     * 获取用户列表
     * @param {Number} account_id
     * @param {Number} page         // 当前分页数
     * @param {Number} pageSize     // 每页显示的数量
     * @param {Object} user_status  // 用户状态
     * @param {Object} search       // 搜索条件
     * @param {Array} [fields]
     * @returns {Promise<void>}
     */
    async getUserPageList(account_id, user_status, page, pageSize = 15, search = {}, fields = "*") {
        const where = Object.assign({account_id, user_status}, formatSearchParams(search));
        if (where.user_status == EnumUserStatus.all) delete where.user_status;
        fields = Array.isArray(fields) ? fields.join(',') : fields;

        return await this.modelUserIns.where(where).page(page, pageSize).field(fields).softCountSelect().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err);
        });
    }

    /**
     * 获取所有用户列表
     * @param {Number} account_id
     * @param {Array} [fields]
     * @returns {Promise<void>}
     */
    async getAllUser(account_id, fields = "*") {
        fields = Array.isArray(fields) ? fields.join(',') : fields;

        return await this.modelUserIns.where({account_id}).field(fields).softSelect().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err);
        });
    }

    /**
     * 获取单个用户详情
     * @param {Number} account_id
     * @param {Number} user_id
     * @param {Array} [fields]
     * @returns {Promise<any>}
     */
    async getUserById(account_id, user_id, fields = "*"){
        fields = Array.isArray(fields) ? fields.join(',') : fields;
        return await this.modelUserIns.where({account_id, user_id}).field(fields).softFind().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 获取单个用户详情
     * @param {Number} account_id
     * @param {Number} user_id
     * @param {Array} [fields]
     * @returns {Promise<any>}
     */
    async getUserList(id){
        id = Array.isArray(id) ? id : [id];
        return this.modelUserIns.where({ user_id: ['IN', id] }).limit(id.length).select();
    }

    /**
     * 更新用户
     * @param {Number} account_id
     * @param {Number} user_id
     * @param {Object} data
     * @param {String} [data.user_name]
     * @param {String} [data.user_email]
     * @param {String} [data.user_phone]
     * @param {String} [data.user_status]
     * @returns {Promise<void>}
     */
    async updateUser(account_id, user_id, data) {
        return await this.modelUserIns.where({account_id, user_id}).update(data).catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 删除用户
     * @param {Number} account_id
     * @param {Array} user_ids
     * @returns {Promise<void>}
     */
    async delUser(account_id, user_ids) {
        return await this.modelUserIns.where({user_id: ['IN', user_ids] }).softDel().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

     /**
     * 禁用用户
     * @param {Number} account_id
     * @param {Array} user_ids
     * @returns {Promise<void>}
     */
      async disableUser(user_id) {
        return await this.modelUserIns.where({user_id}).update({user_status: EnumUserStatus.disable}).catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 获取单个用户详情
     * @param {Number} account_id
     * @param {Number} user_id
     * @param {Array} [fields]
     * @returns {Promise<any>}
     */
    async getUser(id){
        id = Array.isArray(id) ? id : [id];
        return this.modelUserIns.where({ user_id: ['IN', id] }).limit(id.length).select();
    }
}
