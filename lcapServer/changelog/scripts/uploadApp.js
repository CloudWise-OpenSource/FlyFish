'use strict';

const config = require('config');
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs-extra');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const _ = require('lodash');

const mongoUrl = config.get('mongoose.clients.flyfish.url');
const staticDir = config.get('pathConfig.staticDir');
const componentsPath = config.get('pathConfig.componentsPath');
const applicationPath = config.get('pathConfig.applicationPath');
const initComponentVersion = config.get('pathConfig.initComponentVersion');

const uploadDir = path.resolve('upload');

const filename = process.argv[2];
const newStaticPathPrefix = process.argv[3];

const appId = filename.slice(0, -4); // xxx.tar文件
const extractDir = `${uploadDir}/${appId}`;


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

    /**
     * 1. 插入applications表 (TODO: 部分需要is_lib=true)
     * 2. 插入projects表
     * 3. 插入component_categories表
     * 4. 复制components文件
     * 5. 复制应用静态资源
     * 6. 复制组件资源
     */

    await exec(`cd upload && tar -xzvf ${filename}`, { maxBuffer: 1024 * 1024 * 1024 });

    const admin = await db.collection('users').findOne({ username: 'admin' });
    const adminId = admin && admin._id.toString();

    const categoriesInfo = await db.collection('component_categories').find({}, { sort: { create_time: -1 }, limit: 1 }).toArray();
    if (_.isEmpty(categoriesInfo[0])) {
      console.log('upload fail: no categoryInfo!!!');
      return;
    }

    const curCategoryInfo = categoriesInfo[0];
    const basicCategoryInfo = (curCategoryInfo.categories || []).find(category => category.name === '2D图表组件') || {};
    const basicSubCategoryInfo = (basicCategoryInfo.children || []).find(subCategory => subCategory.name === '基础组件');

    const application = await fs.readJson(path.resolve(extractDir, 'application.json'));
    const appObjectId = ObjectId(application._id);
    delete application._id;

    application.cover = (application.cover === '/application_tpl/public/cover.png') ? '/application_tpl/public/cover.jpeg' : application.cover;

    if (newStaticPathPrefix) {
      for (const page of application.pages) {
        if (page.options) page.options.backgroundImage = `${newStaticPathPrefix.slice(1)}/${page.options.backgroundImage}`;
      }

      for (const page of application.pages) {
        for (const component of page.components) {
          if (component.options) component.options.image = `${newStaticPathPrefix.slice(1)}/${component.options.image}`;
        }
      }
    }

    Object.assign(application, {
      cover: newStaticPathPrefix ? `${newStaticPathPrefix}${application.cover}` : application.cover,
      creator: adminId,
      updater: adminId,
      create_time: new Date(),
      update_time: new Date(),
    });

    await db.collection('applications').updateOne(
      { _id: appObjectId },
      { $set: application, $setOnInsert: { _id: appObjectId } },
      { upsert: true }
    );

    const project = await fs.readJson(path.resolve(extractDir, 'project.json'));
    const projectObjectId = ObjectId(project._id);
    delete project._id;
    Object.assign(project, {
      creator: adminId,
      updater: adminId,
      create_time: new Date(),
      update_time: new Date(),
    });
    await db.collection('projects').updateOne(
      { _id: projectObjectId },
      { $set: project, $setOnInsert: { _id: projectObjectId } },
      { upsert: true }
    );

    await fs.copy(
      path.resolve(extractDir, 'applications'),
      path.resolve(staticDir, applicationPath)
    );

    await fs.copy(
      path.resolve(extractDir, 'components'),
      path.resolve(staticDir, componentsPath)
    );

    const components = await fs.readJson(path.resolve(extractDir, 'component.json'));
    for (const chunk of _.chunk(components, 2)) {
      /* eslint-disable no-loop-func */
      await Promise.all(chunk.map(async component => {
        const componentId = component._id;
        delete component._id;

        component.cover = (component.cover === '/component_tpl/public/cover.png') ? '/component_tpl/public/cover.jpeg' : component.cover;
        Object.assign(component, {
          versions: (component.versions || []).map(version => {
            version.time = new Date(version.time);
            return version;
          }),
          applications: [],
          projects: [],
          tags: [],
          type: 'common',
          cover: newStaticPathPrefix ? `${newStaticPathPrefix}${component.cover}` : component.cover,
          category: basicCategoryInfo.id,
          sub_category: basicSubCategoryInfo.id,
          creator: adminId,
          updater: adminId,
          create_time: new Date(),
          update_time: new Date(),
        });

        await db.collection('components').updateOne(
          { _id: ObjectId(componentId) },
          { $set: component, $setOnInsert: { _id: ObjectId(componentId) } },
          { upsert: true }
        );

        await exec(`cd ${staticDir}/${componentsPath} && tar -xzvf ${componentId}.tar`, { maxBuffer: 1024 * 1024 * 1024 });

        if (newStaticPathPrefix) {
          const comVersion = `${staticDir}/${componentsPath}/${componentId}/${initComponentVersion}`;
          if (fs.pathExistsSync(comVersion)) {
            await exec(`sed -i -e "s#\/components\/#${newStaticPathPrefix}\/components\/#g" ${comVersion}/editor.html`);
            await exec(`sed -i -e "s#\/common\/#${newStaticPathPrefix}\/common\/#g" ${comVersion}/editor.html`);
            await exec(`sed -i -e "s#\/components\/#${newStaticPathPrefix}\/components\/#g" ${comVersion}/index.html`);
            await exec(`sed -i -e "s#\/common\/#${newStaticPathPrefix}\/common\/#g" ${comVersion}/index.html`);
            await exec(`sed -i -e "s#\'components\'#\'${newStaticPathPrefix.slice(1)}\/components\'#g" ${comVersion}/env.js`);
          }
        }

        await fs.remove(`${staticDir}/${componentsPath}/${componentId}.tar`);
      }));
    }

  } catch (error) {
    console.log(error.stack || error);
  } finally {
    console.log('upload success');
    await fs.remove(extractDir);
    mongoClient.close();
    process.exit(0);
  }
})();

