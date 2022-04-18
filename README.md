<div align="center">
  <a href="https://github.com/CloudWise-OpenSource/FlyFish"><img src="https://cdn.jsdelivr.net/gh/CloudWise-OpenSource/FlyFish/flyfishicon.png" alt="flyfish" /></a>
</div>

# 飞鱼（FlyFish）

  <div align="left">
    <a href="https://github.com/CloudWise-OpenSource/FlyFish/pulls"><img src="https://badgen.net/github/prs/CloudWise-OpenSource/FlyFish" /></a>
    <a href="https://github.com/CloudWise-OpenSource/FlyFish/blob/main/LICENSE"><img src="https://badgen.net/github/license/CloudWise-OpenSource/FlyFish" /></a>
    <a href="https://github.com/CloudWise-OpenSource/FlyFish/releases"><img src="https://badgen.net/github/release/CloudWise-OpenSource/FlyFish" /></a>
  </div>

## 见码如面

飞鱼（FlyFish）是一个数据可视化编码平台。通过简易的方式快速创建数据模型，通过拖拉拽的形式，快速生成一套数据可视化解决方案。

## 在线地址

- [https://flyfish-demo.opscloudwise.com:23368/](https://flyfish-demo.opscloudwise.com:23368/)

## 国内镜像

- [gitee.com/CloudWise/fly-fish](https://gitee.com/CloudWise/fly-fish)

## 背景知识

### 历史培训

- [飞鱼平台讲解](http://docs.aiops.cloudwise.com/zh/flyfish)
- [组件开发讲解](http://docs.aiops.cloudwise.com/zh/flyfish/component/develop.html)

### 相关培训

- [官方文档](http://docs.aiops.cloudwise.com/zh/flyfish)
- [架构及目录](http://docs.aiops.cloudwise.com/zh/flyfish/design.html)
- [用户快速上手](http://docs.aiops.cloudwise.com/zh/flyfish/getting-started/)
- [开发快速上手](http://docs.aiops.cloudwise.com/zh/flyfish/component/basic.html)
- [AIOps 社区](https://www.cloudwise.ai/#/datalaker/dashboard)

## 安装说明

### 分支说明

| 分支 | 说明 |
| ---- | ---- |
| main | v1.0 |
| 2.0  | v2.0 |

### 环境依赖

| 环境  | 说明         |
| ----- | ------------ |
| node  | 推荐@12、@14 |
| redis | >= 4.0.8     |
| mysql | >= 5.6.38    |

### 部署流程

> 持续更新中……

**推荐**

- [基础环境准备篇](./doc/基础环境准备篇.md)
- [code_server 部署篇](./doc/code_server部署篇.md)
- [应用平台部署篇 v1.0](./doc/应用平台部署篇v1.0.md)

**不推荐**

> :heavy_exclamation_mark:以下部署流程已废弃，doc 中已更新标准版部署流程，但未包含 Docker 部署、以及本地部署。因此以下部署流程暂作保留，提供参考。推荐您使用 doc 中部署流程。

- [内网部署文档](http://docs.aiops.cloudwise.com/zh/flyfish/deploy.html)

模式一：Docker 中运行所有服务

- 优势：操作便捷，只依赖 Docker 服务
- 缺点：运行速度慢（包含源码拷贝、软件包安装时间），不方便调试

```
# 5、编译并启动 docker
$ docker build --tag flyfish --file Dockerfile .
$ docker run -itd --name flyfish -p 8364:8364 -p 3306:3306 -p 6379:6379 -p 8081:8081 flyfish

# 6、浏览器访问
# http://127.0.0.1:8364

# 7、进入docker操作
# 根据开发需要【非必操作项】
$ docker exec -it flyfish /bin/bash
```

模式二：Docker 中运行仅数据库服务，代码在本机运行

- 优势：运行速度较快（只有软件包安装时间），方便本地调试
- 缺点：本地需要安装、配置 NodeJS 环境

```
# 5、编译并启动 docker
$ docker build --tag flyfish_database --file scripts/macos/Database-Dockerfile .
$ docker run -itd --name flyfish_database -p 3306:3306 -p 6379:6379 flyfish_database

# 6、编译代码
$ bash scripts/flyfish-startup.sh

# 7、浏览器访问
# #http://127.0.0.1:8364

# 8、进入docker操作
# #根据开发需要【非必操作项】
$ docker exec -it flyfish_database /bin/bash
```

模式三：所有服务都在本地运行

- 优势：浸入式参与全程编译、运行
- 缺点：安装软件及配置项啰嗦

```
# 0、系统版本
$ sw_vers
ProductName:    macOS
ProductVersion: 12.0.1
BuildVersion:   21A559

# 1、启动 MySQL 服务
$ mysql.server start
$ mysql --version
mysql  Ver 14.14 Distrib 5.7.34, for osx10.16 (x86_64) using  EditLine wrapper

# 2、创建数据库 flyfish
$ mysql -h127.0.0.1 -uroot -p<root密码> -e "create database IF NOT EXISTS flyfish;"

# 3、创建用户 Rootmaster
$ mysql -h127.0.0.1 -uroot -p<root密码> -e "create user Rootmaster@% identified by '<见配置档>';"
$ mysql -h127.0.0.1 -uroot -p<root密码> -e "grant all privileges on *.* to 'Rootmaster'@'%' identified by '<见配置档>';"
$ mysql -h127.0.0.1 -uroot -p<root密码> -e "flush privileges;"

# 4、初始化数据
$ npm run init_database_dev

# 5、启动 Redis 服务
$ brew services start redis

# 6、确认服务运行状态（端口）
$ lsof -i:3306,6379
COMMAND     PID     USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
mysqld     5768 jaden.li   27u  IPv4 0x2b28571b878724bf      0t0  TCP localhost:mysql (LISTEN)
redis-ser 12319 jaden.li    6u  IPv4 0x2b28571b87871a0f      0t0  TCP localhost:6379 (LISTEN)
redis-ser 12319 jaden.li    7u  IPv6 0x2b28571b77d81b87      0t0  TCP localhost:6379 (LISTEN)

# 7、启动本地前后端服务
$ bash scripts/flyfish-startup.sh

# 8、浏览器访问
# #http://127.0.0.1:8364
```

## 升级流程

```
# 1、更新代码
$ git checkout main
$ git pull

# 2、停止并删除容器
$ docker container stop flyfish
$ docker container rm flyfish

# 3、更新并启动容器
# 重复【部署流程】步骤
```

## 欢迎加入

_获取更多关于 FlyFish 的技术资料，或加入 FlyFish 开发者交流群，可扫描下方二维码咨询。_

<img src="./doc/images/Susie.png" width="460px">
