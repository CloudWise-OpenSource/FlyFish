<div align="center">
  <a href="https://github.com/CloudWise-OpenSource/FlyFish"><img src="./doc/images/FlyFish logo.png" alt="flyfish" /></a>
</div>

**[English](https://github.com/CloudWise-OpenSource/FlyFish/blob/main/README_EN.md)｜简体中文**

# 飞鱼（FlyFish）

[![img](https://camo.githubusercontent.com/b90fbf522edfb28cd12154150fae08fd89d4be956e644f327f369df43ef33bf0/68747470733a2f2f62616467656e2e6e65742f6769746875622f7072732f436c6f7564576973652d4f70656e536f757263652f466c7946697368)](https://github.com/CloudWise-OpenSource/FlyFish/pulls) [![img](https://camo.githubusercontent.com/4bf17723fd9a7438e40dda0d0f05c3ff85df8450605fbec58cf4643bb044ca49/68747470733a2f2f62616467656e2e6e65742f6769746875622f6c6963656e73652f436c6f7564576973652d4f70656e536f757263652f466c7946697368)](https://github.com/CloudWise-OpenSource/FlyFish/blob/main/LICENSE) [![img](https://camo.githubusercontent.com/1fb3e7fec903937186ee550f90f558bdf63575dc171251276c3335ff863d13cc/68747470733a2f2f62616467656e2e6e65742f6769746875622f72656c656173652f436c6f7564576973652d4f70656e536f757263652f466c7946697368)](https://github.com/CloudWise-OpenSource/FlyFish/releases)

## 见码如面

飞鱼（FlyFish）是一个数据可视化编码平台。通过简易的方式快速创建数据模型，通过拖拉拽的形式，快速生成一套数据可视化解决方案。

| ![IT监控设施概览](./doc/images/IT监控设施概览.gif) | ![基础监控](./doc/images/基础监控.gif) |
| -------------------------------------------------- | -------------------------------------- |

## FlyFish 功能概览

- 项目管理：项目用于代表具体的业务需求场景，是多个应用、组件的集合。
- 应用开发：支持开发大屏应用，可开发单页面或是多页面路由的大屏应用。
- 组件开发：组件为最小粒度的项目基础，通过创建和开发组件拼凑出最终的可视化大屏展示。
- 模板库：可将开发完成的应用/组件分别上传到对应的模板库中，可在已有模板的基础上快速创建新的项目。
- 数据源管理：可接入 MySQL、Http 等多个数据库数据生成对应数据源，供创建项目时组件对数据进行调用。 
- 数据查询：支持根据数据表进行 SQL 查询，精准定位数据源中具体数据并封装保存，也可将查询到的数据重新组合，供组件直接调用。 

| ![产品功能示例1](./doc/images/产品功能示例1.gif) | ![产品功能示例2](./doc/images/产品功能示例2.gif) |
| ------------------------------------------------ | ------------------------------------------------ |

## FlyFish 模版中心

- **[模版中心](https://www.cloudwise.ai/flyFishComponents.html)**
- **[源码下载](https://github.com/CloudWise-OpenSource/FlyFishComponents)**

<img src="./doc/images/组件模版.gif" width="550px"/>

## 快速上手

**国内镜像**：https://gitee.com/CloudWise/fly-fish

**Demo环境地址**：https://flyfish-demo.opscloudwise.com:23368


## 本地部署

### 占用端口

| 服务台                                | 端口  |
| ------------------------------------- | ----- |
| FlyfishWeb 端口(nginx 静态资源代理)   | 8089  |
| FlyfishCodeServer(在线编辑器)端口     | 8081  |
| FlyfishServer(主后端服务)端口         | 7001  |
| FlyfishDataServer(数据源管理服务)端口 | 18532 |

### 部署流程

> 推荐使用 doc 目录内 flyfish 部署文档，后续有关部署流程、学习资料、FAQ 等统一放置 doc 目录中管理。

- [01-基础环境准备篇](./doc/01-基础环境准备篇.md)
- [02-code_server 部署篇](./doc/02-code_server部署篇.md)
- [03-FlyFish 平台部署篇](./doc/03-FlyFish平台部署篇.md)

> 或执行一键脚本：

```bash
# CentOS 7.5/7.6  x86-64
# 须使用root账户
# 可在任意有权限的目录下安装 FlyFish
# 这里指定安装目录为 /data/app/
mkdir -p /data/app/
cd /data/app/

git clone -b main https://github.com/CloudWise-OpenSource/FlyFish.git FlyFish
or
git clone -b main https://gitee.com/CloudWise/fly-fish.git FlyFish

cd /data/app/FlyFish
bash flyfish.sh install

# 一键卸载
bash flyfish.sh uninstall

```

## 升级流程

```
# 1、更新代码
$ git checkout main
$ git pull
```

## 学习资料

- **[技术文档](http://docs.aiops.cloudwise.com/zh/flyfish)**
- **[教学视频](http://docs.aiops.cloudwise.com/zh/flyfish/video-course/P1.html)**
- **[官方论坛](http://bbs.aiops.cloudwise.com/t/FlyFish)**

 ## 参与贡献
 您可以点击阅读 **[FlyFish 贡献指南](https://github.com/CloudWise-OpenSource/FlyFish/discussions/140)** 参与贡献，同时由衷感谢那些为 FlyFish 做出贡献的开发者，无论是 issue 问题、文档翻译、代码贡献，FlyFish 的发展离不开你的支持

| | | |
| :--------| :---------| :-------- |
| [maxDwq](https://github.com/maxDwq)| [jincheny](https://github.com/jincheny) | [Neeke](https://github.com/Neeke) |
| [tiger wang](https://github.com/xiaohu12685)| [Jaden.Li](https://github.com/imjaden) | [osramywj](https://github.com/osramywj)|
| [suger](https://github.com/sssssssugar)| [Cary Zhou](https://github.com/YouYe) | [soulferryman](https://github.com/soulferryman) |
| [aiwhj](https://github.com/aiwhj) | [zengqiu](https://github.com/zengqiu) | [Rise.Hao（郝玉鹏)](https://github.com/RiseHao1029) |
| [Markuuuu](https://github.com/Markuuuu) | [郝少聪](https://github.com/laocong) | |


## 开发者社群

_获取更多关于 FlyFish 的技术资料，或加入 FlyFish 开发者交流群，可扫描下方二维码咨询。_

<img src="./doc/images/Susie.png" width="550px"/>
