# LCAP 平台部署篇

> ⚠️ 包含 server 和 web 部署！部署路径 data/app/fly-fish/
> 防火墙要开放对应端口，默认 code-server:8081、前端: 8089、server: 7001、mongodb:27017

### 一、前端源码打包部署

> lcapWeb 前端源码

1. 前端源码打包

```bash
# lcapWeb 目录
cd lcapWeb

# 安装依赖
npm install

# 打包
npm run build

```

2. 修改前端配置

```bash
# 修改配置
vim dist/conf/env-config.js

# vscodeFolderPrefix 修改为以下路径
# vscodeFolderPrefix: '/data/app/fly-fish/lcapWww'

```

3. nginx 部署前端

```bash
# 以下命令要在根目录下执行
# cd /
# 创建配置文件
touch /etc/nginx/conf.d/FlyFish-2.1.0.conf

# 添加配置
vim /etc/nginx/conf.d/FlyFish-2.1.0.conf

# 复制并修改以下配置到 FlyFish-2.1.0.conf
server {
  listen       8089;
  server_name  FlyFish-2.1.0;
  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  # lcapServer 反向代理
  location ^~ /api/ {
    # IP 替换成当前主机IP
    proxy_pass http://IP:7001/;
  }

  # lcapWeb
  location / {
    root  /data/app/fly-fish/lcapWeb/dist/;
    index  index.html index.htm;
  }
}

# 重载 nginx
systemctl restart nginx

# 验证前端部署是否成功
# 可以访问到前端页面
http://ip:8089

```

### 二、后端部署

> lcapServer 后端源码

1. 初始化数据库

```bash
# 进入目录
cd /data/app/fly-fish/lcapServer/changelog

# 安装依赖
npm install

# 初始化数据库
# 以下命令在 lcapServer 目录下执行
npm run init-development-database

# 提示以下内容意味初始化成功
# init menu success
# init role success
# init user success
# init component_categories success

```

2. 修改配置并启动后端服务

```bash
# 修改后端配置
# 以下命令在 lcapServer 下执行
vim ./config/config.development.js

# staticDir 修改为以下路径
# const staticDir = '/data/app/fly-fish/lcapWww'
# const serverIp = 'IP';

# 安装依赖
# 这里推荐使用 yarn 或者 cnpm 安装依赖
# 社区小伙伴已验证 yarn 安装只需 52s 左右
# npm 需要十分钟
# npm install -g yarn
yarn install
或
npm install

# 启动后端服务
npm run development

# 停止后端服务
npm run stop

```

3. 组件开发环境配置

```bash
# 以下命令在 lcapWww 下执行
# 进入组件开发目录
cd components

# 安装依赖
npm install
```

### 三、验证

访问：http:ip:8089 注册、登录、开发组件大屏。
