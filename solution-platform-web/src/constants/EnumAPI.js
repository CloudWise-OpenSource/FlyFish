/**
 * Created by chencheng on 2017/6/16.
 */

const _processAPI = (api) => {
    if (window.ENV.mock.isStart) {
        return '/mockAPI' + api;
    }

    return api;
};

/**
 * 代理dataHub API
 * @param api
 * @return {*}
 */
const proxyDataHubAPI = (api) => '/proxyDataHub' + api;
// const proxyDataHubAPI = (api) => api;

/**
 *
 * @type {{login}}
 */
const EnumAPI = {

    login: _processAPI('/web/rbac/user/login'),         // 登录
    logout: _processAPI('/web/rbac/user/logout'),       // 退出登录
    registry: _processAPI('/web/rbac/user/registry'),
    getCaptcha: _processAPI('/web/rbac/user/captcha'),

    /*
     |----------------------------------------------------------------
     | dataHub--相关的API地址
     |----------------------------------------------------------------
     */
    hostAllList: proxyDataHubAPI('/v1/plugin/hostAllList'), // 获取主机列表
    hostList: proxyDataHubAPI('/v1/plugin/hostList'), // 分发插件-列表
    submitPlugin: proxyDataHubAPI('/v1/plugin/dispatch'), // 分发插件-提交
    pluginList: proxyDataHubAPI('/v1/plugin/pluginList'), // 获取插件列表
    startPlugin: proxyDataHubAPI('/v1/lifecycle/start'), // 启动插件
    stopPlugin: proxyDataHubAPI('/v1/lifecycle/stop'), // 暂停插件
    uninstallPlugin: proxyDataHubAPI('/v1/plugin/uninstall'), // 卸载插件
    uploadPlugin: proxyDataHubAPI('/v1/plugin/upload'), // 上传插件
    getTaskList: proxyDataHubAPI('/v1/lifecycle/listTask'), // 获取任务列表
    getCreateData: proxyDataHubAPI('/v1/lifecycle/createTask'), // 任务-获取创建默认数据
    getEditData: proxyDataHubAPI('/v1/lifecycle/editTask'), // 任务-获取编辑默认数据
    saveEditTask: proxyDataHubAPI('/v1/lifecycle/saveTaskContent'), // 任务-保存编辑
    delTask: proxyDataHubAPI('/v1/lifecycle/delTask'), // 任务-删除
    getWorkerList: proxyDataHubAPI('/v1/lifecycle/workProcess'), // 获取worker列表
    startWorker: proxyDataHubAPI('/v1/lifecycle/startWork'), // 开启worker
    stopWorker: proxyDataHubAPI('/v1/lifecycle/stopWork'), // 暂停worker
    getLogListAPI: proxyDataHubAPI('/v1/lifecycle/listLogFile'), // 获取日志列表
    getLogContentAPI: proxyDataHubAPI('/v1/lifecycle/logContent'), // 获取日志内容
    getConfFileList: proxyDataHubAPI('/v1/lifecycle/listConfigFile'), // 获取配置文件列表
    getConfigContent: proxyDataHubAPI('/v1/lifecycle/configContent'), // 修改配置弹窗-获取配置详情
    saveConf: proxyDataHubAPI('/v1/lifecycle/saveConfigContent'), // 修改配置-保存

    getLogTypeListAPI: proxyDataHubAPI('/v1/metric/listLogType'), // 采集监控-获取日志类型列表
    getCollectDataAPI: proxyDataHubAPI('/v1/metric/collectStatistics'), // 采集监控--获取柱状图数据
    getCollectListAPI: proxyDataHubAPI('/v1/metric/collectSaticsDetail'), // 采集监控--获取列表数据
    getDetailAPI: proxyDataHubAPI('/v1/metric/collectOneStatistic'), // 采集监控--获取详情

    pluginMonitorList: proxyDataHubAPI('/v1/metric/pluginStatistic'), // 性能监控--获取插件监控列表
    pluginCpu: proxyDataHubAPI('/v1/metric/pluginCpu'), // 性能监控--获取插件cpu使用率
    pluginMem: proxyDataHubAPI('/v1/metric/pluginMem'), // 性能监控--获取插件内存使用率
    hubMonitorList: proxyDataHubAPI('/v1/metric/hubStatistic'), // 性能监控--获取hub监控列表
    hubCpu: proxyDataHubAPI('/v1/metric/hubCpu'), // 性能监控--获取hub cpu使用率
    hubMem: proxyDataHubAPI('/v1/metric/hubMem'), // 性能监控--获取hub 内存使用率
    hostMonitorList: proxyDataHubAPI('/v1/metric/hostStatistic'), // 性能监控--获取主机监控列表
    hostCpu: proxyDataHubAPI('/v1/metric/hostCpu'), // 性能监控--获取hostCpu使用率
    hostMem: proxyDataHubAPI('/v1/metric/hostMem'), // 性能监控--获取hostMem使用率
    hostDisk: proxyDataHubAPI('/v1/metric/hostDisk'), // 性能监控--获取hostDisk使用率
    hostNet: proxyDataHubAPI('/v1/metric/hostNet'), // 性能监控--获取hostNet使用率

    /*
     |----------------------------------------------------------------
     | 数据可视化--相关的API地址
     |----------------------------------------------------------------
     */
    dvScreen_add: _processAPI('/web/visualScreen/screen/add'),                      // 添加大屏
    dvScreen_getPageList: _processAPI('/web/visualScreen/screen/getPageList'),      // 获取大屏分页列表
    dvScreen_getDetail: _processAPI('/web/visualScreen/screen/getDetail'),          // 获取单个大屏详情
    dvScreen_update: _processAPI('/web/visualScreen/screen/update'),                // 更新大屏
    dvScreen_delete: _processAPI('/web/visualScreen/screen/delete'),                // 删除大屏
    dvScreen_unlock: _processAPI('/web/visualScreen/screen/unlock'),                // 解锁大屏
    dvScreen_copy: _processAPI('/web/visualScreen/screen/copy'),                    // 复制大屏
    dvScreen_getDelPageList: _processAPI('/web/visualScreen/screen/getDelPageList'), // 获取已删除大屏分页列表
    dvScreen_undoDelete: _processAPI('/web/visualScreen/screen/undoDelete'),        // 还原已删除大屏
    dvScreen_downloadScreen: _processAPI('/web/visualScreen/screen/downloadScreen'),        // 下载大屏部署包
    dvScreen_getTagList: _processAPI('/web/tag/visualScreenTag/getDetailByScreenId'),  // 根据大屏id获取对应标签列表

    /*
    |----------------------------------------------------------------
    | 组件可视化--相关的API地址
    |----------------------------------------------------------------
    */
    /* 组件管理 */
    dvComponents_getPageList: _processAPI('/web/visualComponents/component/getPageList'),                // 获取可视化组件分页列表
    dvComponents_getDetail: _processAPI('/web/visualComponents/component/getDetail'),                    // 获取单个可视化组件详情
    dvComponents_addComponent: _processAPI('/web/visualComponents/component/add'),                       // 添加可视化组件
    dvComponents_updateComponent: _processAPI('/web/visualComponents/component/update'),                 // 更新可视化组件
    dvComponents_changeVisible: _processAPI('/web/visualComponents/component/changeVisible'),            // 更新可视化组件可见状态
    dvComponents_uploadComponentCover: _processAPI('/web/visualComponents/component/updateComponentCover'), // 上传可视化组件封面
    dvComponents_delComponent: _processAPI('/web/visualComponents/component/delete'),                    // 删除可视化组件
    dvComponents_getTagList: _processAPI('/web/tag/visualComponentTag/getDetailByComponentId'),  // 根据组件id获取对应标签列表

    /*
     |----------------------------------------------------------------
     | RBAC用户管理--相关的API地址
     |----------------------------------------------------------------
     */
    /* 用户管理 */
    user_getAll: _processAPI('/web/rbac/user/getAll'),                      // 获取所有用户
    user_getPageList: _processAPI('/web/rbac/user/getPageList'),            // 获取用户分页列表
    user_getDetail: _processAPI('/web/rbac/user/getDetail'),                // 获取单个用户详情
    user_add: _processAPI('/web/rbac/user/add'),                            // 添加用户
    user_update: _processAPI('/web/rbac/user/update'),                      // 更新用户
    user_del: _processAPI('/web/rbac/user/delete'),                         // 删除用户
    user_resetPassword: _processAPI('/web/rbac/user/resetPassword'),        // 重置密码

    /* 角色管理 */
    role_getAll: _processAPI('/web/rbac/role/getAll'),                      // 获取所有角色
    role_getPageList: _processAPI('/web/rbac/role/getPageList'),            // 获取角色分页列表
    role_getDetail: _processAPI('/web/rbac/role/getDetail'),                // 获取单个角色详情
    role_add: _processAPI('/web/rbac/role/add'),                            // 添加角色
    role_update: _processAPI('/web/rbac/role/update'),                      // 更新角色
    role_del: _processAPI('/web/rbac/role/delete'),                         // 删除角色
    role_userByRole: _processAPI('/web/rbac/role/getUserByRole'),           // 获取角色下的用户
    role_updateRoleMember: _processAPI('/web/rbac/role/updateRoleMember'),  // 更新角色中的用户

    /* 分组管理 */
    group_getAll: _processAPI('/web/rbac/group/getAll'),                      // 获取所有分组
    group_getPageList: _processAPI('/web/rbac/group/getPageList'),            // 获取分组分页列表
    group_getDetail: _processAPI('/web/rbac/group/getDetail'),                // 获取单个分组详情
    group_add: _processAPI('/web/rbac/group/add'),                            // 添加分组
    group_update: _processAPI('/web/rbac/group/update'),                      // 更新分组
    group_del: _processAPI('/web/rbac/group/delete'),                         // 删除分组
    group_userByGroup: _processAPI('/web/rbac/group/getUserByGroup'),         // 获取分组下的用户
    group_updateGroupMember: _processAPI('/web/rbac/group/updateGroupMember'), // 更新分组中的用户

    /* 权限管理 */
    permission_getMenuPermission: _processAPI('/web/rbac/permission/getMenuPermission'),             // 获取菜单权限
    permission_disposeMenuPermission: _processAPI('/web/rbac/permission/disposeMenuPermission'),     // 处理菜单权限

    /*
     |----------------------------------------------------------------
     | 系统管理--相关的API地址
     |----------------------------------------------------------------
     */

    /* 日志审计 */
    system_operateLogList: _processAPI('/web/system/operateLog/getPageList'),   // 获取操作日志列表
    system_uploadLogo: _processAPI('/web/file/logo/upload'),                    // logo上传

    /* 标签管理 */
    system_componentTagList: _processAPI('/web/system/tagManage/getTagList'), // 获取标签列表
    system_addComponentTag: _processAPI('/web/system/tagManage/addTag'), // 新增标签
    system_editComponentTag: _processAPI('/web/system/tagManage/editTag'), // 编辑标签
    system_deleteComponentTag: _processAPI('/web/system/tagManage/deleteTag'), // 删除标签

    /*
     |----------------------------------------------------------------
     | 文件管理--相关的API地址
     |----------------------------------------------------------------
     */

    /* 图片分组列表 */
    getImgGroupPageList: _processAPI('/web/file/imgGroup/getList'),   // 图片分组列表
    addImgGroup: _processAPI('/web/file/imgGroup/add'),   // 添加图片分组
    delImgGroup: _processAPI('/web/file/imgGroup/delete'),   // 删除图片分组
    updateImgGroup: _processAPI('/web/file/imgGroup/update'),   // 删除图片分组

    getImgPageList: _processAPI('/web/file/img/getList'),   // 图片分组列表
    addImg: _processAPI('/web/file/img/upload'),   // 添加图片分组
    delImg: _processAPI('/web/file/img/delete'),   // 删除图片分组
    updateImg: _processAPI('/web/file/img/update'),   // 删除图片分组

};

export default EnumAPI;
