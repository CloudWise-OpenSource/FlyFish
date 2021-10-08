const baseModel = require('./baseModel');
const EnumDelType = require('../constants/EnumCommon').EnumDelType;

module.exports = class extends baseModel {
    constructor(...args) {
        super(...args);
        this._pk = 'id';   // 设置主键字段
        this._soft_del_field = ''
    }

    /**
     * 设置表名
     * @returns {string}
     */
    get tableName () {
        return 'menu_permission';
    }

};
