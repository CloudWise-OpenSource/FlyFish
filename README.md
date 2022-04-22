<div align="center">
  <a href="https://github.com/CloudWise-OpenSource/FlyFish"><img src="./doc/images/FlyFish logo.png" alt="flyfish" /></a>
</div>

# 飞鱼（FlyFish）

[![img](https://camo.githubusercontent.com/b90fbf522edfb28cd12154150fae08fd89d4be956e644f327f369df43ef33bf0/68747470733a2f2f62616467656e2e6e65742f6769746875622f7072732f436c6f7564576973652d4f70656e536f757263652f466c7946697368)](https://github.com/CloudWise-OpenSource/FlyFish/pulls) [![img](https://camo.githubusercontent.com/4bf17723fd9a7438e40dda0d0f05c3ff85df8450605fbec58cf4643bb044ca49/68747470733a2f2f62616467656e2e6e65742f6769746875622f6c6963656e73652f436c6f7564576973652d4f70656e536f757263652f466c7946697368)](https://github.com/CloudWise-OpenSource/FlyFish/blob/main/LICENSE) [![img](https://camo.githubusercontent.com/1fb3e7fec903937186ee550f90f558bdf63575dc171251276c3335ff863d13cc/68747470733a2f2f62616467656e2e6e65742f6769746875622f72656c656173652f436c6f7564576973652d4f70656e536f757263652f466c7946697368)](https://github.com/CloudWise-OpenSource/FlyFish/releases)

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

| 分支 | 说明   |
| ---- | ------ |
| main | 主分支 |

### 环境依赖

| 环境    | 说明   |
| ------- | ------ |
| node    | 14.9.0 |
| mongodb | 4.0.0  |
| nginx   | 1.20.1 |

### 部署流程

> 推荐使用 doc 目录内 flyfish 部署文档，后续有关部署流程、学习资料、FAQ 等统一放置 doc 目录中管理。

- [基础环境准备篇](./doc/基础环境准备篇.md)
- [code_server部署篇](./doc/code_server部署篇.md)
- [FlyFish平台部署篇](./doc/FlyFish平台部署篇.md)

## 升级流程

```
# 1、更新代码
$ git checkout main
$ git pull

```

## Roadmap

> FlyFish 2022 Roadmap

### 系统

- 支持创建网格化画布应用
- 支持响应式布局
- 新增表单类应用

### 数据源

- 增加数据源管理
- 对接 MySQL、MongoDB、Redis、Postgres 等数据存储数据源
- 对接 HTTP API 数据源
- 支持对数据源进行模型建表

### 数据处理

- 支持根据数据表进行 SQL 查询
- 支持查询的可视化
- 新增复杂数据处理

### 用户管理

- 用户管理和权限管控

## 欢迎加入

_获取更多关于 FlyFish 的技术资料，或加入 FlyFish 开发者交流群，可扫描下方二维码咨询。_

<img src="./doc/images/Susie.png" width="550px"/>
