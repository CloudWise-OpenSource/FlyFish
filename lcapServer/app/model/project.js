'use strict';
const _ = require('lodash');
const { camelizeKeys, decamelizeKeys } = require('humps');

const Enum = require('../lib/enum');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const connFlyfish = app.mongooseDB.get('flyfish');

  const ProjectSchema = new Schema({
    account_id: String,

    create_time: {
      type: Date,
      default: Date.now,
    },
    update_time: {
      type: Date,
      default: Date.now,
    },
    name: {
      type: String,
    },
    trades: {
      type: [ String ],
    },
    desc: {
      type: String,
    },
    creator: String,
    updater: String,
    is_internal: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: Enum.COMMON_STATUS.VALID,
    },
    from: String,
  });

  ProjectSchema.statics._create = async function(params) {
    const doc = _toDoc(params);
    const res = await this.create(doc);
    return { id: res._id.toString() };
  };

  ProjectSchema.statics._deleteOne = async function(params) {
    const doc = _toDoc(params);
    return await this.deleteOne(doc);
  };

  ProjectSchema.statics._findOne = async function(params) {
    const doc = _toDoc(params);
    const res = await this.findOne(doc).lean(true);
    return _toObj(res);
  };

  ProjectSchema.statics._find = async function(query, projection, options) {
    const filter = _toDoc(query);
    const res = await this.find(filter, projection, options).lean(true);
    return res.map(_toObj);
  };

  ProjectSchema.statics._count = async function(query) {
    const filter = _toDoc(query);
    return await this.count(filter);
  };

  ProjectSchema.statics._updateOne = async function(query, params) {
    const filter = _toDoc(query);
    const doc = _toDoc(params, true);
    return await this.updateOne(filter, doc);
  };

  function _toDoc(obj, update) {
    if (_.isEmpty(obj)) return;
    obj = _.omitBy(obj, _.isNil);

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

    return Object.assign(camelizeRes, res);
  }

  return connFlyfish.model('Project', ProjectSchema);
};
