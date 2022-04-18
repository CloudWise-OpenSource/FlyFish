/**
 * Created by chencheng on 17-9-14.
 */
import EnumRouter from 'constants/EnumRouter';
import T from 'utils/T';
// import EnumMenuPermission from 'constants/EnumMenuPermission';

/**
 * 枚举默认收起左侧菜单的URL
 * @type {[*]}
 */
export const EnumCollapsedLeftMenuUrls = [
    // EnumRouter.dHanding_apexMonitorOverview,     // apex 监控概览
    // EnumRouter.dHanding_apexMonitorAppDetail,    // apex 监控应用详情
    // EnumRouter.dHanding_apexAppJsonConf,         // apex 应用json配置

    EnumRouter.v_component_create,
];

/**
 * icon 类型
 * @type {{antd: string, custom: string}}
 */
export const EnumIconTypes = {
    antd: 'antd',
    custom: 'custom'
};
const { isAdmin } = T.auth.getLoginInfo() || {}
let userRouters = [
    {
        label: '用户列表',
        // uniqueIdentity: EnumMenuPermission.userM_userList,
        icon: {
            appType: EnumIconTypes.antd,
            iconType: 'pie-chart',
        },
        url: EnumRouter.rbac_userList,
        children: [],
    },
    {
        label: '角色列表',
        // uniqueIdentity: EnumMenuPermission.userM_roleList,
        icon: {
            appType: EnumIconTypes.antd,
            iconType: 'pie-chart',
        },
        url: EnumRouter.rbac_roleList,
        children: [],
    },
]
userRouters= isAdmin ? userRouters : T.lodash.filter(userRouters, (item) => { return item.label !== '角色列表' })
/**
 * 菜单配置
 *
 * Usage:
 * 左侧菜单参数使用说明:
 * {
        label:"Apex应用",

        //antd中的icon type
        icon:"swap",

        //可以是字符串,也可以是数组,当作为数组时可以将数组内的所有url都让该栏目保持高亮
        url:"url1" || ["url1", "url2"],

        children:[]
    }
 * @type {[*]}
 */
export const EnumDefaultMenus = [
    {
        label: '数据平台',
        value: 'dataPlatform',
        childrenMenu: [
            {
                label: '可视化组件',
                icon: {
                    appType: EnumIconTypes.custom,
                    iconType: 'zujian1'
                },
                children: [
                    {
                        label: '组件分类',
                        icon: {
                            appType: EnumIconTypes.antd,
                            iconType: 'database'
                        },
                        url: [EnumRouter.v_component_categoriesList],
                        children: []
                    },
                    {
                        label: '组织列表',
                        icon: {
                            appType: EnumIconTypes.antd,
                            iconType: 'database'
                        },
                        url: [EnumRouter.v_org_list],
                        children: []
                    },
                    {
                        label: '组件列表',
                        icon: {
                            appType: EnumIconTypes.antd,
                            iconType: 'database'
                        },
                        url: [EnumRouter.v_component_list, EnumRouter.v_component_change_list, EnumRouter.v_component_change_detail, EnumRouter.v_component_create],
                        children: []
                    },
                ]
            },
            {
                label: '用户管理',
                // uniqueIdentity: EnumMenuPermission.userM,
                icon: {
                    appType: EnumIconTypes.custom,
                    iconType: 'caiji',
                },
                children: userRouters
            },
            {
                // 用户列表
                url: EnumRouter.rbac_userList,
            },
            {
                // accessToken列表
                url: EnumRouter.rbac_accessTokenList,
            },
        ]
    }
];

