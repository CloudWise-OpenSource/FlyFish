#!/bin/bash

#获取项目路径，容器环境约定为/data/app/工程名
APP_HOME=$(cd `dirname $0`/../&&pwd)
APP_NAME="lcapServer"

sed -i -e "s#\${CW_LOCAL_IP}#$CW_LOCAL_IP#g" \
    -e "s#\${CW_MAIN_SERVER_IP}#$CW_MAIN_SERVER_IP#g" \
    -e "s#\${CW_INSTALL_APP_DIR}#$CW_INSTALL_APP_DIR#g" \
    -e "s#\${CW_YAPI_SERVER_IP}#$CW_YAPI_SERVER_IP#g" \
    -e "s#\${CW_YAPI_SERVER_PORT}#$CW_YAPI_SERVER_PORT#g" \
    -e "s#\${CW_MONGODB_IP}#$CW_MONGODB_IP#g" \
    -e "s#\${CW_MONGODB_PORT}#$CW_MONGODB_PORT#g" \
    -e "s#\${CW_MONGODB_USERNAME}#$CW_MONGODB_USERNAME#g" \
    -e "s#\${CW_MONGODB_PASSWORD}#$CW_MONGODB_PASSWORD#g" \
    -e "s#\${CW_DOCP_SERVER_IP}#$CW_DOCP_SERVER_IP#g" \
    -e "s#\${CW_DOCP_SERVER_PORT}#$CW_DOCP_SERVER_PORT#g" ${APP_HOME}/config/config.docp.js

sed -i -e "s#\${CW_RUN_USER}#$CW_RUN_USER#g" \
    -e "s#\${CW_LOCAL_IP}#$CW_LOCAL_IP#g" \
    -e "s#\${CW_INSTALL_APP_DIR}#$CW_INSTALL_APP_DIR#g" \
    -e "s#\${CW_INSTALL_LOGS_DIR}#$CW_INSTALL_LOGS_DIR#g" \
    -e "s#\${CW_INSTALL_DATA_DIR}#$CW_INSTALL_DATA_DIR#g" \
    -e "s#\${CW_SERVICE_PORT}#$CW_SERVICE_PORT#g"  ${APP_HOME}/bin/${APP_NAME}

sed -i -e "s#\${SERVICE_NAME}#$SERVICE_NAME#g" \
    -e "s#\${CW_INSTALL_APP_DIR}#$CW_INSTALL_APP_DIR#g"  ${APP_HOME}/scripts/init.py

sed -i -e "s#\${CW_MAIN_SERVER_PORT}#$CW_MAIN_SERVER_PORT#g" ${APP_HOME}/package.json

cd $APP_HOME
bash bin/$APP_NAME start -f