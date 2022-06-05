# FlyFish 平台部署篇

> ⚠️ 包含 server 和 web 部署！部署路径 /data/app/FlyFish/

```bash
cd /data/app/FlyFish
# 切换 npm 源
npm config set registry https://registry.npmmirror.com
```

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

# hostname 修改为当前主机IP
# hostname = IP
# vscodeFolderPrefix 修改为以下路径
# vscodeFolderPrefix: '/data/app/FlyFish/lcapWww'

```

3. nginx 部署前端

```bash
# 以下命令要在根目录下执行
# cd /
# 创建配置文件
nginx 配置文件位置检查
/usr/local/nginx/sbin/nginx -t
nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok
nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful

touch /etc/nginx/conf.d/FlyFish-2.1.0.conf
or
touch /usr/local/nginx/conf/conf.d/FlyFish-2.1.0.conf

# 添加配置
vim /etc/nginx/conf.d/FlyFish-2.1.0.conf
or
vim /usr/local/nginx/conf/conf.d/FlyFish-2.1.0.conf

# 复制并修改以下配置到 FlyFish-2.1.0.conf
server {
  listen       8089;
  server_name  FlyFish-2.1.0;
  default_type application/octet-stream;
  client_max_body_size 100m;

  # lcapServer 反向代理
  location ^~ /api/ {
    proxy_pass http://0.0.0.0:7001/;
    # IP 替换成当前主机IP
    proxy_cookie_domain 0.0.0.0 IP;
  }

  # lcapWeb
  location / {
    root  /data/app/FlyFish/lcapWeb/dist/;
    index  index.html index.htm;
  }
}

# 重载 nginx
systemctl restart nginx
or
/usr/local/nginx/sbin/nginx -s reload

# 验证前端部署是否成功
# 可以访问到前端页面
http://ip:8089

```

### 二、后端部署

> lcapServer 后端源码

1. 安装依赖

```bash
### 安装主服务依赖
cd /data/app/FlyFish/lcapServer/
npm install --unsafe-perm=true --allow-root

### 安装初始化脚本依赖
cd /data/app/FlyFish/lcapServer/changelog
npm install

### 安装组件开发依赖
cd /data/app/FlyFish/lcapWww/components
npm install
```

2. 初始化数据库

```bash
# 初始化数据库
cd /data/app/FlyFish/lcapServer/
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
# const staticDir = '/data/app/FlyFish/lcapWww'
# serverIp 修改为 0.0.0.0
# const serverIp = '0.0.0.0';


# 启动后端服务
npm run development

# 停止后端服务
npm run stop

```

3. 组件开发环境配置

```bash
# 以下命令在 lcapWww 下执行
# 进入组件开发目录
cd /data/app/FlyFish/lcapWww/components

# 安装依赖
npm install

# 修改大屏应用配置
vim /data/app/FlyFish/lcapWww/web/screen/config/env.js

# 修改为当前主机IP
# const apiDomain = 'http://IP:7001';
# 例如：const apiDomain = 'http://127.0.0.1:7001';
```

### 三、验证

> 防火墙要开放对应端口，默认 code-server:8081、前端: 8089、server: 7001、mongodb:27017

访问：http:ip:8089 注册、登录、开发组件大屏。

- 初始账号：admin
- 密码：utq#SpV!
