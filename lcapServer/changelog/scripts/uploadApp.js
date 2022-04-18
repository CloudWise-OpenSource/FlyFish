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

const uploadDir = path.resolve('upload');

const filename = process.argv[2];
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

    const application = await fs.readJson(path.resolve(extractDir, 'application.json'));
    const appObjectId = ObjectId(application._id);
    delete application._id;
    Object.assign(application, {
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

    const categoryInfo = await fs.readJson(path.resolve(extractDir, 'category.json'));
    Object.assign(categoryInfo, {
      create_time: new Date(),
      update_time: new Date(),
    });
    const categoryObjectId = ObjectId(categoryInfo._id);
    delete categoryInfo._id;
    await db.collection('component_categories').updateOne(
      { _id: categoryObjectId },
      { $set: categoryInfo, $setOnInsert: { _id: categoryObjectId } },
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
        Object.assign(component, {
          versions: (component.versions || []).map(version => {
            version.time = new Date(version.time);
            return version;
          }),
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

