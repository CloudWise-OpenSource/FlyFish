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
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (110, 1, 1, 1, NULL, 'title', 'title', 1, 0, 1, 1623833284686, 1632379448365, 0, NULL, NULL, 1, 17, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (131, 1, 1, 1, NULL, 'BarChart', 'BarChart', 1, 0, 1, 1624431199719, 1632299015604, 0, NULL, NULL, 1, 10, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (148, 1, 1, 1, NULL, 'FoldLineChart', 'FoldLineChart', 1, 0, 1, 1624598210694, 1633620356957, 0, NULL, NULL, 10, 16, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (172, 1, 1, 1, NULL, 'ScatterChart', 'ScatterChart', 1, 0, 1, 1624935990167, 1631953315426, NULL, NULL, NULL, 10, 10, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (181, 1, 1, 1, NULL, 'ScrollPageTable', 'ScrollPageTable', 1, 0, 1, 1624951764431, 1633422119081, NULL, NULL, NULL, NULL, NULL, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (279, 1, 1, 1, NULL, 'PieChart', 'PieChart', 1, 0, 1, 1626747863534, 1633618993383, NULL, NULL, NULL, NULL, NULL, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (284, 1, 1, 1, NULL, 'RadarChart', 'RadarChart', 1, 0, 1, 1626847574433, 1631953328023, NULL, NULL, NULL, NULL, NULL, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (306, 1, 1, 1, NULL, 'WaterWaveBall', 'WaterWaveBall', 1, 0, 1, 1627438132257, 1632844412212, NULL, NULL, NULL, 5, 5, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (307, 1, 1, 1, NULL, 'CommonImage', 'CommonImage', 1, 0, 1, 1627539831463, 1632986325903, NULL, NULL, NULL, 1, 1, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (368, 1, 1, 1, NULL, 'MapChart', 'MapChart', 1, 0, 1, 1629053787387, 1632734376088, NULL, NULL, NULL, 16, 16, '1', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (369, 1, 1, 1, NULL, 'PictorialBarChart', 'PictorialBarChart', 1, 0, 1, 1629053849065, 1632309819714, NULL, NULL, NULL, 16, 16, '1', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (370, 1, 1, 1, NULL, 'GaugeChart', 'GaugeChart', 1, 0, 1, 1629053929156, 1632282389133, NULL, NULL, NULL, 16, 16, '1', NULL, 1, 'on');"
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
