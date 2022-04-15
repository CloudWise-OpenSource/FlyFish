'use strict';

const config = require('config');
const { MongoClient } = require('mongodb');
const { Sequelize, DataTypes, Op } = require('sequelize');
const _ = require('lodash');

const mongoUrl = config.get('mongoose.clients.flyfish.url');
const solutionUri = config.get('mysql.solution_uri');
const VCUri = config.get('mysql.visual_component_uri');

let mongoClient,
  db,
  solutionSequelize,
  VCSequelize;
const tableMap = {};
let success = 0;
const errList = [];

async function init() {
  mongoClient = new MongoClient(mongoUrl);
  await mongoClient.connect();
  db = mongoClient.db('flyfish');

  // 应用平台
  solutionSequelize = new Sequelize(solutionUri);
  tableMap.SolutionComponent = solutionSequelize.define('visual_components', {
    component_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    org_mark: {
      type: DataTypes.STRING,
    },
    component_mark: {
      type: DataTypes.STRING,
    },
    deleted_at: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.INTEGER,
    },
    updated_at: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'visual_components',
    timestamps: false,
  });

  tableMap.SolutionTagView = solutionSequelize.define('visual_component_tag_view', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    component_id: {
      type: DataTypes.INTEGER,
    },
    tag_id: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    create_at: {
      type: DataTypes.INTEGER,
    },
    update_at: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'visual_component_tag_view',
    timestamps: false,
  });


  // 组件开发平台
  VCSequelize = new Sequelize(VCUri);
  tableMap.VCComponent = VCSequelize.define('visual_components', {
    component_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    org_id: {
      type: DataTypes.INTEGER,
    },
    component_mark: {
      type: DataTypes.STRING,
    },
    deleted_at: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.INTEGER,
    },
    updated_at: {
      type: DataTypes.INTEGER,
    },
    create_user_id: {
      type: DataTypes.INTEGER,
    },
    update_user_id: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'visual_components',
    timestamps: false,
  });

  tableMap.VCOrg = VCSequelize.define('visual_org', {
    org_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    org_mark: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'visual_org',
    timestamps: false,
  });
}


(async () => {
  try {
    await init();
    const { SolutionComponent, VCComponent, SolutionTagView, VCOrg } = tableMap;
    const solutionComponents = await SolutionComponent.findAll({ where: { deleted_at: 1 } });

    const solutionTagViews = await SolutionTagView.findAll({ where: { status: 1 } });
    const solutionTagViewMap = _.keyBy(solutionTagViews, 'component_id');

    const VCComponents = await VCComponent.findAll();
    const CVComponentMap = _.keyBy(VCComponents, 'component_mark');

    const VCOrgs = await VCOrg.findAll();
    const VCOrgMap = _.keyBy(VCOrgs, 'org_id');

    const category = await db.collection('component_categories').findOne({}, { sort: { create_time: -1 } });
    const categoryId = category.categories[0].id;

    const users = await db.collection('users').find().toArray();
    const userMap = _.keyBy(users, 'old_user_id');

    const projects = await db.collection('projects').find().toArray();
    const projectMap = _.keyBy(projects, 'old_id');
    const weiguishuProjectId = projects.filter(p => p.name === '未归属组件')[0]._id.toString();

    const pubComponents = [];

    // 应用平台的组件（已发布组件）
    for (const component of solutionComponents) {
      try {
        let subCategoryId,
          type;
        if (component.org_mark === 'comonComponent') {
          type = 'common';
          subCategoryId = category.categories[0].children[0].id;
        } else {
          type = 'project';
          subCategoryId = category.categories[0].children[1].id;
        }

        const VCComponent = CVComponentMap[component.component_mark] || {};
        const oldCreator = VCComponent.create_user_id;
        const oldUpdater = VCComponent.update_user_id;

        const doc = {
          name: component.name,
          is_lib: false,
          category: categoryId,
          sub_category: subCategoryId,
          type,
          applications: [],
          versions: [
            {
              no: 'v1.0.0',
              desc: '',
              status: 'valid',
              time: new Date(),
            },
          ],
          cover: '/component_tpl/public/cover.jpeg',
          creator: oldCreator && userMap[oldCreator] && userMap[oldCreator]._id.toString() || '',
          updater: oldUpdater && userMap[oldUpdater] && userMap[oldUpdater]._id.toString() || '',
          develop_status: 'online',
          status: 'valid',
          create_time: new Date(+component.created_at),
          update_time: new Date(+component.updated_at),

          old_org_mark: component.org_mark,
          old_component_mark: component.component_mark,
        };

        if (type === 'project') {
          let projectId;
          const oldTagId = solutionTagViewMap[component.component_id] && solutionTagViewMap[component.component_id].tag_id;
          if (oldTagId) projectId = projectMap[oldTagId] && projectMap[oldTagId]._id.toString();
          doc.projects = projectId && [ projectId ] || [];
        }
        await db.collection('components').insertOne(doc);
        success++;

        pubComponents.push(component.component_mark);
      } catch (error) {
        errList.push(component.component_mark);
        console.error(`失败：${component.component_mark}`, JSON.stringify(error.stack || error));
      }
    }

    // 组件开发平台，除应用平台已存在的组件（未发布组件）
    const unPubComponents = VCComponents.filter(c => !pubComponents.includes(c.component_mark) && c.deleted_at === 1);

    for (const component of unPubComponents) {
      try {
        let subCategoryId,
          type;
        if (component.org_id === 4) {
          type = 'common';
          subCategoryId = category.categories[0].children[0].id;
        } else {
          type = 'project';
          subCategoryId = category.categories[0].children[1].id;
        }

        const doc = {
          name: component.name,
          is_lib: false,
          category: categoryId,
          sub_category: subCategoryId,
          type,
          applications: [],
          versions: [],
          cover: '/component_tpl/public/cover.jpeg',
          creator: component.create_user_id && userMap[component.create_user_id] && userMap[component.create_user_id]._id.toString() || '',
          updater: component.update_user_id && userMap[component.update_user_id] && userMap[component.update_user_id]._id.toString() || '',
          develop_status: 'doing',
          status: 'valid',
          create_time: new Date(+component.created_at),
          update_time: new Date(+component.updated_at),

          old_org_mark: VCOrgMap[component.org_id].org_mark,
          old_component_mark: component.component_mark,
        };

        if (type === 'project') {
          doc.projects = [ weiguishuProjectId ];
        }

        await db.collection('components').insertOne(doc);
        success++;
      } catch (error) {
        errList.push(component.component_mark);
        console.error(`失败：${component.component_mark}`, JSON.stringify(error.stack || error));
      }
    }
  } catch (error) {
    console.log(error.stack || error);
  } finally {
    console.log(`执行完毕，成功${success}条`);
    console.log(`失败：${errList.length}条`, JSON.stringify(errList));
    mongoClient.close();
    process.exit(0);
  }
})();

