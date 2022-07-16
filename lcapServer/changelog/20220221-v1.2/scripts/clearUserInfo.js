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
    // "admin"

    const users = await db.collection('users').find({}).toArray();
    for (const user of users) {
      console.log(user.username);
    }

  } catch (error) {
    console.log(error.stack || error);
  } finally {
    mongoClient.close();
    process.exit(0);
  }
})();

