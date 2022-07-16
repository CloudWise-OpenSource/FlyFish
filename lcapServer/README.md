# FlyFish

FlyFish server repo
## 手动部署

### 部署code-server(在线编辑器)
git clone https://git.cloudwise.com/FlyFish/code-server.git
#### 进入目录
```
cd code-server
```
#### 切换分支
```
git checkout feature-flyfish-v2.0
```

#### 修改配置文件
```
vi config.yaml  修改端口8080为8081，ip为0.0.0.0不需要改动
```
#### 启动在线编辑器
```
nginx: npm run linux-start
mac: npm run linux-mac
```

### 部署服务

#### 进入目录&&安装依赖
```
cd flyfish2.0-server
npm i
```

### 修改配置文件
```
vi config.default.js  修改所有ip为部署机器ip
vi config.development.js  修改所有ip为部署机器ip
```
### 初始化数据库
```
npm run init-development-database(输出success即为成功)
```
### 启动服务
```
npm run development
```
### 部署组件开发环境
```
#移动到开发环境到根目录【config.{dev}.js可配置，默认根目录】
cd /
git clone https://git.cloudwise.com/FlyFish/flyfish2.0-www.git www

#修改配置文件
vi web/screen/config/env.js  #apiDomain修改为后端服务ip和port
```

### 访问
```
http://127.0.0.1:7001
```

## 一键部署 【待完善】
```bash
$ chmod +x startup.sh
$ ./startup.sh
$ open http://localhost:7001/
```
