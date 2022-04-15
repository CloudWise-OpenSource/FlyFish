'use strict';

const config = require('config');
const { MongoClient, ObjectId } = require('mongodb');
const _ = require('lodash');

const mongoUrl = config.get('mongoose.clients.flyfish.url');

let mongoClient,
  db;

async function init() {
  mongoClient = new MongoClient(mongoUrl);
  await mongoClient.connect();
  db = mongoClient.db('flyfish');
}

// 给components 加上 applications字段
(async () => {
  try {
    await init();

    const componentAppRelation = {};

    const applications = await db.collection('applications').find().toArray();
    for (const app of applications) {
      for (const page of app.pages) {
        for (const component of page.components) {
          if (componentAppRelation[component.type]) {
            componentAppRelation[component.type].add(app._id.toString());
          } else {
            componentAppRelation[component.type] = new Set([ app._id.toString() ]);
          }
        }
      }
    }

    for (const [ componentId, apps ] of Object.entries(componentAppRelation)) {
      await db.collection('components').updateOne({ _id: ObjectId(componentId) }, { $set: { applications: [ ...apps ] } });
    }
  } catch (error) {
    console.log(error.stack || error);
  } finally {
    mongoClient.close();
    process.exit(0);
  }
})();

