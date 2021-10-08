'use strict';

const tableName = 'visual_screen';

exports.up = function (db) {
  db.addColumn(tableName, "create_user_id", {
    type: "int",
    notNull: false,
  });
  return null;
};

exports.down = function (db) {
  db.removeColumn(tableName, "create_user_id");
  return null;
};
