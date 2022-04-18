/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-06-04 10:28:05
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-09-10 15:31:03
 */
/**
 * Created by chencheng on 2017/6/16.
 */

const _processAPI = (api) => api;


/**
 *
 * @type {{login: *, logout: *, user_getAll: *, user_getPageList: *, user_getDetail: *, user_add: *, user_update: *, user_resetPassword: *, aToken_getPageList: *, aToken_getDetail: *, aToken_add: *, aToken_del: *, aToken_updateStatus: *, dSource_getAll: *, dSource_getPageList: *, dSource_getDetail: *, dSource_addSource: *, dSource_updateSource: *, dSource_delSource: *, dStore_getAll: *, dStore_getPageList: *, dStore_getDetail: *, dStore_addStore: *, dStore_updateStore: *, dStore_delStore: *, dModel_getPageList: *, dModel_getDetail: *, dModel_addModel: *, dModel_updateModel: *, dModel_delModel: *, dModel_query: *, dvComponentsCategories_getAll: *, dvComponentsCategories_getPageList: *, dvComponentsCategories_getDetail: *, dvComponentsCategories_addCategories: *, dvComponentsCategories_updateCategories: *, dvComponentsCategories_delCategories: *, dvComponents_getPageList: *, dvComponents_getDetail: *, dvComponents_addComponent: *, dvComponents_updateComponent: *, dvComponents_delComponent: *, dvComponents_dev_initDevSpace: *, dvComponents_dev_readDevFile: *, dvComponents_dev_saveDevFileContent: *, dvComponents_dev_addDevFileOrDir: *, dvComponents_dev_updateDevFileOrDir: *, dvComponents_dev_delDevFileOrDir: *, dvComponents_dev_npmDevComponent: *, dvComponents_dev_compileDevComponent: *, apexAppList: string, apexUploadAppPackage: string, apexDelAppPackage: function(*, *, *): string, apexDelApp: function(*, *, *, *): string, apexCreateApp: function(*, *, *, *): string, apexGetApp: function(*, *, *, *): string, apexGetYarnQueue: string, apexApplications: string, apexLaunchApplication: function(*, *, *, *): string, apexAppPackagesOperators: function(*, *, *): string, apexAppPackagesAttributes: function(*, *, *): string, apexAppJsonAssignableClasses: function(*, *, *, *): string, apexAppJsonClassesDetail: function(*, *, *, *): string, apexAppJsonValidate: function(*, *, *, *): string, apexAppJsonSave: function(*, *, *, *): string, apexClusterMetrics: string, apexAppInstanceRes: function(*): string, apexAppPhysicalPlanRes: function(*): string, apexAppPhysicalPlanOperatorsRes: function(*): string, apexAppPhysicalPlanOverview: function(*, *): string, apexAppPhysicalPlanContainerHistory: function(*, *): string, apexAppPhysicalPlanContainersRes: function(*): string, apexAppPhysicalPlanContainersOverview: function(*, *): string, apexAppPhysicalPlanContainerstackTrace: function(*, *): string, apexAppPhysicalPlanContainerLogRes: function(*, *): string, apexAppPhysicalPlanContainerLogDetail: function(*, *, *): string, apexAppPhysicalPlanContainerLogDownload: function(*, *, *): string, apexAppLogicalPlanRes: function(*): string, apexAppLogicalPlanOperatorsRes: function(*): string, apexAppLogicalPlanOperatorsProperties: function(*, *): string, apexAppAttemptsRes: function(*): string, apexAppAttemptsDetails: function(*, *): string, apexAppShutdown: function(*): string, apexAppKill: function(*): string, apexAppRestart: function(*): string, apexAppPhysicalOperatorProperties: function(*): string, apexAppStramEvents: function(*): string, apexMapping_getAll: *, apexMapping_getPageList: *, apexMapping_getDetail: *, apexMapping_add: *, apexMapping_update: *, apexMapping_del: *, kafkaM_clusters: string, kafkaM_topics: function(*): string, YarnM_clusters: string, YarnM_applications: string, YarnM_clustersMetrics: string, YarnM_clustersNodes: string, YarnM_clustersScheduler: string, YarnM_clustersApplicationsDetails: function(*): string, YarnM_clustersAttempt: function(*): string, HdfsM_NameNodeInfo: string, HdfsM_NameNodeStatus: string, HdfsM_snapshot: string, HdfsM_FSNamesystem: string, HdfsM_JvmMetrics: string, DruidM_Cluster: string, DruidM_OverloadRunningTasks: string, DruidM_OverloadPendingTasks: string, DruidM_OverloadWaitingTasks: string, DruidM_OverloadCompleteTasks: string, DruidM_OverloadWorkers: string, DruidM_OverloadSupervisor: string, DuridM_DataSourceIntervals: function(*): string, DuridM_DataSource: function(*): string, DuridM_Segments: function(*, *): string, DuridM_DataSourceId: string, DuridM_Rules: function(*): string, DuridM_RulesInfo: string}}
 */
