/**
 * Created by chencheng on 2017/8/24.
 */
const EnumAccessTokenStatus = require('../../constants/app/accessToken').EnumAccessTokenStatus;
const mkAccessKeyID = require('../../constants/app/accessToken').mkAccessKeyID;
const mkAccessKeySecret = require('../../constants/app/accessToken').mkAccessKeySecret;
const mkAccessToken = require('../../constants/app/accessToken').mkAccessToken;

/**
 * 格式化过滤条件
 * @param search
 * @returns {*}
 */
const formatSearchParams = (search) => {
    search = think.isEmpty(search) ? {} : JSON.parse(search);
    return search;
};

module.exports = class extends think.Service{
	constructor(){
		super();
		this.cacheService = think.service('cache');

		// accessTokenmodel实例
		this.modelAccessTokenIns = think.model('accessToken');
	}

	/**
	 * 添加accessToken
	 * @param {Number} account_id
	 * @returns {Promise.<*>}
	 */
	async addAccessToken(account_id) {
        const params = {
            account_id,
            access_key_id: mkAccessKeyID(),
            access_key_secret: mkAccessKeySecret(),
            token: mkAccessToken(),
            status: EnumAccessTokenStatus.normal
		};

		return await this.modelAccessTokenIns.add(params).catch(err => {
            think.logger.error(err);
			return think.isError(err) ? err : new Error(err)
		});
	}


    /**
     * 获取accessToken列表
     * @param {Number} account_id
     * @param {Number} page         // 当前分页数
     * @param {Number} pageSize     // 每页显示的数量
     * @param {Object} search       // 搜索条件
     * @param {Array} [fields]
     * @returns {Promise<void>}
     */
    async getAccessTokenPageList(account_id, page, pageSize = 15, search = {}, fields = "*") {
        const where = Object.assign({account_id}, formatSearchParams(search));
        fields = Array.isArray(fields) ? fields.join(',') : fields;

        return await this.modelAccessTokenIns.where(where).page(page, pageSize).field(fields).softCountSelect().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err);
        });
    }

    /**
     * 获取所有accessToken列表
     * @param {Number} account_id
     * @param {Array} [fields]
     * @returns {Promise<void>}
     */
    async getAllAccessToken(account_id, fields = "*") {
        fields = Array.isArray(fields) ? fields.join(',') : fields;

        return await this.modelAccessTokenIns.where({account_id}).field(fields).softSelect().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err);
        });
    }

    /**
     * 获取单个accessToken详情
     * @param {Number} access_key_id
     * @param {Array} [fields]
     * @returns {Promise<any>}
     */
    async getAccessTokenById(access_key_id, fields = "*"){
        fields = Array.isArray(fields) ? fields.join(',') : fields;
        return await this.modelAccessTokenIns.where({access_key_id}).field(fields).softFind().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 更新accessToken
     * @param {Number} account_id
     * @param {Number} access_key_id
     * @param {Object} data
     * @param {String} [data.status]
     * @returns {Promise<void>}
     */
    async updateAccessToken(account_id, access_key_id, data) {
        return await this.modelAccessTokenIns.where({account_id, access_key_id}).update(data).catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 删除accessToken
     * @param {Number} account_id
     * @param {Array} access_key_ids
     * @returns {Promise<void>}
     */
    async delAccessToken(account_id, access_key_ids) {
        return await this.modelAccessTokenIns.where({access_key_id: ['IN', access_key_ids] }).delete().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }


}
