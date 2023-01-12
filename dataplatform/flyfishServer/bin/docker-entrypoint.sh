#!/bin/bash

#获取项目路径，容器环境约定为/data/app/工程名
APP_HOME=$(cd `dirname $0`/../&&pwd)
APP_NAME="flyfishServer"

sed -i -e "s#\${CW_RUN_USER}#$CW_RUN_USER#g" \
    -e "s#\${CW_LOCAL_IP}#$CW_LOCAL_IP#g" \
    -e "s#\${CW_SERVER_NAME}#$CW_SERVER_NAME#g" \
    -e "s#\${CW_SERVICE_PORT}#$CW_SERVICE_PORT#g" \
    -e "s#\${CW_INSTALL_APP_DIR}#$CW_INSTALL_APP_DIR#g" \
    -e "s#\${CW_INSTALL_LOGS_DIR}#$CW_INSTALL_LOGS_DIR#g" \
    -e "s#\${CW_INSTALL_DATA_DIR}#$CW_INSTALL_DATA_DIR#g" \
    -e "s#\${CW_NACOS_SERVER}#$CW_NACOS_SERVER#g" \
    -e "s#\${CW_NACOS_USERNAME}#$CW_NACOS_USERNAME#g" \
    -e "s#\${CW_NACOS_PASSWORD}#$CW_NACOS_PASSWORD#g" \
    -e "s#\${CW_NACOS_NAMESPACE}#$CW_NACOS_NAMESPACE#g" \
    -e "s#\${CW_JVM_HEAP_SIZE}#$CW_JVM_HEAP_SIZE#g" ${APP_HOME}/bin/lcapServer

sed -i -e "s#\${CW_INSTALL_APP_DIR}#$CW_INSTALL_APP_DIR#g" \
    -e "s#\${CW_INSTALL_LOGS_DIR}#$CW_INSTALL_LOGS_DIR#g" \
    -e "s#\${CW_INSTALL_DATA_DIR}#$CW_INSTALL_DATA_DIR#g"  ${APP_HOME}/conf/nacos/lcap/lcap-common-default.properties

# 启动应用程序
cd $APP_HOME
bash bin/$APP_NAME start -f