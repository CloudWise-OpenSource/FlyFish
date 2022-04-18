/**
 * 枚举权限主体类型
 * @type {{user: {label: string, value: number}, role: {label: string, value: number}, group: {label: string, value: number}}}
 */
export const EnumPermissionSubjectType = {
    user:{
        label: "用户",
        value: 1,
    },
    role: {
        label: "角色",
        value: 2,
    },
    group: {
        label: "分组",
        value: 3,
    }
};


