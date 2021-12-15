const Base = require('../base');
const path = require('path');
module.exports = class extends Base{

    constructor(ctx) {
        super(ctx);
        this.componentService = think.service('visualComponents/component', think.config("custom.appModules.web"));
    }

    /**
     * @api {POST} /web/visualComponents/component/add 添加组件
     * @apiGroup VComponentsManage
     * @apiVersion 1.0.0
     * @apiDescription 添加组件
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {String} name 组件名称
     * @apiParam (入参) {String} component_mark 组件标识
     * @apiParam (入参) {Number} categories_id 组件分类
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "添加成功"
	 *      "data": {}
	 *  }
     */
    async addAction() {
        const { account_id, user_id } = await this.getCacheUserInfo();
        let { name, component_mark, org_id, categories_id ,type, typeId} = this.post();
        if (await this.componentService.isExistComponentMarkIncludeDel(account_id, org_id, component_mark)) return this.fail("该组织中组件标识已存在");

        const result = await this.componentService.addComponent(account_id, user_id, {name, component_mark, org_id, categories_id, type, typeId});
        if (think.isError(result)) return this.fail(result.message);

        return this.success({}, "添加成功");
    }


    /**
     * @api {GET} /web/visualComponents/component/getPageList 获取组件分页列表
     * @apiGroup VComponentsManage
     * @apiVersion 1.0.0
     * @apiDescription 获取组件分页列表
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
                            "component_id": 17,
                            "component_id": 1,
                            "account_id": 1,
                            "org_id": "1",
                            "name": "test",
                            "component_mark": "test",
                            "is_developping": 1,
                            "is_published": 0,
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
        const { page, search, pageSize } = this.get();
        const result = await this.componentService.getComponentPageList(
          account_id,
          page || 1,
          pageSize || 20,
          search
        );

        if (think.isError(result)) return this.fail(result.message);

        return this.success(result, "success");
    }

    /**
     * @api {GET} /web/visualComponents/component/getDetail 获取单个组件分类详情
     * @apiGroup VComponentsManage
     * @apiVersion 1.0.0
     * @apiDescription 获取单个组件分类详情
     *
     * @apiParam (入参) {String} component_id 组件分类ID
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "success"
	 *      "data": {
	 *          name: "",       // 组件分类名称
	 *          config: "",     // 配置
	 *      }
	 *  }
     */
    async getDetailAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { component_id } = this.get();
        const result = await this.componentService.getComponentById(account_id, component_id);

        if (think.isError(result)) return this.fail(result.message);
        if (think.isEmpty(result)) return this.fail("数据不存在");

        return this.success(result, "success");
    }

    /**
     * @api {PUT} /web/visualComponents/component/update 更新组件分类
     * @apiGroup VComponentsManage
     * @apiVersion 1.0.0
     * @apiDescription 更新组件分类
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Number} component_id 组件分类ID
     * @apiParam (入参) {String} name 组件名称
     * @apiParam (入参) {Number} type 组件类型
     * @apiParam (入参) {Number} categories_id 组件分类
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
        const { component_id, name, org_id, categories_id } = this.post();
        console.log(component_id, name, org_id, categories_id)
        const result = await this.componentService.updateComponent(account_id, component_id, {name, org_id, categories_id});

        if (think.isError(result)) return this.fail(result.message);

        return this.success({}, "更新成功");
    }

    /**
     * @api {DELETE} /web/visualComponents/component/delete 删除组件
     * @apiGroup VComponentsManage
     * @apiVersion 1.0.0
     * @apiDescription 删除组件
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Array} component_ids 组件ID: [1,2,3,...]
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
        const { component_ids } = this.post();

        const result = await this.componentService.delComponent(account_id, component_ids);

        if (think.isError(result)) return this.fail(result.message);

        return this.success({}, "删除成功");
    }


    /**
     * @api {GET} /web/visualComponents/component/download 组件下载
     * @apiGroup VComponentsManage
     * @apiVersion 1.0.0
     * @apiDescription 组件下载
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Array} component_id 组件ID
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "组件下载"
	 *      "data": {}
	 *  }
     */
    async downloadAction() {
        const devComponentIOService = think.service('visualComponents/devComponentIO', think.config("custom.appModules.web"));
        const { component_id } = this.get();
        const filepath = await devComponentIOService.mkComponentZip(component_id);
        if (think.isError(filepath)) return this.fail(filepath.message);

        this.download(filepath)
    }

    /**
     * @api {GET} /web/visualComponents/component/downloadComponentCode 组件源代码下载
     * @apiGroup VComponentsManage
     * @apiVersion 1.0.0
     * @apiDescription 组件源代码下载
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Array} component_id 组件ID
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "组件源代码下载"
	 *      "data": {}
	 *  }
     */
    async downloadComponentCodeAction() {
        const devComponentIOService = think.service('visualComponents/devComponentIO', think.config("custom.appModules.web"));
        const { component_id } = this.get();
        const filepath = await devComponentIOService.downloadComponentCode(component_id);
        if (think.isError(filepath)) return this.fail(filepath.message);

        this.download(filepath)
    }

    /**
     * @api {GET} /web/visualComponents/component/downloadComponentCode 组件源代码导出
     * @apiGroup VComponentsManage
     * @apiVersion 1.0.0
     * @apiDescription 组件源代码导出
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Array} component_id 组件ID
     * @apiParam (入参) {Object} component 组件文件
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "组件源代码导出"
	 *      "data": {}
	 *  }
     */
    async importComponentCodeAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { component_id } = this.post();
        const component = this.file('component');

        if (!component) return this.fail("没有上传组件包");
        const result = await this.componentService.importComponentCode(account_id, component_id, component);
        if (think.isError(result)) return this.fail(result.message);

        return this.success({}, "更新成功");
    }



    /**
     * @api {POST} /web/visualComponents/component/copy 复制组件
     * @apiGroup VComponentsManage
     * @apiVersion 1.0.0
     * @apiDescription 复制组件
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {String} component_id 组件ID
     * @apiParam (入参) {String} target_component_mark 组件标识
     * @apiParam (入参) {String} target_org_id 目标组织ID
     *
     * @apiSuccessExample Success-Response:
     *  {
	 *      "code": 0,
	 *      "message": "添加成功" 
	 *      "data": {}
	 *  }
     */
    async copyAction() {
        const { account_id, user_id, user_name } = await this.getCacheUserInfo();
        let { component_id, target_org_id, target_component_mark } = this.post();

        const result = await this.componentService.copyComponent(account_id, user_id, {component_id, target_org_id, target_component_mark, user_name });
        if (think.isError(result)) return this.fail(result.message);

        return this.success({}, "添加成功");
    }

}
