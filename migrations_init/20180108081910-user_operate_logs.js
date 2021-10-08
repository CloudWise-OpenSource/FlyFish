'use strict';

// 定义表名
const tableName = 'user_operate_logs';

exports.up = function (db, callback) {
    // 创建表
    db.createTable(tableName, {
        operate_log_id: {
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
            notNull: true,
        },
        log_type: {
            notNull: true,
            type: "int",
        },
        content: {
            type:'text',
            length: 64,
        },

        created_at: {
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
