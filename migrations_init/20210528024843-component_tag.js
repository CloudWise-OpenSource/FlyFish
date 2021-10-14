'use strict';

var tableName = 'component_tag';
const columns = {
  // tag id
  id: {
    type: 'int',
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    notNull: true,
  },
  // tag 名称
  name: {
    type: 'varchar',
    notNull: true,
    length: 255,
    unique: true,
  },
  // tag 描述
  description: {
    type: 'longtext',
    notNull: true,
  },
  // 标签状态 0 删除 1 开启
  status: {
    type: 'int',
    notNull: true,
    defaultValue: 1
  },
}

exports.up = function (db, callback) {
  db.createTable(tableName, {
    columns,
    ifNotExists: true
  }, () => {
    // 创建初始化数据
    const initColumns = [1, 'basic component', 'basic', 1];
    const insertColumns = Object.keys(columns);
    db.insert(tableName, insertColumns, initColumns, callback);
  })
  return null;
};

exports.down = function (db) {
  db.dropTable(tableName);
  return null;
};
