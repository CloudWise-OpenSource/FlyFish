const _ = require('lodash');
const EnumUserRoleOfAdmin = require('../../constants/app/rbac/userRole').EnumUserRoleOfAdmin;

/**
 * Created by chencheng on 2017/8/24.
 */

module.exports = class extends think.Service{
	constructor(){
		super();
		this.userRoleService = think.service('rbac/userRole');
		this.userGroupService = think.service('rbac/userGroup');
		this.permissionService = think.service('rbac/permission');
	}

    /**
     * 获取用户登录信息
     * @param userInfo
     * @return {Promise<{isAdmin: boolean, user: {}, menuPermission: Array}>}
     */
	async getUserLoginInfo(userInfo) {
        const { user_id, account_id, user_email, user_phone, user_name } = userInfo;

        let roleNames = [];
        const roleIds = (await this.userRoleService.getRoleIdsByUserId(account_id, user_id)).map(item => item.role_id);
        if (roleIds.length > 0) roleNames = (await this.userRoleService.getRolesInfoByRoleIds(account_id, roleIds)).map(item => item.role_name);
        const groupIds = (await this.userGroupService.getGroupIdsByUserId(account_id, user_id)).map(item => item.group_id);

        // 处理菜单权限
        const menuPermissions = (await this.permissionService.getMenuAllPermission(account_id, user_id, groupIds, roleIds, 'permission')).map(item => JSON.parse(item.permission))
        let allMenuPermissions = [];
        menuPermissions.forEach(item => item.forEach(permission => allMenuPermissions.push(permission)));

        return {
            isAdmin: roleNames.indexOf(EnumUserRoleOfAdmin.admin) !== -1,
            user: {user_email, user_phone, user_name, user_id},
            menuPermission: _.uniq(allMenuPermissions)
        }
    }

}
