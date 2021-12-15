'use strict';

// 定义表名
const tableName = 'visual_components_version';

exports.up = function (db, callback) {
    // 创建表
    db.createTable(tableName, {
        component_version_id: {
            type: 'int',
            primaryKey: true,
            autoIncrement: true,
            notNull: true,
        },
        account_id:{
            type: "int",
            notNull: true,
        },
        component_id:{
            type: "int",
            notNull: true,
        },
        version: {
            notNull: true,
            type: "string",
            length: 16,
        },
        description: {
            type:'text',
        },
        deleted_at: {
            notNull: true,
            type: "tinyint",
            defaultValue: 1
        },
        created_at: {
            type: "bigint",
            notNull: true,
        },
        updated_at: {
            type: "bigint",
            notNull: true,
        },
    }, () => {
        // 1.创建表索引
        db.addIndex(tableName, 'account_id', ['account_id']);
    });

    return null;
};

exports.down = function (db) {
    // 删除表
    db.dropTable(tableName);
    return null;
};
