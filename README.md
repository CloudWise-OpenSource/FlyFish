# Solution-Platform-Server

## 一句话了解我

通过简易的方式快速创建数据模型，通过拖拉拽的形式，快速生成一套解决方案。

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

## 安装

### 分支说明

(说明主分支、开发分支或其他分支作用)

【说明: [xxx: 具体功能描述] eg: feature_refactor_config】

| 分支        | 说明        |
| ----------- | ----------- |
| master      | 主分支      |
| dev         | 测试分支    |

### 环境依赖

(描述依赖项，及其安装/配置方式)

| 环境  | 说明      |
| ----- | --------- |
| node  | >= 8.9.3  |
| redis | >= 4.0.8  |
| mysql | >= 5.6.38 |

### 部署
描述依赖项，及其安装/配置方式)

| 环境  | 说明      |
| ----- | --------- |
| node  | >= 8.9.3  |
| redis | >= 4.0.8  |
| mysql | >= 5.6.38 |

1、进入项目目录
```
cd flyfish
```
2、修改mysql、redis配置文件ip【如本地部署无需修改】
```
vim src/common/config/adapter.js
```
3、修改code-server配置文件ip【如本地部署无需修改】
```
vim code-server/linux/out/browser/pages/vscode.browserified.js
```

4、build dockerfile
```
docker build -t flyfish .
```

5、run docker
```
docker run -itd --name flyfish -p 8364:8364 -p 3306:3306 -p 6379:6379 -p 8081:8081 flyfish
```

6、使用
```
浏览器访问: http://127.0.0.1:8364
```
## 服务器管理

```
docker exec -it flyfish /bin/bash
```

## 升级
1、更新代码
```
git checkout master
git pull
```
2、更新容器
```
重复【安装】步骤
```
