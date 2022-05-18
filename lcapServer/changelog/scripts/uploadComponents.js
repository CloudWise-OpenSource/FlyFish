
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
const initComponentVersion = config.get('pathConfig.initComponentVersion');

const uploadDir = path.resolve('upload');

const filename = process.argv[2];
const newStaticPathPrefix = process.argv[3];

const extractDir = `${uploadDir}/${filename.slice(0, -4)}`;

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
     * 1. 插入components表
     * 1. 插入component_categories表
     * 3. 复制components文件
     * 4. 复制组件资源
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

        delete component.project_id;
        await db.collection('components').updateOne(
          { _id: ObjectId(componentId) },
          { $set: component, $setOnInsert: { _id: ObjectId(componentId) } },
          { upsert: true }
        );

        await exec(`cd ${staticDir}/${componentsPath} && tar -xzvf ${componentId}.tar`, { maxBuffer: 1024 * 1024 * 1024 });

        if (newStaticPathPrefix) {
          // editor.html
          await exec(`sed -i -e "s#\/components\/#${newStaticPathPrefix}\/components\/#g" ${staticDir}/${componentsPath}/${componentId}/${initComponentVersion}/editor.html`);
          await exec(`sed -i -e "s#\/common\/#${newStaticPathPrefix}\/common\/#g" ${staticDir}/${componentsPath}/${componentId}/${initComponentVersion}/editor.html`);
          // index.html
          await exec(`sed -i -e "s#\/components\/#${newStaticPathPrefix}\/components\/#g" ${staticDir}/${componentsPath}/${componentId}/${initComponentVersion}/index.html`);
          await exec(`sed -i -e "s#\/common\/#${newStaticPathPrefix}\/common\/#g" ${staticDir}/${componentsPath}/${componentId}/${initComponentVersion}/index.html`);

          // env.js
          await exec(`sed -i -e "s#\'components\'#\'${newStaticPathPrefix.slice(1)}\/components\'#g" ${staticDir}/${componentsPath}/${componentId}/${initComponentVersion}/env.js`);
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

