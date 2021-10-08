/**
 * 格式化过滤条件
 * @param search
 * @returns {*}
 */
const formatSearchParams = (search) => {
    search = think.isEmpty(search) ? {} : JSON.parse(search);
    if (search.hasOwnProperty('name')) search.name = ['like','%' + search.name + '%'];

    return search;
};

module.exports = class extends think.Service{
    constructor(){
        super();

        // 用户model实例
        this.modelVisualOrgIns = think.model('componentsOrg', {}, think.config('custom.appModules.web'));
    }

    /**
     * 校验组织标示名称是否存在
     * @param {Number} account_id
     * @param {Object} params
     * @param {Mixed} org_id    // 存在具体的id是用于验证更新数据， 不存在id是验证创建数据
     */
    async isExist(account_id, params, org_id = null) {
        const where = Object.assign({account_id}, params);
        if(org_id) where.org_id = ['!=', org_id];

        const result = await this.modelVisualOrgIns.where(where).softCount().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err);
        });

        return !think.isError(result) && result > 0  ?  true : false;
    }

    /**
     * 添加组织
     * @param {Number} account_id
     * @param {Object} params
     * @param {String} params.name                // 组织名称
     * @param {String} params.description         // 组织描述
     * @returns {Promise<*>}
     */
    async addOrg(account_id, params){
        Object.assign(params, { account_id });

        return await this.modelVisualOrgIns.add(params).catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 获取组织列表
     * @param {Number} account_id
     * @param {Number} page         // 当前分页数
     * @param {Number} pageSize     // 每页显示的数量
     * @param {Object} search       // 搜索条件
     * @returns {Promise<void>}
     */
    async getOrgPageList(account_id, page, pageSize = 15, search = {}) {
        const where = Object.assign({account_id}, formatSearchParams(search));

        return await this.modelVisualOrgIns.where(where).page(page, pageSize).softCountSelect().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err);
        });
    }

    /**
     * 获取所有组织
     * @param {Number} account_id
     * @param {Array | String} fields
     * @returns {Promise<void>}
     */
    async getAllOrg(account_id, fields = "*") {
        const where = {account_id};
        fields = Array.isArray(fields) ? fields.join(',') : fields;

        return await this.modelVisualOrgIns.where(where).field(fields).softSelect().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err);
        });
    }

    /**
     * 获取单个组织详情
     * @param {Number} account_id
     * @param {Number} org_id
     * @returns {Promise<any>}
     */
    async getOrgById(account_id, org_id){
        return await this.modelVisualOrgIns.where({account_id, org_id}).softFind().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 更新组织
     * @param {Number} account_id
     * @param {Number} org_id
     * @param {Object} data
     * @param {String} data.name                // 组织名称
     * @param {String} data.description         // 组织描述
     * @returns {Promise<void>}
     */
    async updateOrg(account_id, org_id, data) {
        return await this.modelVisualOrgIns.where({ account_id, org_id }).update(data).catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 删除组织
     * @param {Number} account_id
     * @param {Array} org_ids
     * @returns {Promise<void>}
     */
    async delOrg(account_id, org_ids) {
        return await this.modelVisualOrgIns.where({ account_id, org_id: ['IN', org_ids] }).delete().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }
}
