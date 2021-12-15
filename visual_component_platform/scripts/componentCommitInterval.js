const config = require('config');
const simpleGit = require('simple-git');
const _ = require('lodash');
const path = require('path');
const { Sequelize, DataTypes, Op} = require('sequelize');

const mysqlUri = config.get('mysql.uri');
const wwwPath = config.get('wwwPath');
const maxInterval = 2 * 60 * 1000;
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
  
  tableMap.User = sequelize.define("user", {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    user_name: {
      type: DataTypes.STRING
    },
  }, {
    tableName: 'user',
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
    const {Component, User, Org} = tableMap;
    const needPushComponents = await Component.findAll({where: {need_push: 1, last_change_time: {[Op.lte]: Date.now() - maxInterval}}});
    if (needPushComponents.length === 0) return;
    console.log(`${needPushComponents.length} 个组件等待被提交`);
    const componentMap = _.keyBy(needPushComponents, 'component_id');

    const orgIds = _.uniq(needPushComponents.map(c => c.org_id));
    const orgInfos = await Org.findAll({where: {org_id: {[Op.in]: orgIds}}});
    const orgInfoMap = _.keyBy(orgInfos, 'org_id');

    const updateUserIds = _.uniq(needPushComponents.map(c => c.update_user_id));
    const updateUserInfos = await User.findAll({where: {user_id: {[Op.in]: updateUserIds}}});
    const updateUserMap = _.keyBy(updateUserInfos, 'user_id');

    for (let chunk of _.chunk(needPushComponents, 10)) {
      await Promise.all(chunk.map(async component => {
        const orgId = componentMap[component.component_id].org_id;
        const orgMark = orgInfoMap[orgId].org_mark;
        const componentPath = path.resolve(
          wwwPath,
          "static/dev_visual_component/dev_workspace",
          orgMark,
          component.component_mark
        );
        const updateUserName = component.update_user_id && updateUserMap[component.update_user_id] && updateUserMap[component.update_user_id].user_name || 'system';
        const git = simpleGit(componentPath);
        const status = await git.status();
        if (!status.isClean()) {
          await git
          .add('.')
          .commit(`Update: regular commit by ${updateUserName}`)
          .push(['origin', 'master']);

          await Component.update({need_push: 2, last_change_time: Date.now()}, {where: {component_id: component.component_id}})
          successCount ++;
        }
      }));
    }
  } catch (error) {
    console.error(error);
  } finally {
    console.log(`提交成功 ${successCount}个`);
  }
})()