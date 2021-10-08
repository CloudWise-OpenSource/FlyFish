'use strict';

// 定义表名
const tableName = 'user_group';

exports.up = function (db, callback) {
    // 创建表
    db.createTable(tableName, {
        group_id: {
            type: 'int',
            primaryKey: true,
            autoIncrement: true,
            notNull: true,
        },
        parent_group_id: {
            type: 'int',
            notNull: true,
            defaultValue: 0
        },
        account_id:{
            type: "int",
            notNull: true,
        },
        group_name: {
            type:'varchar',
            notNull: true,
            length: 64,
        },
        description: {
            type:'varchar',
            notNull: true,
            length: 255,
        },
        lft:{
            type: "int",
            notNull: true,
        },
        rgt:{
            type: "int",
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
        const fields = ['group_id', 'account_id', 'parent_group_id', 'group_name', 'description', 'lft', 'rgt', 'created_at', 'updated_at'];
        const values = [
            [1, 1, 0, '根节点', 'test', 1, 2, '1515467647000', '1515467647000'],
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
