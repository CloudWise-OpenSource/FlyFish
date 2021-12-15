const Base = require('../base');
module.exports = class extends Base{

    constructor(ctx) {
        super(ctx);
        this.orgService = think.service('visualComponents/organize', think.config("custom.appModules.web"));
    }

    /**
     * @api {POST} /web/visualComponents/organize/add 添加组织
     * @apiGroup VComponentsOrg
     * @apiVersion 1.0.0
     * @apiDescription 添加组织
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {String} name 组织名称
     * @apiParam (入参) {Number} description 描述
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "添加成功"
	 *      "data": {}
	 *  }
     */
    async addAction() {
        const { account_id } = await this.getCacheUserInfo();
        let { name, org_mark, description } = this.post();
        if (await this.orgService.isExist(account_id, {name})) return this.fail("组织已存在");
        if (await this.orgService.isExist(account_id, {org_mark})) return this.fail("组织标识已存在");

        const result = await this.orgService.addOrg(account_id, {name, org_mark, description: description || ""});
        if (think.isError(result)) return this.fail(result.message);

        return this.success({}, "添加成功");
    }


    /**
     * @api {GET} /web/visualComponents/organize/getPageList 获取组织分页列表
     * @apiGroup VComponentsOrg
     * @apiVersion 1.0.0
     * @apiDescription 获取组织分页列表
     *
     * @apiParam (入参) {Number} page 当前分页数
     * @apiParam (入参) {Object} [search={}] 过滤条件:
     * {
     *      name: ""   // 名称
     * }
     * @apiParam (入参) {String} [search.name] 过滤名称
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "success"
	 *      "data": {
                    "count": 3,
                    "totalPages": 3,
                    "pagesize": 1,
                    "currentPage": 1,
                    "data": [
                        {
                            "org_id": 1,
                            "account_id": 1,
                            "name": "test",
                            "description": "",
                            "deleted_at": 1,
                            "created_at": 1512983392221,
                            "updated_at": 1512983392221
                        }
                    ]
                }
            }
	 *  }
     */
    async getPageListAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { page, search } = this.get();
        const result = await this.orgService.getOrgPageList(account_id, page, 15, search);

        if (think.isError(result)) return this.fail(result.message);

        return this.success(result, "success");
    }

    /**
     * @api {GET} /web/visualComponents/organize/getAll 获取所有组织
     * @apiGroup VComponentsOrg
     * @apiVersion 1.0.0
     * @apiDescription 获取所有组织
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "success"
	 *      "data": [
     *          {
                    "org_id": 1,
                    "account_id": 1,
                    "name": "test",
                    "org_mark": "",
                    "description": "",
                    "deleted_at": 1,
                    "created_at": 1512983392221,
                }
            ]
     *  }
     */
    async getAllAction() {
        const { account_id } = await this.getCacheUserInfo();
        const result = await this.orgService.getAllOrg(account_id);

        if (think.isError(result)) return this.fail(result.message);

        return this.success(result, "success");
    }

    /**
     * @api {GET} /web/visualComponents/organize/getDetail 获取单个组织详情
     * @apiGroup VComponentsOrg
     * @apiVersion 1.0.0
     * @apiDescription 获取单个组织详情
     *
     * @apiParam (入参) {String} org_id 组织ID
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "success"
	 *      "data": {
	 *          name: "",       // 组织名称
	 *          config: "",     // 配置
	 *      }
	 *  }
     */
    async getDetailAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { org_id } = this.get();
        const result = await this.orgService.getOrgById(account_id, org_id);

        if (think.isError(result)) return this.fail(result.message);
        if (think.isEmpty(result)) return this.fail("数据不存在");

        return this.success(result, "success");
    }

    /**
     * @api {PUT} /web/visualComponents/organize/update 更新组织
     * @apiGroup VComponentsOrg
     * @apiVersion 1.0.0
     * @apiDescription 更新组织
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Number} org_id 组织ID
     * @apiParam (入参) {String} name 组织名称
     * @apiParam (入参) {Number} description 描述
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "更新成功"
	 *      "data": {}
	 *  }
     */
    async updateAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { org_id, name, description } = this.post();

        const result = await this.orgService.updateOrg(account_id, org_id, {name, description: description || ""});

        if (think.isError(result)) return this.fail(result.message);

        return this.success({}, "更新成功");
    }

    /**
     * @api {DELETE} /web/visualComponents/organize/delete 删除组织
     * @apiGroup VComponentsOrg
     * @apiVersion 1.0.0
     * @apiDescription 删除组织
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Array} org_ids 组织ID: [1,2,3,...]
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
        const { org_ids } = this.post();

        const result = await this.orgService.delOrg(account_id, org_ids);

        if (think.isError(result)) return this.fail(result.message);

        return this.success({}, "删除成功");
    }

}
