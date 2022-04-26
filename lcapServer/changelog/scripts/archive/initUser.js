'use strict';

const config = require('config');
const { MongoClient } = require('mongodb');
const { Sequelize, DataTypes, Op } = require('sequelize');
const _ = require('lodash');
const md5 = require('md5');

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
  tableMap.User = solutionSequelize.define('user', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    user_name: {
      type: DataTypes.STRING,
    },
    user_email: {
      type: DataTypes.STRING,
    },
    user_phone: {
      type: DataTypes.STRING,
    },
    user_password: {
      type: DataTypes.STRING,
    },
    user_status: {
      type: DataTypes.STRING,
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
  }, {
    tableName: 'user',
    timestamps: false,
  });
}


(async () => {
  try {
    await init();
    const { User } = tableMap;
    const users = await User.findAll({ where: { deleted_at: 1 } });
    console.log(`${users.length} 个用户等待被同步`);

    const roles = await db.collection('roles').find().toArray();
    const roleMap = {
      member: roles.find(r => r.name === '成员')._id.toString(),
      admin: roles.find(r => r.name === '管理员')._id.toString(),
    };

    for (const user of users) {
      let role = roleMap.member;
      let password = `${user.user_name}_yunzhihui123`;
      if (user.user_name === 'admin') {
        role = roleMap.admin;
        password = 'utq#SpV!';
      }
      const doc = {
        username: user.user_name,
        email: user.user_email,
        phone: user.user_phone,
        role,
        password: md5(password),
        status: 'valid',
        old_user_id: user.user_id,
        create_time: new Date(),
        update_time: new Date(),
      };
      await db.collection('users').insertOne(doc);
      console.log(`done: ${user.user_name}`);
    }
  } catch (error) {
    console.log(error.stack || error);
  } finally {
    mongoClient.close();
    process.exit(0);
  }
})();

