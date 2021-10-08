const EnumErrorCode = require('../../common/constants/EnumError').EnumErrorCode;

module.exports = class extends think.Logic {

    /**
     * 执行验证
     * @param rules
     * @param messages
     * @returns {*}
     */
    doValidate(rules, messages = {}) {

        if (!this.validate(rules, messages)) return this.fail(EnumErrorCode.NOT_PASS_VALIDATE_PARAMS, '校验参数错误', this.validateErrors);

        return true;
    }
}
