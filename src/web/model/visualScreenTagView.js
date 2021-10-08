const baseModel = require('../../common/model/baseModel');

module.exports = class extends baseModel {
  constructor(...args) {
    super(...args);
    this._soft_del_field = "id";
  }

  /**
   * 设置表名
   * @returns {string}
   */
  get tableName() {
    return "visual_screen_tag_view";
  }

  /**
   * 添加额外的schema数据
   */
  get schema() {
    return {
      create_at: {
        default: () => think.datetime(),
      },
      update_at: {
        update: true,
        default: () => think.datetime(),
      },
    };
  }

  /**
   * 添加大屏标签对照关系
   * @param {String} screen_id
   * @param {String} tag_id
   * @returns {Promise<*>}
   */
  addScreenLink({ screen_id, tag_id }) {
    return this.transactionAdd({
      screen_id,
      tag_id,
      create_at: think.datetime(),
    });
  }

  /**
   * 获取大屏标签对照关系
   * @param {String} screen_id
   * @returns {Promise<*>}
   */
  getScreenLink(screen_id) {
    return this.where({ screen_id }).find();
  }

  /**
   * 根据大屏标签获取大屏列表(批量)
   * @param {Number} tag_id
   * @returns {Promise<*>}
   */
  async getScreenList(tag_id) {
    tag_id = Array.isArray(tag_id) ? tag_id : [tag_id];
    let result = await this.where().select();
    return result.filter(item => {
      const tags = (item["tag_id"] || '').split(',') || [];
      return tag_id.some((id) => tags.includes(id));
    });
  }

  /**
   * 更新大屏标签对照关系
   * @param {String} screen_id
   * @param {String} tag_id
   * @returns {Promise<*>}
   */
  updateScreenLink({ screen_id, tag_id }) {
    return this.transactionUpdate(
      { screen_id },
      { tag_id, update_at: think.datetime() }
    );
  }

  /**
   * 删除大屏标签对照关系
   * @param {String|String[]} screen_id
   * @returns {Promise<*>}
   */
  deleteScreenLink(screen_id) {
    // 统一处理一下，可以是数组，也可以是单个的id
    screen_id = Array.isArray(screen_id) ? screen_id : [screen_id];
    return this.transactionUpdate(
      { screen_id: ["IN", screen_id] },
      { status: 0 }
    );
  }
};