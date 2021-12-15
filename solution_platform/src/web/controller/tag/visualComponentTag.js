const Base = require('../base');

module.exports = class extends Base {
  constructor(ctx) {
    super(ctx);
    this.visualComponentTagModel = think.model('visualComponentTagView', {}, think.config('custom.appModules.web'));
  }

  /**
   * @api {GET} /web/tag/visualComponentTag/getDetailByComponentId 根据组件id获取标签
   * @apiGroup VisualComponentTagManage
   * @apiVersion 1.0.0
   * @apiDescription 根据组件id获取标签
   *
   * @apiHeader (请求头部) {String} Content-Type multipart/form-data
   * @apiParam (入参) {Number} component_id 组件id
   *
   * @apiSuccessExample Success-Response:
   *  {
   *      "code": 0,
   *      "data": {}
   *  }
   */
  async getDetailByComponentIdAction() {
    const { component_id } = this.get();
    if (!component_id) {
      return this.fail('参数component_id缺失');
    }

    const result = await this.visualComponentTagModel.getComponentLink(component_id);
    if (think.isError(result)) {
      return this.fail(result);
    }
    let tag_id = null;
    if (!think.isEmpty(result)) {
      tag_id = result.tag_id;
    }
    return this.success(tag_id, '查询成功');
  }
}