'use strict';

const config = require('config');
const { MongoClient } = require('mongodb');
const _ = require('lodash');
const { Sequelize, DataTypes } = require('sequelize');

const flyfishMongoUrl = config.get('mongoose.clients.flyfish.url');
const doucUrl = config.get('douc.url');

let flyfishMongoClient,
  flyfishDb;
let doucSequelize;
const tableMap = {};

async function init() {
  flyfishMongoClient = new MongoClient(flyfishMongoUrl);
  await flyfishMongoClient.connect();
  flyfishDb = flyfishMongoClient.db('yapi');

  doucSequelize = new Sequelize(doucUrl);
  tableMap.sysApiInfo = doucSequelize.define('sys_api_info', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    account_id: {
      type: DataTypes.INTEGER,
    },
    code: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    uri: {
      type: DataTypes.STRING,
    },
    rule: {
      type: DataTypes.TINYINT,
    },
    api_type: {
      type: DataTypes.TINYINT,
    },
    request_info: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.TINYINT,
    },
    create_time: {
      type: DataTypes.DATE,
    },
    modify_time: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'sys_api_info',
    timestamps: false,
  });

  tableMap.sysAppApiPermission = doucSequelize.define('sys_app_api_permission', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    app_id: {
      type: DataTypes.STRING,
    },
    code: {
      type: DataTypes.STRING,
    },
    module_code: {
      type: DataTypes.STRING,
    },
    expire_time: {
      type: DataTypes.DATE,
    },
    bind_type: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'sys_app_api_permission',
    timestamps: false,
  });

  tableMap.sysAppDisplay = doucSequelize.define('sys_app_display', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    app_key: {
      type: DataTypes.STRING,
    },
    app_secret: {
      type: DataTypes.STRING,
    },
    app_name: {
      type: DataTypes.STRING,
    },
    auth_type: {
      type: DataTypes.INTEGER,
    },
    access_params: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.TINYINT,
    },
    description: {
      type: DataTypes.STRING,
    },
    is_deleted: {
      type: DataTypes.TINYINT,
    },
    rule: {
      type: DataTypes.STRING,
    },
    create_time: {
      type: DataTypes.DATE,
    },
    modify_time: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'sys_app_display',
    timestamps: false,
  });
}

(async () => {
  try {
    await init();
    const { sysApiInfo, sysAppApiPermission, sysAppDisplay } = tableMap;
    const admin = await flyfishDb.collection('user').findOne({ username: 'admin' });
    const sysAppDisplays = await sysAppDisplay.findAll();

    for (const eSysAppDisplay of sysAppDisplays) {
      const appRule = JSON.parse(eSysAppDisplay.rule || '{}') || {};
      const insertAppInfo = {
        _id: await getNextSequenceValue('app'),

        add_time: eSysAppDisplay.create_time.getTime() / 1000,
        up_time: eSysAppDisplay.modify_time.getTime() / 1000,

        status: eSysAppDisplay.status ? 'valid' : 'invalid',

        add_uid: admin._id,
        up_uid: admin._id,

        name: eSysAppDisplay.app_name,
        desc: eSysAppDisplay.description,
        app_key: eSysAppDisplay.app_key,
        app_secret: eSysAppDisplay.app_secret,

        traffic_strategy: {
          enable: !!_.get(appRule, [ 'hasRule' ], 0),
          count: _.get(appRule, [ 'count' ], 0),
        },

        from: 'douc',
        douc_id: eSysAppDisplay.id,
      };
      await flyfishDb.collection('app').insertOne(insertAppInfo);

      const curRelations = await sysAppApiPermission.findAll({ where: { app_id: eSysAppDisplay.id } });
      for (const curRelation of curRelations) {
        const curSysApiInfo = await sysApiInfo.findOne({ where: { code: curRelation.code } });
        if (_.isEmpty(curSysApiInfo)) {
          console.log(`${curSysApiInfo.id} not found in db: [sys_api_info]`);
          continue;
        }

        const curInterface = await flyfishDb.collection('interface').findOne({ path: curSysApiInfo.uri });
        if (_.isEmpty(curInterface)) {
          console.log(`${curSysApiInfo.id} not found ${curSysApiInfo.uri} in db: [interface]`);
          continue;
        }

        const apiRule = JSON.parse(curSysApiInfo.rule || '{}') || {};
        const updateInterfaceInfo = {
          traffic_strategy: {
            enable: !!_.get(apiRule, [ 'hasFlowRule' ], 0),
            count: _.get(apiRule, [ 'flowRule', 'count' ], 0),
          },
          fuse_strategy: {
            enable: !!_.get(apiRule, [ 'hasDegradeRule' ], 0),
            count: _.get(apiRule, [ 'degradeRule', 'count' ], 0),
            time_window: _.get(apiRule, [ 'degradeRule', 'timeWindow' ], 0),
            min_req_amount: _.get(apiRule, [ 'degradeRule', 'minRequestAmount' ], 0),
          },
        };
        await flyfishDb.collection('interface').updateOne({ _id: curInterface._id }, { $set: updateInterfaceInfo });

        const now = Date.now() / 1000;
        const insertRelationInfo = {
          _id: await getNextSequenceValue('interface_app_relation'),
          interface_id: curInterface._id,
          app_id: insertAppInfo._id,

          start_time: now,
          expire_time: 0,

          enable: !!eSysAppDisplay.status,
          status: 'valid',

          add_time: now,
          up_time: now,

          from: 'douc',
        };
        if (curRelation.bind_type) {
          insertRelationInfo.expire_time = curRelation.expire_time.getTime() / 1000;
        } else {
          insertRelationInfo.expire_time = 0;
        }
        await flyfishDb.collection('interface_app_relation').insertOne(insertRelationInfo);
      }

      console.log(`${eSysAppDisplay.id} register success =>  [${insertAppInfo._id}]`);
    }
  } catch (error) {
    console.log(error.stack || error);
  } finally {
    flyfishMongoClient.close();
    process.exit(0);
  }
})();


async function getNextSequenceValue(field) {
  const newDoc = await flyfishDb.collection('identitycounters').findOneAndUpdate(
    { model: field },
    { $inc: { count: 1 } },
    { returnDocument: 'after' } // 返回更新后的数据
  );

  return newDoc.value.count;
}
