'use strict';

const config = require('config');
const { MongoClient } = require('mongodb');
const _ = require('lodash');
const fs = require('fs-extra');
const { Sequelize, DataTypes, Op } = require('sequelize');
const moment = require('moment');

const flyfishMongoUrl = config.get('mongoose.clients.flyfish.url');
const dodbUrl = config.get('dodb.url');

let flyfishMongoClient,
  flyfishDb;
let dodbSequelize;
let lastSyncTime;
let interfaceSuccess = 0,
  cateSuccess = 0;
const NOW = Date.now();
const tableMap = {};
const VAR_MAP = {
  BOOLEAN: 'boolean',
  BIGINT: 'integer',
  INTEGER: 'integer',
  FLOAT: 'float',
  DOUBLE: 'number',
  VARCHAR: 'string',
  DATE: 'date',
  TIMESTAMP: 'datetime',
  UUID: 'string',
};

async function init() {
  flyfishMongoClient = new MongoClient(flyfishMongoUrl);
  await flyfishMongoClient.connect();
  flyfishDb = flyfishMongoClient.db('yapi');

  dodbSequelize = new Sequelize(dodbUrl);
  tableMap.bizApiDisplay = dodbSequelize.define('biz_api_display', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    api_name: {
      type: DataTypes.STRING,
    },
    api_path: {
      type: DataTypes.STRING,
    },
    request_info: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.TINYINT,
    },
    is_deleted: {
      type: DataTypes.TINYINT,
    },
    creation_time: {
      type: DataTypes.DATE,
    },
    modified_time: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'biz_api_display',
    timestamps: false,
  });

  tableMap.relation = dodbSequelize.define('biz_data_ref_classification', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    classification_id: {
      type: DataTypes.INTEGER,
    },
    ref_id: {
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.STRING,
    },
    is_deleted: {
      type: DataTypes.TINYINT,
    },
    creation_time: {
      type: DataTypes.DATE,
    },
    modified_time: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'biz_data_ref_classification',
    timestamps: false,
  });

  tableMap.bizDataClassification = dodbSequelize.define('biz_data_classification', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    data_name: {
      type: DataTypes.STRING,
    },
    parent_id: {
      type: DataTypes.INTEGER,
    },
    mode_type: {
      type: DataTypes.STRING,
    },
    is_deleted: {
      type: DataTypes.TINYINT,
    },
    creation_time: {
      type: DataTypes.DATE,
    },
    modified_time: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'biz_data_classification',
    timestamps: false,
  });

  try {
    ({ lastSyncTime } = await fs.readJSON('./cache/dodb.json'));
  } catch (error) {
    lastSyncTime = 0;
  }
}

