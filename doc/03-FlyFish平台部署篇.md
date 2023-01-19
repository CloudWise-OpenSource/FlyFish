# FlyFish 平台部署篇

> ⚠️ 包含 server 和 web 部署！部署路径 /data/app/FlyFish/

```bash
#注意事项
mkdir -p /data/app/FlyFish 
mkdir -p /data/app/flyfish
/data/app/FlyFish   是源码包的位置，包括前端源码lcapWeb包，和后端源码dataplatform包
/data/app/flyfish/  是构建打包后的运行包的位置，包括前端运行包lcapWeb，后端运行包flyfishServer、flyfishDevServer、flyfishCodeServer

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
#移动lcapWeb运行包
#FlyFish/lcapWeb
mv lcapWeb /data/app/flyfish

```

2. 修改前端配置

```bash
# FlyFish 目录下执行
# 修改配置
vim lcapWeb/lcapWeb/conf/env-config.js

# code-server访问静态资源时的路径前缀
static_dir = '/data/app/flyfish/lcapWeb'
```

3. nginx 部署前端

```bash
# 以下命令要在根目录下执行
# cd /
# 创建配置文件
nginx 配置文件位置检查
nginx -t
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
  server_name flyfish;
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
    # PRO_PATH 替换成 flyfish 项目路径
    # 例如： /data/app/flyfish/lcapWeb/;
    root PRO_PATH/lcapWeb/;
    index index.html index.htm;
  }

  # code-server
  location ^~ /lcapCode/ {
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
    #部署code—server服务器的ip
    proxy_pass http://ip:8081/;
  }

  # 静态资源代理（cover、png）
  location ^~ /lcapWeb/www/ {
    # PRO_PATH 替换成 flyfish 项目路径
    # 例如： /data/app/flyfish/lcapWeb/www/;
    alias PRO_PATH/lcapWeb/www/;
  }
  #访问可视化组件需要使用
  location ^~ /www/ {
    # PRO_PATH 替换成 flyfish 项目路径
    # 例如： /data/app/flyfish/lcapWeb/www/;
    alias PRO_PATH/lcapWeb/www/;
  }

  # lcapDevServer 反向代理
  location ^~ /flyfish-dev/ {
    proxy_pass http://127.0.0.1:19532/flyfish-dev/;
    # IP 替换成当前主机 IP
    proxy_cookie_domain 0.0.0.0 IP;
  }

  # lcapServer 反向代理
  location ^~ /flyfish/ {
    proxy_pass http://127.0.0.1:19531/flyfish/;
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

> flyfishServer 后端源码
1. 生成并解压压缩包，把解压后的运行包，移动到/data/app/flyfish

```bash
# 服务打包
# 生成 flyfishServer-${version}-${datetime}-${git_commit_id}.tar.gz 安装包
# FlyFish下执行
cd ./dataplatform && mvn clean package -Dmaven.test.skip=true -Dmaven.gitcommitid.skip=true -am -pl flyfishServer

# 解压部署包
# FlyFish/dataplatform/目录下执行
tar -zxvf ./flyfishServer/target/flyfishServer-\$\{git.build.version\}-\$\{git.commit.time\}-\$\{git.commit.id.abbrev\}.tar.gz

#解压后
cd flyfishServer
ls
#可以看到bin、conf、lib、logs、utils目录
#通过maven构建打包，得到了真正的运行的包,把解压后的运行包，移动到/data/app/flyfish
cd ..
mv flyfishServer /data/app/flyfish

```
1. 初始化数据库

```bash
# 执行sql脚本
cd /data/app/FlyFish/dataplatform/flyfishServer/sql
#连接数据库，在数据库sql脚本框中执行sql文件
#或者直接mysql -u用户名 -p
#输入密码

mysql> source SQL文件（init.sql）的绝对路径
#执行完毕后，查看数据库
mysql> show databases;
mysql> use cw_lcap;
#查看表
mysql> show tables;
```


3. 修改配置

```bash
# 修改后端配置: application.properties

spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://${ip}:${port}/cw_lcap?createDatabaseIfNotExist=true&allowMultiQueries=true&useUnicode=true&autoReconnect=true&characterEncoding=utf8&connectionCollation=utf8_general_ci&useSSL=false&&serverTimezone=Asia/Shanghai
spring.datasource.username=${username}
spring.datasource.password=${password}

```

3. 启动服务

```bash
# 以下命令在 /data/app/flyfish/flyfishServer/bin 下执行
# 启动后端服务
./flyfishServer start

# 停止后端服务
./flyfishServer stop

# 重启后端服务
./flyfishServer restart

```

4. 组件开发环境配置

```bash
# 以下命令在 /data/app/flyfish 下执行
# 进入组件开发目录
cd lcapWeb/www/components && npm install

```

> flyfishDevServer 源码部署

1. 生成并解压压缩包

```bash
# 服务打包
# 生成 flyfishDevServer-${version}-${datetime}-${git_commit_id}.tar.gz 安装包
# FlyFish下执行
cd ./dataplatform && mvn clean package -Dmaven.test.skip=true -Dmaven.gitcommitid.skip=true -am -pl flyfishDevServer

# 解压部署包
# dataplatform目录下执行
tar -zxvf ./flyfishDevServer/target/lcapDataServer-\$\{git.build.version\}-\$\{git.commit.time\}-\$\{git.commit.id.abbrev\}.tar.gz

#把构建的运行包移到/data/app/flyfish下
# dataplatform目录下执行
mv ./flyfishDevServer/target/flyfishDevServer /data/app/flyfish
```

2. 修改服务配置文件

```bash
# 进入服务解压目录，执行以下命令
# 在 /data/app/flyfish/flyfishDevServer 目录下执行
vim ./conf/application.properties

# 修改以下配置项
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://${ip}:${port}/cw_lcap?createDatabaseIfNotExist=true&allowMultiQueries=true&useUnicode=true&autoReconnect=true&characterEncoding=utf8&connectionCollation=utf8_general_ci&useSSL=false&&serverTimezone=Asia/Shanghai
spring.datasource.username=${username}
spring.datasource.password=${password}
```
3. 初始化内置组件

```bash
# 初始化内置组件
# /data/app/flyfish 目录下执行
cd flyfishDevServer/utils
java -jar -Dspring.datasource.url="jdbc:mysql://${IP}:${port}/cw_lcap?createDatabaseIfNotExist=true&allowMultiQueries=true&useUnicode=true&autoReconnect=true&characterEncoding=utf8&connectionCollation=utf8_general_ci&useSSL=false&&serverTimezone=Asia/Shanghai" -Dspring.datasource.username="${username}" -Dspring.datasource.password="${password}" 
/data/app/flyfish/flyfishDevServer/utils/initResource-0.0.1-SNAPSHOT.jar

注意事项：执行java -jar前检查目录
/data/app/flyfish/lcapWeb
/data/app/flyfish/flyfishDevServer/utils

```
4. 启动服务

```bash
# 以下命令在 flyfish/flyfishDevServer/bin 下执行
# 启动后端服务
./flyfishDevServer start

# 停止后端服务
./flyfishDevServer stop

# 重启后端服务
./flyfishDevServer restart

# 查看日志验证服务是否启动
# 在以下目录下执行
# FlyFish/flyfishDevServer/
tail -200f ./logs/flyfishDevServer/flyfishDevServer.info.log
```

### 三、验证

> 防火墙（安全组）开放 8089 端口。

访问：http:ip:8089 注册、登录、开发组件大屏，推荐您使用最新版本 Chrome 浏览器访问飞鱼平台。

- 初始账号：admin
- 密码：utq#SpV!
