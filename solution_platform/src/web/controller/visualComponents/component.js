const Base = require('../base');
module.exports = class extends Base {

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
     * @apiHeader (请求头部) {String} Content-Type multipart/form-data
     * @apiParam (入参) {File} componentList 组件文件
     * @apiParam (入参) {Number} tag_id 标签ID
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
        const { tag_id } = this.post();
        const result = await this.componentService.addComponent(account_id, this.file("componentList"), tag_id);
        if (think.isError(result)) return this.fail(result.message);

        return this.success({}, "添加成功");
    }

    /**
     * @api {PUT} /web/visualComponents/component/update 更新组件
     * @apiGroup VComponentsManage
     * @apiVersion 1.0.0
     * @apiDescription 更新组件
     *
     * @apiHeader (请求头部) {String} Content-Type multipart/form-data
     * @apiParam (入参) {Object} component 组件文件
     * @apiParam (入参) {Number} component_id 组件ID
     * @apiParam (入参) {Number} tag_id 标签ID
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
        const { component_id, tag_id } = this.post();
        const component = this.file('component');

        if (!component_id && !component) return this.fail("没有上传组件包");
        const result = await this.componentService.updateComponent(account_id, component_id, component, tag_id);
        if (think.isError(result)) return this.fail(result.message);

        return this.success({}, "更新成功");
    }

    /**
     * @api {POST} /web/visualComponents/component/updateComponentCover 更新组件封面
     * @apiGroup VComponentsManage
     * @apiVersion 1.0.0
     * @apiDescription 更新组件封面
     *
     * @apiHeader (请求头部) {String} Content-Type multipart/form-data
     * @apiParam (入参) {Object} cover 组件封面文件
     * @apiParam (入参) {Number} component_id 组件ID
     *
     * @apiSuccessExample Success-Response:
     *  {
     *      "code": 0,
     *      "message": "更新成功"
     *      "data": {}
     *  }
     */
    async updateComponentCoverAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { component_id } = this.post();
        const cover = this.file('cover');

        if (!cover) return this.fail("没有上传封面");
        const result = await this.componentService.uploadComponentCover(account_id, component_id, cover);

        if (think.isError(result)) return this.fail(result.message);

        return this.success({}, "更新成功");
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
                            "account_id": 1,
                            "name": "test",
                            "component_mark": "test",
                            "is_developping": 1,
                            "is_published": 0,
                            "deleted_at": 1,
                            "created_at": 1512983392221,
                            "updated_at": 1512983392221,
                            "is_hide": 0
                        }
                    ]
                }
            }
     *  }
     */
    async getPageListAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { page, search } = this.get();
        const result = await this.componentService.getComponentPageList(account_id, page, 15, search);

        if (think.isError(result)) return this.fail(result.message);

        return this.success(result, "success");
    }

    /**
     * @api {GET} /web/visualComponents/component/getComponentListByTagId 根据标签id获取组件列表
     * @apiGroup VComponentsManage
     * @apiVersion 1.0.0
     * @apiDescription 根据标签id获取组件列表
     *
     * @apiParam (入参) {String} tag_id 标签id列表
     * @apiParam (入参) {String} is_hide 标签id列表
     *
     * @apiSuccessExample Success-Response:
     *  {
     *      "code": 0,
     *      "message": "success"
     *      "data": {
     *          component_list: [],   // 组件列表
     *          tag_info: {},     // 标签详情
     *      }
     *  }
     */
    async getComponentListByTagIdAction() {
        const { tag_id, is_hide = 0 } = this.get();
        const result = await this.componentService.getComponentListByTagId(tag_id, Number(is_hide));

        if (think.isError(result)) return this.fail(result.message);

        return this.success(result, "success");
    }

    /**
     * @api {GET} /web/visualComponents/component/getDetail 获取单个组件详情
     * @apiGroup VComponentsManage
     * @apiVersion 1.0.0
     * @apiDescription 获取单个组件详情
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
     * @api {POST} /web/visualComponents/component/changeVisible 更改组件可见状态
     * @apiGroup VComponentsManage
     * @apiVersion 1.0.0
     * @apiDescription 更改组件可见状态
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Number} component_id 组件ID
     * @apiParam (入参) {Number} is_hide 是否隐藏
     *
     * @apiSuccessExample Success-Response:
     *  {
     *      "code": 0,
     *      "message": "更改组件可见状态成功"
     *      "data": {}
     *  }
     */
     async changeVisibleAction() {
        const { component_id, is_hide } = this.post();

        const result = await this.componentService.changeVisible(component_id, is_hide);

        if (think.isError(result)) return this.fail(result.message);

        return this.success({}, "更改组件可见状态成功");
    }

}
