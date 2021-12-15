/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-06-24 16:25:41
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-06-28 14:53:14
 */
const baseModel = require('../../common/model/baseModel');

module.exports = class extends baseModel{
  constructor(...args) {
    super(...args);
    this._soft_del_field='deleteFlag';
    this._pk = 'sceneId';             // 设置主键字段
  }
  /**
     * 设置表名
     * @returns {string}
     */
    get tableName () {
      return 'visual_scenes';
  }
}