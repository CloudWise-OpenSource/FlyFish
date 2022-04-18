const Base = require('../base');
module.exports = class extends Base{

    constructor(ctx) {
        super(ctx);
        this.categoriesService = think.service('visualComponents/categories', think.config("custom.appModules.web"));
    }

    /**
     * @api {POST} /web/visualComponents/categories/add 添加组件分类
     * @apiGroup VComponentsCategories
     * @apiVersion 1.0.0
     * @apiDescription 添加组件分类
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {String} name 组件分类名称
     * @apiParam (入参) {Number} type 组件分类类型
     * @apiParam (入参) {Object} config 组件分类配置
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
        let { type, name, config } = this.post();
        if (await this.categoriesService.isExistName(account_id, name)) return this.fail("名称已存在");

        const result = await this.categoriesService.addCategories(account_id, {type, name, config});
        if (think.isError(result)) return this.fail(result.message);

        return this.success({}, "添加成功");
    }


    /**
     * @api {GET} /web/visualComponents/categories/getPageList 获取组件分类分页列表
     * @apiGroup VComponentsCategories
     * @apiVersion 1.0.0
     * @apiDescription 获取组件分类分页列表
     *
     * @apiParam (入参) {Number} type 组件分类类型
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
	 *      "message": "ok"
	 *      "data": {
                    "count": 3,
                    "totalPages": 3,
                    "pagesize": 1,
                    "currentPage": 1,
                    "data": [
                        {
                            "categories_id": 1,
                            "account_id": 1,
                            "type": 1,
                            "name": "test",
                            "config": "{\"a\":1}",
                            "deleted_at": 1,
                            "created_at": 1511335476178,
                            "updated_at": 1511335476178
                        }
                    ]
                }
            }
	 *  }
     */
    async getPageListAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { type, page, search } = this.get();
        const result = await this.categoriesService.getCategoriesPageList(account_id, type, page, 15, search);

        if (think.isError(result)) return this.fail(result.message);

        return this.success(result, "success");
    }


    /**
     * @api {GET} /web/visualComponents/categories/getAll 获取所有的组件分类
     * @apiGroup VComponentsCategories
     * @apiVersion 1.0.0
     * @apiDescription 获取所有的组件分类
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "ok"
	 *      "data": [
                {
                    "categories_id": 1,
                    "name": "test",
                }
            ]
     *  }
     */
    async getAllAction() {
        const { account_id } = await this.getCacheUserInfo();
        const result = await this.categoriesService.getAllList(account_id);

        if (think.isError(result)) return this.fail(result.message);

        return this.success(result, "success");
    }


    /**
     * @api {GET} /web/visualComponents/categories/getDetail 获取单个组件分类详情
     * @apiGroup VComponentsCategories
     * @apiVersion 1.0.0
     * @apiDescription 获取单个组件分类详情
     *
     * @apiParam (入参) {String} categories_id 组件分类ID
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "ok"
	 *      "data": {
	 *          name: "",       // 组件分类名称
	 *          config: "",     // 配置
	 *      }
	 *  }
     */
    async getDetailAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { categories_id } = this.get();
        const result = await this.categoriesService.getCategoriesById(account_id, categories_id);

        if (think.isError(result)) return this.fail(result.message);
        if (think.isEmpty(result)) return this.fail("数据不存在");

        return this.success(result, "success");
    }

    /**
     * @api {PUT} /web/visualComponents/categories/update 更新组件分类
     * @apiGroup VComponentsCategories
     * @apiVersion 1.0.0
     * @apiDescription 更新组件分类
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Number} categories_id 组件分类ID
     * @apiParam (入参) {String} name 组件分类名称
     * @apiParam (入参) {Number} type 组件分类类型
     * @apiParam (入参) {Object} [config] 组件分类配置
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
        const { categories_id, name, type } = this.post();

        if (await this.categoriesService.isExistName(account_id, name, categories_id)) return this.fail("名称已存在");
        const result = await this.categoriesService.updateCategories(account_id, categories_id, {name, type});

        if (think.isError(result)) return this.fail(result.message);

        return this.success({}, "更新成功");
    }

    /**
     * @api {DELETE} /web/visualComponents/categories/delete 删除组件分类
     * @apiGroup VComponentsCategories
     * @apiVersion 1.0.0
     * @apiDescription 删除组件分类
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Array} categories_ids 组件分类ID: [1,2,3,...]
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "ok"
	 *      "data": {}
	 *  }
     */
    async deleteAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { categories_ids } = this.post();

        const result = await this.categoriesService.delCategories(account_id, categories_ids);

        if (think.isError(result)) return this.fail(result.message);

        return this.success({}, "删除成功");
    }

}
