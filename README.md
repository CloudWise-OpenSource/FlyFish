<div align="center">
  <a href="https://github.com/CloudWise-OpenSource/FlyFish"><img src="https://cdn.jsdelivr.net/gh/CloudWise-OpenSource/FlyFish/flyfishicon.png" alt="flyfish" /></a>
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

> 推荐使用 doc 目录内 flyfish 部署文档，后续有关部署流程、学习资料、FAQ 等统一放置 doc 目录中管理。

**推荐**

- [基础环境准备篇.md](./doc/基础环境准备篇.md)
- [code_server 部署篇](./doc/code_server部署篇.md)
- [应用平台部署篇 v2.0](./doc/应用平台部署篇v2.0.md)
- [组件开发平台部署篇](./doc/组件开发平台部署篇.md)

**不推荐**

> ❗ 以下部署流程已废弃，doc 中已更新标准版部署流程，但未包含 Docker 部署、以及本地部署。因此以下部署流程暂作保留，提供参考。推荐您使用 doc 中部署流程。

- [内网部署文档](http://docs.aiops.cloudwise.com/zh/flyfish/deploy.html)

## 升级流程

```
# 1、更新代码
$ git checkout master
$ git pull

# 2、停止并删除容器
$ pm2 restart ${id}

```

## 欢迎加入

_获取更多关于 FlyFish 的技术资料，或加入 FlyFish 开发者交流群，可扫描下方二维码咨询。_

<img src="https://gitee.com/CloudWise/fly-fish/raw/main/doc/images/Susie.png" width="550px"/>
