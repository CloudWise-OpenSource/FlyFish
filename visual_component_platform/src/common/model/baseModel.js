const EnumDelType = require('../constants/EnumCommon').EnumDelType;
const mkSoftWhere = (_soft_del_field) => _soft_del_field ? {[_soft_del_field]: ['!=', EnumDelType.yes]} : {};

module.exports = class extends think.Model {
    constructor(...args) {
        super(...args);
        this._soft_del_field = null;
    }

    checkSoftDelField() {
        if(!this._soft_del_field) throw new Error('_soft_del_field不能为空');
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
        return this.update(this._soft_del_field ? {[this._soft_del_field]: EnumDelType.yes} : {});
    }
}
