'use strict';

const config = require('config');
const { MongoClient } = require('mongodb');
const _ = require('lodash');
const fs = require('fs-extra');
const moment = require('moment');

const flyfishMongoUrl = config.get('mongoose.clients.flyfish.url');
const RDEPMongoUrl = config.get('rdep_yapi.url');

let flyfishMongoClient,
  RDEPMongoClient,
  flyfishDb,
  RDEPDb;
let lastSyncTime;
let apiSuccess = 0;
const now = Date.now() / 1000;

async function init() {
  flyfishMongoClient = new MongoClient(flyfishMongoUrl);
  await flyfishMongoClient.connect();
  flyfishDb = flyfishMongoClient.db('yapi');

  RDEPMongoClient = new MongoClient(RDEPMongoUrl);
  await RDEPMongoClient.connect();
  RDEPDb = RDEPMongoClient.db('yapi');

  try {
    ({ lastSyncTime } = await fs.readJSON('./cache/yapi.json'));
  } catch (error) {
    lastSyncTime = 0;
  }
}

(async () => {
  try {
    await init();

    const admin = await flyfishDb.collection('user').findOne({ username: 'admin' });

    const groups = await RDEPDb.collection('group').find({ up_time: { $gte: +lastSyncTime } }).toArray();
    if (groups.length) {
      console.log('sync start rdep group');

      for (const group of groups) {
        let newGroup = Object.assign({}, group, {
          rdep_id: group._id,
          uid: admin._id,
          members: [],
          tag: [],
          sync_time: now,
        });
        newGroup = _.omit(newGroup, '_id');
        await flyfishDb.collection('group').updateOne(
          { rdep_id: group._id },
          { $set: newGroup, $setOnInsert: { _id: await getNextSequenceValue('group') } },
          { upsert: true }
        );

        console.log(`sync success rdep group: ${group._id}`);
      }
    } else {
      console.log('no group item!!');
    }

    const allGroups = await flyfishDb.collection('group').find().toArray();
    const groupMap = _.keyBy(allGroups, 'rdep_id');

    const projects = await RDEPDb.collection('project').find({ up_time: { $gte: +lastSyncTime } }).toArray();
    if (projects.length) {
      console.log('sync start rdep project');

      for (const project of projects) {
        let newProject = Object.assign({}, project, {
          rdep_id: project._id,
          members: [],
          p_tag: [],
          tag: [],
          uid: admin._id,
          group_id: groupMap[project.group_id] && groupMap[project.group_id]._id || 1,
          sync_time: now,
        });
        newProject = _.omit(newProject, '_id');
        const updatedProject = await flyfishDb.collection('project').updateOne(
          { rdep_id: project._id },
          { $set: newProject, $setOnInsert: { _id: await getNextSequenceValue('project') } },
          { upsert: true }
        );

        console.log(`sync success rdep project: ${project._id}`);

        if (updatedProject.upsertedId) {
          await flyfishDb.collection('interface_col').insertOne({
            _id: await getNextSequenceValue('interface_col'),
            checkResponseField: {
              name: 'code',
              value: '0',
              enable: false,
            },
            checkScript: {
              enable: false,
            },
            index: 0,
            test_report: '{}',
            checkHttpCodeIs200: false,
            checkResponseSchema: false,
            name: '公共测试集',
            project_id: updatedProject.upsertedId,
            desc: '公共测试集',
            uid: admin._id,
            add_time: now,
            up_time: now,
          });
        }
      }
    } else {
      console.log('no project item!!');
    }

    const allProjects = await flyfishDb.collection('project').find().toArray();
    const projectMap = _.keyBy(allProjects, 'rdep_id');

    const categories = await RDEPDb.collection('interface_cat').find({ up_time: { $gte: +lastSyncTime } }).toArray();
    if (categories.length) {
      console.log('sync start rdep interface_cat');

      for (const category of categories) {
        let newCategory = Object.assign({}, category, {
          rdep_id: category._id,
          project_id: projectMap[category.project_id] && projectMap[category.project_id]._id || 1,
          uid: admin._id,
          sync_time: now,
        });
        newCategory = _.omit(newCategory, '_id');
        await flyfishDb.collection('interface_cat').updateOne(
          { rdep_id: category._id },
          { $set: newCategory, $setOnInsert: { _id: await getNextSequenceValue('interface_cat') } },
          { upsert: true }
        );

        console.log(`sync success rdep interface_cat_id: ${category._id}`);
      }
    } else {
      console.log('no interface_cat item!!');
    }

    const allCategories = await flyfishDb.collection('interface_cat').find().toArray();
    const categoryMap = _.keyBy(allCategories, 'rdep_id');

    const interfaces = await RDEPDb.collection('interface').find({ up_time: { $gte: +lastSyncTime } }).toArray();
    if (interfaces.length) {
      console.log('sync start rdep interface');

      for (const i of interfaces) {
        let newInterface = Object.assign({}, i, {
          rdep_id: i._id,
          project_id: projectMap[i.project_id] && projectMap[i.project_id]._id || 1,
          catid: categoryMap[i.catid] && categoryMap[i.catid]._id,
          uid: admin._id,
          sync_time: now,
          status: i.status === 'publish' ? 'done' : 'undone',
        });
        newInterface = _.omit(newInterface, '_id');
        await flyfishDb.collection('interface').updateOne(
          { rdep_id: i._id },
          { $set: newInterface, $setOnInsert: { _id: await getNextSequenceValue('interface') } },
          { upsert: true }
        );
        apiSuccess++;

        console.log(`sync success rdep interface id: ${i._id}`);
      }
    } else {
      console.log('no interface item!!');
    }
  } catch (error) {
    console.log(error.stack || error);
  } finally {
    await fs.writeJSON('./cache/yapi.json', { lastSyncTime: now });
    console.log(`======sync success: ${apiSuccess}个接口, sync time: ${moment().format('YYYY-MM-DD HH:mm:ss')}======`);
    flyfishMongoClient.close();
    RDEPMongoClient.close();
    process.exit(0);
  }
})();

async function getNextSequenceValue(field) {
  const newDoc = await flyfishDb.collection('identitycounters').findOneAndUpdate(
    { model: field },
    { $inc: { count: 1 } },
    { returnDocument: 'after' } // 返回更新后的数据
  );

  return newDoc.value.count;
}

