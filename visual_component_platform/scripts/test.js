const config = require('config');
const _ = require('lodash');
const { Sequelize, DataTypes, Op} = require('sequelize');

const mysqlUri = config.get('mysql.uri');
let successCount = 0;
let tableMap = {};

function prepare() {
  const sequelize = new Sequelize(mysqlUri);

  tableMap.P = sequelize.define("menu_permission", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    account_id: {
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    group_id: {
      type: DataTypes.INTEGER,
    },
    role_id: {
      type: DataTypes.INTEGER,
    },
    permission: {
      type: DataTypes.TEXT,
    },
  
  }, {
    tableName: 'menu_permission',
    timestamps: false,
  });
  
}

(async () => {
  try {
    prepare();
    const {P} = tableMap;
    const arr = [...Array(98)].map((v,i) => i+2);

    for (let i of arr) {
      try {
        await P.create({account_id:1, user_id: i, permission: '["2","6","2-1","6-1"]'})
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