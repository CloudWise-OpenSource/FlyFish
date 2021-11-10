#!/bin/bash

green() {
    echo -e "\033[;32m${1}\033[0m"
}

#启动redis
/opt/redis-5.0.3/src/redis-server /opt/redis-5.0.3/redis.conf

#启动mysql
/usr/local/mysql/support-files/mysql.server start

_HOSTNAME="127.0.0.1"
_PORT="3306"
_USERNAME="Rootmaster"
_PASSWORD="Rootmaster@777"
_DBNAME="flyfish"

green "依赖安装开始"
npm install --registry=https://r.npm.taobao.org
green "依赖安装完成"

#创建数据库
mysql -u${_USERNAME} -p${_PASSWORD} -e "create database IF NOT EXISTS ${_DBNAME};"

#初始化数据库
npm run init_database_dev

pm2 monit
