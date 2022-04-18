const baseModel = require('../../common/model/baseModel');

module.exports = class extends baseModel {
  constructor(...args) {
    super(...args);
    this._soft_del_field = 'id';
  }

  /**
   * 设置表名
   * @returns {string}
   */
  get tableName() {
    return 'visual_component_tag_view';
  }

  /**
   * 添加额外的schema数据
   */
  get schema() {
    return {
      create_at: {
        default: () => think.datetime()
      },
      update_at: {
        update: true,
        default: () => think.datetime()
      }
    }
  }

  /**
 * 添加组件标签对照关系
 * @param {Number} component_id
 * @param {String} tag_id
 * @returns {Promise<*>}
 */
  addComponentLink({
    component_id,
    tag_id
  }) {
    component_id = Array.isArray(component_id) ? component_id : [component_id];
    const queue = component_id.map(id => ({ component_id: id, tag_id, create_at: think.datetime() }))
    return this.transactionBatchAdd(queue);
  }

  /**
   * 获取组件标签对照关系(批量)
   * @param {Number} component_id
   * @returns {Promise<*>}
   */
  getComponentLink(component_id) {
    component_id = Array.isArray(component_id) ? component_id : [component_id];
    return this.where({ component_id: ['IN', component_id] }).find({ limit: component_id.length });
  }

  /**
   * 根据tag_id获取组件列表(批量)
   * @param {Number} tag_id
   * @returns {Promise<*>}
   */
  getComponentList(tag_id) {
    tag_id = Array.isArray(tag_id) ? tag_id : [tag_id];
    return this.where({ tag_id: ['IN', tag_id] }).select();
  }

  /**
   * 更新组件标签对照关系
   * @param {Number} component_id
   * @param {String} tag_id
   * @returns {Promise<*>}
   */
  updateComponentLink({
    component_id,
    tag_id
  }) {
    return this.transactionUpdate({ component_id }, { tag_id, update_at: think.datetime() });
  }

  /**
   * 删除组件标签对照关系
   * @param {Number} component_id
   * @returns {Promise<*>}
   */
  deleteComponentLink(component_id) {
    // 统一处理一下，可以是数组，也可以是单个的id
    component_id = Array.isArray(component_id) ? component_id : [component_id];
    return this.transactionUpdate({ component_id: ['IN', component_id] }, { status: 0 });
  }
}