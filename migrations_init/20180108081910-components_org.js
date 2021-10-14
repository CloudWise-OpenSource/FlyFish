'use strict';

// 定义表名
const tableName = 'components_org';

exports.up = function (db, callback) {
    // 创建表
    db.createTable(tableName, {
        org_id: {
            type: 'int',
            primaryKey: true,
            autoIncrement: true,
            notNull: true,
        },
        account_id:{
            type: "int",
            notNull: true,
        },
        name: {
            type:'string',
            notNull: true,
            length: 64,
        },
        org_mark: {
            type:'string',
            notNull: true,
            length: 128,
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
        const initSql = "INSERT INTO `flyfish`.`components_org` (`org_id`, `account_id`, `name`, `org_mark`, `description`, `deleted_at`, `created_at`, `updated_at`) VALUES (1, 1, 'public', 'public', '', 1, 1621324843907, 1621324843907);";
        db.runSql(initSql);
    });

    return null;
};

exports.down = function (db) {
    // 删除表
    db.dropTable(tableName);
    return null;
};
