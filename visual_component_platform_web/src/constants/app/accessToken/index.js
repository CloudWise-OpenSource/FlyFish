/**
 * 枚举AccessToken状态类型
 * @type {{normal: {label: *, value: number}, disabled: {label: *, value: number}}}
 */
export const EnumAccessTokenStatusType = {
    normal:{
        label: <span style={{color: 'green'}}>启用</span>,
        value: 1,
    },
    disabled: {
        label: <span style={{color: 'red'}}>禁用</span>,
        value: 0,
    }
};


