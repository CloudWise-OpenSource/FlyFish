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
vim lcapWeb/lcapWeb/conf/env-config.js

# hostname 修改为当前主机IP
hostname = IP
# web部署端口
fontPort = 8089  
# server端部署的端口
backPort = 7001
# code-server访问静态资源时的路径前缀
static_dir = '/data/app/FlyFish'
# 静态资源的代理路径，与nginx配置要匹配
common_dir = 'lcapWeb/www'
# api请求前缀，与nginx配置匹配
apiDomain :'/api'
# java服务api请求前缀，与nginx配置匹配
javaApiDomain : '/lcap-data-server'
# code-server部署端口
code_port = 3001
# 组件平台是否拆分，默认为false
isSplitComponentModule : false
# 是否独立部署api,默认为false
onlyApiModule : false
# 组件平台接口api的前缀，在isSplitComponentModule为false时，与apiDomain保持一致
componentSplitApiPrefix : '/api'

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
  # lcapServer 反向代理
  location ^~ /lcap-data-server/ {
    proxy_pass   http://0.0.0.0:18532/;
  }
  # 静态资源代理
  location /lcapWeb/www {
    root  /data/app/FlyFish;
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
cd lcapServer/
npm install --unsafe-perm=true --allow-root

### 安装初始化脚本依赖
cd lcapServer/changelog
npm install
```

2. 初始化数据库

```bash
# 初始化数据库
cd lcapServer/changelog
NODE_ENV=development node scripts/initDatabase.js

# 提示以下内容意味初始化成功
# init menu success
# init role success
# init user success
# init component_categories success

```

3. 修改配置并启动后端服务

```bash
# 修改后端配置
cd lcapServer
vim ./config/config.development.js

staticDir -> 静态目录 eg:  /data/app/lcapWeb
commonDirPath -> 组件开发目录, 默认www, 配置staticDir使用，eg: /data/app/lcapWeb/www
dataBaseDir -> 数据目录 eg:  /data/appData
logsBaseDir -> 日志目录 eg:  /data/logs

serverIp -> 服务ip eg: '127.0.0.1'
serverPort -> 服务port eg: 7001

mongodbIp -> monggodbIp eg: '127.0.0.1'
mongodbPort -> mongodbPort eg: '127.0.0.1'

// 非必须
mongodbUsername -> mongodbUsername eg: 'admin'
mongodbPassword -> mongodbPassword eg: 'admin'

// chrome 端口，用于自动生成组件、应用缩略图服务，默认9222
chromePort -> chrome无头浏览器port eg: 9222
```
 
3. 修改生成缩略图配置
```
cd lcapServer
vim lib/chrome-linux/fonts/fonts.conf

修改${CW_INSTALL_CHROME_DIR}为chrome-linux的绝对路径（有两处，注意都要修改掉）

eg: <dir>/data/app/lcapServer/lib/chrome-linux/fonts/fonts</dir>
```

4. 启动服务
```
# 启动后端服务
npm run development

# 停止后端服务
npm run stop

```

4. 组件开发环境配置

```bash
# 以下命令在 lcapWww 下执行
# 进入组件开发目录
cd lcapWeb/lcapWeb/www/components

# 安装依赖
npm install

# 修改大屏应用配置
vim /data/app/FlyFish/lcapWww/web/screen/config/env.js

# 修改为当前主机IP
# const apiDomain = 'http://IP:7001';
# 例如：const apiDomain = 'http://127.0.0.1:7001';
```

> lcapDataserver源码部署

1. 生成并解压压缩包压缩包
```bash
# 服务打包
cd ./lcapDataserver && mvn clean package -Dmaven.test.skip=true -am -pl lcap-server
# 生成 lcapDataServer-${version}-${datetime}-${git_commit_id}.tar.gz 安装包

# 将压缩包上传到服务器，解压缩
tar -zxvf ./lcapDataServer-${version}-${datetime}-${git_commit_id}.tar.gz

# 解压后生成的核心文件目录如下：
[root@host233 app]# cd ./lcapDataServer
[root@host233 lcapDataServer]# ll
总用量 32
drwxrwxr-x  2 kid kid    56 7月  18 21:31 bin
drwxrwxr-x  3 kid kid   107 7月  18 21:41 conf
drwxrwxr-x  2 kid kid 12288 7月  18 21:25 lib
```

2. 修改服务配置文件
```bash
# 进入服务解压目录，执行以下命令
vim ./conf/application.properties

# 修改以下配置项

# 应用/组件导入导出相关配置，导入导出时需要用到web端的应用/组件源码,所以请设置对应的路径
file.basepath=/data/app/portalWeb/lcapWeb/www
application_basepath=/data/app/portalWeb/lcapWeb/www/applications
component_basepath=/data/app/portalWeb/lcapWeb/www/components
component_down_tmp_basepath=/data/appData/lcapDataServer/down_tmp_basepath
component_upload_tmp_basepath=/data/appData/lcapDataServer/upload_tmp_basepath
config_filename=config_filename

# mongo数据源配置
spring.application.name=lcapDataServer
spring.main.allow-bean-definition-overriding=true
spring.data.mongodb.host=${IP}
spring.data.mongodb.port=${PORT}
spring.data.mongodb.username=${USERNAME}
spring.data.mongodb.password=${PASSWORD}
spring.data.mongodb.database=flyfish
spring.data.mongodb.authenticationDatabase=test
spring.servlet.multipart.max-file-size=1024MB
spring.servlet.multipart.max-request-size=1024MB
```

### 三、验证

> 防火墙要开放对应端口，默认 code-server:8081、前端: 8089、lcapServer: 7001、lcapDataServer：8099、mongodb:27017

访问：http:ip:8089 注册、登录、开发组件大屏。

- 初始账号：admin
- 密码：utq#SpV!
