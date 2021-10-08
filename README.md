# Solution-Platform-Server

## 一句话了解我

通过简易的方式快速创建数据模型，通过拖拉拽的形式，快速生成一套解决方案。

## 背景知识

### 历史培训

 - [飞鱼平台讲解](https://yunzhihui.feishu.cn/minutes/obcn2ran211b55f3jlqt84mx)
 - [组件开发讲解](https://yunzhihui.feishu.cn/minutes/obcnwz1t6x94f59b1668ju4j)

### 相关培训

 - [官方文档](http://10.2.2.38/web/ff-doc/)
 - [用户快速上手](http://10.2.2.38/web/ff-doc/guide/quick-screen)
 - [开发快速上手](http://10.2.2.38/web/ff-doc/guide/quick-component)
 - [架构文档](https://team.cloudwise.com/pages/viewpage.action?pageId=33683298)
 - [表结构文档](https://team.cloudwise.com/pages/viewpage.action?pageId=33684035)
 - [组件开发文档](http://10.2.2.38/web/ff-doc/document)

## 安装

### 分支说明

(说明主分支、开发分支或其他分支作用)

【说明: [xxx: 具体功能描述] eg: feature_refactor_config】

| 分支        | 说明        |
| ----------- | ----------- |
| master      | 主分支      |
| dev         | 测试分支    |
| hotfix_xxx  | bugfix 分支 |
| feature_xxx | 特性分支    |
| release_xxx | 预发布分支  |

### 环境依赖

(描述依赖项，及其安装/配置方式)

| 环境  | 说明      |
| ----- | --------- |
| jdk   | >= v1.8   |
| node  | >= 8.9.3  |
| redis | >= 4.0.8  |
| mysql | >= 5.6.38 |

### 安装

- #### 手动安装

【注意: vim 部分需要自行填写相关配置信息】

1.进入项目

```
cd Solution-Platform-Server

npm install
```

2.配置 pm2.production.json

```
cp pm2.json pm2.production.json

vim pm2.production.json
```

3.初始化数据库配置

```
cp config/database.dev.json config/database.production.json

vim config/database.production.json
```

4.编辑 src/common/config/config.production.js

```
cp src/common/config/config.js src/common/config/config.production.js

vim src/common/config/config.production.js
```

5.编辑 src/common/config/adapter.production.js

```
cp src/common/config/adapter.js src/common/config/adapter.production.js

vim src/common/config/adapter.production.js
```

6.编辑 src/web/config/config.production.js

```
cp src/web/config/config.js src/web/config/config.production.js

vim src/web/config/config.production.js
```

- #### jenkins pipeline 自动安装（待补充）

### 启动/停止

```
初始化数据库: pm2 run init_database_production
启动: pm2 run pm2-start
重启: pm2 run pm2-restart
重新加载: npm run pm2-reload
停止: pm2 run pm2-stop
```

### 编译

```
# 编译 prod 命令
npm run init_database_production
```

## API 说明

```
两种方式
# 自动生成
  1、npm run createWebApiDoc
  2、npm run openWebApiDoc

# 直接查看
  1、 http://10.2.3.56:8363/webApiDoc/index.html
```

## 最新更新日志

### Vx.x.x (xxxx.xx.xx)

待补充 (Vx.x.x的主要更新内容)
