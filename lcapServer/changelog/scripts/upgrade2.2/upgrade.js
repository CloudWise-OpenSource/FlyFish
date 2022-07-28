'use strict';

const config = require('config');
const { MongoClient, ObjectId } = require('mongodb');
const util = require('util');
const fs = require('fs');
const _ = require('lodash');
const exec = util.promisify(require('child_process').exec);

const mongoUrl = config.get('mongoose.clients.flyfish.url');
const staticDir = config.get('pathConfig.staticDir');
const commonDirPath = config.get('pathConfig.commonDirPath');
const componentsPath = config.get('pathConfig.componentsPath');
const initComponentVersion = config.get('pathConfig.initComponentVersion');
const newStaticPathPrefix = commonDirPath ? `/${commonDirPath}` : '';

let mongoClient,
  db;

(async () => {
  try {
    await init();

    await upgradeMenu();
    await upgradeAdminRole();
    // await upgradeWww();
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

async function upgradeAdminRole() {
  const adminRoleInfo = await db.collection('roles').findOne({ name: '管理员' });
  if (!_.isEmpty(adminRoleInfo)) {
    const menus = [
      {
        name: '应用创建',
        url: '/app',
        index: 1,
      },
      {
        name: '项目管理',
        url: '/app/project-manage',
        index: 2,
      },
      {
        name: '应用开发',
        url: '/app/apply-develop',
        index: 3,
      },
      {
        name: '组件列表',
        url: '/app/component-develop',
        index: 4,
      },
      {
        name: '数据源管理',
        url: '/data',
        index: 5,
      },
      {
        name: '数据查询',
        url: '/data-search',
        index: 6,
      },
      {
        name: '用户管理',
        url: '/user',
        index: 7,
      },
      {
        name: '用户列表',
        url: '/user/user-manage',
        index: 8,
      },
      {
        name: '角色列表',
        url: '/user/role-manage',
        index: 9,
      },
    ];
    await db.collection('roles').updateOne({ _id: adminRoleInfo._id }, { $set: { menus } });
    console.log('upgrade role success');
  }
}

async function upgradeMenu() {
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
            name: '组件列表',
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
      {
        name: '数据源管理',
        url: '/data',
        index: 12,
        children: [],
      },
      {
        name: '数据查询',
        url: '/data-search',
        index: 13,
        children: [],
      },
    ],
    create_time: new Date(),
    update_time: new Date(),
  };
  await db.collection('menus').insertOne(menuInfo);
  console.log('upgrade menu success');
}

async function upgradeWww() {
  const files = fs.readdirSync(`${staticDir}/${componentsPath}`);
  if (!fs.existsSync(`${staticDir}/${componentsPath}`)) {
    console.log(`no found path:[ ${`${staticDir}/${componentsPath}`} ]`);
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    try {
      if (filename.length !== 24) continue;
      const componentId = filename;

      const componentPath = `${staticDir}/${componentsPath}/${componentId}`;
      const comVersion = `${componentPath}/${initComponentVersion}`;
      if (!fs.existsSync(`${comVersion}`)) continue;

      const componentInfo = await db.collection('components').findOne({ _id: ObjectId(componentId) });
      const updateComponentInfo = {
        cover: newStaticPathPrefix ? (componentInfo.cover.includes(newStaticPathPrefix) ? componentInfo.cover : `${newStaticPathPrefix}${componentInfo.cover}`) : componentInfo.cover,
      };
      await db.collection('components').updateOne({ _id: ObjectId(componentId) }, { $set: { updateComponentInfo } });

      if (newStaticPathPrefix) {
        await exec(`sed -i 's#src=".*/components/#src="${newStaticPathPrefix}/components/#g' ${comVersion}/editor.html`);
        await exec(`sed -i 's#src=".*/common/#src="${newStaticPathPrefix}/common/#g' ${comVersion}/editor.html`);
        await exec(`sed -i 's#href=".*/common/#href="${newStaticPathPrefix}/common/#g' ${comVersion}/editor.html`);
        await exec(`sed -i 's#src=".*/components/#src="${newStaticPathPrefix}/components/#g' ${comVersion}/index.html`);
        await exec(`sed -i 's#src=".*/common/#src="${newStaticPathPrefix}/common/#g' ${comVersion}/index.html`);
        await exec(`sed -i "s#componentsDir.*components'#componentsDir: '${newStaticPathPrefix.slice(1)}/components'#g" ${comVersion}/env.js`);
      }

      console.log(`update component success: ${componentId},  progress: ${i + 1}/${files.length}`);
    } catch (error) {
      console.log(`update component fail: ${error.stack || error}`);
    }
  }
}

