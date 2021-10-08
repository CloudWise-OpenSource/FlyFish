/**
 * Created by chencheng on 17-9-14.
 */
import EnumRouter from 'constants/EnumRouter';
import EnumMenuPermission from 'constants/EnumMenuPermission';
import T from 'utils/T';
/**
 * 枚举默认收起左侧菜单的URL
 * @type {[*]}
 */
export const EnumCollapsedLeftMenuUrls = [];

/**
 * icon 类型
 * @type {{antd: string, custom: string}}
 */
export const EnumIconTypes = {
    antd: 'antd',
    custom: 'custom',
};
const { isAdmin } = T.auth.getLoginInfo() || {};
let userRouters = [
    {
        label: '用户列表',
        uniqueIdentity: EnumMenuPermission.userM_userList,
        icon: {
            appType: EnumIconTypes.antd,
            iconType: 'pie-chart',
        },
        url: EnumRouter.rbac_userList,
        children: [],
    },
    {
        label: '角色列表',
        uniqueIdentity: EnumMenuPermission.userM_roleList,
        icon: {
            appType: EnumIconTypes.antd,
            iconType: 'pie-chart',
        },
        url: EnumRouter.rbac_roleList,
        children: [],
    },
    {
        label: '分组列表',
        uniqueIdentity: EnumMenuPermission.userM_groupList,
        icon: {
            appType: EnumIconTypes.antd,
            iconType: 'pie-chart',
        },
        url: EnumRouter.rbac_groupList,
        children: [],
    },
    {
        label: '权限分配',
        uniqueIdentity: EnumMenuPermission.userM_permissionList,
        icon: {
            appType: EnumIconTypes.antd,
            iconType: 'pie-chart',
        },
        url: EnumRouter.rbac_permission,
        children: [],
    },
];
userRouters = isAdmin ? userRouters : T.lodash.filter(userRouters, (item) => { return item.label !== '角色列表' });
/**
 * 菜单配置
 *
 * Usage:
 * 左侧菜单参数使用说明:
 * {
        label:"ETL应用",
        uniqueIdentity: "1-1",  // 整个菜单中的唯一标示
        uiPermission:[          // 当前页面的ui内容权限
            {
                label: '删除按钮',
                uniqueIdentity: "ui-3-1-1"
            }
        ],
        //antd中的icon type
        icon:{
            appType: EnumIconTypes.custom,
            iconType: 'caiji'
        },

        //可以是字符串,也可以是数组,当作为数组时可以将数组内的所有url都让该栏目保持高亮
        url:"url1" || ["url1", "url2"],

        children:[]
    }
 * @type {[*]}
 */
export const EnumDefaultMenus = [
    {
        label: '解决方案平台',
        value: 'dataPlatform',
        childrenMenu: [
            {
                label: '数据可视化',
                uniqueIdentity: EnumMenuPermission.dv,
                icon: {
                    appType: EnumIconTypes.custom,
                    iconType: 'caiji',
                },
                children: [
                    {
                        label: '作品集',
                        uniqueIdentity: EnumMenuPermission.dv_bigScreen,
                        icon: {
                            appType: EnumIconTypes.antd,
                            iconType: 'pie-chart',
                        },
                        url: EnumRouter.dVisual_bigScreen,
                        children: [],
                    },
                ],
            },
            {
                label: '可视化组件',
                icon: {
                    appType: EnumIconTypes.custom,
                    iconType: 'zujian1',
                },
                children: [
                    {
                        label: '组件列表',
                        icon: {
                            appType: EnumIconTypes.antd,
                            iconType: 'database',
                        },
                        url: [
                            EnumRouter.v_component_list,
                            EnumRouter.v_component_create,
                        ],
                        children: [],
                    }
                ],
            },
            {
                label: '用户管理',
                uniqueIdentity: EnumMenuPermission.userM,
                icon: {
                    appType: EnumIconTypes.custom,
                    iconType: 'caiji',
                },
                children: userRouters,
            },

        ],
    },
];
