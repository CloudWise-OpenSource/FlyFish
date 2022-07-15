#!/bin/bash

#获取项目路径，容器环境约定为/data/app/工程名
APP_HOME=$(cd `dirname $0`/../&&pwd)
APP_NAME="lcapWeb"

# 修改启动脚本占位符
sed -i -e "s#\${CW_LOCAL_IP}#$CW_LOCAL_IP#g" \
    -e "s#\${CW_INSTALL_APP_DIR}#$CW_INSTALL_APP_DIR#g" \
    -e "s#\${CW_LOCAL_PORT}#$CW_LOCAL_PORT#g" \
    -e "s#\${CW_YAPI_SERVER_PORT}#$CW_YAPI_SERVER_PORT#g" \
    -e "s#\${CW_CODE_SERVER_PORT}#$CW_CODE_SERVER_PORT#g" ${APP_HOME}/conf/env-config.js

mkdir -pv /data/logs/tengine
ln -sfn /data/app/lcapWeb/* /data/app/tengine/html
/data/app/tengine/sbin/nginx -p /data/app/tengine -c /data/app/tengine/conf/nginx.conf