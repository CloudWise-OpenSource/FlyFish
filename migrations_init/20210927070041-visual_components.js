'use strict';

const tableName = 'visual_components';

exports.up = function(db) {
  db.addColumn(tableName, "is_hide", {
    type: "int",
    notNull: false,
    defaultValue: 0
  });
  return null;
};

exports.down = function(db) {
  // 删除字段
  db.removeColumn(tableName, "is_hide");
  return null;
};

