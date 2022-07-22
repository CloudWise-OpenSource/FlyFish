<div align="center">
  <a href="https://github.com/CloudWise-OpenSource/FlyFish"><img src="./doc/images/FlyFish logo.png" alt="flyfish" /></a>
</div>

**[English](https://github.com/CloudWise-OpenSource/FlyFish/blob/main/README_EN.md)｜简体中文**

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
- [架构及目录](http://docs.aiops.cloudwise.com/zh/flyfish/design/design2_1.html)
- [用户快速上手](http://docs.aiops.cloudwise.com/zh/flyfish/getting-started/)
- [开发快速上手](http://docs.aiops.cloudwise.com/zh/flyfish/component/basic.html)
- [AIOps 社区](https://www.cloudwise.ai/#/datalaker/dashboard)

## 功能示例
![产品功能示例1](./doc/images/产品功能示例1.gif)|![产品功能示例2](./doc/images/产品功能示例2.gif)
---|---

## 大屏案例
![IT监控设施概览](./doc/images/IT监控设施概览.gif)|![基础监控](./doc/images/基础监控.gif)
---|---


## 安装说明

### 分支说明

| 分支 | 说明   |
| ---- | ------ |
| main | 主分支 |

### 环境依赖

| 环境    | 说明    |
| ------- | ------- |
| node    | 14.19.3 |
| mongodb | 4.0.0   |
| nginx   | 1.20.1  |

### 开放端口

| 服务台                              | 端口 |
| ----------------------------------- | ---- |
| FlyfishWeb 端口(nginx 静态资源代理) | 8089 |
| FlyfishCodeServer(在线编辑器)端口   | 8081 |
| FlyfishServer(主后端服务)端口       | 7001 |

### 部署流程

> 推荐使用 doc 目录内 flyfish 部署文档，后续有关部署流程、学习资料、FAQ 等统一放置 doc 目录中管理。

- [01-基础环境准备篇](./doc/01-基础环境准备篇.md)
- [02-code_server 部署篇](./doc/02-code_server部署篇.md)
- [03-FlyFish 平台部署篇](./doc/03-FlyFish平台部署篇.md)

> 或执行一键脚本：

```bash
# CentOS 7.5/7.6  x86-64
# 须使用root账户
mkdir -p /data/app/
cd /data/app/

git clone -b main https://github.com/CloudWise-OpenSource/FlyFish.git FlyFish
or
git clone -b main https://gitee.com/CloudWise/fly-fish.git FlyFish

cd /data/app/FlyFish
bash flyfish.sh install

# 一键卸载
bash flyfish.sh uninstall

# 一键更新
# FlyFish-2.1.1 升级至 FlyFish-2.1.2
git checkout main
git pull origin main

bash flyfish.sh update
```

## 升级流程

```
# 1、更新代码
$ git checkout main
$ git pull
```

## Roadmap

> FlyFish 2022 Roadmap


### 数据源

- 增加数据源管理
- 对接 MySQL、Http等数据存储数据源
- 支持对数据源进行模型建表

### 数据处理

- 支持根据数据表进行SQL查询
- 支持查询的可视化
- 新增数据处理

## 组件库
[FlyFish组件库](https://github.com/CloudWise-OpenSource/FlyFishComponents)

## 贡献者名单

感谢那些为 FlyFish 做出贡献的开发者，无论是 issue 问题、文档翻译、代码贡献，FlyFish 的发展离不开你的支持
| | | |
| :--------| :---------| :-------- |
| [maxDwq](https://github.com/maxDwq)| [jincheny](https://github.com/jincheny) | [Neeke](https://github.com/Neeke) |
| [tiger wang](https://github.com/xiaohu12685)| [Jaden.Li](https://github.com/imjaden) | [osramywj](https://github.com/osramywj)|
| [suger](https://github.com/sssssssugar)| [Cary Zhou](https://github.com/YouYe) | [soulferryman](https://github.com/soulferryman) |
| [aiwhj](https://github.com/aiwhj) | [zengqiu](https://github.com/zengqiu) | [Rise.Hao（郝玉鹏)](https://github.com/RiseHao1029) |
| [Markuuuu](https://github.com/Markuuuu) | [郝少聪](https://github.com/laocong) | |


## 如何参与贡献
[FlyFish体验官招募计划](https://github.com/CloudWise-OpenSource/FlyFish/issues/131)

[FlyFish组件激励计划](https://github.com/CloudWise-OpenSource/FlyFishComponents/issues/7)

## 欢迎加入

_获取更多关于 FlyFish 的技术资料，或加入 FlyFish 开发者交流群，可扫描下方二维码咨询。_

<img src="./doc/images/Susie.png" width="550px"/>
