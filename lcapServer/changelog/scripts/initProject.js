'use strict';

const config = require('config');
const { MongoClient } = require('mongodb');
const { Sequelize, DataTypes, Op } = require('sequelize');

const mongoUrl = config.get('mongoose.clients.flyfish.url');
const solutionUri = config.get('mysql.solution_uri');

let mongoClient,
  db,
  solutionSequelize;
const tableMap = {};

async function init() {
  mongoClient = new MongoClient(mongoUrl);
  await mongoClient.connect();
  db = mongoClient.db('flyfish');

  solutionSequelize = new Sequelize(solutionUri);
  tableMap.Tag = solutionSequelize.define('component_tag', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'component_tag',
    timestamps: false,
  });
}


(async () => {
  try {
    await init();
    const { Tag } = tableMap;
    const tags = await Tag.findAll({ where: { status: 1 } });
    console.log(`${tags.length} 个项目等待被同步`);

    for (const tag of tags) {
      if (tag.name === '基础组件') continue;
      const doc = {
        name: tag.name,
        desc: tag.description,
        status: 'valid',
        trades: [],
        create_time: new Date(),
        update_time: new Date(),
        old_id: tag.id,
      };
      await db.collection('projects').insertOne(doc);
    }

    const weiguishu = {
      name: '未归属组件',
      desc: '旧组件开发平台未导入应用平台的组件',
      status: 'valid',
      trades: [],
      create_time: new Date(),
      update_time: new Date(),
    };
    await db.collection('projects').insertOne(weiguishu);

  } catch (error) {
    console.log(error.stack || error);
  } finally {
    mongoClient.close();
    process.exit(0);
  }
})();

