'use strict';
const _ = require('lodash');
const { camelizeKeys, decamelizeKeys } = require('humps');

const Enum = require('../lib/enum');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const connFlyfish = app.mongooseDB.get('flyfish');

  const TradeSchema = new Schema({
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
    status: {
      type: String,
      default: Enum.COMMON_STATUS.VALID,
    },
  });

  TradeSchema.statics._create = async function(params) {
    const doc = _toDoc(params);
    const res = await this.create(doc);
    if (Array.isArray(res)) return res.map(item => _toObj(item._doc));
    return _toObj(res._doc);
  };

  TradeSchema.statics._find = async function(query = {}, projection = null, options = {}) {
    const filter = _toDoc(query);
    const res = await this.find(filter, projection, options).lean(true);
    return res.map(_toObj);
  };

  TradeSchema.statics._findOne = async function(params) {
    const doc = _toDoc(params);
    const res = await this.findOne(doc).lean(true);
    return _toObj(res);
  };


  function _toDoc(obj) {
    if (_.isEmpty(obj)) return;

    if (!_.isNil(obj.id)) {
      obj._id = obj.id;
      delete obj.id;
    }
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

  return connFlyfish.model('Trade', TradeSchema);
};
