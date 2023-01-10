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
# lcapWeb 安装依赖
# FlyFish 目录下执行
cd lcapWeb && npm install

# 打包
npm run build

```

2. 修改前端配置

```bash
# FlyFish 目录下执行
# 修改配置
vim lcapWeb/lcapWeb/conf/env-config.js

# code-server访问静态资源时的路径前缀
static_dir = '/data/app/FlyFish/lcapWeb/lcapWeb'

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

touch /etc/nginx/conf.d/flyfish.conf
or
touch /usr/local/nginx/conf/conf.d/flyfish.conf

# 添加配置
vim /etc/nginx/conf.d/flyfish.conf
or
vim /usr/local/nginx/conf/conf.d/flyfish.conf

# 复制并修改以下配置到 flyfish.conf
map $http_upgrade $connection_upgrade {
  default upgrade;
  '' close;
}

server {
  listen 8089;
  server_name FlyFish;
  default_type application/octet-stream;
  client_max_body_size 100m;

  gzip  on;
  gzip_min_length 1k;
  gzip_vary on;
  gzip_disable "MSIE [1-6]\.";
  gzip_types text/plain application/javascript application/x-javascript text/javascript text/xml text/css;
  gzip_comp_level 4;
  gzip_buffers 4 16k;

  # lcapWeb
  location / {
    # PRO_PATH 替换成 FlyFish 项目路径
    # 例如： data/app/FlyFish/lcapWeb/lcapWeb/;
    root PRO_PATH/lcapWeb/lcapWeb/;
    index index.html index.htm;
  }

  # code-server
  location ^~ /lcapCode/ {
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
    proxy_pass http://127.0.0.1:8081/;
  }

  # 静态资源代理
  location /lcapWww/ {
    # PRO_PATH 替换成 FlyFish 项目路径
    # 例如： data/app/FlyFish/lcapWeb/lcapWeb/www/;
    alias PRO_PATH/lcapWeb/lcapWeb/www/;
  }

  # 静态资源代理
  location /lcapWeb/ {
    # PRO_PATH 替换成 FlyFish 项目路径
    # 例如： data/app/FlyFish/lcapWeb/lcapWeb/www/;
    alias PRO_PATH/lcapWeb/lcapWeb/;
  }

  # lcapServer 反向代理
  location ^~ /api/ {
    proxy_pass http://0.0.0.0:7001/;
    # IP 替换成当前主机 IP
    proxy_cookie_domain 0.0.0.0 IP;
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
# 安装主服务依赖
# FlyFish 目录下执行
cd lcapServer/ && npm install

# 安装初始化脚本依赖
# FlyFish 目录下执行
cd lcapServer/changelog && npm install

```

2. 初始化数据库

```bash
# 初始化数据库
# FlyFish 目录下执行
cd lcapServer/changelog && NODE_ENV=development node scripts/initDatabase.js

# 提示以下内容意味初始化成功
# init menu success
# init role success
# init user success
# init component_categories success

```

3. 修改配置并启动后端服务

```bash
# 修改后端配置
# 无特殊需求，使用默认配置即可。
# FlyFish 目录下执行
cd lcapServer && vim ./config/config.development.js

staticDir -> 静态目录 eg:  /data/app/lcapWeb
commonDirPath -> 组件开发目录, 默认www, 配置staticDir使用，eg: /data/app/lcapWeb/lacpWeb/www
dataBaseDir -> 数据目录 eg:  /data/appData
logsBaseDir -> 日志目录 eg:  /data/logs

serverIp -> 服务ip eg: '127.0.0.1'
serverPort -> 服务port eg: 7001

mongodbIp -> monggodbIp eg: '127.0.0.1'
mongodbPort -> mongodbPort eg: '127.0.0.1'

// 非必须 如mongodb没有username和password，请使用//将username和password注释掉
mongodbUsername -> mongodbUsername eg: 'admin'
mongodbPassword -> mongodbPassword eg: 'admin'

// mongodb没有username和password，使用第一个url配置
config.mongoose = {
    clients: {
      flyfish: {
        // url: `mongodb://${mongodbIp}:${mongodbPort}/flyfish`,
        url: `mongodb://${mongodbUsername}:${mongodbPassword}@${mongodbIp}:${mongodbPort}/flyfish?authSource=test`,
        options: {
          useUnifiedTopology: true,
        },
      },
    },
  };

// chrome 端口，用于自动生成组件、应用缩略图服务，默认9222
chromePort -> chrome无头浏览器port eg: 9222
```

3. 解压缩略图依赖

```bash
# 以下命令在 FlyFish 下执行
cd lcapServer/lib/chrome-linux && unzip chrome-core.zip

```

4. 启动服务

```bash
# 以下命令在 FlyFish/lcapServer 下执行
# 启动后端服务
npm run development

# 停止后端服务
npm run stop

```

5. 组件开发环境配置

```bash
# 以下命令在 FlyFish 下执行
# 进入组件开发目录
cd lcapWeb/lcapWeb/www/components && npm install

```

> lcapDataserver 源码部署

1. 生成并解压压缩包压缩包

```bash
# 服务打包
# 生成 lcapDataServer-${version}-${datetime}-${git_commit_id}.tar.gz 安装包
# FlyFish下执行
cd ./lcapDataServer && mvn clean package -Dmaven.test.skip=true -Dmaven.gitcommitid.skip=true -am -pl lcap-server

# 解压部署包
# FlyFish/lcapDataServer 目录下执行
tar -zxvf ./lcap-server/target/lcapDataServer-\$\{git.build.version\}-\$\{git.commit.time\}-\$\{git.commit.id.abbrev\}.tar.gz

# 解压后生成的核心文件目录如下：
cd ./lcap-server/target/lcapDataServer
ll

# 总用量 32
# drwxrwxr-x  2 kid kid    56 7月  18 21:31 bin
# drwxrwxr-x  3 kid kid   107 7月  18 21:41 conf
# drwxrwxr-x  2 kid kid 12288 7月  18 21:25 lib
```

2. 修改服务配置文件

```bash
# 进入服务解压目录，执行以下命令
# 在 FlyFish/lcapDataServer/lcap-server/target/lcapDataServer 目录下执行
vim ./conf/application.properties

# 修改以下配置项
# 应用/组件导入导出相关配置，导入导出时需要用到web端的应用/组件源码,所以请设置对应的路径
file.basepath=/data/app/FlyFish/lcapWeb/www
application_basepath=/data/app/FlyFish/lcapWeb/lcapWeb/www/applications
component_basepath=/data/app/FlyFish/lcapWeb/lcapWeb/www/components
component_down_tmp_basepath=/data/appData/lcapDataServer/down_tmp_basepath
component_upload_tmp_basepath=/data/appData/lcapDataServer/upload_tmp_basepath
config_filename=config_filename

# mongo数据源配置
spring.application.name=lcapDataServer
spring.main.allow-bean-definition-overriding=true
spring.data.mongodb.host=${IP}
spring.data.mongodb.port=${PORT}
# 如mongodb没有username和password，请使用#将username和password注释掉
spring.data.mongodb.username=${USERNAME}
spring.data.mongodb.password=${PASSWORD}
spring.data.mongodb.database=flyfish
spring.data.mongodb.authenticationDatabase=test
spring.servlet.multipart.max-file-size=1024MB
spring.servlet.multipart.max-request-size=1024MB
```

3. 启动服务

```bash
# 启动 lcapDataServer 服务
./bin/lcapDataServer start

# 停止 lcapDataServer 服务
./bin/lcapDataServer stop

# 查看日志验证服务是否启动
# 在以下目录下执行
# FlyFish/lcapDataServer/lcap-server/target/lcapDataServer
tail -200f ./logs/lcapDataServer/lcap-dataserver.info.log
```

### 三、验证

> 防火墙（安全组）开放 8089 端口。

访问：http:ip:8089 注册、登录、开发组件大屏，推荐您使用最新版本 Chrome 浏览器访问飞鱼平台。

- 初始账号：admin
- 密码：utq#SpV!
