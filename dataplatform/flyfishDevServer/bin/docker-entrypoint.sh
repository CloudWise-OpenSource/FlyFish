#!/bin/bash

#获取项目路径，容器环境约定为/data/app/工程名
APP_HOME=$(cd `dirname $0`/../&&pwd)
APP_NAME="flyfishDevServer"

# 启动应用程序
cd $APP_HOME
bash bin/$APP_NAME start -f