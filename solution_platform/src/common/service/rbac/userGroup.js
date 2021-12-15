/**
 * Created by chencheng on 2017/8/24.
 */

const EnumRootParentGroupId = require('../../constants/app/rbac/userGroup').EnumRootParentGroupId;
const EnumPermissionSubjectType = require('../../constants/app/rbac/permission').EnumPermissionSubjectType;

/**
 * 格式化过滤条件
 * @param search
 * @returns {*}
 */
const formatSearchParams = (search) => {
    search = think.isEmpty(search) ? {} : JSON.parse(search);
    if (search.hasOwnProperty('group_name')) search.group_name = ['like','%' + search.group_name + '%'];

    return search;
};

module.exports = class extends think.Service{
	constructor(){
		super();
		// 分组model实例
		this.modelUserGroupIns = think.model('userGroup');
		this.modelUserGroupRelationIns = think.model('userGroupRelation').db(this.modelUserGroupIns.db());
        this.permissionService = think.service('rbac/permission', 'common', this.modelUserGroupIns.db());
	}

    /**
     * 校验是否存在
     * @param {Number} account_id
     * @param {Object} params
     * @param {Mixed} [group_id]    // 存在具体的id是用于验证更新数据， 不存在id是验证创建数据
     */
    async isExist(account_id, params = {}, group_id = null) {
        const where = Object.assign({account_id}, params);
        if(group_id) where.group_id = ['!=', group_id];

        const result = await this.modelUserGroupIns.where(where).softCount().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err);
        });

        return result > 0 ?  true : false;
    }

	/**
	 * 添加分组
	 *
	 * @param {Number} account_id
	 * @param {Number} parent_group_id
	 * @param {Object} params
	 * @param {string} [params.group_id]
	 * @param {string} params.group_name
	 * @param {string} params.description
	 * @returns {Promise.<group_id>}
	 */
	async addGroup(account_id, parent_group_id, params) {
        const group_id = await this.modelUserGroupIns.addGroup(account_id, parent_group_id, params);
        if (think.isError(group_id)) return group_id;
	}

    /**
     * 获取分组节点
     * @param {Number} account_id
     * @param {Number} group_id
     * @param {Number} parent_group_id
     * @return {Promise<*>}
     */
	async getGroupTree(account_id, group_id, parent_group_id){
        const result = await this.modelUserGroupIns.getGroup(account_id, group_id, parent_group_id);
        if (think.isError(result)) return result;

        const formatGroup = (data, parent_group_id) => {
            const formatResult = [];
            data.forEach(item => {
                if (parent_group_id == item.parent_group_id){
                    formatResult.push({
                        group_id: item.group_id,
                        parent_group_id: item.parent_group_id,
                        group_name: item.group_name,
                        lft: item.lft,
                        rgt: item.rgt,
                        description: item.description,
                        children: formatGroup(data, item.group_id)
                    });
                }
            });

            return formatResult.length < 1 ? null : formatResult;
        }

        return formatGroup(result, parent_group_id);
	}


    /**
     * 删除分组节点
     * @param {Number} account_id
     * @param {Number} group_id
     * @return {Promise<T>}
     */
	async delGroup(account_id, group_id) {
        return await this.modelUserGroupIns.transaction(async () => {
            // 删除分组
            const delGroupRes = await this.modelUserGroupIns.delGroup(account_id, group_id, false);
            if (think.isError(delGroupRes)) throw delGroupRes;

            // 删除分组用户关系
            await this.modelUserGroupRelationIns.where({account_id, group_id}).delete();
            // 删除分组菜单权限关系
            await this.permissionService.delMenuPermissionByIds(account_id, [group_id], EnumPermissionSubjectType.group);
        }).catch(err => {
            this.modelUserGroupIns.rollback();
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 更新分组
     * @param {Number} account_id
     * @param {Number} group_id
     * @param {Number} parent_group_id
     * @param {Object} params
     * @param {String} params.group_name
     * @param {String} params.description
     * @return {Promise<*>}
     */
    async updateGroup(account_id, group_id, parent_group_id, params){
        const sourceGroup = await this.modelUserGroupIns.where({group_id}).find();
        const { group_name, description } = params;

        // 更新分组基本信息
        const result = await this.modelUserGroupIns.where({account_id, group_id}).update({ group_name, description }).catch(err => {
			think.logger.error(err);
			return think.isError(err) ? err : new Error(err)
		});

        if (think.isError(result)) return result;

        // 移动节点
        if(sourceGroup.parent_group_id != parent_group_id){

            const oldGroupTree = await this.getGroupTree(account_id, group_id, sourceGroup.parent_group_id);

            await this.delGroup(account_id, group_id);

            const addGroup = async (parent_group_id, data) => {

                for(let i = 0; i < data.length; i++){
                    const { group_id, group_name, description, children } = data[i];
                    const new_group_id = await this.addGroup(account_id, parent_group_id, {group_id, group_name, description});

                    if(children && children.length > 0){
                        await addGroup(new_group_id, children);
                    }
                }
            };

            return await addGroup(parent_group_id, oldGroupTree);
        }

        return result;
    }

    /**
     * 获取所有分组树
     * @param {Number} account_id
     * @returns {Promise<void>}
     */
    async getAllGroupTree(account_id) {
        const rootGroup = await this.modelUserGroupIns.where({parent_group_id: EnumRootParentGroupId}).find();
        return await this.getGroupTree(account_id, rootGroup.group_id, rootGroup.parent_group_id);
    }


    /**
     * 获取单个分组详情
     * @param {Number} account_id
     * @param {Number} group_id
     * @param {Array} [fields]
     * @returns {Promise<any>}
     */
    async getGroupById(account_id, group_id, fields = "*"){
        fields = Array.isArray(fields) ? fields.join(',') : fields;
        return await this.modelUserGroupIns.where({account_id, group_id}).field(fields).softFind().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }


    /**
     * 获取group_id依据user_id
     * @param {Number} account_id
     * @param {Number} user_id
     * @param {String} field
     * @return {Promise<any>}
     */
    async getGroupIdsByUserId(account_id, user_id, field = '*') {
        return await this.modelUserGroupRelationIns.field(field).where({user_id}).select().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }


    /**
     * 获取user_id依据group_id
     * @param {Number} account_id
     * @param {Number} group_id
     * @param {String} field
     * @return {Promise<any>}
     */
    async getUserIdsByGroupId(account_id, group_id, field = '*') {
        return await this.modelUserGroupRelationIns.field(field).where({group_id}).select().catch(err => {
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }

    /**
     * 更新分组中的成员
     * @param {Number} account_id
     * @param {Number} group_id
     * @param {Array} addUsers
     * @param {Array} delUsers
     * @return {Promise<T>}
     */
    async updateGroupMember(account_id, group_id, addUsers = [], delUsers = []){
        return await this.modelUserGroupIns.transaction(async () => {
            // 删除分组成员
            if(delUsers.length > 0) await this.modelUserGroupRelationIns.where({group_id, account_id, user_id: ['IN', delUsers]}).delete();

            // 添加分组成员
            if(addUsers.length > 0) await this.modelUserGroupRelationIns.addMany(addUsers.map(user_id => ({user_id, group_id, account_id})));

        }).catch(err => {
            console.log(err);
            think.logger.error(err);
            return think.isError(err) ? err : new Error(err)
        });
    }
}
