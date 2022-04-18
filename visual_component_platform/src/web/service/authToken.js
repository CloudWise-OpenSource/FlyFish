
module.exports = class extends think.Service{
    constructor(){
        super();
        // 用户model实例
        this.authTokenIns = think.model('authToken', {}, think.config('custom.appModules.web'));

        this.helperService = think.service('helper');
    }

    /**
     * 生成大屏的uuid
     * @return {*}
     */
    mkToken() {
        return this.helperService.uuid.v1();
    }

    /**
     * 添加数据存储
     * @param {Number} account_id
     * @param {Object} params
     * @param {String} params.name      // 数据存储名称
     * @param {String} params.type      // 数据存储类型
     * @param {Object} params.config    // 数据存储配置
     * @returns {Promise<*>}
     */
    async addDataStore(account_id, params){
        Object.assign(params, {
            account_id,
            token: this.mkToken()
        });

        return await this.authTokenIns.add(params).catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 获取token信息
     * @param {String} token
     * @param {Array} [fields]
     * @return {Promise<*>}
     */
    async getAuthTokenByToken(token, fields = "*"){
        fields = Array.isArray(fields) ? fields.join(',') : fields;

        return await this.authTokenIns.where({token}).field(fields).softFind().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }


}
