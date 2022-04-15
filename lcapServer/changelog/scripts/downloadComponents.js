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

const componentIds = process.argv.slice(2);
const downloadDir = `download/components_${componentIds[0]}`;

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
     * 1. 下载components表
     * 2. 下载projects表
     * 3. 下载components表
     * 4. 下载应用静态资源
     * 5. 下载组件资源
     */

    const categories = await db.collection('component_categories').find({}, { sort: { create_time: -1 }, limit: 1 }).toArray();
    const categoryInfo = categories[0];

    const components = await db.collection('components').find({ _id: { $in: componentIds.map(id => ObjectId(id)) } }).toArray();
    components.forEach(component => {
      Object.assign(component, {
        projects: [],
        tags: [],
        applications: [],
        creator: '',
        updater: '',
      });
    });

    await fs.outputJson(path.resolve(downloadDir, 'category.json'), categoryInfo);
    await fs.outputJson(path.resolve(downloadDir, 'component.json'), components);

    console.log(`一共有${components.length}个组件`);

    for (const chunk of _.chunk(components, 2)) {
      await Promise.all(chunk.map(async component => {
        const componentId = component._id.toString();
        const componentDir = path.resolve(staticDir, 'components');
        await exec(`cd ${componentDir} && tar -czvf ${componentId}.tar ${componentId} --exclude=${componentId}/*/node_modules`, { maxBuffer: 1024 * 1024 * 1024 });
        await fs.move(
          path.resolve(componentDir, `${componentId}.tar`),
          path.resolve(downloadDir, 'components', `${componentId}.tar`),
          { overwrite: true }
        );
      }));
    }

    await exec(`cd download && tar -czvf components_${componentIds[0]}.tar components_${componentIds[0]}`, { maxBuffer: 1024 * 1024 * 1024 });
  } catch (error) {
    console.log(error.stack || error);
  } finally {
    await fs.remove(downloadDir);
    console.log('download success');
    mongoClient.close();
    process.exit(0);
  }
})();

