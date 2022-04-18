/**
 * Created by chencheng on 2017/8/5.
 */

const Base = require('../base');

module.exports = class extends Base {
    constructor(ctx) {
        super(ctx);
        this.roleService = think.service('rbac/userRole');
    }

    /**
     * @api {POST} /web/rbac/role/add 添加角色
     * @apiGroup UserRole
     * @apiVersion 1.0.0
     * @apiDescription 添加角色
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {String} role_name 角色名称
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
        const {role_name, description} = this.post();
        if (await this.roleService.isExist(account_id, {role_name})) return this.fail("角色名称存在");

        const result = await this.roleService.addRole(account_id, {role_name, description});
        if (think.isError(result)) return this.fail(result.message);

        this.success({}, "添加成功");
    }

    /**
     * @api {GET} /web/rbac/role/getPageList 获取角色分页列表
     * @apiGroup UserRole
     * @apiVersion 1.0.0
     * @apiDescription 获取角色分页列表
     *
     * @apiParam (入参) {Number} page 当前分页数
     * @apiParam (入参) {Object} [search={}] 过滤条件:
     * @apiParam (入参) {String} [search.role_name] 过滤名称
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "ok"
	 *      "data": {
                    "count": 3,
                    "totalPages": 3,
                    "pagesize": 1,
                    "currentPage": 1,
                    "data": [
                        {
                            "role_id": 1,
                            "account_id": 1,
                            "role_name": "",
                            "role_type": 1,
                            "deleted_at": 1,
                            "created_at": 1511335476178,
                            "updated_at": 1511335476178
                        }
                    ]
                }
            }
     *  }
     */
    async getPageListAction(){
        const { account_id } = await this.getCacheUserInfo();
        const { page, search } = this.get();
        const result = await this.roleService.getRolePageList(account_id, page, 15, search);

        if (think.isError(result)) return this.fail(result.message);

        this.success(result, "success");
    }

    /**
     * @api {GET} /web/rbac/role/getAll 获取所有角色
     * @apiGroup UserRole
     * @apiVersion 1.0.0
     * @apiDescription 获取所有角色
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "ok"
	 *      "data": [
                {
                    "role_id": 1,
                    "account_id": 1,
                    "role_name": "",
                    "role_type": 1,
                    "deleted_at": 1,
                    "created_at": 1511335476178,
                    "updated_at": 1511335476178
                }
            ]
     *  }
     */
    async getAllAction(){
        const { account_id } = await this.getCacheUserInfo();
        const result = await this.roleService.getAllRole(account_id);

        if (think.isError(result)) return this.fail(result.message);

        this.success(result, "success");
    }

    /**
     * @api {GET} /web/rbac/role/getDetail 获取单个角色详情
     * @apiGroup UserRole
     * @apiVersion 1.0.0
     * @apiDescription 获取单个角色详情
     *
     * @apiParam (入参) {String} role_id 角色ID
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "ok"
	 *      "data": {
	 *          name: "",       // 角色名称
	 *          config: "",     // 配置
	 *      }
	 *  }
     */
    async getDetailAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { role_id } = this.get();
        const result = await this.roleService.getRoleById(account_id, role_id);

        if (think.isError(result)) return this.fail(result.message);
        if (think.isEmpty(result)) return this.fail("数据不存在");

        this.success(result, "success");
    }

    /**
     * @api {PUT} /web/rbac/role/update 更新角色
     * @apiGroup UserRole
     * @apiVersion 1.0.0
     * @apiDescription 更新角色
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Number} role_id 角色ID
     * @apiParam (入参) {String} role_name 角色名称
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
        const { role_id, role_name, description } = this.post();
        if (await this.roleService.isExist(account_id, {role_name}, role_id)) return this.fail("角色名称已存在");

        const result = await this.roleService.updateRole(account_id, role_id, { role_name, description });

        if (think.isError(result)) return this.fail(result.message);

        this.success({}, "更新成功");
    }


    /**
     * @api {POST} /web/rbac/role/delete 删除角色
     * @apiGroup UserRole
     * @apiVersion 1.0.0
     * @apiDescription 删除角色
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Array} role_ids 角色ID: [1,2,3,...]
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
        const { role_ids } = this.post();

        const result = await this.roleService.delRole(account_id, role_ids);
        if (think.isError(result)) return this.fail(result.message);

        this.success({}, "删除成功");
    }


    /**
     * @api {GET} /web/rbac/role/getUserByRole 获取角色下的用户
     * @apiGroup UserRole
     * @apiVersion 1.0.0
     * @apiDescription 获取角色下的用户
     *
     * @apiParam (入参) {String} role_id 角色ID
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "ok"
	 *      "data": {
	 *          id: "",          // ID
	 *          user_id: "",     // 用户ID
	 *          role_id: "",     // 角色ID
	 *      }
	 *  }
     */
    async getUserByRoleAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { role_id } = this.get();

        const result = await this.roleService.getUserIdsByRoleId(account_id, role_id);
        if (think.isError(result)) return this.fail(result.message);

        this.success(result, "获取成功");
    }


    /**
     * @api {PUT} /web/rbac/role/updateRoleMember 更新角色成员
     * @apiGroup UserRole
     * @apiVersion 1.0.0
     * @apiDescription 更新角色成员
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Array} addUsers 增加角色成员user_id
     * @apiParam (入参) {Array} delUsers 删除角色成员user_id
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "ok"
	 *      "data": {}
	 *  }
     */
    async updateRoleMemberAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { addUsers, delUsers, role_id } = this.post();

        const result = await this.roleService.updateRoleMember(account_id, role_id, addUsers, delUsers );

        if (think.isError(result)) return this.fail(result.message);

        this.success({}, "更新成功");
    }

}
