'use strict';
const _ = require('lodash');
const { camelizeKeys, decamelizeKeys } = require('humps');

const Enum = require('../lib/enum');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const connFlyfish = app.mongooseDB.get('flyfish');

  const ResourceRenderRecordsSchema = new Schema({
    create_time: {
      type: Date,
      default: Date.now,
    },
    update_time: {
      type: Date,
      default: Date.now,
    },
    type: String,
    version: String,
    render_status: String,
    page_auth: String,
    render_stage: {
      type: String,
      default: Enum.RENDER_STAGE.UNDONE,
    },
    re_render_count: {
      type: Number,
      default: 0,
    },
  });

  ResourceRenderRecordsSchema.statics._create = async function(params) {
    const doc = _toDoc(params);
    const res = await this.create(doc);
    if (Array.isArray(res)) return res.map(item => _toObj(item._doc));
    return _toObj(res._doc);
  };

  ResourceRenderRecordsSchema.statics._updateOne = async function(cond, params, options) {
    const docCond = _toDoc(cond);
    const docData = _toDoc(params, true);
    return await this.updateOne(docCond, docData, options);
  };

  ResourceRenderRecordsSchema.statics._find = async function(query, projection, options) {
    const filter = _toDoc(query);
    const res = await this.find(filter, projection, options).lean(true);
    return res.map(_toObj);
  };

  function _toDoc(obj, update = false) {
    if (_.isEmpty(obj)) return;

    if (obj.id) obj._id = obj.id; delete (obj.id);
    if (update) obj.updateTime = Date.now();
    const returnObj = decamelizeKeys(obj, function(key, convert, options) {
      return _.startsWith(key, '$') ? key : convert(key, options);
    });
    if (obj.dataConfig) returnObj.dataConfig = obj.dataConfig;

    return returnObj;
  }

  function _toObj(doc) {
    if (_.isEmpty(doc)) return;

    const res = {};
    res.id = doc._id.toString();

    const camelizeRes = camelizeKeys(doc);
    if (doc.dataConfig) camelizeRes.dataConfig = doc.dataConfig;

    if (!_.isNil(camelizeRes.createTime)) res.createTime = camelizeRes.createTime.getTime();
    if (!_.isNil(camelizeRes.updateTime)) res.updateTime = camelizeRes.updateTime.getTime();

    return Object.assign({}, camelizeRes, res);
  }

  return connFlyfish.model('ResourceRenderRecords', ResourceRenderRecordsSchema, 'resource_render_records');
};
