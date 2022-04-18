'use strict';

const config = require('config');
const { MongoClient } = require('mongodb');
const { Sequelize, DataTypes, Op } = require('sequelize');
const _ = require('lodash');

const mongoUrl = config.get('mongoose.clients.flyfish.url');
const solutionUri = config.get('mysql.solution_uri');
const VCUri = config.get('mysql.visual_component_uri');

let mongoClient,
  VCSequelize,
  solutionSequelize;
const tableMap = {};

async function init() {
  mongoClient = new MongoClient(mongoUrl);
  await mongoClient.connect();

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
}


(async () => {
  try {
    await init();
    const { SolutionComponent, VCComponent } = tableMap;
    const solutionComponents = await SolutionComponent.findAll({ where: { deleted_at: 1 } });
    const sc = solutionComponents.map(c => c.component_mark);

    const VCComponents = await VCComponent.findAll({});
    const leftComponents = VCComponents.filter(c => !sc.includes(c.component_mark) && c.deleted_at === 1);

    console.log(leftComponents.length);
    for (const c of leftComponents) {
      console.log(c.component_mark);
    }

  } catch (error) {
    console.log(error.stack || error);
  } finally {
    mongoClient.close();
    process.exit(0);
  }
})();

