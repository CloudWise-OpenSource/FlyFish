'use strict';

// 定义表名
const tableName = 'auth_token';

exports.up = function (db, callback) {
    // 创建表
    db.createTable(tableName, {
        id: {
            type: 'int',
            primaryKey: true,
            autoIncrement: true,
            notNull: true,
        },
        account_id: {
            type: 'int',
            notNull: true,
        },
        access_key_id: {
            type:'string',
            notNull: true,
            length: 128,
        },
        access_key_secret: {
            type:'string',
            notNull: true,
            length: 128,
        },
        token: {
            type:'string',
            notNull: true,
            length: 64,
        },
        status: {
            notNull: true,
            type: "tinyint",
            defaultValue: 1
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

    });

    return null;
};

exports.down = function (db) {
    // 删除表
    db.dropTable(tableName);
    return null;
};
