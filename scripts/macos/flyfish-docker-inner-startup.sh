#!/bin/bash

#启动redis
/opt/redis-5.0.3/src/redis-server /opt/redis-5.0.3/redis.conf

#启动mysql
/usr/local/mysql/support-files/mysql.server start

_HOSTNAME="127.0.0.1"
_PORT="3306"
_USERNAME="Rootmaster"
_PASSWORD="Rootmaster@777"
_DBNAME="flyfish"

#创建数据库
mysql -u${_USERNAME} -p${_PASSWORD} -e "create database IF NOT EXISTS ${_DBNAME};"
