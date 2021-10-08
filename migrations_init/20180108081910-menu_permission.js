'use strict';

// 定义表名
const tableName = 'menu_permission';

exports.up = function (db, callback) {
    // 创建表
    db.createTable(tableName, {
        id: {
            type: 'int',
            primaryKey: true,
            autoIncrement: true,
            notNull: true,
        },
        account_id:{
            type: "int",
            notNull: true,
        },
        user_id:{
            type: "int",
        },
        group_id:{
            type: "int",
        },
        role_id:{
            type: "int",
        },
        permission: {
            type: "text",
        }
    }, () => {

    });

    return null;
};

exports.down = function (db) {
    // 删除表
    db.dropTable(tableName);
    return null;
};
