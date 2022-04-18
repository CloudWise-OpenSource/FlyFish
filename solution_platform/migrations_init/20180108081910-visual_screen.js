'use strict';

// 定义表名
const tableName = 'visual_screen';

exports.up = function (db, callback) {
    // 创建表
    db.createTable(tableName, {
        id: {
            type: 'int',
            primaryKey: true,
            autoIncrement: true,
            notNull: true,
        },
        screen_id: {
            type:'varchar',
            notNull: true,
            length: 64,
        },
        account_id:{
            type: "int",
            notNull: true,
        },
        name: {
            type:'varchar',
            notNull: true,
            length: 64,
        },
        cover: {
            type:'varchar',
            length: 64,
        },
        options_conf: {
            type:'longtext',
        },
        developing_user_id:{
            type: "int",
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
        logo: {
            type: 'varchar',
            length: 64,
        },
        status: {
            type: 'int',
            notNull: true,
            defaultValue: 0
        }
    }, () => {
        // 1.创建表索引
        db.addIndex(tableName, 'account_id', ['account_id']);
        db.addIndex(tableName, 'screen_id', ['screen_id'], true);
    });

    return null;
};

exports.down = function (db) {
    // 删除表
    db.dropTable(tableName);
    return null;
};
