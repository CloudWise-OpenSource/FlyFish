'use strict';

var tableName = 'visual_screen_tag_view';

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
      // 大屏id
      screen_id: {
        type: 'varchar',
        unique: true,
        notNull: true,
        length: 255,
      },
      // 标签id
      tag_id: {
        type: 'varchar',
        notNull: true,
        length: 255,
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
