/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-07-30 15:41:09
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-08-04 14:55:29
 */
'use strict';

// 定义表名
const tableName = 'visual_scenes';

exports.up = function (db, callback) {
    // 创建表
    db.createTable(tableName, {
        sceneId: {
            type: 'int',
            primaryKey: true,
            autoIncrement: true,
            notNull: true,
        },
        sceneName:{
            type: 'string',
            notNull: true,
            length:20
        },
        desc: {
            type:'string',
            length: 50,
        },
        dirPath: {
            type:'string',
            notNull: true,
            length: 200
        },
        fileName: {
            type:'string',
            notNull: true,
            length: 30
        },
        author: {
            type:'string',
            length: 20
        },
        createTime: {
            type: "bigint",
            notNull: true
        },
        deleteFlag: {
            type: "string",
            notNull: true,
            length: 2,
            defaultValue: '1'
        }
    }, () => {
        // 1.创建表索引
        db.addIndex(tableName, 'sceneId', ['sceneId']);
    });

    return null;
};

exports.down = function (db) {
    // 删除表
    db.dropTable(tableName);
    return null;
};
