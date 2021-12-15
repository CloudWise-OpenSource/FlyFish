"use strict";

const tableName = "visual_components";

exports.up = function (db) {
  db.addColumn(tableName, "create_user_id", {
    type: "int",
    notNull: false,
  });
  db.addColumn(tableName, "update_user_id", {
    type: "int",
    notNull: false,
  });
  
  return null;
};

exports.down = function (db) {
  db.removeColumn(tableName, "create_user_id");
  db.removeColumn(tableName, "update_user_id");
  return null;
};
