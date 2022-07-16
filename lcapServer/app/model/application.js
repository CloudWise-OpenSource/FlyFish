'use strict';
const _ = require('lodash');
const { camelizeKeys, decamelizeKeys } = require('humps');

const Enum = require('../lib/enum');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const connFlyfish = app.mongooseDB.get('flyfish');

  const ApplicationSchema = new Schema({
    create_time: {
      type: Date,
      default: Date.now,
    },
    update_time: {
      type: Date,
      default: Date.now,
    },

    name: String,
    project_id: String,
    is_lib: Boolean,
    is_recommend: Boolean,

    is_from_doma: Boolean,
    is_from_docc: Boolean,

    tags: [ String ],
    develop_status: {
      type: String,
      default: Enum.APP_DEVELOP_STATUS.DOING,
    },
    type: String,
    model_id: String, // 资源modelId
    models: [{
      _id: false,
      model_info: {
        id: String,
        name: String,
      },
      ci_infos: [{
        _id: false,
        id: String,
        name: String,
      }],
    }],
    cover: String,
    creator: String,
    updater: String,
    account_id: String,
    status: {
      type: String,
      default: Enum.COMMON_STATUS.VALID,
    },
    from: String,
    pages: [ Object ],
  });

  // 注意：create有options参数时，doc必须是数组
  ApplicationSchema.statics._create = async function(params) {
    const doc = _toDoc(params);
    const res = await this.create([ doc ], { checkKeys: false });
    return { id: res[0]._id.toString() };
  };

  ApplicationSchema.statics._deleteOne = async function(params) {
    const doc = _toDoc(params);
    return await this.deleteOne(doc);
  };

  ApplicationSchema.statics._findOne = async function(params) {
    const doc = _toDoc(params);
    const res = await this.findOne(doc).lean(true);
    return _toObj(res);
  };

  ApplicationSchema.statics._find = async function(query, projection, options) {
    const filter = _toDoc(query);
    const res = await this.find(filter, projection, options).lean(true);
    return res.map(_toObj);
  };

  ApplicationSchema.statics._count = async function(query) {
    const filter = _toDoc(query);
    return await this.count(filter);
  };

  ApplicationSchema.statics._updateOne = async function(query, params) {
    const filter = _toDoc(query);
    const doc = _toDoc(params, true);
    return await this.updateOne(filter, doc);
  };

  function _toDoc(obj, update = false) {
    if (_.isEmpty(obj)) return;

    if (obj.id) obj._id = obj.id; delete (obj.id);
    if (update) obj.updateTime = Date.now();
    const returnObj = decamelizeKeys(obj);

    if (obj.pages) returnObj.pages = obj.pages;

    return returnObj;
  }

  function _toObj(doc) {
    if (_.isEmpty(doc)) return;

    const res = {};
    res.id = doc._id.toString();

    const camelizeRes = camelizeKeys(doc);

    if (doc.pages) camelizeRes.pages = doc.pages;

    if (!_.isNil(camelizeRes.createTime)) res.createTime = camelizeRes.createTime.getTime();
    if (!_.isNil(camelizeRes.updateTime)) res.updateTime = camelizeRes.updateTime.getTime();

    return Object.assign({}, camelizeRes, res);
  }

  return connFlyfish.model('Application', ApplicationSchema);
};
