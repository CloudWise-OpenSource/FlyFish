'use strict';

const config = require('config');
const { MongoClient } = require('mongodb');

const mongoUrl = config.get('mongoose.clients.flyfish.url');

let mongoClient,
  db;

async function init() {
  mongoClient = new MongoClient(mongoUrl);
  await mongoClient.connect();
  db = mongoClient.db('flyfish');
}


(async () => {
  try {
    await init();
    const now = Date.now();
    const doc = {
      categories: [
        {
          id: `${now}0`,
          name: '2D图表组件',
          children: [
            {
              id: `${now}00`,
              name: '基础组件',
            },
            {
              id: `${now}01`,
              name: '项目组件',
            },
          ],
        },
      ],

      create_time: new Date(),
      update_time: new Date(),
    };
    await db.collection('component_categories').insertOne(doc);
  } catch (error) {
    console.log(error.stack || error);
  } finally {
    mongoClient.close();
    process.exit(0);
  }
})();

