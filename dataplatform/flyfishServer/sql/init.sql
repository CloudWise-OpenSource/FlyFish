create database if not exists cw_lcap;

create table if not exists account (
    `id` varchar(255) NOT NULL,
    `name` varchar(100) NOT NULL,
    `type` varchar(100) NOT NULL,
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table if not exists app_var (
   `id` varchar(255) NOT NULL,
   `type` varchar(10) DEFAULT NULL,
   `name` varchar(100) DEFAULT NULL,
   `intro` varchar(100) DEFAULT NULL,
   `app_id` varchar(100) DEFAULT NULL,
   `scope` varchar(10) DEFAULT NULL,
   `page_id` varchar(100) DEFAULT NULL,
   `value_type` varchar(10) DEFAULT NULL,
   `default_value` text,
   `path` varchar(100) DEFAULT NULL,
   `deleted` tinyint(4) DEFAULT '0',
   `create_time` datetime DEFAULT NULL,
   `update_time` datetime DEFAULT NULL,
   PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE if not exists `application` (
    `id` varchar(255) NOT NULL,
    `name` varchar(255) NOT NULL,
    `develop_status` varchar(255) DEFAULT 'doing',
    `type` varchar(100) NOT NULL,
    `cover` varchar(255) DEFAULT NULL,
    `pages` longtext,
    `init_from` varchar(255) DEFAULT NULL,
    `is_lib` tinyint(4) NOT NULL DEFAULT '0' COMMENT '是否属于模版库 0-否 1-属于',
    `is_recommend` tinyint(4) NOT NULL DEFAULT '0' COMMENT '是否推荐至工作台',
    `invalid` int(11) NOT NULL DEFAULT '0',
    `project_id` varchar(255) NOT NULL,
    `account_id` bigint(32) DEFAULT NULL,
    `deleted` tinyint(4) NOT NULL DEFAULT '0',
    `creator` bigint(32) DEFAULT NULL,
    `updater` bigint(32) DEFAULT NULL,
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `models` text DEFAULT NULL,
    `model_id` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE if not exists `application_component_ref` (
    `id` varchar(255) NOT NULL,
    `application_id` varchar(255) NOT NULL,
    `component_id` varchar(255) NOT NULL,
    `deleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0未删除 1已删除',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE if not exists `application_project_ref` (
    `id` varchar(255) NOT NULL,
    `application_id` varchar(255) NOT NULL,
    `project_id` varchar(255) NOT NULL,
    `deleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0未删除 1已删除',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE if not exists `application_tag_ref` (
    `id` varchar(255) NOT NULL,
    `tag_id` varchar(255) NOT NULL,
    `application_id` varchar(255) NOT NULL,
    `deleted` tinyint(4) NOT NULL DEFAULT '0',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE if not exists `component` (
    `id` varchar(255) NOT NULL,
    `name` varchar(255) NOT NULL,
    `is_lib` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0:非组件库组件 1:组件库组件',
    `icon` text,
    `init_from` varchar(100) DEFAULT NULL,
    `category_id` varchar(255) DEFAULT NULL,
    `sub_category_id` varchar(255) DEFAULT NULL,
    `desc` text DEFAULT NULL,
    `cover` varchar(255) default NULL COMMENT '预览图地址',
    `automatic_cover` varchar(100) NOT NULL DEFAULT 'custom' COMMENT '组件背景图生成方式 custom:手动上传（auto:自动生成方式已废弃）',
    `allow_data_search` tinyint(4) DEFAULT '0',
    `develop_status` varchar(255) DEFAULT NULL DEFAULT 'doing' COMMENT '组件开发状态',
    `account_id` bigint(32) DEFAULT NULL,
    `deleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0未删除1已删除',
    `creator` bigint(32) DEFAULT NULL,
    `updater` bigint(32) DEFAULT NULL,
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `type` varchar(100) DEFAULT NULL COMMENT 'project: 项目组件,common:基础组件',
    `data_config` text,
    `latest_version` varchar(100) DEFAULT 'v-current' COMMENT '组件最新版本号',
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE if not exists `component_category` (
    `id` varchar(255) NOT NULL,
    `account_id` bigint(32) DEFAULT NULL,
    `name` varchar(255) NOT NULL,
    `icon` varchar(100) DEFAULT NULL,
    `parent_id` varchar(30) DEFAULT NULL COMMENT '顶级分类 parent_id=-1',
    `init_from` varchar(100) DEFAULT NULL,
    `deleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0未删除 1已删除',
    `creator` bigint(32) DEFAULT NULL,
    `updater` bigint(32) DEFAULT NULL,
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO `component_category` (`id`, `account_id`, `name`, `icon`, `parent_id`, `init_from`, `deleted`, `creator`, `updater`, `create_time`, `update_time`) VALUES ('1564525415961214975', -1, '未分类', 'icon-widget', '-1', NULL, 0, 3, 3, '2022-08-30 16:08:21', '2022-09-22 18:53:23') ON DUPLICATE KEY UPDATE update_time=update_time;
INSERT INTO `component_category` (`id`, `account_id`, `name`, `icon`, `parent_id`, `init_from`, `deleted`, `creator`, `updater`, `create_time`, `update_time`) VALUES ('1564525415961214976', -1, '监控常用', 'icon-gauge-chart', '-1', NULL, 0, 3, 3, '2022-08-30 18:08:21', '2022-09-22 18:53:23') ON DUPLICATE KEY UPDATE update_time=update_time;
INSERT INTO `component_category` (`id`, `account_id`, `name`, `icon`, `parent_id`, `init_from`, `deleted`, `creator`, `updater`, `create_time`, `update_time`) VALUES ('1564525415961214977', -1, '图表', 'icon-scatter-chart', '-1', NULL, 0, 3, 3, '2022-08-30 23:08:21', '2022-09-22 18:53:23') ON DUPLICATE KEY UPDATE update_time=update_time;
INSERT INTO `component_category` (`id`, `account_id`, `name`, `icon`, `parent_id`, `init_from`, `deleted`, `creator`, `updater`, `create_time`, `update_time`) VALUES ('1564525687764697090', -1, '地图', 'icon-map', '-1', NULL, 0, 3, 3, '2022-08-30 22:09:26', '2022-09-22 18:53:23') ON DUPLICATE KEY UPDATE update_time=update_time;
INSERT INTO `component_category` (`id`, `account_id`, `name`, `icon`, `parent_id`, `init_from`, `deleted`, `creator`, `updater`, `create_time`, `update_time`) VALUES ('1564525727392481281', -1, '媒体', 'icon-media', '-1', NULL, 0, 3, 3, '2022-08-30 20:09:36', '2022-09-22 18:53:23') ON DUPLICATE KEY UPDATE update_time=update_time;
INSERT INTO `component_category` (`id`, `account_id`, `name`, `icon`, `parent_id`, `init_from`, `deleted`, `creator`, `updater`, `create_time`, `update_time`) VALUES ('1564525758279335938', -1, '布局', 'icon-contain-box', '-1', NULL, 0, 3, 3, '2022-08-30 19:09:43', '2022-09-22 18:53:23') ON DUPLICATE KEY UPDATE update_time=update_time;
INSERT INTO `component_category` (`id`, `account_id`, `name`, `icon`, `parent_id`, `init_from`, `deleted`, `creator`, `updater`, `create_time`, `update_time`) VALUES ('1564525799849082882', -1, '文本', 'icon-title', '-1', NULL, 0, 3, 3, '2022-08-30 21:09:53', '2022-09-22 18:53:23') ON DUPLICATE KEY UPDATE update_time=update_time;
INSERT INTO `component_category` (`id`, `account_id`, `name`, `icon`, `parent_id`, `init_from`, `deleted`, `creator`, `updater`, `create_time`, `update_time`) VALUES ('1564525835823628290', -1, '控件', 'icon-number-show', '-1', NULL, 0, 3, 3, '2022-08-30 18:10:01', '2022-09-22 18:53:23') ON DUPLICATE KEY UPDATE update_time=update_time;
INSERT INTO `component_category` (`id`, `account_id`, `name`, `icon`, `parent_id`, `init_from`, `deleted`, `creator`, `updater`, `create_time`, `update_time`) VALUES ('1564525861660540928', -1, '未分类', NULL, '1564525415961214975', NULL, 0, 3, 3, '2022-08-30 16:10:08', '2022-09-22 18:53:23') ON DUPLICATE KEY UPDATE update_time=update_time;
INSERT INTO `component_category` (`id`, `account_id`, `name`, `icon`, `parent_id`, `init_from`, `deleted`, `creator`, `updater`, `create_time`, `update_time`) VALUES ('1564525861660540929', -1, '按钮', NULL, '1564525835823628290', NULL, 0, 3, 3, '2022-08-30 16:10:08', '2022-09-22 18:53:23') ON DUPLICATE KEY UPDATE update_time=update_time;
INSERT INTO `component_category` (`id`, `account_id`, `name`, `icon`, `parent_id`, `init_from`, `deleted`, `creator`, `updater`, `create_time`, `update_time`) VALUES ('1564525886159470592', -1, '监控常用', NULL, '1564525415961214976', NULL, 0, 3, 3, '2022-08-30 16:10:13', '2022-09-22 18:53:23') ON DUPLICATE KEY UPDATE update_time=update_time;
INSERT INTO `component_category` (`id`, `account_id`, `name`, `icon`, `parent_id`, `init_from`, `deleted`, `creator`, `updater`, `create_time`, `update_time`) VALUES ('1564525886159470593', -1, '文本', NULL, '1564525799849082882', NULL, 0, 3, 3, '2022-08-30 16:10:13', '2022-09-22 18:53:23') ON DUPLICATE KEY UPDATE update_time=update_time;
INSERT INTO `component_category` (`id`, `account_id`, `name`, `icon`, `parent_id`, `init_from`, `deleted`, `creator`, `updater`, `create_time`, `update_time`) VALUES ('1564525908062126081', -1, '数字', NULL, '1564525799849082882', NULL, 0, 3, 3, '2022-08-30 16:10:19', '2022-09-22 18:53:23') ON DUPLICATE KEY UPDATE update_time=update_time;
INSERT INTO `component_category` (`id`, `account_id`, `name`, `icon`, `parent_id`, `init_from`, `deleted`, `creator`, `updater`, `create_time`, `update_time`) VALUES ('1564525932007407618', -1, '流动箭头', NULL, '1564525758279335938', NULL, 0, 3, 3, '2022-08-30 16:10:24', '2022-09-22 18:53:23') ON DUPLICATE KEY UPDATE update_time=update_time;
INSERT INTO `component_category` (`id`, `account_id`, `name`, `icon`, `parent_id`, `init_from`, `deleted`, `creator`, `updater`, `create_time`, `update_time`) VALUES ('1564525954170109953', -1, '导航栏', NULL, '1564525758279335938', NULL, 0, 3, 3, '2022-08-30 16:10:30', '2022-09-22 18:53:23') ON DUPLICATE KEY UPDATE update_time=update_time;
INSERT INTO `component_category` (`id`, `account_id`, `name`, `icon`, `parent_id`, `init_from`, `deleted`, `creator`, `updater`, `create_time`, `update_time`) VALUES ('1564525981454057474', -1, '媒体', NULL, '1564525727392481281', NULL, 0, 3, 3, '2022-08-30 16:10:36', '2022-09-22 18:53:23') ON DUPLICATE KEY UPDATE update_time=update_time;
INSERT INTO `component_category` (`id`, `account_id`, `name`, `icon`, `parent_id`, `init_from`, `deleted`, `creator`, `updater`, `create_time`, `update_time`) VALUES ('1564526004128464898', -1, '地图', NULL, '1564525687764697090', NULL, 0, 3, 3, '2022-08-30 16:10:42', '2022-09-22 18:53:23') ON DUPLICATE KEY UPDATE update_time=update_time;
INSERT INTO `component_category` (`id`, `account_id`, `name`, `icon`, `parent_id`, `init_from`, `deleted`, `creator`, `updater`, `create_time`, `update_time`) VALUES ('1564526030661632002', -1, '图表', NULL, '1564525415961214977', NULL, 0, 3, 3, '2022-08-30 16:10:48', '2022-09-22 18:53:23') ON DUPLICATE KEY UPDATE update_time=update_time;
INSERT INTO `component_category` (`id`, `account_id`, `name`, `icon`, `parent_id`, `init_from`, `deleted`, `creator`, `updater`, `create_time`, `update_time`) VALUES ('1564526030661632003', -1, '饼图', NULL, '1564525415961214977', NULL, 0, 3, 3, '2022-08-30 16:10:48', '2022-09-22 18:53:23') ON DUPLICATE KEY UPDATE update_time=update_time;
INSERT INTO `component_category` (`id`, `account_id`, `name`, `icon`, `parent_id`, `init_from`, `deleted`, `creator`, `updater`, `create_time`, `update_time`) VALUES ('1564526062076968962', -1, '雷达图', NULL, '1564525415961214977', NULL, 0, 3, 3, '2022-08-30 16:10:55', '2022-09-22 18:53:23') ON DUPLICATE KEY UPDATE update_time=update_time;
INSERT INTO `component_category` (`id`, `account_id`, `name`, `icon`, `parent_id`, `init_from`, `deleted`, `creator`, `updater`, `create_time`, `update_time`) VALUES ('1564526087905492993', -1, '散点图', NULL, '1564525415961214977', NULL, 0, 3, 3, '2022-08-30 16:11:02', '2022-09-22 18:53:23') ON DUPLICATE KEY UPDATE update_time=update_time;
INSERT INTO `component_category` (`id`, `account_id`, `name`, `icon`, `parent_id`, `init_from`, `deleted`, `creator`, `updater`, `create_time`, `update_time`) VALUES ('1564526121707388930', -1, '柱状图', NULL, '1564525415961214977', NULL, 0, 3, 3, '2022-08-30 16:11:10', '2022-09-22 18:53:23') ON DUPLICATE KEY UPDATE update_time=update_time;
INSERT INTO `component_category` (`id`, `account_id`, `name`, `icon`, `parent_id`, `init_from`, `deleted`, `creator`, `updater`, `create_time`, `update_time`) VALUES ('1564526146298593281', -1, '折线图', NULL, '1564525415961214977', NULL, 0, 3, 3, '2022-08-30 16:11:15', '2022-09-22 18:53:23') ON DUPLICATE KEY UPDATE update_time=update_time;
INSERT INTO `component_category` (`id`, `account_id`, `name`, `icon`, `parent_id`, `init_from`, `deleted`, `creator`, `updater`, `create_time`, `update_time`) VALUES ('1564526169769918466', -1, '仪表盘', NULL, '1564525415961214977', NULL, 0, 3, 3, '2022-08-30 16:11:21', '2022-09-22 18:53:23') ON DUPLICATE KEY UPDATE update_time=update_time;

CREATE TABLE if not exists `component_collection` (
    `id` varchar(255) NOT NULL COMMENT '收藏id',
    `component_id` varchar(30) NOT NULL COMMENT '组件id',
    `account_id` bigint(20) DEFAULT NULL COMMENT '租户id',
    `creator` bigint(20) DEFAULT NULL COMMENT '创建者id',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table if not exists component_group (
    `id` varchar(255) NOT NULL,
    `info` longtext,
    `name` varchar(255) DEFAULT NULL,
    `cover` varchar(255) DEFAULT NULL,
    `category_first_id` varchar(255) DEFAULT NULL,
    `category_second_id` varchar(255) DEFAULT NULL,
    `create_time` datetime DEFAULT NULL,
    `update_time` datetime DEFAULT NULL,
    `deleted` tinyint(1) DEFAULT NULL,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table if not exists component_group_category (
    `id` varchar(255) NOT NULL,
    `name` varchar(255) DEFAULT NULL,
    `parent_id` varchar(255) DEFAULT NULL,
    `create_time` datetime DEFAULT NULL,
    `update_time` datetime DEFAULT NULL,
    `deleted` tinyint(1) DEFAULT NULL,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE if not exists `component_project_ref` (
    `id` varchar(255) NOT NULL,
    `project_id` varchar(255) NOT NULL,
    `component_id` varchar(255) NOT NULL,
    `deleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0未删除 1已删除',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE if not exists `component_tag_ref` (
    `id` varchar(255) NOT NULL,
    `tag_id` varchar(255) NOT NULL,
    `component_id` varchar(255) NOT NULL,
    `deleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0未删除 1已删除',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE if not exists `component_version` (
    `id` varchar(255) NOT NULL,
    `component_id` varchar(255) NOT NULL,
    `no` varchar(255) NOT NULL,
    `status` varchar(100) DEFAULT NULL,
    `desc` varchar(255) DEFAULT NULL,
    `creator` bigint(32) DEFAULT NULL,
    `updater` bigint(32) DEFAULT NULL,
    `deleted` tinyint(4) NOT NULL DEFAULT '0',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE if not exists `data_combine_query` (
    `id` varchar(100) NOT NULL ,
    `combine_query_id` varchar(100) NOT NULL,
    `ref_query_id` varchar(100) NOT NULL,
    `deleted` bigint(20) NOT NULL DEFAULT '0',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB  DEFAULT CHARSET=utf8;


CREATE TABLE if not exists `data_query` (
    `id` varchar(255) NOT NULL,
    `data_source_id` varchar(255) DEFAULT NULL,
    `table_id` varchar(255) DEFAULT NULL,
    `query_name` varchar(255) NOT NULL,
    `query_type` tinyint(4) NOT NULL,
    `setting` text,
    `sql` text,
    `account_id` bigint(32) DEFAULT NULL,
    `deleted` tinyint(4) NOT NULL DEFAULT '0',
    `creator` bigint(32) DEFAULT NULL,
    `updater` bigint(32) DEFAULT NULL,
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE if not exists `data_source` (
    `id` varchar(255) NOT NULL,
    `name` varchar(255) NOT NULL,
    `schema_type` varchar(255) NOT NULL,
    `schema_name` varchar(255) NOT NULL,
    `connect_data` text,
    `account_id` bigint(32) DEFAULT NULL,
    `deleted` tinyint(4) NOT NULL DEFAULT '0',
    `creator` bigint(32) DEFAULT NULL,
    `updater` bigint(32) DEFAULT NULL,
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE if not exists `data_table` (
    `id` varchar(255) NOT NULL,
    `data_source_id` varchar(255) DEFAULT NULL,
    `name` varchar(255) NOT NULL,
    `meta` text NOT NULL,
    `account_id` bigint(20) DEFAULT NULL,
    `creator` bigint(32) DEFAULT NULL,
    `updater` bigint(32) DEFAULT NULL,
    `deleted` tinyint(4) DEFAULT NULL,
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE if not exists `import_result` (
    `id` varchar(100) NOT NULL,
    `key` varchar(100) NOT NULL,
    `type` varchar(100) DEFAULT NULL,
    `status` tinyint(4) DEFAULT NULL,
    `creator` bigint(20) DEFAULT NULL,
    `updater` bigint(20) DEFAULT NULL,
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE if not exists `project` (
    `id` varchar(225) NOT NULL,
    `name` varchar(100) NOT NULL,
    `desc` text,
    `init_from` varchar(100) DEFAULT NULL,
    `account_id` bigint(32) DEFAULT NULL,
    `deleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0未删除1已删除',
    `creator` bigint(32) DEFAULT NULL,
    `updater` bigint(32) DEFAULT NULL,
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO cw_lcap.project (id,name,`desc`,init_from,account_id,deleted,creator,updater,create_time,update_time) VALUES ('1564451835235811329','系统内置','系统内置','lcap-init',-1,0,3,3,'2022-08-30 11:15:58','2022-08-30 11:15:58') ON DUPLICATE KEY UPDATE update_time=update_time;

CREATE TABLE if not exists `project_trade_ref` (
    `id` varchar(255) NOT NULL,
    `project_id` varchar(100) NOT NULL,
    `trade_id` varchar(100) NOT NULL,
    `deleted` tinyint(4) DEFAULT '0',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO `cw_lcap`.`project_trade_ref` (`id`, `project_id`, `trade_id`, `deleted`, `create_time`, `update_time`) VALUES ('1593515946641805314', '1564451835235811329', '1564144977514147842', 0, '2022-11-18 16:06:22', '2022-11-18 16:06:22')  ON DUPLICATE KEY UPDATE update_time=update_time;

CREATE TABLE if not exists `tag` (
    `id` varchar(255) NOT NULL,
    `account_id` bigint(32) DEFAULT NULL,
    `name` varchar(255) NOT NULL,
    `type` varchar(255) DEFAULT NULL,
    `deleted` tinyint(4) NOT NULL DEFAULT '0',
    `creator` bigint(32) DEFAULT NULL,
    `updater` bigint(32) DEFAULT NULL,
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE if not exists `trade` (
    `id` varchar(255) NOT NULL,
    `name` varchar(255) NOT NULL,
    `desc` varchar(255) DEFAULT NULL,
    `init_from` varchar(100) DEFAULT NULL,
    `deleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0未删除1已删除',
    `account_id` bigint(32) DEFAULT NULL,
    `creator` bigint(32) DEFAULT NULL,
    `updater` bigint(32) DEFAULT NULL,
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO cw_lcap.trade (id,name,`desc`,init_from,deleted,account_id,creator,updater,create_time,update_time) VALUES ('1564144977514147842','全行业',NULL,NULL,0,-1,3,3,'2022-08-29 14:56:38','2022-08-29 14:56:38') ON DUPLICATE KEY UPDATE update_time=update_time;

CREATE TABLE if not exists `user` (
  `id` varchar(255) NOT NULL COMMENT 'id',
  `user_name` varchar(100) DEFAULT NULL COMMENT '用户名',
  `email` varchar(32) DEFAULT NULL COMMENT '邮箱',
  `phone` varchar(11) DEFAULT NULL COMMENT '电话',
  `password` varchar(100) DEFAULT NULL COMMENT '密码',
  `role_id` int(11) DEFAULT NULL COMMENT '角色id',
  `status` varchar(20) DEFAULT NULL COMMENT '是否非法，是否禁用',
  `is_douc` tinyint(1) DEFAULT NULL COMMENT '是否是douc用户',
  `updater` bigint(32) DEFAULT NULL COMMENT '更新人',
  `creator` bigint(32) DEFAULT NULL COMMENT '创建人',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表';
INSERT INTO `user`
(id, user_name, email, phone, password, role_id, status, is_douc, updater, creator, create_time, update_time)
VALUES('1613128193869365249', 'admin', '1203947952@qq.com', '18939657757', '327731c2e3932dcd84ffaf232c5644f6', 1, 'valid', 0, NULL, NULL, '2023-01-11 18:58:27', '2023-01-11 18:58:27');

CREATE TABLE if not exists `role` (
  `id` varchar(255) NOT NULL COMMENT 'id',
  `status` varchar(10) DEFAULT NULL COMMENT '是否合法',
  `name` varchar(100) DEFAULT NULL COMMENT '角色名',
  `desc` varchar(100) DEFAULT NULL COMMENT '描述',
  `menus` text COMMENT '菜单对象MenuVo',
  `updater` bigint(32) DEFAULT NULL COMMENT '更新人',
  `creator` bigint(32) DEFAULT NULL COMMENT '创建人',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO `role`
(id, status, name, `desc`, menus, updater, creator, create_time, update_time)
VALUES('1', 'valid', '管理员', 'admin', '{"menus": [{"url": "/app", "name": "应用创建", "index": 2}, {"url": "/app/project-manage", "name": "项目管理", "index": 3}, {"url": "/app/apply-develop", "name": "应用开发", "index": 4}, {"url": "/app/component-develop", "name": "组件列表", "index": 5}, {"url": "/user", "name": "用户管理", "index": 9}, {"url": "/user/user-manage", "name": "用户列表", "index": 10}, {"url": "/user/role-manage", "name": "角色列表", "index": 11}, {"url": "/data", "name": "数据源管理", "index": 12}, {"url": "/data-search", "name": "数据查询", "index": 13}]}', NULL, NULL, '2022-12-27 18:08:16', '2022-12-28 11:41:11');
INSERT INTO `role`
(id, status, name, `desc`, menus, updater, creator, create_time, update_time)
VALUES('2', 'valid', '成员', '成员', '{"menus":[{"index":1,"url":"/app","name":"应用创建"},{"index":2,"url":"/app/project-manage","children":[],"name":"项目管理"},{"index":3,"url":"/app/apply-develop","children":[],"name":"应用开发"},{"index":4,"url":"/app/component-develop","children":[],"name":"组件列表"},{"index":5,"url":"/user","name":"用户管理"},{"index":6,"url":"/user/user-manage","children":[],"name":"用户列表"},{"index":7,"url":"/user/role-manage","children":[],"name":"角色列表"},{"index":8,"url":"/data","name":"数据源管理"},{"index":9,"url":"/data-search","name":"数据查询"}]}', NULL, NULL, '2022-12-27 18:08:16', '2022-12-29 15:48:29');

CREATE TABLE if not exists `menus` (
  `id` varchar(255) NOT NULL COMMENT 'id',
  `parent_menu_id` int(11) DEFAULT NULL COMMENT '父id',
  `name` varchar(100) DEFAULT NULL COMMENT '菜单名称',
  `url` varchar(100) DEFAULT NULL COMMENT '菜单url',
  `updater` bigint(32) DEFAULT NULL COMMENT '更新人',
  `creator` bigint(32) DEFAULT NULL COMMENT '创建人',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO menus
(id, parent_menu_id, name, url, updater, creator, create_time, update_time)
VALUES('1', NULL, '应用创建', '/app', NULL, NULL, '2022-12-27 14:54:44', '2022-12-27 14:54:44');
INSERT INTO menus
(id, parent_menu_id, name, url, updater, creator, create_time, update_time)
VALUES('2', 1, '项目管理', '/app/project-manage', NULL, NULL, '2022-12-27 14:54:45', '2022-12-27 14:54:45');
INSERT INTO menus
(id, parent_menu_id, name, url, updater, creator, create_time, update_time)
VALUES('3', 1, '应用开发', '/app/apply-develop', NULL, NULL, '2022-12-27 14:54:46', '2022-12-27 14:54:46');
INSERT INTO menus
(id, parent_menu_id, name, url, updater, creator, create_time, update_time)
VALUES('4', 1, '组件列表', '/app/component-develop', NULL, NULL, '2022-12-27 14:54:48', '2022-12-27 14:54:48');
INSERT INTO menus
(id, parent_menu_id, name, url, updater, creator, create_time, update_time)
VALUES('5', NULL, '用户管理', '/user', NULL, NULL, '2022-12-27 14:54:49', '2022-12-27 14:54:49');
INSERT INTO menus
(id, parent_menu_id, name, url, updater, creator, create_time, update_time)
VALUES('6', 5, '用户列表', '/user/user-manage', NULL, NULL, '2022-12-27 14:54:49', '2022-12-27 14:54:49');
INSERT INTO menus
(id, parent_menu_id, name, url, updater, creator, create_time, update_time)
VALUES('7', 5, '角色列表', '/user/role-manage', NULL, NULL, '2022-12-27 14:54:50', '2022-12-27 14:54:50');
INSERT INTO menus
(id, parent_menu_id, name, url, updater, creator, create_time, update_time)
VALUES('8', NULL, '数据源管理', '/data', NULL, NULL, '2022-12-27 14:54:50', '2022-12-27 14:54:50');
INSERT INTO menus
(id, parent_menu_id, name, url, updater, creator, create_time, update_time)
VALUES('9', NULL, '数据查询', '/data-search', NULL, NULL, '2022-12-27 14:54:50', '2022-12-27 14:54:50');


