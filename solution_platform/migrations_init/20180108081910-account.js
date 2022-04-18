'use strict';

// 定义表名
const tableName = 'account';

exports.up = function (db, callback) {
    // 创建表
    db.createTable(tableName, {
        account_id: {
            type: 'int',
            primaryKey: true,
            autoIncrement: true,
            notNull: true,
        },
        name: {
            type:'string',
            notNull: true,
            length: 64,
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
        // 2.初始化数据
        const fields = ['account_id', 'name', 'created_at', 'updated_at'];
        const values = [
            [1, 'flyfish', '1515467647000', '1515467647000'],
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
