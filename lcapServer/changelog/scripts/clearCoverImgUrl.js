'use strict';

const config = require('config');
const { MongoClient } = require('mongodb');
const _ = require('lodash');

const flyfishMongoUrl = config.get('mongoose.clients.flyfish.url');

let flyfishMongoClient,
  flyfishDb;

async function init() {
  flyfishMongoClient = new MongoClient(flyfishMongoUrl);
  await flyfishMongoClient.connect();
  flyfishDb = flyfishMongoClient.db('flyfish');
}

(async () => {
  try {
    await init();

    const url = '/component_tpl/public/cover.png';
    const components = await flyfishDb.collection('components').find({ type: 'common' });

    for (const component of components) {
      const componentId = component._id;
      await flyfishDb.collection('components').updateOne({ _id: componentId }, { cover: url });
    }

    console.log('clear success');
  } catch (error) {
    console.log(error.stack || error);
  } finally {
    flyfishMongoClient.close();
    process.exit(0);
  }
})();
