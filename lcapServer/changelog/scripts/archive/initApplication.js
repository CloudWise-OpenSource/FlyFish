'use strict';

const config = require('config');
const { MongoClient } = require('mongodb');
const { Sequelize, DataTypes, Op } = require('sequelize');
const _ = require('lodash');

const mongoUrl = config.get('mongoose.clients.flyfish.url');
const solutionUri = config.get('mysql.solution_uri');

let mongoClient,
  db,
  solutionSequelize;
const tableMap = {};
const SCREEN_STATUS = [ 'doing', 'testing', 'delivered' ];
let success = 0;
const errList = [];

async function init() {
  mongoClient = new MongoClient(mongoUrl);
  await mongoClient.connect();
  db = mongoClient.db('flyfish');

  solutionSequelize = new Sequelize(solutionUri);
  tableMap.Screen = solutionSequelize.define('visual_screen', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    screen_id: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    options_conf: {
      type: DataTypes.TEXT,
    },
    deleted_at: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.INTEGER,
    },
    updated_at: {
      type: DataTypes.INTEGER,
    },
    create_user_id: {
      type: DataTypes.INTEGER,
    },
    developing_user_id: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    cover: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'visual_screen',
    timestamps: false,
  });

  tableMap.ScreenAndView = solutionSequelize.define('visual_screen_tag_view', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    screen_id: {
      type: DataTypes.STRING,
    },
    tag_id: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'visual_screen_tag_view',
    timestamps: false,
  });
}


(async () => {
  try {
    await init();
    const { Screen, ScreenAndView } = tableMap;

    const screens = await Screen.findAll({ where: { deleted_at: 1 } });
    console.log(`${screens.length} 个应用等待被同步`);

    const screenAndViews = await ScreenAndView.findAll({ where: { status: 1 } });
    const screenAndViewMap = _.keyBy(screenAndViews, 'screen_id');

    const users = await db.collection('users').find().toArray();
    const userMap = _.keyBy(users, 'old_user_id');

    const projects = await db.collection('projects').find().toArray();
    const projectMap = _.keyBy(projects, 'old_id');

    const components = await db.collection('components').find().toArray();
    const componentMap = _.keyBy(components, 'old_component_mark');

    const specialScreenMap = {
      57: [[ 17, 14 ], 17 ], // 招商城科
      98: [[ 37, 15 ], 37 ], // 震坤行poc
      99: [[ 34, 14 ], 34 ], // display-components
      106: [[ 40, 42 ], 40 ], // 国投IT基础设施监控大屏
      164: [[ 16, 59 ], 16 ], // 星巴克
      209: [[ 20, 70 ], 70 ], // 四川社保厅POC
      220: [[ 34, 75, 67, 58, 71, 111 ], 111 ], // 云智慧运营看板
      223: [[ 15, 47, 20 ], 15 ], // 基础设施运维监控概览大屏- pepper副本
      247: [[ 31, 83, 15 ], 83 ], // 贵州省公安厅运维态势大屏
      259: [[ 40, 42, 93 ], 40 ], // 国投IT基础设施监控大屏复制保存
      261: [[ 44, 93 ], 40 ], // 国投基础设施监控大屏2复制保存
      113: [[ 44 ], 40 ], // 国投基础设施监控大屏2
      283: [[ 99 ], 40 ], // 国投集团IT设施监控大屏
    };
    for (const screen of screens) {
      try {
        const tagStr = screenAndViewMap[screen.screen_id] && screenAndViewMap[screen.screen_id].tag_id;
        const tagIds = tagStr.split(',');
        let tagId = tagIds[0];
        let projectId = projectMap[tagId]._id.toString();

        if (tagIds.length > 1 && specialScreenMap[screen.id]) {
          tagId = specialScreenMap[screen.id][1];
          // TODO: 把0下的组件都挂到1上
          const components = await db.collection('components').find({ projects: { $in: specialScreenMap[screen.id][0] } }).toArray();
          const componentIds = _.uniq(components.map(item => item._id));
          projectId = projectMap[tagId]._id.toString();

          await db.collection('components').updateMany({ _id: { $in: componentIds } }, { $addToSet: { projects: projectId } });
        }

        const optionObj = screen.options_conf && JSON.parse(screen.options_conf) || {};
        optionObj.components = (optionObj.components || []).map(c => {
          c._type = c.type;
          c.type = componentMap[c.type]._id.toString();
          c.version = 'v1.0.0';

          return c;
        });
        const doc = {
          name: screen.name,
          old_id: screen.id,
          old_screen_id: screen.screen_id,
          project_id: projectId,
          type: '2D',
          develop_status: SCREEN_STATUS[screen.status] || 'doing',
          creator: userMap[screen.create_user_id] && userMap[screen.create_user_id]._id.toString(),
          updater: userMap[screen.developing_user_id] && userMap[screen.developing_user_id]._id.toString(),
          status: 'valid',
          _cover: screen.cover,
          pages: [ optionObj ],
          create_time: new Date(),
          update_time: new Date(),
        };
        await db.collection('applications').insertOne(doc);
        success++;
      } catch (error) {
        errList.push(screen.screen_id);
        console.error(`失败：${screen.screen_id}`, JSON.stringify(error.stack || error));
      }
    }

  } catch (error) {
    console.log(error.stack || error);
  } finally {
    console.log(`执行完毕，成功${success}条`);
    console.log(`失败：${errList.length}条`, JSON.stringify(errList));
    mongoClient.close();
    process.exit(0);
  }
})();

