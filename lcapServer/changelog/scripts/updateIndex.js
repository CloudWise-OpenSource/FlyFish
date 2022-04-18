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
    console.log('update indexes start');
    await init();
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
  } catch (error) {
    console.log(error.stack || error);
  } finally {
    console.log('update indexes success');
    mongoClient.close();
    process.exit(0);
  }
})();

