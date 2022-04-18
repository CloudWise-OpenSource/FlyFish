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
        this.modelAccountIns = think.model('account');
    }

    /**
     * 校验账户名称是否存在
     * @param {String} name
     * @param {Mixed} account_id    // 存在具体的id是用于验证更新数据， 不存在id是验证创建数据
     */
    async isExistName(name, account_id = null) {
        const where = {name};
        if(account_id) where.account_id = ['!=', account_id];

        const result = await this.modelAccountIns.where(where).softCount().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err);
        });

        return think.isError(result) || !result ?  true : false;
    }

    /**
     * 添加账户
     * @param {Object} params
     * @param {String} params.name      // 账户名称
     * @returns {Promise<*>}
     */
    async addAccount(params){
        return await this.modelAccountIns.add(params).catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 获取账户列表
     * @param {Number} page         // 当前分页数
     * @param {Number} pageSize     // 每页显示的数量
     * @param {Object} search       // 搜索条件
     * @param {Array} [fields]
     * @returns {Promise<void>}
     */
    async getAccountPageList(page, pageSize = 15, search = {}, fields = "*") {
        const where = formatSearchParams(search);
        fields = Array.isArray(fields) ? fields.join(',') : fields;

        return await this.modelAccountIns.where(where).page(page, pageSize).field(fields).softCountSelect().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err);
        });
    }

    /**
     * 获取所有账户列表
     * @param {Array} [fields]
     * @returns {Promise<void>}
     */
    async getAllAccount(fields = "*") {
        fields = Array.isArray(fields) ? fields.join(',') : fields;

        return await this.modelAccountIns.field(fields).softSelect().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err);
        });
    }

    /**
     * 获取单个账户详情
     * @param {Number} account_id
     * @param {Array} [fields]
     * @returns {Promise<any>}
     */
    async getAccountById(account_id, fields = "*"){
        fields = Array.isArray(fields) ? fields.join(',') : fields;
        return await this.modelAccountIns.where({account_id}).field(fields).softFind().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 更新账户
     * @param {Number} account_id
     * @param {Object} data
     * @param {Object} data.name
     * @returns {Promise<void>}
     */
    async updateAccount(account_id, data) {
        return await this.modelAccountIns.where({account_id}).update(data).catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 删除账户
     * @param {Number} account_id
     * @param {Array} account_ids
     * @returns {Promise<void>}
     */
    async delAccount(account_ids) {
        return await this.modelAccountIns.where({account_id: ['IN', account_ids] }).softDel().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

}
