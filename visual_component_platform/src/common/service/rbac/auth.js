const _ = require('lodash');
const EnumUserRoleOfAdmin = require('../../constants/app/rbac/userRole').EnumUserRoleOfAdmin;
const EnumUserRoleType = require('../../constants/app/rbac/userRole').EnumUserRoleType;

/**
 * Created by chencheng on 2017/8/24.
 */

module.exports = class extends think.Service{
	constructor(){
		super();
		this.userRoleService = think.service('rbac/userRole');
	}

    /**
     * 获取用户登录信息
     * @param userInfo
     * @return {Promise<{isAdmin: boolean, user: {}, menuPermission: Array}>}
     */
	async getUserLoginInfo(userInfo) {
        const { user_id, account_id, user_email, user_phone, user_name } = userInfo;

        let roleNames = [];
        const role_ids = (await this.userRoleService.getRoleIdsByUserId(account_id, user_id)).map(item => item.role_id);
        if(role_ids.length > 0 ) roleNames = (await this.userRoleService.getRolesInfoByRoleIds(account_id, role_ids)).map(item => item.role_name);
        
        return {
            isAdmin: roleNames.indexOf(EnumUserRoleOfAdmin.admin) !== -1,
            user: {user_email, user_phone, user_name, user_id},
        }
    }

}
