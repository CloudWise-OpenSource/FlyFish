'use strict';

const config = require('config');
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs-extra');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const _ = require('lodash');
const moment = require('moment');

const mongoUrl = config.get('mongoose.clients.flyfish.url');
const wwwDir = config.get('pathConfig.staticDir') + config.get('pathConfig.commonDirPath');

const now = moment().format('YYYYMMDDHHmmss');
const componentIds = process.argv.slice(2);
const downloadTmpDir = `download/components_${now}`;

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
    const components = await db.collection('components').find({ _id: { $in: componentIds.map(id => ObjectId(id)) } }).toArray();
    await fs.outputJson(path.resolve(downloadTmpDir, 'component.json'), components);

    console.log(`一共有${components.length}个组件`);

    for (const chunk of _.chunk(components, 2)) {
      await Promise.all(chunk.map(async component => {
        const componentId = component._id.toString();
        const componentDir = path.resolve(wwwDir, 'components');
        await exec(`cd ${componentDir} && tar -czvf ${componentId}.tar ${componentId}`, { maxBuffer: 1024 * 1024 * 1024 });
        await fs.move(
          path.resolve(componentDir, `${componentId}.tar`),
          path.resolve(downloadTmpDir, 'components', `${componentId}.tar`),
          { overwrite: true }
        );
      }));
    }

    await exec(`cd download && tar -czvf components_${now}.tar components_${now}`, { maxBuffer: 1024 * 1024 * 1024 });
  } catch (error) {
    console.log(error.stack || error);
  } finally {
    await fs.remove(downloadTmpDir);
    console.log('download success');
    mongoClient.close();
    process.exit(0);
  }
})();

