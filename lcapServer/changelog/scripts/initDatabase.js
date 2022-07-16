'use strict';

const config = require('config');
const { MongoClient } = require('mongodb');

const mongoUrl = config.get('mongoose.clients.flyfish.url');
const _ = require('lodash');
const md5 = require('md5');

let mongoClient,
  db;

(async () => {
  try {
    await init();

    await initMenu();
    await initRole();
    await initUser();
    await initComponentCategory();
  } catch (error) {
    console.log(error.stack || error);
  } finally {
    mongoClient.close();
    process.exit(0);
  }
})();

async function init() {
  mongoClient = new MongoClient(mongoUrl);
  await mongoClient.connect();
  db = mongoClient.db('flyfish');
}

async function initRole() {
  const exists = await db.collection('roles').find({ name: { $in: [ '管理员', '成员' ] } }).toArray();

  if (exists.length === 0) {
    const roles = [{
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
    await db.collection('roles').insertMany(roles);
  }

  console.log('init role success');
}

async function initUser() {
  const exists = await db.collection('users').findOne({ username: 'admin' });

  if (_.isEmpty(exists)) {
    const roleInfo = await db.collection('roles').findOne({ name: '管理员' });
    const password = 'utq#SpV!';
    const doc = {
      username: 'admin',
      email: 'admin@yunzhihui.com',
      phone: '',
      role: roleInfo._id.toString(),
      password: md5(password),
      status: 'valid',
      create_time: new Date(),
      update_time: new Date(),
    };
    await db.collection('users').insertOne(doc);
  }

  console.log('init user success');
}

async function initMenu() {
  const exists = await db.collection('menus').findOne();
  if (_.isEmpty(exists)) {
    const menuInfo = {
      menus: [
        {
          name: '应用创建',
          url: '/app',
          index: 2,
          children: [
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
          ],
        },
        {
          name: '用户管理',
          url: '/user',
          index: 9,
          children: [
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
          ],
        },
      ],
      create_time: new Date(),
      update_time: new Date(),
    };
    await db.collection('menus').insertOne(menuInfo);
  }

  console.log('init menu success');
}

async function initComponentCategory() {
  const exists = await db.collection('component_categories').findOne();
  if (_.isEmpty(exists)) {
    const doc = {
      categories: [
        {
          id: '19700101',
          name: '2D图表组件',
          children: [
            {
              id: '197001010',
              name: '未分类',
            },
            {
              id: '197001011',
              name: '基础组件',
            },
            {
              id: '197001012',
              name: '项目组件',
            },
          ],
        },
      ],

      create_time: new Date(),
      update_time: new Date(),
    };
    await db.collection('component_categories').insertOne(doc);
  }

  console.log('init component_categories success');
}
