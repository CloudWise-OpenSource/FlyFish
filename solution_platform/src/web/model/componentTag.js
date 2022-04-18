/**
 * @description 标签 model
 */

const baseModel = require('../../common/model/baseModel');
module.exports = class extends baseModel {
    constructor(...props) {
        super(...props);
        this._soft_del_field = 'id';
    }

    get tableName() {
        return 'component_tag';
    }

    /**
     * @description 获取标签列表(且不返回已删除部分)
     * @param {object} options 检索条件
     * @returns 
     */
    getTagList({ page = 1, pageSize = 10, search, status, not_default } = {}) {
        const condition = {}
        status && (condition.status = status);
        not_default && (condition.id = ['!=', '1']);
        if (search && search.length) {
            condition.name = ['like', `%${search}%`]
        }

        return this.where(condition).page(page, pageSize).countSelect();
    }

    /**
     * @description 获取标签
     * @param {Number} id id
     * @returns 
     */
    getTag(id) {
        id = Array.isArray(id) ? id : [id];
        return this.where({ id: ['IN', id] }).limit(id.length).select();
    }

    /**
     * @description 新增标签
     * @param {string} name 标签名称   
     * @param {string} description 标签描述 
     * @param {number} status 标签状态
     * @returns {number} insertId
     */
    addTag({
        name,
        description,
        status = 1
    } = {}) {
        return this.transactionAdd({ name, description, status })
    }

    /**
     * @description 更新标签
     * @param {string} name 标签名称   
     * @param {string} description 标签描述  
     * @param {number} status 标签状态
     * @returns {number} effectRows
     */
    editTag({
        id,
        name,
        description,
        status = 1
    } = {}) {
        return this.transactionUpdate({ id: Number(id) }, { name, description, status: Number(status) })
    }

    /**
     * @description 删除标签(软删)
     * @param {array} id 更新标签列表  
     * @returns {number} effectRows
     */
    deleteTag({
        id = []
    }) {
        // 前端URLSearchParams处理之后数组会变成a,b,c形式
        const dataList = id.split(',').map(id => ({ id: Number(id), status: 0 }));
        return this.transactionBatchUpdate(dataList)
    }
}