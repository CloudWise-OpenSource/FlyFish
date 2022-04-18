import { EnumAllType } from '../EnumCommon';

/**
 * 枚举操作日志类型
 * @type {{all: {label: string, value: string}, model: {label: string, value: number}}}
 */
export const EnumOperateLogType = {
    all: {
        label: '所有',
        value: EnumAllType
    },

    model: {
        label: '模型',
        value: 1
    }

}