const EnumAPI = {
	login: _processAPI("/web/rbac/user/login"), // 登录
	logout: _processAPI("/web/rbac/user/logout"), // 退出登录
	registry: _processAPI("/web/rbac/user/registry"),
	getCaptcha: _processAPI("/web/rbac/user/captcha"),

	/*
     |----------------------------------------------------------------
     | RBAC用户管理--相关的API地址
     |----------------------------------------------------------------
     */

	//----用户管理----
	user_getAll: _processAPI("/web/rbac/user/getAll"), // 获取所有用户
	user_getPageList: _processAPI("/web/rbac/user/getPageList"), // 获取用户分页列表
	user_getDetail: _processAPI("/web/rbac/user/getDetail"), // 获取单个用户详情
	user_add: _processAPI("/web/rbac/user/add"), // 添加用户
	user_update: _processAPI("/web/rbac/user/update"), // 更新用户
	user_del: _processAPI("/web/rbac/user/delete"), // 删除用户
	user_resetPassword: _processAPI("/web/rbac/user/resetPassword"), // 重置密码

	/* 角色管理 */
	role_getAll: _processAPI("/web/rbac/role/getAll"), // 获取所有角色
	role_getPageList: _processAPI("/web/rbac/role/getPageList"), // 获取角色分页列表
	role_getDetail: _processAPI("/web/rbac/role/getDetail"), // 获取单个角色详情
	role_add: _processAPI("/web/rbac/role/add"), // 添加角色
	role_update: _processAPI("/web/rbac/role/update"), // 更新角色
	role_del: _processAPI("/web/rbac/role/delete"), // 删除角色
	role_userByRole: _processAPI("/web/rbac/role/getUserByRole"), // 获取角色下的用户
	role_updateRoleMember: _processAPI("/web/rbac/role/updateRoleMember"), // 更新角色中的用户

	//----AccessToken管理----
	aToken_getPageList: _processAPI("/web/rbac/accessToken/getPageList"), // 获取accessToken分页列表
	aToken_getDetail: _processAPI("/web/rbac/accessToken/getDetail"), // 获取accessToken详情
	aToken_add: _processAPI("/web/rbac/accessToken/add"), // 添加accessToken
	aToken_del: _processAPI("/web/rbac/accessToken/delete"), // 删除accessToken
	aToken_updateStatus: _processAPI("/web/rbac/accessToken/updateStatus"), // 更新accessToken状态

	/*
     |----------------------------------------------------------------
     | 组件可视化--相关的API地址
     |----------------------------------------------------------------
     */
	/*组件分类*/
	dvComponentsCategories_getAll: _processAPI(
		"/web/visualComponents/categories/getAll"
	), // 获取可视化所有组件分类
	dvComponentsCategories_getPageList: _processAPI(
		"/web/visualComponents/categories/getPageList"
	), // 获取可视化组件分类分页列表
	dvComponentsCategories_getDetail: _processAPI(
		"/web/visualComponents/categories/getDetail"
	), // 获取单个可视化组件分类详情
	dvComponentsCategories_addCategories: _processAPI(
		"/web/visualComponents/categories/add"
	), // 添加可视化组件分类
	dvComponentsCategories_updateCategories: _processAPI(
		"/web/visualComponents/categories/update"
	), // 更新可视化组件分类
	dvComponentsCategories_delCategories: _processAPI(
		"/web/visualComponents/categories/delete"
	), // 删除可视化组件分类

	/*组件管理*/
	dvOrg_getAll: _processAPI("/web/visualComponents/organize/getAll"), // 获取可视化所有组织
	dvOrg_getPageList: _processAPI("/web/visualComponents/organize/getPageList"), // 获取可视化组织分页列表
	dvOrg_getDetail: _processAPI("/web/visualComponents/organize/getDetail"), // 获取单个可视化组织详情
	dvOrg_add: _processAPI("/web/visualComponents/organize/add"), // 添加可视化组织
	dvOrg_update: _processAPI("/web/visualComponents/organize/update"), // 更新可视化组织
	dvOrg_del: _processAPI("/web/visualComponents/organize/delete"), // 删除可视化组织

	/*组件管理*/
	dvComponents_getPageList: _processAPI(
		"/web/visualComponents/component/getPageList"
	), // 获取可视化组件分页列表
	dvComponents_getDetail: _processAPI(
		"/web/visualComponents/component/getDetail"
	), // 获取单个可视化组件详情
	dvComponents_addComponent: _processAPI("/web/visualComponents/component/add"), // 添加可视化组件
	dvComponents_updateComponent: _processAPI(
		"/web/visualComponents/component/update"
	), // 更新可视化组件
	dvComponents_delComponent: _processAPI(
		"/web/visualComponents/component/delete"
	), // 删除可视化组件
	dvComponents_download: _processAPI("/web/visualComponents/component/download"), // 下载可视化组件
	dvComponents_downloadComponentCode: _processAPI(
		"/web/visualComponents/component/downloadComponentCode"
	), // 导入可视化组件源代码
	dvComponents_importComponentCode: _processAPI(
		"/web/visualComponents/component/importComponentCode"
	), // 下载可视化组件源代码
	dvComponents_copy: _processAPI("/web/visualComponents/component/copy"), // 复制可视化组件源代码

	/*组件编辑记录*/
	dvComponents_getChangePageList: _processAPI(
		"/web/visualComponents/devComponentIO/componentHistory"
	),
	dvComponents_getChangeDetail: _processAPI(
		"/web/visualComponents/devComponentIO/componentCommitDetail"
	),

	dvComponents_dev_initDevSpace: _processAPI(
		"/web/visualComponents/devComponentIO/initDevWorkspace"
	), // 初始化可视化组件开发空间
	dvComponents_dev_readDevFile: _processAPI(
		"/web/visualComponents/devComponentIO/readDevFile"
	), // 读取开发组件文件内容
	dvComponents_dev_saveDevFileContent: _processAPI(
		"/web/visualComponents/devComponentIO/saveDevFileContent"
	), // 保存开发组件文件内容
	dvComponents_dev_addDevFileOrDir: _processAPI(
		"/web/visualComponents/devComponentIO/addDevFileOrDir"
	), // 添加开发组件文件或目录
	dvComponents_dev_updateDevFileOrDir: _processAPI(
		"/web/visualComponents/devComponentIO/updateDevFileOrDir"
	), // 更新开发组件文件或目录
	dvComponents_dev_delDevFileOrDir: _processAPI(
		"/web/visualComponents/devComponentIO/delDevFileOrDir"
	), // 删除开发组件文件或目录
	dvComponents_dev_npmDevComponent: _processAPI(
		"/web/visualComponents/devComponentIO/npmDevComponent"
	), // npm install 开发组件
	dvComponents_dev_compileDevComponent: _processAPI(
		"/web/visualComponents/devComponentIO/compileDevComponent"
	), // compile开发组件
	dvComponents_dev_uploadFile: _processAPI(
		"/web/visualComponents/devComponentIO/uploadFile"
	), // 上传文件

	/*场景管理*/
	scene_checkScene: _processAPI("/web/visualComponents/scene/checkScene"), // 检查场景
	scene_checkSceneEdit: _processAPI(
		"/web/visualComponents/scene/checkSceneEdit"
	), // 检查场景
	scene_addScene: _processAPI("/web/visualComponents/scene/addScene"), // 新增场景
	scene_editScene: _processAPI("/web/visualComponents/scene/editScene"), // 编辑场景
	scene_delScene: _processAPI("/web/visualComponents/scene/delScene"), // 删除场景
	scene_upload: _processAPI("/web/visualComponents/scene/uploadFile"), // 上传场景
	scene_queryScene: _processAPI("/web/visualComponents/scene/queryScene"), // 分页查询场景
	scene_queryAllScene: _processAPI("/web/visualComponents/scene/queryAllScene"), // 查询全部场景
};

export default EnumAPI;