(async () => {
  try {
    await init();
    const { bizApiDisplay, relation, bizDataClassification } = tableMap;

    const admin = await flyfishDb.collection('user').findOne({ username: 'admin' });

    const dodbGroup = await flyfishDb.collection('group').findOne({ group_name: '数据服务' });
    let dodbGroupId = dodbGroup && dodbGroup._id;
    if (!dodbGroupId) {
      const group = await flyfishDb.collection('group').insertOne({
        _id: await getNextSequenceValue('group'),
        custom_field1: { enable: false },
        group_name: '数据服务',
        members: [ ],
        tag: [],
        type: 'public',
        uid: admin._id,
        add_time: NOW / 1000,
        up_time: NOW / 1000,
      });
      dodbGroupId = group.insertedId;
    }

    const dodbProject = await flyfishDb.collection('project').findOne({ name: '数据服务API' });
    let dodbProjectId = dodbProject && dodbProject._id;
    if (!dodbProjectId) {
      const project = await flyfishDb.collection('project').insertOne({
        _id: await getNextSequenceValue('project'),
        switch_notice: true,
        is_mock_open: false,
        strice: false,
	      is_json5: false,
        name: '数据服务API',
        project_type: 'public',
        basepath: '',
	      members: [ ],
        uid: admin._id,
        group_id: dodbGroupId,
        icon: 'code-o',
        color: 'purple',
        env: [
          {
            header: [ ],
            name: 'local',
            domain: 'http://127.0.0.1',
            global: [ ],
          },
        ],
        tag: [ ],
        add_time: NOW / 1000,
        up_time: NOW / 1000,
      });

      dodbProjectId = project.insertedId;

      await flyfishDb.collection('interface_col').insertOne({
        _id: await getNextSequenceValue('interface_col'),
        checkResponseField: {
          name: 'code',
          value: '0',
          enable: false,
        },
        checkScript: {
          enable: false,
        },
        index: 0,
        test_report: '{}',
        checkHttpCodeIs200: false,
        checkResponseSchema: false,
        name: '公共测试集',
        project_id: dodbProjectId,
        desc: '公共测试集',
        uid: admin._id,
        add_time: NOW / 1000,
        up_time: NOW / 1000,
      });
    }


    const classifications = await bizDataClassification.findAll({ where: { mode_type: 'api_display' } });
    const topCate = _.find(classifications, { parent_id: 0 }).id;
    const firstCates = classifications.filter(item => item.parent_id === topCate);

    const needUpdateCates = firstCates.filter(item => item.modified_time >= +lastSyncTime);
    const cateParentMap = {};
    classifications.forEach(cate => {
      cateParentMap[cate.id] = cate.parent_id;
    });

    for (const cate of needUpdateCates) {
      const newCate = {
        name: cate.data_name,
        desc: '',
        index: 0,
        dodb_id: cate.id,
        project_id: dodbProjectId,
        uid: admin._id,
        sync_time: NOW / 1000,
        add_time: cate.creation_time.getTime() / 1000,
        up_time: cate.modified_time.getTime() / 1000,
        valid: cate.is_deleted !== 1,
      };

      await flyfishDb.collection('interface_cat').updateOne(
        { dodb_id: cate.id },
        { $set: newCate, $setOnInsert: { _id: await getNextSequenceValue('interface_cat') } },
        { upsert: true }
      );
      cateSuccess++;
    }

    const apis = await bizApiDisplay.findAll({ where: { modified_time: { [Op.gte]: +lastSyncTime } } });

    for (const api of apis) {
      const reqInfo = JSON.parse(api.request_info);

      const reqBodyOther = {
        type: 'object',
        title: 'title',
        properties: {},
        required: [],
      };

      for (const param of reqInfo.params || []) {
        reqBodyOther.properties[param.name] = {
          type: VAR_MAP[param.type],
          default: param.def,
          description: param.description,
        };
        reqBodyOther.required.push(param.name);
      }
      const newInterface = {
        dodb_id: api.id,
        traffic_strategy: {
          enable: false,
          count: 0,
        },
        fuse_strategy: {
          enable: false,
          count: 0,
          time_window: 0,
          min_req_amount: 0,
        },
        edit_uid: 0,
        status: api.status === 1 ? 'done' : 'undone',
        type: 'static',
        req_body_is_json_schema: true,
        res_body_is_json_schema: true,
        api_opened: [ 'External' ],
        index: 0,
        tag: [ ],
        method: reqInfo.requestMethod,
        // catid: , // 后面更新上去
        title: api.api_name,
        path: api.api_path.replace(/\/gatewayApi\/dodp/, ''),
        project_id: dodbProjectId,
        req_params: [ ],
        res_body_type: 'json',
        query_path: {
          path: api.api_path.replace(/\/gatewayApi\/dodp/, ''),
          params: [ ],
        },
        uid: admin._id,
        add_time: api.creation_time.getTime() / 1000,
        up_time: api.modified_time.getTime() / 1000,
        sync_time: NOW / 1000,
        req_query: [ ],
        req_headers: [
          {
            required: '1',
            name: 'Content-Type',
            value: 'application/json',
          },
          {
            required: '1',
            name: 'appKey',
            value: '',
          },
          {
            required: '1',
            name: 'appSecret',
            value: '',
          },
        ],
        desc: '',
        markdown: '',
        req_body_type: 'json',
        req_body_other: JSON.stringify(reqBodyOther),
        valid: true,
      };

      await flyfishDb.collection('interface').updateOne(
        { dodb_id: api.id },
        { $set: newInterface, $setOnInsert: { _id: await getNextSequenceValue('interface') } },
        { upsert: true }
      );
      interfaceSuccess++;
    }

    const dodbCates = await flyfishDb.collection('interface_cat').find({ dodb_id: { $exists: true } }, { projection: { dodb_id: 1 } }).toArray();
    const dodbCateMap = _.keyBy(dodbCates, 'dodb_id');

    const relations = await relation.findAll({ where: { modified_time: { [Op.gte]: +lastSyncTime }, type: 'api_query_model', is_deleted: 0 } });
    for (const relation of relations) {
      const relationFirstCate = findFirstCate(relation.classification_id, cateParentMap, firstCates.map(cate => cate.id));
      await flyfishDb.collection('interface').updateOne(
        { dodb_id: relation.ref_id },
        { $set: {
          catid: dodbCateMap[relationFirstCate] && dodbCateMap[relationFirstCate]._id,
          up_time: NOW / 1000,
        } }
      );
    }


  } catch (error) {
    console.log(error.stack || error);
  } finally {
    console.log(`======sync success: ${interfaceSuccess}个接口，${cateSuccess}个分类, sync time: ${moment().format('YYYY-MM-DD HH:mm:ss')}======`);
    await fs.writeJSON('./cache/dodb.json', { lastSyncTime: NOW });
    flyfishMongoClient.close();
    process.exit(0);
  }
})();

function findFirstCate(id, cateParentMap, firstCates) {
  if (firstCates.includes(id)) return id;
  if (!cateParentMap[id]) return firstCates[0];
  return findFirstCate(cateParentMap[id], cateParentMap, firstCates);
}


async function getNextSequenceValue(field) {
  const newDoc = await flyfishDb.collection('identitycounters').findOneAndUpdate(
    { model: field },
    { $inc: { count: 1 } },
    { returnDocument: 'after' } // 返回更新后的数据
  );

  return newDoc.value.count;
}
