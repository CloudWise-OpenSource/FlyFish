/**
 * Created by chencheng on 2017/8/5.
 */

const Base = require('../base');

module.exports = class extends Base {
    constructor(ctx) {
        super(ctx);
        this.groupService = think.service('rbac/userGroup');
    }

    /**
     * @api {POST} /web/rbac/group/add 添加分组
     * @apiGroup UserGroup
     * @apiVersion 1.0.0
     * @apiDescription 添加分组
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {String} group_name 分组名称
     * @apiParam (入参) {String} parent_group_id 父分组ID
     * @apiParam (入参) {String} description 分组描述
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "ok"
	 *      "data": {}
	 *  }
     */
    async addAction() {
        const { account_id } = await this.getCacheUserInfo();
        const {group_name, parent_group_id, description} = this.post();
        if (await this.groupService.isExist(account_id, {group_name})) return this.fail("分组名称存在");

        const result = await this.groupService.addGroup(account_id, parent_group_id, {group_name, description});
        if (think.isError(result)) return this.fail(result.message);

        this.success({}, "添加成功");
    }

    /**
     * @api {GET} /web/rbac/group/getAll 获取所有分组
     * @apiGroup UserGroup
     * @apiVersion 1.0.0
     * @apiDescription 获取所有分组
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "ok"
	 *      "data": {}
     *  }
     */
    async getAllAction(){
        const { account_id } = await this.getCacheUserInfo();
        const result = await this.groupService.getAllGroupTree(account_id);

        if (think.isError(result)) return this.fail(result.message);

        this.success(result, "success");
    }



    /**
     * @api {GET} /web/rbac/group/getDetail 获取单个分组详情
     * @apiGroup UserGroup
     * @apiVersion 1.0.0
     * @apiDescription 获取单个分组详情
     *
     * @apiParam (入参) {String} group_id 分组ID
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "ok"
	 *      "data": {
	 *          name: "",       // 分组名称
	 *          config: "",     // 配置
	 *      }
	 *  }
     */
    async getDetailAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { group_id } = this.get();
        const result = await this.groupService.getGroupById(account_id, group_id);

        if (think.isError(result)) return this.fail(result.message);
        if (think.isEmpty(result)) return this.fail("数据不存在");

        this.success(result, "success");
    }

    /**
     * @api {PUT} /web/rbac/group/update 更新分组
     * @apiGroup UserGroup
     * @apiVersion 1.0.0
     * @apiDescription 更新分组
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Number} group_id 分组ID
     * @apiParam (入参) {String} group_name 分组名称
     * @apiParam (入参) {String} description 描述
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "ok"
	 *      "data": {}
	 *  }
     */
    async updateAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { group_id, group_name, parent_group_id, description } = this.post();
        if (await this.groupService.isExist(account_id, {group_name}, group_id)) return this.fail("分组名称已存在");

        const result = await this.groupService.updateGroup(account_id, group_id, parent_group_id, { group_name, description });
        if (think.isError(result)) return this.fail(result.message);

        this.success({}, "更新成功");
    }


    /**
     * @api {DELETE} /web/rbac/group/delete 删除分组
     * @apiGroup UserGroup
     * @apiVersion 1.0.0
     * @apiDescription 删除分组
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Number} group_id 分组ID
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "删除成功"
	 *      "data": {}
	 *  }
     */
    async deleteAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { group_id } = this.post();

        const result = await this.groupService.delGroup(account_id, group_id);
        if (think.isError(result)) return this.fail(result.message);

        this.success({}, "删除成功");
    }


    /**
     * @api {GET} /web/rbac/group/getUserByGroup 获取分组下的用户
     * @apiGroup UserGroup
     * @apiVersion 1.0.0
     * @apiDescription 获取分组下的用户
     *
     * @apiParam (入参) {String} group_id 分组ID
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "ok"
	 *      "data": {
	 *          id: "",          // ID
	 *          user_id: "",     // 用户ID
	 *          group_id: "",     // 分组ID
	 *      }
	 *  }
     */
    async getUserByGroupAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { group_id } = this.get();

        const result = await this.groupService.getUserIdsByGroupId(account_id, group_id);
        if (think.isError(result)) return this.fail(result.message);

        this.success(result, "获取成功");
    }


    /**
     * @api {PUT} /web/rbac/group/updateGroupMember 更新分组成员
     * @apiGroup UserGroup
     * @apiVersion 1.0.0
     * @apiDescription 更新分组成员
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Array} addUsers 增加分组成员user_id
     * @apiParam (入参) {Array} delUsers 删除分组成员user_id
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "ok"
	 *      "data": {}
	 *  }
     */
    async updateGroupMemberAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { addUsers, delUsers, group_id } = this.post();

        const result = await this.groupService.updateGroupMember(account_id, group_id, addUsers, delUsers );

        if (think.isError(result)) return this.fail(result.message);

        this.success({}, "更新成功");
    }

}
