'use strict';
const _ = require('lodash');
const { camelizeKeys, decamelizeKeys } = require('humps');
const Enum = require('../lib/enum');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const connFlyfish = app.mongooseDB.get('flyfish');

  const ComponentSchema = new Schema({
    account_id: String,
    create_time: {
      type: Date,
      default: Date.now,
    },
    update_time: {
      type: Date,
      default: Date.now,
    },

    name: String,
    category: String,
    sub_category: String,
    type: String,
    desc: String,
    is_lib: Boolean,
    projects: [ String ],
    tags: [ String ],
    applications: [ String ],
    data_config: Object,
    automatic_cover: Number,

    versions: [{
      _id: false,
      no: String,
      desc: String,
      status: String,
      time: {
        type: Date,
        default: Date.now,
      },
    }],
    cover: String,
    creator: String,
    updater: String,
    develop_status: {
      type: String,
      default: Enum.COMPONENT_DEVELOP_STATUS.DOING,
    },

    status: {
      type: String,
      default: Enum.COMMON_STATUS.VALID,
    },
    git_lab_project_id: {
      type: Number,
    },
    need_push_git: {
      type: Boolean,
    },
    last_change_time: {
      type: Date,
    },
    from: String,
    allow_data_search: Number,
  });

  ComponentSchema.statics._count = async function(query) {
    const filter = _toDoc(query);
    return await this.count(filter);
  };

  ComponentSchema.statics._find = async function(params, projection, options) {
    const doc = _toDoc(params);
    const res = await this.find(doc, projection, options).lean(true);
    return res.map(_toObj);
  };

  ComponentSchema.statics._findOne = async function(params) {
    const doc = _toDoc(params);
    const res = await this.findOne(doc).lean(true);
    return _toObj(res);
  };

  ComponentSchema.statics._create = async function(params) {
    const doc = _toDoc(params);
    const res = await this.create(doc);
    return { id: res._id.toString() };
  };

  ComponentSchema.statics._updateOne = async function(cond, params) {
    const docCond = _toDoc(cond);
    const docData = _toDoc(params, true);
    return await this.updateOne(docCond, docData);
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

  return connFlyfish.model('Component', ComponentSchema);
};
