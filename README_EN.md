<div align="center">
  <a href="https://github.com/CloudWise-OpenSource/FlyFish"><img src="./doc/images/FlyFish logo.png" alt="flyfish" /></a>
</div>

**English ｜[简体中文](https://github.com/CloudWise-OpenSource/FlyFish)**

# FlyFish

[![img](https://camo.githubusercontent.com/b90fbf522edfb28cd12154150fae08fd89d4be956e644f327f369df43ef33bf0/68747470733a2f2f62616467656e2e6e65742f6769746875622f7072732f436c6f7564576973652d4f70656e536f757263652f466c7946697368)](https://github.com/CloudWise-OpenSource/FlyFish/pulls) [![img](https://camo.githubusercontent.com/4bf17723fd9a7438e40dda0d0f05c3ff85df8450605fbec58cf4643bb044ca49/68747470733a2f2f62616467656e2e6e65742f6769746875622f6c6963656e73652f436c6f7564576973652d4f70656e536f757263652f466c7946697368)](https://github.com/CloudWise-OpenSource/FlyFish/blob/main/LICENSE) [![img](https://camo.githubusercontent.com/1fb3e7fec903937186ee550f90f558bdf63575dc171251276c3335ff863d13cc/68747470733a2f2f62616467656e2e6e65742f6769746875622f72656c656173652f436c6f7564576973652d4f70656e536f757263652f466c7946697368)](https://github.com/CloudWise-OpenSource/FlyFish/releases)

## Code Finds You Well

Flyfish is a data visualization coding platform. We can create a data model quickly in a simple way, and quickly generate a set of data visualization solutions by dragging.

## Demo Online

https://flyfish-demo.opscloudwise.com:23368/

## Gitee Mirror

https://gitee.com/CloudWise/fly-fish

## Essential Knowledge

### Historical Sharing

- [FlyFish platform explanation](http://docs.aiops.cloudwise.com/zh/flyfish)
- [Component development explanation](http://docs.aiops.cloudwise.com/zh/flyfish/component/develop.html)

### Peripheral Sharing

- [Official documents](http://docs.aiops.cloudwise.com/zh/flyfish)
- [Architecture and contents](http://docs.aiops.cloudwise.com/zh/flyfish/design.html)
- [Users get started quickly](http://docs.aiops.cloudwise.com/zh/flyfish/getting-started/)
- [Get started quickly](http://docs.aiops.cloudwise.com/zh/flyfish/component/basic.html)
- [AIOps community](https://www.cloudwise.ai/#/datalaker/dashboard)

## Product Features

| ![产品功能示例1](./doc/images/产品功能示例1.gif) | ![产品功能示例2](./doc/images/产品功能示例2.gif) |
| ------------------------------------------------ | ------------------------------------------------ |

## Data Visualization Case

| ![IT监控设施概览](./doc/images/IT监控设施概览.gif) | ![基础监控](./doc/images/基础监控.gif) |
| -------------------------------------------------- | -------------------------------------- |

## Installation Instructions

### Branch Instructions

| Branch | Instruction  |
| ------ | ------------ |
| main   | Trunk Branch |

### Environmental Dependencys

| Env     | Instruction |
| ------- | ----------- |
| node    | 14.19.3     |
| mongodb | 4.0.0       |
| nginx   | 1.20.1      |
| jdk     | 1.8         |

### Occupied port

| Reception                                             | Port  |
| ----------------------------------------------------- | ----- |
| FlyFishWeb Port(Nginx static resource proxy)          | 8089  |
| FlyFishCodeServer(Online editor)Port                  | 8081  |
| FlyFishServer(Primary backend service)Port            | 7001  |
| FlyfishDataServer(Data source management service)Port | 18532 |

### Deployment Process

> It is recommended to use the flyfish deployment documents in the doc directory. The subsequent deployment processes, learning materials, FAQs, etc. are uniformly placed in the doc directory for management.

- [01-Basic environment preparation](./doc/01-基础环境准备篇.md)
- [02-code_server deployment](./doc/02-code_server部署篇.md)
- [03-FlyFish platform deployment](./doc/03-FlyFish平台部署篇.md)

> Or execute one key script：

```bash
# CentOS 7.5/7.6  x86-64
# Root account is required
# Flyfish can be installed in any directory with permission
# The installation directory specified here is /data/app/
mkdir -p /data/app/
cd /data/app/

git clone -b main https://github.com/CloudWise-OpenSource/FlyFish.git FlyFish
or
git clone -b main https://gitee.com/CloudWise/fly-fish.git FlyFish

cd /data/app/FlyFish
bash flyfish.sh install

# One click unload
bash flyfish.sh uninstall
```

## Upgrade Process

```
# 1、Update code
$ git checkout main
$ git pull
```

## Roadmap

> FlyFish 2022 Roadmap

### Data Source

- Newly added data source management
- Support docking MySql, MongoDB,Redis or Postgres for data storage
- - Support model building for data sources

### Data Processing

- Support SQL query by data sheet
- Support query visualization
- Newly added complex data processing

## Components

[FlyFishComponents](https://github.com/CloudWise-OpenSource/FlyFishComponents)

## Contributor list

Thanks to the developers who have made contributions to Flyfish. Whatever the issue, document translation or code contribution, Flyfish cannot develop without your support.
| | | |
| :--------| :---------| :-------- |
| [maxDwq](https://github.com/maxDwq)| [jincheny](https://github.com/jincheny) | [Neeke](https://github.com/Neeke) |
| [tiger wang](https://github.com/xiaohu12685)| [Jaden.Li](https://github.com/imjaden) | [osramywj](https://github.com/osramywj)|
| [suger](https://github.com/sssssssugar)| [Cary Zhou](https://github.com/YouYe) | [soulferryman](https://github.com/soulferryman) |
| [aiwhj](https://github.com/aiwhj) | [zengqiu](https://github.com/zengqiu) | [Rise.Hao（郝玉鹏)](https://github.com/RiseHao1029) |
| [Markuuuu](https://github.com/Markuuuu) | [郝少聪](https://github.com/laocong) | |

## Welcome to join

For more technical information about flyfish, or to join the flyfish developer exchange group, you can scan the QR code below for consultation.

**Email：** open.source@cloudwise.com

**WeChat：**

<img src="./doc/images/FlyFish QR code.png" width="400px"/>
