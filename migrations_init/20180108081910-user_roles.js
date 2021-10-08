'use strict';

// 定义表名
const tableName = 'user_roles';

exports.up = function (db, callback) {
    // 创建表
    db.createTable(tableName, {
        role_id: {
            type: 'int',
            primaryKey: true,
            autoIncrement: true,
            notNull: true,
        },
        account_id:{
            type: "int",
            notNull: true,
        },
        role_type: {
            notNull: true,
            type: "tinyint",
        },
        role_name: {
            type:'string',
            notNull: true,
            length: 64,
        },
        description: {
            type:'varchar',
            length: 255,
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
        const fields = ['account_id', 'role_type', 'role_name', 'description', 'created_at', 'updated_at'];
        const values = [
            [1, 1, '管理员', '系统内置角色', '1515467647000', '1515467647000'],
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
