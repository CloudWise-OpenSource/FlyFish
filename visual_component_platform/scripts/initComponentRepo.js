const config = require('config');
const simpleGit = require('simple-git');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { Sequelize, DataTypes, Op} = require('sequelize');

const mysqlUri = config.get('mysql.uri');
const wwwPath = config.get('wwwPath');
const namespaceId = config.get('gitLab.namespace_id');
const gitLabToken = config.get('gitLab.private_token')
const tableMap = {};
let successCount = 0;

function prepare() {
  const sequelize = new Sequelize(mysqlUri);

  tableMap.Component = sequelize.define("visual_components", {
    component_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    git_lab_project_id: {
      type: DataTypes.INTEGER,
    },
    need_push: {
      type: DataTypes.TINYINT,
    },
    last_change_time: {
      type: DataTypes.BIGINT,
    },
    org_id: {
      type: DataTypes.INTEGER
    },
    component_mark: {
      type: DataTypes.STRING
    },
    update_user_id: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'visual_components',
    timestamps: false,
  });
  tableMap.Org = sequelize.define("visual_org", {
    org_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    org_mark: {
      type: DataTypes.STRING
    },
  }, {
    tableName: 'visual_org',
    timestamps: false,
  });
}

(async () => {
  try {
    prepare();
    const {Component, Org} = tableMap;
    const needPushComponents = await Component.findAll({where: {
      deleted_at: 1,
      need_push: null
    }});
    if (needPushComponents.length === 0) return;
    console.log(`${needPushComponents.length} 个组件仓库等待被初始化`);
    const componentMap = _.keyBy(needPushComponents, 'component_id');

    const orgIds = _.uniq(needPushComponents.map(c => c.org_id));
    const orgInfos = await Org.findAll({where: {org_id: {[Op.in]: orgIds}}});
    const orgInfoMap = _.keyBy(orgInfos, 'org_id');

    for (let component of needPushComponents) {
      try {
        const orgId = componentMap[component.component_id].org_id;
        const orgMark = orgInfoMap[orgId].org_mark;
        const componentPath = path.resolve(
          wwwPath,
          "static/dev_visual_component/dev_workspace",
          orgMark,
          component.component_mark
        );

        const gitIgnorePath = path.resolve(componentPath, '.gitignore');
        fs.writeFileSync(gitIgnorePath, 'node_modules\npackage-lock.json\nrelease\nrelease_code\ncomponents');

        const git = simpleGit(componentPath);

        const reqBody = {
          name: `${orgMark}.${component.component_mark}`,
          path: `${orgMark}.${component.component_mark}`,
          namespace_id: namespaceId,
        }
        const newRepo = await axios.post(`https://git.cloudwise.com/api/v4/projects?private_token=${gitLabToken}`, reqBody).catch(e => {
          console.log(e.response);
          return e.response;
        });
        const {status, data: {id: newRepoId, ssh_url_to_repo: newRepoUrl}} = newRepo;
        // 判断返回值
        if (status !== 201) return console.log(`远程仓库 ${orgMark}.${component.component_mark} 创建失败`);

        await git
        .init()
        .add('.')
        .commit(`first commit by system`)
        .addRemote('origin', newRepoUrl)
        .push(['-u', '--set-upstream', 'origin', 'master']);

        await Component.update({git_lab_project_id: newRepoId, need_push: 2, last_change_time: Date.now()}, {where: {component_id: component.component_id}})
        console.log('组件仓库初始化成功： ', component.component_id);
        successCount ++;
      } catch (e) {
        console.log(e);
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    console.log(`初始化成功 ${successCount}个`);
  }
})()