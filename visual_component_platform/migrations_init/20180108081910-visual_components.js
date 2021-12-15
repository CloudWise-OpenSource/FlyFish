'use strict';

// 定义表名
const tableName = 'visual_components';

exports.up = function (db, callback) {
    // 创建表
    db.createTable(tableName, {
        component_id: {
            type: 'int',
            primaryKey: true,
            autoIncrement: true,
            notNull: true,
        },
        categories_id: {
            notNull: true,
            type: "int",
        },
        account_id:{
            type: "int",
            notNull: true,
        },
        org_id: {
            notNull: true,
            type: "int",
        },
        developer_user_id: {
            type: "int",
        },
        name: {
            type:'string',
            notNull: true,
            length: 64,
        },
        component_mark: {
            type:'string',
            notNull: true,
            length: 64,
        },
        is_developping: {
            notNull: true,
            type: "tinyint",
            defaultValue: 1
        },
        is_published: {
            notNull: true,
            type: "tinyint",
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
