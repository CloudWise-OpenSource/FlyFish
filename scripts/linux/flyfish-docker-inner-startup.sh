#!/bin/bash

#启动redis
/opt/redis-5.0.3/src/redis-server /opt/redis-5.0.3/redis.conf

#启动mysql
/usr/local/mysql/support-files/mysql.server start

#启动code-server
cd code-server && npm run linux-start && cd ../

#初始化数据库
HOSTNAME="127.0.0.1"  #数据库信息
PORT="3306"
USERNAME="Rootmaster"
PASSWORD="Rootmaster@777"
DBNAME="flyfish"  #数据库名称

#创建数据库
create_db_sql="create database IF NOT EXISTS ${DBNAME}"
mysql -u${USERNAME} -p${PASSWORD} -e "${create_db_sql}"

npm run init_database_dev

#启动服务
npm run dev