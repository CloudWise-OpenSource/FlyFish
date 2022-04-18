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
    const docs = [{
      name: '管理员',
      status: 'valid',
      menus: [
        {
          name: '工作台',
          url: '/dashboard',
          index: 1,
        },
        {
          name: '应用创建',
          url: '/app',
          index: 2,
        },
        {
          name: '项目管理',
          url: '/app/project-manage',
          index: 3,
        },
        {
          name: '应用开发',
          url: '/app/apply-develop',
          index: 4,
        },
        {
          name: '组件开发',
          url: '/app/component-develop',
          index: 5,
        },
        {
          name: '模板库',
          url: '/template',
          index: 6,
        },
        {
          name: '应用模板库',
          url: '/template/apply-template',
          index: 7,
        },
        {
          name: '组件库',
          url: '/template/library-template',
          index: 8,
        },
        {
          name: '用户管理',
          url: '/user',
          index: 9,
        },
        {
          name: '用户列表',
          url: '/user/user-manage',
          index: 10,
        },
        {
          name: '角色列表',
          url: '/user/role-manage',
          index: 11,
        },
        {
          name: 'API应用服务层',
          url: '/api',
          index: 12,
        },
        {
          name: 'API列表',
          url: '/api/api-list',
          index: 13,
        },
        {
          name: '应用管理',
          url: '/api/api-manage',
          index: 14,
        },
      ],
      desc: 'admin',
      create_time: new Date(),
      update_time: new Date(),
    },
    {
      name: '成员',
      status: 'valid',
      menus: [
        {
          name: '工作台',
          url: '/dashboard',
          index: 1,
        },
        {
          name: '应用创建',
          url: '/app',
          index: 2,
        },
        {
          name: '项目管理',
          url: '/app/project-manage',
          index: 3,
        },
        {
          name: '应用开发',
          url: '/app/apply-develop',
          index: 4,
        },
        {
          name: '组件开发',
          url: '/app/component-develop',
          index: 5,
        },
        {
          name: '模板库',
          url: '/template',
          index: 6,
        },
        {
          name: '应用模板库',
          url: '/template/apply-template',
          index: 7,
        },
        {
          name: '组件库',
          url: '/template/library-template',
          index: 8,
        },
        {
          name: 'API应用服务层',
          url: '/api',
          index: 9,
        },
        {
          name: 'API列表',
          url: '/api/api-list',
          index: 10,
        },
        {
          name: '应用管理',
          url: '/api/api-manage',
          index: 11,
        },
      ],
      desc: '基础角色',
      create_time: new Date(),
      update_time: new Date(),
    },
    ];
    await db.collection('roles').insertMany(docs);
  } catch (error) {
    console.log(error.stack || error);
  } finally {
    mongoClient.close();
    process.exit(0);
  }
})();

