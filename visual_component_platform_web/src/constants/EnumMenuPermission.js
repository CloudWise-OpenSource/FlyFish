/**
 * 菜单和ui内容权限标示
 */
export default (() => {
    const permissionMark =  {
        /** ******** 1.数据采集相关的权限标示 **********/
        dataCollect: '1',               // 数据采集
        dataCollect_collector: '1-1',   // 采集器

        dataCollect_pm: '1-2',          // 性能监控
        dataCollect_pm_host: '1-2-1',   // 主机监控
        dataCollect_pm_plugin: '1-2-2', // 插件监控
        dataCollect_pm_hub: '1-2-3',    // Hub监控

        dataCollect_cm: '1-3',          // 采集监控

        /** ******** 2.数据可视化相关的权限标示 **********/
        dv: '2',                        // 数据可视化
        dv_bigScreen: '2-1',            // 作品集
        v_component_list: '2-2',            // 作品集


        /** ******** 3.用户管理相关的权限标示 **********/
        userM: '3',                     // 用户管理
        userM_userList: '3-1',          // 用户列表
        userM_roleList: '3-2',          // 角色列表
        userM_groupList: '3-3',         // 分组列表
        userM_permissionList: '3-4',    // 分组列表

        /** ******** 4.系统管理相关的权限标示 **********/
        systemM: '4',                   // 系统管理
        systemM_operateLogList: '4-1',  // 日志审计
        systemM_logoManage: '4-2',       // logo管理
        systemM_tagManage: '4-3',       // tag管理

        /********* 5.文件管理 ***********/
        fileManager: '5',               //文件管理
        fileManager_img: '5-1',         //图片管理
        fileManager_imgGroup: '5-2',    //图片分组管理

        /********* 6.可视化组件 ***********/
        componentView: '6',               //可视化组件
        componentView_list: '6-1',         //组件列表
    }

    // 检查是否存在相同的标示
    let permissionMarkArr = Object.values(permissionMark);
    let permissionMarkSet = new Set(permissionMarkArr);
    if (permissionMarkSet.size !== permissionMarkArr.length) throw new Error('菜单和ui内容权限标示,存在相同的标示');

    return permissionMark;

})();
