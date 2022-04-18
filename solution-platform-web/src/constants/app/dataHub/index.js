/**
 * 插件类型枚举
 * @type {[null,null]}
 */
export const EnumPluginTypes = [
    {
        value: 'source-agent',
        label: 'source-agent',
        optionName: 'sourceAgent'
    },
    {
        value: 'sink-agent',
        label: 'sink-agent',
        optionName: 'sinkAgent'
    }
];

/**
 * hub状态枚举
 * @type {{using: {label: string, value: number, className: string}, stop: {label: string, value: number, className: string}}}
 */
export const EnumHubStatus = {
    using: {
        label: '使用中',
        value: 1,
        className: 'status_green'
    },
    stop: {
        label: '暂停',
        value: 2,
        className: 'status_red'
    }
};

/**
 * 主机状态枚举
 * @type {{using: {label: string, value: number, className: string}, stop: {label: string, value: number, className: string}}}
 */
export const EnumHostStatus = {
    using: {
        label: '使用中',
        value: 1,
        className: 'status_green'
    },
    stop: {
        label: '暂停',
        value: 2,
        className: 'status_red'
    }
};

/**
 * 插件状态枚举
 * @type {{using: {label: string, value: number, color: string}, stop: {label: string, value: number, color: string}}}
 */
export const EnumPluginStatus = {
    using: {
        label: '使用中',
        value: 1,
        color: 'green'
    },
    stop: {
        label: '暂停',
        value: 2,
        color: 'orange'
    }
};

/**
 * 表格分页器默认配置
 * @type {{page: {label: string, value: number}, pageSize: {label: string, value: number}}}
 */
export const EnumPaginationConfig = {
    page: {
        label: '当前页',
        value: 1
    },
    pageSize: {
        label: '页数',
        value: 10
    }
};

/**
 * 时间范围枚举
 * @type {{m30: {label: string, value: string}, h1: {label: string, value: string}, h6: {label: string, value: string}, h12: {label: string, value: string}, d1: {label: string, value: string}}}
 */
export const EnumTimeRange = [
    {
        label: '最近30分钟',
        value: '30M'
    },
    {
        label: '最近1小时',
        value: '1H'
    },
    {
        label: '最近6小时',
        value: '6H'
    },
    {
        label: '最近12小时',
        value: '12H'
    },
    {
        label: '最近1天',
        value: '1D'
    },
];

/**
 * 警示颜色枚举
 * @type {[null,null,null]}
 */
export const EnumWarnColor = [
    {
        label: '正常值',
        className: 'warnColor_green',
        low: 0,
        high: 60
    },
    {
        label: '预警值',
        className: 'warnColor_orange',
        low: 60,
        high: 85
    },
    {
        label: '警告值',
        className: 'warnColor_red',
        low: 85,
        high: 200
    },
];

/**
 * worker状态枚举
 * @type {{start: {label: string, value: number, className: string}, stop: {label: string, value: number, className: string}}}
 */
export const EnumWorkStatus = {
    start:{
        label: '开启中',
        value: 1,
        className: 'status_green'
    },
    stop:{
        label: '暂停中',
        value: 0,
        className: 'status_red'
    },
    countDown:{
        label: '倒计时',
        value: 2,
    }
}

