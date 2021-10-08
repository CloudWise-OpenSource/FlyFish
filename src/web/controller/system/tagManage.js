/**
 * @description component tag controller
 */
const Base = require('../base');

module.exports = class extends Base {
    constructor(ctx) {
        super(ctx);
        this.componentTagModel = think.model('componentTag', {}, think.config('custom.appModules.web'));
    }

    /**
     * @api {GET} /web/system/tagManage/getTagList 获取标签分页列表
     * @apiGroup SystemTagManage
     * @apiVersion 1.0.0
     * @apiDescription 获取标签分页列表
     *
     * @apiParam (入参) {Number} page 当前分页数
     */
    async getTagListAction() {
        const { page = 1, pageSize, search, not_default, status } = this.get();
        const result = await this.componentTagModel.getTagList({ page, pageSize, search, status, not_default });

        if (think.isError(result)) return this.fail(result.message);
        this.success(result, "success");
    }

    /**
     * @api {POST} /web/system/tagManage/addTag 新增标签
     * @apiGroup SystemTagManage
     * @apiVersion 1.0.0
     * @apiDescription 新增标签
     *
     * @apiParam (入参) {string} name 标签名称
     * @apiParam (入参) {string} description 标签备注
     */
    async addTagAction() {
        const { name, description } = this.post();
        const result = await this.componentTagModel.addTag({ name, description });

        if (think.isError(result)) return this.fail(result.message);
        this.success({ id: result }, "success");
    }

    /**
     * @api {POST} /web/system/tagManage/editTag 编辑标签
     * @apiGroup SystemTagManage
     * @apiVersion 1.0.0
     * @apiDescription 编辑标签
     *
     * @apiParam (入参) {number} id 标签id
     * @apiParam (入参) {string} name 标签名称
     * @apiParam (入参) {string} description 标签备注
     * @apiParam (入参) {number} is_default 是否为默认标签
     */
    async editTagAction() {
        const { id, name, description, status } = this.post();
        const result = await this.componentTagModel.editTag({ id, name, description, status });

        if (think.isError(result)) return this.fail(result.message);
        this.success({ effectRows: result }, "success");
    }

    /**
     * @api {POST} /web/system/tagManage/deleteTag 删除标签
     * @apiGroup SystemTagManage
     * @apiVersion 1.0.0
     * @apiDescription 删除标签
     *
     * @apiParam (入参) {array} id 标签id数组
     */
    async deleteTagAction() {
        const { id } = this.post();
        const result = await this.componentTagModel.deleteTag({ id });

        if (think.isError(result)) return this.fail(result.message);
        this.success({ effectRows: result }, "success");
    }
}