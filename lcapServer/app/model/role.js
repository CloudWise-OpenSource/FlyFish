'use strict';
const Enum = require('../lib/enum');

const _ = require('lodash');
const { camelizeKeys, decamelizeKeys } = require('humps');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const connFlyfish = app.mongooseDB.get('flyfish');

  const RoleSchema = new Schema({
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
    desc: {
      type: String,
    },
    menus: [{
      _id: false,
      name: String,
      url: String,
      index: Number,
    }],
    status: {
      type: String,
      default: Enum.COMMON_STATUS.VALID,
    },
  });

  RoleSchema.statics._find = async function(params, projection, options) {
    const doc = _toDoc(params);
    const res = await this.find(doc, projection, options).lean(true);
    return res.map(_toObj);
  };

  RoleSchema.statics._count = async function(params) {
    const doc = _toDoc(params);
    return await this.count(doc);
  };

  RoleSchema.statics._create = async function(params) {
    const doc = _toDoc(params);
    return await this.create(doc);
  };

  RoleSchema.statics._findOne = async function(params) {
    const doc = _toDoc(params);
    const res = await this.findOne(doc).lean(true);
    return _toObj(res);
  };

  RoleSchema.statics._updateOne = async function(cond, params) {
    const docCond = _toDoc(cond);
    const docData = _toDoc(params, true);
    return await this.updateOne(docCond, docData);
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

  return connFlyfish.model('Role', RoleSchema);
};
