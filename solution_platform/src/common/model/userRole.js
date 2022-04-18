const baseModel = require('./baseModel');
const EnumDelType = require('../constants/EnumCommon').EnumDelType;

module.exports = class extends baseModel {
    constructor(...args) {
        super(...args);
        this._pk = 'role_id';   // 设置主键字段
        this._soft_del_field = 'deleted_at'
    }

    /**
     * 设置表名
     * @returns {string}
     */
    get tableName () {
        return 'user_roles';
    }

    /**
     * 添加额外的schema数据
     * @returns {{createdAt: {default: (function(): number)}, updatedAt: {update: boolean, default: (function(): number)}}}
     */
    get schema() {
        return {
            deleted_at: {
                default: EnumDelType.no
            },
            created_at: {
                default: () => Date.now()
            },
            updated_at: {
                update: true,
                default: () => Date.now()
            }
        }
    }
};
