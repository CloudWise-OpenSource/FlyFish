/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-07-30 15:41:09
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-08-03 09:43:58
 */
'use strict';

// 定义表名
const tableName = 'visual_components';

exports.up = function (db, callback) {
    // 创建字段
    db.addColumn(tableName, 'type',{
      type:'string',
      length: 4,
      notNull: true
    });
    db.addColumn(tableName, 'typeId',{
      type:'int'
    });

    return null;
};

exports.down = function (db) {
    // 删除字段
    db.removeColumn(tableName,'type');
    db.removeColumn(tableName,'typeId');
    return null;
};
