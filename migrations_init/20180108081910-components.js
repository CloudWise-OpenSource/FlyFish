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
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (110, 1, 1, 1, NULL, '标题', 'title', 1, 0, 1, 1623833284686, 1632379448365, 0, NULL, NULL, 1, 17, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (131, 1, 1, 1, NULL, '柱状图', 'BarChart', 1, 0, 1, 1624431199719, 1632299015604, 0, NULL, NULL, 1, 10, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (148, 1, 1, 1, NULL, '趋势图', 'FoldLineChart', 1, 0, 1, 1624598210694, 1633620356957, 0, NULL, NULL, 10, 16, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (172, 1, 1, 1, NULL, '散点图', 'ScatterChart', 1, 0, 1, 1624935990167, 1631953315426, NULL, NULL, NULL, 10, 10, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (181, 1, 1, 1, NULL, '滚动分页表格', 'ScrollPageTable', 1, 0, 1, 1624951764431, 1633422119081, NULL, NULL, NULL, NULL, NULL, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (279, 1, 1, 1, NULL, '饼图', 'PieChart', 1, 0, 1, 1626747863534, 1633618993383, NULL, NULL, NULL, NULL, NULL, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (284, 1, 1, 1, NULL, '雷达图', 'RadarChart', 1, 0, 1, 1626847574433, 1631953328023, NULL, NULL, NULL, NULL, NULL, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (306, 1, 1, 1, NULL, '水波球', 'WaterWaveBall', 1, 0, 1, 1627438132257, 1632844412212, NULL, NULL, NULL, 5, 5, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (307, 1, 1, 1, NULL, '图片', 'CommonImage', 1, 0, 1, 1627539831463, 1632986325903, NULL, NULL, NULL, 1, 1, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (368, 1, 1, 1, NULL, '地理地图', 'MapChart', 1, 0, 1, 1629053787387, 1632734376088, NULL, NULL, NULL, 16, 16, '1', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (369, 1, 1, 1, NULL, '象形图', 'PictorialBarChart', 1, 0, 1, 1629053849065, 1632309819714, NULL, NULL, NULL, 16, 16, '1', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (370, 1, 1, 1, NULL, '仪表盘', 'GaugeChart', 1, 0, 1, 1629053929156, 1632282389133, NULL, NULL, NULL, 16, 16, '1', NULL, 1, 'on');",

            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (56, 6, 1, 4, NULL, '公共tab切换', 'CommonTabSwitch', 1, 0, 1, 1621325696356, 1635322611150, 0, NULL, NULL, NULL, NULL, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (67, 6, 1, 4, NULL, '轮播图公共组件', 'CarouselCommon', 1, 0, 1, 1621878100447, 1633922214531, 0, NULL, NULL, NULL, NULL, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (73, 6, 1, 4, NULL, 'HT3D基础组件', 'HT3DComponent', 1, 0, 1, 1622799738707, 1634731270053, 0, NULL, NULL, NULL, NULL, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (135, 6, 1, 4, NULL, '表格轮训翻页', 'RoudPage', 1, 0, 1, 1624437707043, 1634714817791, 0, NULL, NULL, NULL, NULL, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (159, 6, 1, 4, NULL, '轮巡转圈圈', 'circle', 1, 0, 1, 1624614961802, 1630581681226, 0, NULL, NULL, NULL, NULL, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (203, 5, 1, 4, NULL, 'YinHePie', 'YinHePie', 1, 0, 1, 1625128091015, 1631519289657, NULL, NULL, NULL, NULL, NULL, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (260, 6, 1, 4, NULL, '算法融合公共组件', 'CommonAlgorithmCombine', 1, 0, 1, 1626161577102, 1632729833549, NULL, NULL, NULL, 1, 1, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (270, 13, 1, 4, NULL, '热力图', 'heatmap', 1, 0, 1, 1626674887071, 1632727793258, NULL, NULL, NULL, 10, 10, '', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (332, 6, 1, 4, NULL, '级联选择', 'cascader', 1, 0, 1, 1628230011180, 1633689884688, NULL, NULL, NULL, 12, 12, '', NULL, 0, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (387, 4, 1, 4, NULL, '圆环进度组件', 'RingProgress', 1, 0, 1, 1629254522011, 1635384337117, NULL, NULL, NULL, 9, 28, '1', NULL, 0, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (388, 6, 1, 4, NULL, '动态数据加载无限滚动列表', 'VirtualiInfiniteScrollList', 1, 0, 1, 1629258392596, 1635845067965, NULL, NULL, NULL, 5, 5, '1', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (498, 2, 1, 4, NULL, '横向柱状排列图', 'crosswiseColumnar', 1, 0, 1, 1630460956433, 1635242325572, NULL, NULL, NULL, 12, 28, '1', NULL, 0, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (506, 1, 1, 4, NULL, '轮播折线图', 'RotationLineChart', 1, 0, 1, 1630485119776, 1634290768444, NULL, NULL, NULL, 12, 12, '1', NULL, 1, 'on');",
            "INSERT INTO `flyfish`.`components` (`component_id`, `categories_id`, `account_id`, `org_id`, `developer_user_id`, `name`, `component_mark`, `is_developping`, `is_published`, `deleted_at`, `created_at`, `updated_at`, `is3d`, `dirPath`, `fileName`, `create_user_id`, `update_user_id`, `type`, `typeId`, `default_value`, `shelf_status`) VALUES (522, 4, 1, 4, NULL, '进度条', 'progressBar', 1, 0, 1, 1630665638774, 1635242298238, NULL, NULL, NULL, 28, 28, '1', NULL, 0, 'on');",
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
