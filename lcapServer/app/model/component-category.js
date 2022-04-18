'use strict';
const _ = require('lodash');
const { camelizeKeys, decamelizeKeys } = require('humps');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const connFlyfish = app.mongooseDB.get('flyfish');

  const ComponentCategorySchema = new Schema({
    create_time: {
      type: Date,
      default: Date.now,
    },
    update_time: {
      type: Date,
      default: Date.now,
    },

    categories: [{
      _id: false,
      id: String,
      name: String,
      children: [{
        _id: false,
        id: String,
        name: String,
      }],
    }],
  });

  ComponentCategorySchema.statics._find = async function(params, projection, options) {
    const doc = _toDoc(params);
    const res = await this.find(doc, projection, options).lean(true);
    return res.map(_toObj);
  };

  ComponentCategorySchema.statics._create = async function(params) {
    const doc = _toDoc(params);
    return await this.create(doc);
  };

  function _toDoc(obj, update = false) {
    if (_.isEmpty(obj)) return;

    if (obj.id) obj._id = obj.id; delete (obj.id);
    if (update) obj.updateTime = Date.now();
    return decamelizeKeys(obj);
  }

  function _toObj(doc) {
    if (_.isEmpty(doc)) return;

    const res = {};
    res.id = doc._id.toString();

    const camelizeRes = camelizeKeys(doc);

    if (!_.isNil(camelizeRes.createTime)) res.createTime = camelizeRes.createTime.getTime();
    if (!_.isNil(camelizeRes.updateTime)) res.updateTime = camelizeRes.updateTime.getTime();

    return Object.assign({}, camelizeRes, res);
  }

  return connFlyfish.model('ComponentCategory', ComponentCategorySchema, 'component_categories');
};
