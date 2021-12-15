const EnumComponentsCategoriesType = require('../../../common/constants/app/visual/EnumVisualComponents').EnumComponentsCategoriesType;

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
        this.modelCategoriesIns = think.model('visualComponentsCategories', {}, think.config('custom.appModules.web'));
    }

    /**
     * 校验分类名称是否存在
     * @param {Number} account_id
     * @param {String} name
     * @param {Mixed} categories_id    // 存在具体的id是用于验证更新数据， 不存在id是验证创建数据
     */
    async isExistName(account_id, name, categories_id = null) {
        const where = {account_id, name};
        if(categories_id) where.categories_id = ['!=', categories_id];

        const result = await this.modelCategoriesIns.where(where).softCount().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err);
        });

        return result > 0 ?  true : false;
    }

    /**
     * 添加分类
     * @param {Number} account_id
     * @param {Object} params
     * @param {String} params.name      // 分类名称
     * @param {Number} params.type      // 分类类型
     * @param {Object} params.config    // 分类配置
     * @returns {Promise<*>}
     */
    async addCategories(account_id, params){
        Object.assign(params, {
            account_id,
            config: JSON.stringify(params.config)
        });

        return await this.modelCategoriesIns.add(params).catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 获取分类列表
     * @param {Number} account_id
     * @param {Number} type         // 分类类型
     * @param {Number} page         // 当前分页数
     * @param {Number} pageSize     // 每页显示的数量
     * @param {Object} search       // 搜索条件
     * @returns {Promise<void>}
     */
    async getCategoriesPageList(account_id, type, page, pageSize = 15, search = {}) {
        const where = Object.assign({account_id,type}, formatSearchParams(search));
        if (where.type == EnumComponentsCategoriesType.all) delete where.type;

        return await this.modelCategoriesIns.where(where).page(page, pageSize).softCountSelect().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err);
        });
    }

    /**
     * 获取所有分类
     * @param {Number} account_id
     * @returns {Promise<void>}
     */
    async getAllList(account_id) {
        return await this.modelCategoriesIns.where({account_id}).field('categories_id,name').softSelect().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err);
        });
    }

    /**
     * 获取单个分类详情
     * @param {Number} account_id
     * @param {Number} categories_id
     * @returns {Promise<any>}
     */
    async getCategoriesById(account_id, categories_id){
        return await this.modelCategoriesIns.where({account_id, categories_id}).softFind().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 更新分类
     * @param {Number} account_id
     * @param {Number} categories_id
     * @param {Object} data
     * @param {Object} data.name
     * @param {Object} data.config
     * @returns {Promise<void>}
     */
    async updateCategories(account_id, categories_id, data) {
        return await this.modelCategoriesIns.where({ account_id, categories_id }).update(data).catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 删除分类
     * @param {Number} account_id
     * @param {Array} categories_ids
     * @returns {Promise<void>}
     */
    async delCategories(account_id, categories_ids) {
        return await this.modelCategoriesIns.where({ account_id, categories_id: ['IN', categories_ids] }).softDel().catch(err => {
        // return await this.modelCategoriesIns.where({ account_id, categories_id: ['IN', categories_ids] }).delete().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }
}
