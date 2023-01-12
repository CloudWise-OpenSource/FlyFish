#!/bin/bash

##############
#使用方法：
#在项目根目录下执行：./deploy.sh lcapServer 10.2.3.181
# 参数1：服务名，lcapServer/lcapDevServer
# 参数2：服务ip
###############

serverName=$1
ip=$2
port=$3
jarName=

CW_RUN_USER="commonuser"
# 该节点通信地址
CW_LOCAL_IP=$ip
CW_SERVICE_PORT=
CW_INSTALL_APP_DIR="/data/app"
CW_INSTALL_LOGS_DIR="/data/logs"
CW_INSTALL_DATA_DIR="/data/appData"

CW_NACOS_SERVER="$ip:18117"
CW_NACOS_USERNAME="nacos"
CW_NACOS_PASSWORD="kbRmjCIED/vXbOjxUudm649N+KSUmy/JpFm53hwPH0hTwEcBYxy3jl72Hw5C4dJHeoIBKaQpa1Vp+4s/iIEQVAbRlHvZ7EATKCidTbpSbP1/ceg18fQFBeSslNmnOZ8rvmoWZkQ/NPs6WmEXCpyGr6z1/vSyJwhtdpnYt8fSlDg="
CW_NACOS_NAMESPACE="PROD"

CW_JVM_HEAP_SIZE="512m"


function getServerPortInfo() {
  case $serverName in
    "lcapServer")
      CW_SERVICE_PORT=18531
    ;;
    "lcapDevServer")
      CW_SERVICE_PORT=18534
    ;;
    *)
      CW_SERVICE_PORT=18531
    ;;
  esac
}

function package() {
  echo "开始打包>>>>>>>>>>>>>>>>>>>>"
  mvn clean package -Dmaven.test.skip=true -Dfile.encoding=UTF-8 -DassemblyName=assembly2 -am -pl $serverName
  echo "打包完成>>>>>>>>>>>>>>>>>>>>"
}

function upload() {
  jarList=`ls $serverName/target | grep $serverName | grep '.tar.gz'`
  jarName=${jarList[0]}

  echo "开始上传>>>>>>>>>>>>>>>>>>>>"
  scp -P 36000 $serverName/target/$jarName  root@$ip:/data/app/$jarName
  echo "上传完成--^_^--"
}

function deploy(){
  step1="cd /data/app && rm -fr $serverName && tar -xzvf $jarName >/dev/null && chown -R $CW_RUN_USER:$CW_RUN_USER $serverName \n"
  step2="sed -i \
         -e 's#\\\${CW_RUN_USER}#$CW_RUN_USER#g' \
         -e 's#\\\${CW_LOCAL_IP}#$CW_LOCAL_IP#g' \
         -e 's#\\\${CW_SERVICE_PORT}#$CW_SERVICE_PORT#g' \
         -e 's#\\\${CW_INSTALL_APP_DIR}#$CW_INSTALL_APP_DIR#g' \
         -e 's#\\\${CW_INSTALL_LOGS_DIR}#$CW_INSTALL_LOGS_DIR#g' \
         -e 's#\\\${CW_INSTALL_DATA_DIR}#$CW_INSTALL_DATA_DIR#g' \
         -e 's#\\\${CW_NACOS_SERVER}#$CW_NACOS_SERVER#g' \
         -e 's#\\\${CW_NACOS_USERNAME}#$CW_NACOS_USERNAME#g' \
         -e 's#\\\${CW_NACOS_PASSWORD}#$CW_NACOS_PASSWORD#g' \
         -e 's#\\\${CW_NACOS_NAMESPACE}#$CW_NACOS_NAMESPACE#g' \
         -e 's#\\\${CW_JVM_HEAP_SIZE}#$CW_JVM_HEAP_SIZE#g' \
          $serverName/bin/$serverName \n"
  step3="$serverName/bin/$serverName restart \n"
  /usr/bin/expect -c "
  spawn ssh root@$ip -p36000
  send \"$step1\"
  send \"$step2\"
  send \"$step3\"
  send \"exit\n\"
  interact"

  echo "服务重启完成！！！！！！"
}


function main(){
  getServerPortInfo
  package
  upload
  deploy
}

main $*