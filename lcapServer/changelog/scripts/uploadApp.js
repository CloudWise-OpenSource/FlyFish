'use strict';

const config = require('config');
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs-extra');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const _ = require('lodash');
const Enum = require('../../app/lib/enum');

const mongoUrl = config.get('mongoose.clients.flyfish.url');
const staticDir = config.get('pathConfig.staticDir');
const componentsPath = config.get('pathConfig.componentsPath');
const applicationPath = config.get('pathConfig.applicationPath');
const initComponentVersion = config.get('pathConfig.initComponentVersion');
const commonDirPath = config.get('pathConfig.commonDirPath');

const uploadDir = path.resolve('upload');
const filename = process.argv[2];
const newStaticPathPrefix = commonDirPath ? `/${commonDirPath}` : '';

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

    await exec(`cd upload && tar -xzvf ${filename}`, { maxBuffer: 1024 * 1024 * 1024 });
    const categoriesInfo = await db.collection('component_categories').find({}, { sort: { create_time: -1 }, limit: 1 }).toArray();
    if (_.isEmpty(categoriesInfo[0])) {
      console.log('upload fail: no categoryInfo!!!');
      return;
    }

    const projectInfo = await db.collection('projects').findOne({ from: Enum.DATA_FROM.LCAP_INIT });
    if (_.isEmpty(projectInfo)) {
      console.log('upload fail: no projectInfo!!!');
      return;
    }

    const curCategoryInfo = categoriesInfo[0];
    const basicCategoryInfo = (curCategoryInfo.categories || []).find(category => category.name === '2D图表组件') || {};
    const basicSubCategoryInfo = (basicCategoryInfo.children || []).find(subCategory => subCategory.name === '项目组件');
    if (_.isEmpty(basicCategoryInfo) || _.isEmpty(basicSubCategoryInfo)) {
      console.log('upload fail: no categoryInfo!!!');
      return;
    }

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
      project_id: projectInfo._id.toString(),
      from: Enum.DATA_FROM.LCAP_INIT,
      create_time: new Date(),
      update_time: new Date(),
    });

    await db.collection('applications').updateOne(
      { _id: appObjectId },
      { $set: application, $setOnInsert: { _id: appObjectId } },
      { upsert: true }
    );

    await fs.copy(path.resolve(extractDir, 'applications'), path.resolve(staticDir, applicationPath));
    await fs.copy(path.resolve(extractDir, 'components'), path.resolve(staticDir, componentsPath));

    const components = await fs.readJson(path.resolve(extractDir, 'component.json'));
    for (let j = 0; j < components.length; j++) {
      const component = components[j];
      const componentId = component._id;

      component.cover = (component.cover === '/component_tpl/public/cover.png') ? '/component_tpl/public/cover.jpeg' : component.cover;
      const updateComponentInfo = {
        versions: (component.versions || []).map(version => {
          version.time = new Date(version.time);
          return version;
        }),
        projects: [],
        tags: [],
        applications: [],
        develop_status: component.develop_status,
        status: 'valid',
        name: component.name,
        category: basicCategoryInfo.id,
        sub_category: basicSubCategoryInfo.id,
        type: Enum.COMPONENT_TYPE.PROJECT,
        cover: newStaticPathPrefix ? (component.cover.includes(newStaticPathPrefix) ? component.cover : `${newStaticPathPrefix}${component.cover}`) : component.cover,
        from: Enum.DATA_FROM.LCAP_INIT,
        create_time: new Date(),
        update_time: new Date(),
      };

      await db.collection('components').updateOne(
        { _id: ObjectId(componentId) },
        { $set: updateComponentInfo, $setOnInsert: { _id: ObjectId(componentId) } },
        { upsert: true }
      );

      await exec(`cd ${staticDir}/${componentsPath} && tar -xzvf ${componentId}.tar`, { maxBuffer: 1024 * 1024 * 1024 });

      if (newStaticPathPrefix) {
        const comVersion = `${staticDir}/${componentsPath}/${componentId}/${initComponentVersion}`;
        if (fs.pathExistsSync(comVersion)) {
          await exec(`sed -i 's#src=".*/components/#src="${newStaticPathPrefix}/components/#g' ${comVersion}/editor.html`);
          await exec(`sed -i 's#src=".*/common/#src="${newStaticPathPrefix}/common/#g' ${comVersion}/editor.html`);
          await exec(`sed -i 's#href=".*/common/#href="${newStaticPathPrefix}/common/#g' ${comVersion}/editor.html`);
          await exec(`sed -i 's#src=".*/components/#src="${newStaticPathPrefix}/components/#g' ${comVersion}/index.html`);
          await exec(`sed -i 's#src=".*/common/#src="${newStaticPathPrefix}/common/#g' ${comVersion}/index.html`);
          await exec(`sed -i "s#componentsDir.*components'#componentsDir: '${newStaticPathPrefix.slice(1)}/components'#g" ${comVersion}/env.js`);
        }
      }

      await fs.remove(`${staticDir}/${componentsPath}/${componentId}.tar`);
      console.log(`upload component success: ${componentId},  progress: ${j + 1}/${components.length}`);
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

