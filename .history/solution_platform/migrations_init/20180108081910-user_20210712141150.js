'use strict';

// 定义表名
const tableName = 'user';

exports.up = function (db, callback) {
    // 创建表
    db.createTable(tableName, {
        user_id: {
            type: 'int',
            primaryKey: true,
            autoIncrement: true,
            notNull: true,
        },
        account_id:{
            type: "int",
            notNull: true,
        },
        user_name: {
            type:'string',
            notNull: true,
            length: 64,
        },
        user_email: {
            type:'string',
            notNull: true,
            length: 32,
            unique: true,
        },
        user_phone: {
            type:'string',
            length: 32,
            unique: true,
        },
        user_password: {
            notNull: true,
            type:'string',
            length: 64,
        },
        user_status: {
            notNull: true,
            type:'tinyint',
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
        // 1.创建表索引
        db.addIndex(tableName, 'account_id', ['account_id']);

        // 2.初始化数据
        const fields = ['account_id', 'user_name', 'user_email', 'user_phone', 'user_password', 'user_status', 'created_at', 'updated_at'];
        // user_password = "tianjishuju!@#$"
        const values = [
            [1, 'demo', 'demo@tianjishuju.com', '15010003357', 'd7ebcd793a15d2862c908fe1234b4621', 1, '1515467647000', '1515467647000'],
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
