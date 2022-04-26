'use strict';

const config = require('config');
const { MongoClient } = require('mongodb');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const simpleGit = require('simple-git');
const axios = require('axios');


const mongoUrl = config.get('mongoose.clients.flyfish.url');
const staticDir = config.get('pathConfig.staticDir');
const gitConfig = config.get('componentGit');

let mongoClient,
  db;
let successCount = 0;

async function init() {
  mongoClient = new MongoClient(mongoUrl);
  await mongoClient.connect();
  db = mongoClient.db('flyfish');
}


(async () => {
  try {
    await init();
    const componentDir = path.resolve(staticDir, 'components');

    const components = await db.collection('components').find({ git_lab_project_id: { $exists: false } }).toArray();

    for (const component of components) {
      const componentPath = path.resolve(componentDir, component._id.toString(), 'v-current');
      if (!fs.existsSync(componentPath)) continue;

      const git = simpleGit(componentPath);

      const reqBody = {
        name: `${component._id.toString()}`,
        path: `${component._id.toString()}`,
        namespace_id: gitConfig.namespaceId,
      };
      const newRepo = await axios.post(`https://git.cloudwise.com/api/v4/projects?private_token=${gitConfig.privateToken}`, reqBody).catch(e => {
        console.log(e.response);
        return e.response;
      });
      const { status, data: { id: newRepoId, ssh_url_to_repo: newRepoUrl } } = newRepo;
      // 判断返回值
      if (status !== 201) return console.log(`远程仓库 ${component._id.toString()} 创建失败`);

      await git
        .init()
        .add('.')
        .commit('Update #LOWCODE-581 first commit by system')
        .addRemote('origin', newRepoUrl)
        .push([ '-u', '--set-upstream', 'origin', 'master' ]);

      await db.collection('components').updateOne({ _id: component._id }, { $set: { git_lab_project_id: newRepoId, need_push_git: false, last_change_time: new Date() } });
      console.log(component._id.toString(), '初始化成功');
      successCount++;
    }
  } catch (error) {
    console.log(error.stack || error);
  } finally {
    console.log(`共成功初始化${successCount}个组件`);
    mongoClient.close();
    process.exit(0);
  }
})();

