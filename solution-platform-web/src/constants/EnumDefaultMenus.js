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
const { isAdmin } = T.auth.getLoginInfo() || {}
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
]
userRouters= isAdmin ? userRouters : T.lodash.filter(userRouters, (item) => { return item.label !== '角色列表' })
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
                    // {
                    //     label: '3D编排',
                    //     icon: {
                    //         appType: EnumIconTypes.antd,
                    //         iconType: 'pie-chart',
                    //     },
                    //     url: EnumRouter.dVisual_3dEdit,
                    //     children: [],
                    // },
                ],
            },
            {
                label: '可视化组件',
                uniqueIdentity: EnumMenuPermission.componentView,
                icon: {
                    appType: EnumIconTypes.custom,
                    iconType: 'caiji',
                },
                children: [
                    {
                        label: '可视化组件列表',
                        uniqueIdentity: EnumMenuPermission.componentView_list,
                        icon: {
                            appType: EnumIconTypes.antd,
                            iconType: 'pie-chart',
                        },
                        url: EnumRouter.v_component_list,
                        children: [],
                    },
                ],
            },
            {
                label: '用户管理',
                uniqueIdentity: EnumMenuPermission.userM,
                icon: {
                    appType: EnumIconTypes.custom,
                    iconType: 'caiji',
                },
                children: userRouters
            },
            // {
            //     label: '文件管理',
            //     uniqueIdentity: EnumMenuPermission.fileManager,
            //     icon: {
            //         appType: EnumIconTypes.custom,
            //         iconType: 'caiji',
            //     },
            //     children: [
            //         {
            //             label: '图片管理',
            //             uniqueIdentity: EnumMenuPermission.fileManager_img,
            //             icon: {
            //                 appType: EnumIconTypes.antd,
            //                 iconType: 'pie-chart',
            //             },
            //             url: EnumRouter.fileManager_img,
            //             children: [],
            //         },
            //         {
            //             label: '图片分组管理',
            //             uniqueIdentity: EnumMenuPermission.fileManager_imgGroup,
            //             icon: {
            //                 appType: EnumIconTypes.antd,
            //                 iconType: 'pie-chart',
            //             },
            //             url: EnumRouter.fileManager_imgGroup,
            //             children: [],
            //         },
            //     ],
            // },
            {
                label: '系统管理',
                uniqueIdentity: EnumMenuPermission.systemM,
                icon: {
                    appType: EnumIconTypes.custom,
                    iconType: 'caiji',
                },
                children: [
                    {
                        label: 'logo管理',
                        uniqueIdentity: EnumMenuPermission.systemM_logoManage,
                        icon: {
                            appType: EnumIconTypes.antd,
                            iconType: 'pie-chart',
                        },
                        url: EnumRouter.system_logo_manage,
                        children: [],
                    },
                    {
                        label: '标签管理',
                        uniqueIdentity: EnumMenuPermission.system_tag_manage,
                        icon: {
                            appType: EnumIconTypes.antd,
                            iconType: 'tags',
                        },
                        url: EnumRouter.system_tag_manage,
                        children: [],
                    },
                    // {
                    //     label: '日志审计',
                    //     uniqueIdentity: EnumMenuPermission.systemM_operateLogList,
                    //     icon: {
                    //         appType: EnumIconTypes.antd,
                    //         iconType: 'pie-chart'
                    //     },
                    //     url: EnumRouter.system_operateLogList,
                    //     children: []
                    // },
                ],
            },
        ],
    },
];
