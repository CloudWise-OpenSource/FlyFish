'use strict';

var tableName = 'visual_component_tag_view';

exports.up = function (db, callback) {
  db.createTable(tableName, {
    columns: {
      // link id
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        notNull: true,
      },
      // 组件id
      component_id: {
        type: 'int',
        unique: true,
        notNull: true,
      },
      // 标签id
      tag_id: {
        type: 'int',
        notNull: true,
      },
      // 状态： 0 删除 1 正常
      status: {
        type: 'int',
        defaultValue: 1
      },
      // 创建
      create_at: {
        type: 'datetime',
        notNull: true
      },
      // 更新
      update_at: {
        type: 'datetime',
        notNull: true
      }
    },
    ifNotExists: true
  }, callback);
  return null
};

exports.down = function (db) {
  db.dropTable(tableName);
  return null;
};
