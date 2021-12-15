const EnumDelType = require('../constants/EnumCommon').EnumDelType;
const mkSoftWhere = (_soft_del_field) => _soft_del_field ? { [_soft_del_field]: ['!=', EnumDelType.yes] } : {};

module.exports = class extends think.Model {
    constructor(...args) {
        super(...args);
        this._soft_del_field = null;
    }

    checkSoftDelField() {
        if (!this._soft_del_field) throw new Error('_soft_del_field不能为空');
    }


    /**
     * 获取安全查询分页数据
     * @param options
     * @param pageFlag
     * @returns {promise|Promise<Object>}
     */
    softCountSelect(options, pageFlag) {
        this.checkSoftDelField();
        return this.where(mkSoftWhere(this._soft_del_field)).countSelect(options, pageFlag);
    }

    /**
     * 获取安全查询数据
     * @param options
     */
    softSelect(options) {
        this.checkSoftDelField();
        return this.where(mkSoftWhere(this._soft_del_field)).select(options);
    }

    /**
     * 获取安全单条数据
     * @param options
     */
    softFind(options) {
        this.checkSoftDelField();
        return this.where(mkSoftWhere(this._soft_del_field)).find(options);
    }

    /**
     * 获取安全数据量
     * @param field
     */
    softCount(field) {
        this.checkSoftDelField();
        return this.where(mkSoftWhere(this._soft_del_field)).count(field)
    }

    /**
     * 安全删除
     * @returns {Promise}
     */
    softDel() {
        this.checkSoftDelField();
        return this.update(this._soft_del_field ? { [this._soft_del_field]: EnumDelType.yes } : {});
    }

    /**
     * 事务添加
     * @param {object} options 添加内容
     * @returns {Promise<T>}
     */
    transactionAdd(options) {
        this.checkSoftDelField();
        return this.transaction(() => this.add(options));
    }

    /**
     * 事务批量添加
     * @param {object} options 添加内容
     * @returns {Promise<T>}
     */
    transactionBatchAdd(options) {
        this.checkSoftDelField();
        return this.transaction(() => this.addMany(options));
    }

    /**
     * 事务更新
     * @param {object} searchOptions 检索条件
     * @param {object} data 更新内容
     * @param {object} options 更新操作
     * @returns {Promise<T>}
     */
    transactionUpdate(searchOptions, data, options) {
        this.checkSoftDelField();
        return this.transaction(() => this.where(searchOptions).update(data, options));
    }

    /**
     * 事务批量更新
     * @param {array} dataList 更新内容
     * @returns {Promise<T>}
     */
    transactionBatchUpdate(dataList) {
        this.checkSoftDelField();
        return this.transaction(() => this.updateMany(dataList));
    }
}
