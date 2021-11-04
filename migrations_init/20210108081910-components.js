'use strict';

// 定义表名
const tableName = 'components';

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
        account_id: {
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
            type: 'string',
            notNull: true,
            length: 64,
        },
        component_mark: {
            type: 'string',
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
        is3d: {
            type: "int",
        },
        dirPath: {
            type: "string",
        },
        fileName: {
            type: "string",
        },
        create_user_id: {
            type: "int",
        },
        update_user_id: {
            type: "int",
        },
        type: {
            type: "varchar",
        },
        typeId: {
            type: "int",
        },
        default_value: {
            type: "tinyint",
            notNull: true,
            defaultValue: 1
        },
        shelf_status: {
            type: "varchar",
            notNull: true,
            defaultValue: 'off'
        },
    }, () => {
        // 1.创建表索引
        db.addIndex(tableName, 'account_id', ['account_id']);
        // 初始化公共组件数据
        const initSqls = [
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (159, 6, 1, 4, NULL, '轮巡转圈圈', 'circle', 1, 0, 1, 1624614961802, 1630581681226, 0, NULL, NULL, NULL, NULL, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (260, 6, 1, 4, NULL, '算法融合公共组件', 'CommonAlgorithmCombine', 1, 0, 1, 1626161577102, 1632729833549, NULL, NULL, NULL, 1, 1, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (387, 4, 1, 4, NULL, '圆环进度组件', 'RingProgress', 1, 0, 1, 1629254522011, 1635384337117, NULL, NULL, NULL, 9, 28, '1', NULL, 0, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (388, 6, 1, 4, NULL, '动态数据加载无限滚动列表', 'VirtualiInfiniteScrollList', 1, 0, 1, 1629258392596, 1635845067965, NULL, NULL, NULL, 5, 5, '1', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (785, 6, 1, 4, NULL, '时间', 'Time', 1, 0, 1, 1632999286893, 1633923016962, NULL, NULL, NULL, 16, NULL, '1', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (814, 6, 1, 4, NULL, '进度条', 'Progress', 1, 0, 1, 1634202745004, 1635163738399, NULL, NULL, NULL, 16, NULL, '1', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (914, 6, 1, 4, NULL, '视频组件', 'Video', 1, 0, 1, 1635752737013, 1635753267562, NULL, NULL, NULL, 16, NULL, '1', NULL, 1, 'on');",
        ];
        initSqls.forEach(sql => {
            db.runSql(sql);
        })
    });

    return null;
};

exports.down = function (db) {
    // 删除表
    db.dropTable(tableName);
    return null;
};
