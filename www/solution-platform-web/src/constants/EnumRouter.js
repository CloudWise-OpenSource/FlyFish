/**
 * Created by chencheng on 2017/6/13.
 */

/**
 *
 * @type {{rootRoute: string, login: string, dHub_pluginList: string, dHub_pluginUpload: string, dHub_pluginConf: string, dHub_pluginLog: string, dHub_hubMonitorList: string, dHub_pluginMonitorList: string, dHub_collectMonitorList: string, userManage_userList: string}}
 */
const EnumRouter = {
    rootRoute: '', // 根路由

    login: 'login', // 登陆

    /*
     |-----------------------------------------------
     | 数据采集-相关的路由
     |-----------------------------------------------
     */
    // ----采集器---//
    dHub_pluginList: 'dataHub/pluginList',
    dHub_pluginUpload: 'dataHub/pluginUpload',
    dHub_pluginConf: 'dataHub/pluginConf',
    dHub_pluginLog: 'dataHub/pluginLog',
    dHub_pluginTask: 'dataHub/pluginTask',
    dHub_pluginWorker: 'dataHub/pluginWorker',

    // ----性能监控----//
    dHub_hubMonitorList: 'dataHub/hubMonitorList',
    dHub_pluginMonitorList: 'dataHub/pluginMonitorList',
    dHub_collectMonitorList: 'dataHub/collectMonitorList',
    dHub_hostMonitorList: 'dataHub/hostMonitorList', // 性能监控--主机监控

    /*
     |-----------------------------------------------
     | 数据可视化-相关的路由
     |-----------------------------------------------
     */
    dVisual_bigScreen: 'dataVisual/bigScreen',
    // v_component_list: 'dataVisual/component/list',
    dVisual_3dEdit: 'dataVisual/3dEdit',

    /*
     |-----------------------------------------------
     | RBAC用户管理-相关的路由
     |-----------------------------------------------
     */
    rbac_userList: 'rbac/userList',
    rbac_roleList: 'rbac/roleList',
    rbac_groupList: 'rbac/groupList',
    rbac_permission: 'rbac/permission',

    /*
     |-----------------------------------------------
     | 系统管理-相关的路由
     |-----------------------------------------------
     */
    system_operateLogList: 'system/operateLogList',
    system_logo_manage: 'system/logoManage',
    system_tag_manage: 'system/tagManage',

    /*
     |-----------------------------------------------
     | 文件管理-相关路由
     |-----------------------------------------------
     */
    // fileManager_img: 'file/img',
    // fileManager_imgGroup: 'file/imgGroup',

    /*
	 |-----------------------------------------------
	 | 可视化组件管理-相关的路由
	 |-----------------------------------------------
	 */
    v_component_categoriesList: 'visual/component/categories/list',
    v_org_list: 'visual/organize/list',
    v_component_list: 'visual/component/list',
    v_component_create: 'visual/component/create',
    v_scene_manage: 'visual/scene/list',
};


export default (() => {
    let routes = {};
    for (let [key, route] of Object.entries(EnumRouter)) {
        Object.defineProperty(routes, key, {
            get: () => {
                return window.ENV.rootPath + route;

                // TODO 后续改用这种方式

                // const path = window.ENV.rootPath + route;
                // return {
                //     path,
                //     // 实例化url参数
                //     getUrl: (params = {}) => {
                //         return T.lodash.isEmpty(params) ? path : path + '?' + T.queryString.stringify(params);
                //     }
                // };
            },
            configurable: false
        });
    }

    return routes;
})();
