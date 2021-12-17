<div align="center">
  <a href="https://github.com/CloudWise-OpenSource/FlyFish"><img src="https://cdn.jsdelivr.net/gh/CloudWise-OpenSource/FlyFish/flyfishicon.png" alt="flyfish" /></a>
  <div align="center">
    <a href="https://github.com/CloudWise-OpenSource/FlyFish/pulls"><img src="https://badgen.net/github/prs/CloudWise-OpenSource/FlyFish" /></a>
    <a href="https://github.com/CloudWise-OpenSource/FlyFish/blob/main/LICENSE"><img src="https://badgen.net/github/license/CloudWise-OpenSource/FlyFish" /></a>
    <a href="https://github.com/CloudWise-OpenSource/FlyFish/releases"><img src="https://badgen.net/github/release/CloudWise-OpenSource/FlyFish" /></a>
  </div>
</div>

# 飞鱼（FlyFish）

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
- [内网部署文档](http://docs.aiops.cloudwise.com/zh/flyfish/deploy.html)
- [AIOps社区](https://www.cloudwise.ai/#/datalaker/dashboard)

## 安装说明

### 分支说明

| 分支        | 说明        |
| ----------- | ----------- |
| master      | 主分支      |
| dev         | 测试分支    |

### 环境依赖

| 环境  | 说明      |
| ----- | --------- |
| node  | >= 8.9.3  |
| redis | >= 4.0.8  |
| mysql | >= 5.6.38 |

### 部署流程
```
包含三个服务：
visual_component_platform：组件开发平台
solution_platform：应用平台
code_server: web编辑器服务

需要分别部署, 部署文档见：
doc/solution_platform部署流程.md
doc/visual_component_platform部署流程.md
doc/code_server部署流程.md
```
## 升级流程

```
# 1、更新代码
$ git checkout master
$ git pull

# 2、停止并删除容器
$ pm2 restart ${id}

```

## 欢迎加入

*获取更多关于FlyFish的技术资料，或加入FlyFish开发者交流群，可扫描下方二维码咨询。*

<img src="https://gitee.com/CloudWise/fly-fish/raw/main/doc/images/Susie.png" width="550px"/>

