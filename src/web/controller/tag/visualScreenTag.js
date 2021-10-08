const Base = require('../base');

module.exports = class extends Base {
  constructor(ctx) {
    super(ctx);
    this.visualScreenTagModel = think.model('visualScreenTagView', {}, think.config("custom.appModules.web"));
  }

  /**
   * @api {GET} /web/tag/visualComponentTag/getDetailByScreenId 根据大屏id获取标签
   * @apiGroup VisualScreenTagManage
   * @apiVersion 1.0.0
   * @apiDescription 根据大屏id获取标签
   *
   * @apiHeader (请求头部) {String} Content-Type multipart/form-data
   * @apiParam (入参) {Number} screen_id 大屏id
   *
   * @apiSuccessExample Success-Response:
   *  {
   *      "code": 0,
   *      "data": {}
   *  }
   */
  async getDetailByScreenIdAction() {
    const { screen_id } = this.get();
    if (!screen_id) {
      return this.fail('参数screen_id缺失');
    }

    const result = await this.visualScreenTagModel.getScreenLink(screen_id);
    if (think.isError(result)) {
      return this.fail(result);
    }
    let tagList = [];
    if (!think.isEmpty(result)) {
      tagList = result.tag_id.split(',');
    }
    return this.success(tagList, '查询成功');
  }
}