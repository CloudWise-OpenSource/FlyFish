const Base = require('../base');
module.exports = class extends Base {

    constructor(ctx) {
        super(ctx);
        this.screenService = think.service('visualScreen/screen', think.config("custom.appModules.web"));
        this.screenTagModel = ctx.model('visualScreenTagView');
    }

    /**
     * @api {POST} /web/visualScreen/screen/add 添加大屏
     * @apiGroup VScreenManage
     * @apiVersion 1.0.0
     * @apiDescription 添加大屏
     *
     * @apiHeader (请求头部) {String} Content-Type multipart/form-data
     * @apiParam (入参) {String} name 大屏名称
     * @apiParam (入参) {File} cover 待上传的封面
     * @apiParam (入参) {String} tag_id 标签id列表
     * @apiParam (入参) {Number} status 大屏状态
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

        let { name, status, tag_id } = this.post();
        const file = this.file('cover');

        // 检查是否选择标签
        if (!tag_id) {
            return this.fail('请选择标签');
        }

        if (await this.screenService.isExistScreen(account_id, name)) return this.fail("大屏存在");

        const result = await this.screenService.addScreen(account_id, user_id, tag_id, { name, coverPath: file ? file.path : null, status });

        if (think.isError(result)) return this.fail(result.message);

        this.success({}, "添加成功");
    }


    /**
     * @api {GET} /web/visualScreen/screen/getPageList 获取大屏分页列表
     * @apiGroup VScreenManage
     * @apiVersion 1.0.0
     * @apiDescription 获取大屏分页列表
     *
     * @apiParam (入参) {Number} page 当前分页数
     * @apiParam (入参) {Object} [search={}] 过滤条件:
     * @apiParam (入参) {String} order 排序字段:
     * @apiParam (入参) {condition} [search={}] 过滤条件:
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
                            "screen_id": 1,
                            "account_id": 1,
                            "name": "test",
                        }
                    ]
                }
            }
     *  }
     */
    async getPageListAction() {
        const { account_id, user_id } = await this.getCacheUserInfo();
        const { page, search, order, condition } = this.get();
        const result = await this.screenService.getScreenPageList(account_id, user_id, page, 15, "screen_id, name, cover, developing_user_id, status, create_user_id", search, order, condition);

        if (think.isError(result)) return this.fail(result.message);

        this.success(result, "success");
    }

    /**
     * @api {GET} /web/visualScreen/screen/getDetail 获取单个大屏详情
     * @apiGroup VScreenManage
     * @apiVersion 1.0.0
     * @apiDescription 获取单个大屏详情
     *
     * @apiParam (入参) {String} screen_id 大屏ID
     *
     * @apiSuccessExample Success-Response:
     *  {
     *      "code": 0,
     *      "message": "success"
     *      "data": {
     *          name: "",       // 大屏分类名称
     *          config: "",     // 配置
     *      }
     *  }
     */
    async getDetailAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { screen_id } = this.get();
        const result = await this.screenService.getScreenById(account_id, screen_id);
        // 获取对应标签
        const tagListResult = await this.screenTagModel.getScreenLink(screen_id);

        if (think.isError(result) || think.isError(tagListResult)) return this.fail(result.message);
        if (think.isEmpty(result)) return this.fail("数据不存在");

        let tag_list = [];
        if (!think.isEmpty(tagListResult)) {
            tag_list = tagListResult.tag_id.split(',').map(Number);
        }
        result.tag_id = tag_list;

        this.success(result, "success");
    }

    /**
     * @api {PUT} /web/visualScreen/screen/update 更新大屏
     * @apiGroup VScreenManage
     * @apiVersion 1.0.0
     * @apiDescription 更新大屏
     *
     * @apiHeader (请求头部) {String} Content-Type multipart/form-data
     * @apiParam (入参) {Number} screen_id 大屏ID
     * @apiParam (入参) {String} name 大屏名称
     * @apiParam (入参) {File} cover 待上传的封面
     * @apiParam (入参) {Number} status 大屏状态
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

        const { path: coverPath } = this.file('cover') || {};
        const { screen_id, name, status, tag_id } = this.post();

        if (!tag_id) {
            return this.fail('请选择标签');
        }

        if (await this.screenService.isExistScreen(account_id, name, screen_id)) return this.fail("大屏名称重复");

        const result = await this.screenService.updateScreen(account_id, screen_id, tag_id, { name, coverPath, status });
        if (think.isError(result)) return this.fail(result.message);

        this.success({}, "更新成功");
    }

    /**
     * @api {DELETE} /web/visualScreen/screen/delete 删除大屏
     * @apiGroup VScreenManage
     * @apiVersion 1.0.0
     * @apiDescription 删除大屏
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Array} screen_ids 大屏ID: [1,2,3,...]
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
        const { screen_ids } = this.post();

        const result = await this.screenService.delScreen(account_id, screen_ids);
        if (think.isError(result)) return this.fail(result.message);

        this.success({}, "删除成功");
    }

    /**
     * @api {PUT} /web/visualScreen/screen/unlock 解锁大屏
     * @apiGroup VScreenManage
     * @apiVersion 1.0.0
     * @apiDescription 解锁大屏
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Array} screen_ids 大屏ID: [1,2,3,...]
     *
     * @apiSuccessExample Success-Response:
     *  {
     *      "code": 0,
     *      "message": "删除成功"
     *      "data": {}
     *  }
     */
    async unlockAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { screen_id } = this.post();

        const result = await this.screenService.unlockScreen(account_id, screen_id);
        if (think.isError(result)) return this.fail(result.message);

        this.success({}, "解锁成功");
    }

    /**
     * @api {POST} /web/visualScreen/screen/copy 复制大屏
     * @apiGroup VScreenManage
     * @apiVersion 1.0.0
     * @apiDescription 复制大屏
     *
     * @apiHeader (请求头部) {String} Content-Type multipart/form-data
     * @apiParam (入参) {Number} screen_id 大屏ID
     * @apiParam (入参) {String} name 大屏名称
     * @apiParam (入参) {String} tag_id 标签
     * @apiParam (入参) {File} cover 待上传的封面
     * @apiParam (入参) {Number} status 大屏状态
     *
     * @apiSuccessExample Success-Response:
     *  {
     *      "code": 0,
     *      "message": "复制成功"
     *      "data": {}
     *  }
     */
    async copyAction() {
        const { account_id, user_id } = await this.getCacheUserInfo();

        const { path: coverPath } = this.file('cover') || {};
        const { screen_id, name, status, tag_id } = this.post();

        if (!tag_id) return this.fail('请选择标签');

        if (await this.screenService.isExistScreen(account_id, name)) return this.fail("大屏存在");

        const result = await this.screenService.copyScreen(account_id, user_id, screen_id, tag_id, { name, coverPath, status });
        if (think.isError(result)) return this.fail(result.message);

        this.success({}, "复制成功");
    }

    /**
     * @api {GET} /web/visualScreen/screen/getDelPageList 获取已删除大屏分页列表
     * @apiGroup VScreenManage
     * @apiVersion 1.0.0
     * @apiDescription 获取已删除大屏分页列表
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
                            "screen_id": 1,
                            "account_id": 1,
                            "name": "test",
                        }
                    ]
                }
            }
     *  }
     */
    async getDelPageListAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { page, search } = this.get();
        const result = await this.screenService.getScreenDelPageList(account_id, page, 15, "screen_id, name, cover, created_at, updated_at", search);

        if (think.isError(result)) return this.fail(result.message);

        this.success(result, "success");
    }

    /**
     * @api {DELETE} /web/visualScreen/screen/undoDelete 还原大屏
     * @apiGroup VScreenManage
     * @apiVersion 1.0.0
     * @apiDescription 还原大屏
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Array} screen_ids 大屏ID: [1,2,3,...]
     *
     * @apiSuccessExample Success-Response:
     *  {
     *      "code": 0,
     *      "message": "还原成功"
     *      "data": {}
     *  }
     */
    async undoDeleteAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { screen_ids } = this.post();

        const result = await this.screenService.undoDelScreen(account_id, screen_ids);
        if (think.isError(result)) return this.fail(result.message);

        this.success({}, "还原成功");
    }
    /**
     * @api {GET} /web/visualScreen/screen/downloadScreen 大屏导出文件下载
     * @apiGroup VScreenManage
     * @apiVersion 1.0.0
     * @apiDescription 大屏导出文件下载
     *
     * @apiHeader (请求头部) {String} Content-Type application/json
     * @apiParam (入参) {Array} screen_ids 大屏ID: [1,2,3,...]
     *
     * @apiSuccessExample Success-Response:
     *  {
     *      "code": 0,
     *      "message": "大屏文件下载成功"
     *      "data": {}
     *  }
     */
    async downloadScreenAction() {
        const { account_id } = await this.getCacheUserInfo();
        const { screen_id } = this.get();
        const result = await this.screenService.getScreenById(account_id, screen_id);
        if (think.isError(result)) return this.fail(result.message);
        if (think.isEmpty(result.options_conf)) return this.fail("数据不存在");
        const screen_conf = JSON.parse(result.options_conf);
        const filepath = await this.screenService.downloadScreenCode(account_id, screen_id, screen_conf);
        if (think.isError(filepath)) return this.fail(filepath.message);
        // this.success(filepath, "还原成功");
        this.download(filepath)
    }


    async downloadScreenSourceAction() {
        const { screen_id, token } = this.get();

        if (token !== think.config('custom.screenSourceToken')) return this.fail('No download auth');

        const result = await this.screenService.getScreenById(1, screen_id);
        if (think.isError(result)) return this.fail(result.message);

        const screen_conf = JSON.parse(result.options_conf);
        const filepath = await this.screenService.downloadScreenSource(screen_id, screen_conf);
        if (think.isError(filepath)) return this.fail(filepath.message);

        this.download(filepath);
    }
}
