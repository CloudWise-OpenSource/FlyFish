'use strict';

const config = require('config');
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs-extra');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const mongoUrl = config.get('mongoose.clients.flyfish.url');
const staticDir = config.get('pathConfig.staticDir') + config.get('pathConfig.commonDirPath');

const appId = process.argv[2];
const downloadDir = `download/${appId}`;

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
     * 1. 下载applications表
     * 2. 下载projects表
     * 3. 下载component_categories表
     * 4. 下载components表
     * 5. 下载应用静态资源
     * 6. 下载组件资源
     */

    const app = await db.collection('applications').findOne({ _id: ObjectId(appId) });

    Object.assign(app, {
      tags: [],
      creator: '',
      updater: '',
    });

    const project = await db.collection('projects').findOne({ _id: ObjectId(app.project_id) });
    Object.assign(project, {
      trades: [],
      creator: '',
      updater: '',
    });

    const categories = await db.collection('component_categories').find({}, { sort: { create_time: -1 }, limit: 1 }).toArray();
    const categoryInfo = categories[0];

    const componentIdSet = new Set();
    (app.pages || []).forEach(page => {
      (page.components || []).forEach(component => {
        componentIdSet.add(component.type);
      });
    });
    const components = await db.collection('components').find({ _id: { $in: [ ...componentIdSet ].map(id => ObjectId(id)) } }).toArray();
    components.forEach(component => {
      Object.assign(component, {
        projects: [],
        tags: [],
        applications: [],
        creator: '',
        updater: '',
      });
    });

    await fs.outputJson(path.resolve(downloadDir, 'application.json'), app);
    await fs.outputJson(path.resolve(downloadDir, 'project.json'), project);
    await fs.outputJson(path.resolve(downloadDir, 'category.json'), categoryInfo);
    await fs.outputJson(path.resolve(downloadDir, 'component.json'), components);

    const appDir = path.resolve(staticDir, 'applications', appId);
    await fs.copy(appDir, path.resolve(downloadDir, 'applications', appId));

    console.log(`一共有${[ ...componentIdSet ].length}个组件`);

    for (let i = 0; i < components.length; i++) {
      const component = components[i];
      const componentId = component._id.toString();
      const componentDir = path.resolve(staticDir, 'components');
      await exec(`cd ${componentDir} && tar -czvf ${componentId}.tar ${componentId}/v-current  --exclude=${componentId}/*/src --exclude=${componentId}/*/node_modules`, { maxBuffer: 1024 * 1024 * 1024 });
      await fs.copy(
        path.resolve(componentDir, `${componentId}.tar`),
        path.resolve(downloadDir, 'components', `${componentId}.tar`),
        { overwrite: true }
      );

      console.log(`download success ${componentId}, progress: ${i + 1}/${components.length}======`);
    }

    await exec(`cd download && tar -czvf ${appId}.tar ${appId}`, { maxBuffer: 1024 * 1024 * 1024 });
  } catch (error) {
    console.log(error.stack || error);
  } finally {
    await fs.remove(downloadDir);
    console.log('download success');
    mongoClient.close();
    process.exit(0);
  }
})();

