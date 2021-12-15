"use strict";

const tableName = "visual_components";

exports.up = function (db) {
  db.addColumn(tableName, "git_lab_project_id", {
    type: "int",
    notNull: false,
  });
  db.addColumn(tableName, "need_push", {
    type: "tinyint",
    notNull: false,
  });
  db.addColumn(tableName, "last_change_time", {
    type: "bigint",
    notNull: false,
  });

  db.addIndex(tableName, 'last_change_time_need_push', ['last_change_time', 'need_push']);
  return null;
};

exports.down = function (db) {
  db.removeColumn(tableName, "git_lab_project_id");
  db.removeColumn(tableName, "need_push");
  db.removeColumn(tableName, "last_change_time");
  return null;
};
