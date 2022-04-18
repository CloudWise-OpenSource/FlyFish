const EnumAllType = require('../EnumAppCommon').EnumAllType

/**
 * 枚举操作日志类型
 * @type {{all: string, model: number}}
 */
const EnumOperateLogType = {
    all: EnumAllType,   // 所有类型
    model: 1,           // 模型
};

/**
 * 枚举操作日志类型
 * @type {{all: string, model: number}}
 */
exports.EnumOperateLogType = EnumOperateLogType;

/**
 *
 * @type {*[]}
 * usage:
 * {
 *      path: '日志操作接口',
        log_type: EnumOperateLogType.model,
        getContent: (ctx) => `操作日志内容`,
 * }
 */
exports.EnumOperateLogTpl = [
    // {
    //     path: '',
    //     log_type: EnumOperateLogType.model,
    //     getContent: (ctx) => `操作日志`
    // }
];
