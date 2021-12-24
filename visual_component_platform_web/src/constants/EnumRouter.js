/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-06-16 15:45:23
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-06-21 17:13:03
 */
/**
 * Created by chencheng on 2017/6/13.
 */

/**
 *
 * @type {{rootRoute: string, login: string, rbac_userList: string, rbac_accessTokenList: string, v_component_categoriesList: string, v_component_list: string, v_component_create: string}}
 */
const EnumRouter = {
	rootRoute: "", // 根路由

	login: "login", // 登陆
	registry: "registry", // 注册
	/*
     |-----------------------------------------------
     | RBAC用户管理-相关的路由
     |-----------------------------------------------
     */
	rbac_userList: "rbac/userList",
	rbac_roleList: "rbac/roleList",
	rbac_accessTokenList: "rbac/accessTokenList",

	/*
	 |-----------------------------------------------
	 | 可视化组件管理-相关的路由
	 |-----------------------------------------------
	 */
	v_component_categoriesList: "visual/component/categories/list",
	v_org_list: "visual/organize/list",
	v_component_list: "visual/component/list",
	v_component_change_list: "visual/component/change/list",
	v_component_change_detail: "visual/component/change/detail",
	v_component_create: "visual/component/create",
	v_scene_manage: "visual/scene/list",
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
