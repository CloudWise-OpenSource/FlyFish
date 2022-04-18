'use strict';

// 定义表名
const tableName = 'user_role_relation';

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
        role_id: {
            type: 'int',
            notNull: true,
        },
        user_id: {
            type: 'int',
            notNull: true,
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

        // 2.初始化数据
        const fields = ['account_id', 'role_id', 'user_id', 'created_at', 'updated_at'];
        const values = [
            [1, 1, 1, '1515467647000', '1515467647000'],
        ];

        values.forEach(value => db.insert(tableName, fields, value, callback));
    });

    return null;
};

exports.down = function (db) {
    // 删除表
    db.dropTable(tableName);
    return null;
};
