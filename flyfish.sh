#!/usr/bin/env bash

CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
THIS_SCRIPT="${CURRENT_DIR}/$(basename $0)"
PROJECT_FOLDER="$(dirname ${CURRENT_DIR})"
PROJECT_PATH=$(pwd);

function check_user() {
  user=root
  if [ $(whoami) != "${user}" ]; then
    echo "You must use *** ${user} *** to execute this script!"
    exit 1
  fi
}

get_local_ip() {
  ips=$(ip a | grep -oP '(?<=inet\s)\d+(\.\d+){3}' | grep -v "127.0.0.1")
  k=0
  echo "通过命令获取本机ip如下："
  for ip in $ips; do
    ip_list[k]=$ip
    echo "若选择ip: $ip 请输入id: $k"
    ((k++))
  done
  echo ""
  read -p "请选择本机ip对应的id，如果ip不在上述输出中请输入N > " index
  if [[ $index == "N" ]] || [[ $index == "n" ]]; then
    read -p "请输入本机ip:" local_ip
    local_ip_grep=$(echo "$local_ip" | grep -oP "([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})")
    if [ "$local_ip_grep" != "$local_ip" ]; then
      echo "ip: $local_ip 格式不正确！"
      exit 1
    fi
  elif [ -z "$(echo $index | sed -n "/^[0-9]\+$/p")" ]; then
    echo "输入的id: $index 非法,请重新执行命令选择！"
    exit 1
  else
    local_ip=${ip_list[$index]}
    if [ ! -n "$local_ip" ]; then
      echo "选择的ip不存在!"
      exit 1
    fi
  fi
}

function init_system() {
  echo "开始准备环境：git node.js nvm pm2 mongodb nginx maven jdk"

  echo "start install wget"
  yum install at-spi2-atk libxkbcommon nss wget zip unzip -y

  echo "start install nvm"
  cd ~

  git clone -b v0.39.1 --depth=1 https://gitee.com/mirrors/nvm

  echo "source ~/nvm/nvm.sh" >>~/.bashrc
  source ~/.bashrc
  NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node
  nvm install v14.19.3
  nvm alias default v14.19.3
  npm config set registry=https://registry.npmmirror.com

  echo "start install pm2"
  npm install -g pm2@5.1.2

  echo "start install mongodb"
  mongodb_repo=/etc/yum.repos.d/mongodb-org-4.0.repo
  touch $mongodb_repo
  echo "[mongodb-org]" >$mongodb_repo
  echo "name=MongoDB Repository" >>$mongodb_repo
  echo "baseurl=http://mirrors.aliyun.com/mongodb/yum/redhat/7Server/mongodb-org/4.0/x86_64/" >>$mongodb_repo
  echo "gpgcheck=0" >>$mongodb_repo
  echo "enabled=1" >>$mongodb_repo
  yum -y install mongodb-org
  systemctl start mongod.service
  mongodb_conf=/etc/mongod.conf
  sed -i "s/127.0.0.1/0.0.0.0/g" /etc/mongod.conf
  systemctl restart mongod.service
  systemctl status mongod.service

  echo "start install nginx"
  nginx_repo=/etc/yum.repos.d/nginx.repo
  touch $nginx_repo
  echo "[nginx]" >$nginx_repo
  echo "name=nginx repo" >>$nginx_repo
  echo 'baseurl=http://nginx.org/packages/centos/7/$basearch/' >>$nginx_repo
  echo "gpgcheck=0" >>$nginx_repo
  echo "enabled=1" >>$nginx_repo
  yum install -y nginx-1.20.1
  systemctl enable nginx
  systemctl start nginx

  echo "start install maven"
  wget https://mirrors.tuna.tsinghua.edu.cn/apache/maven/maven-3/3.6.3/binaries/apache-maven-3.6.3-bin.tar.gz --no-check-certificate
  mkdir -p /usr/local
  tar -zxvf apache-maven-3.6.3-bin.tar.gz -C /usr/local
  echo "export M2_HOME=/usr/local/apache-maven-3.6.3" >>/etc/profile
  echo 'export PATH=$PATH:$M2_HOME/bin' >>/etc/profile
  source /etc/profile

  cp /usr/local/apache-maven-3.6.3/conf/settings.xml /usr/local/apache-maven-3.6.3/conf/settings_bak.xml
  rm -rf /usr/local/apache-maven-3.6.3/conf/settings.xml
  cp ${PROJECT_PATH}/shell_tpl/settings.xml /usr/local/apache-maven-3.6.3/conf/
  
  echo "start install jdk"
  yum install java-1.8.0-openjdk.x86_64 java-1.8.0-openjdk-devel.x86_64 -y
  echo 'export JAVA_HOME=/usr/lib/jvm/jre-1.8.0-openjdk-1.8.0.342.b07-1.el7_9.x86_64' >>/etc/profile
  echo 'export JRE_HOME=$JAVA_HOME/jre' >>/etc/profile
  echo 'export PATH=$PATH:$JAVA_HOME/bin:$JRE_HOME/bin' >>/etc/profile
  source /etc/profile

  echo "初始化环境结束。"
}

deploy_flyfish_web() {
  echo "开始部署FLyFish前端："
  cd ${PROJECT_PATH}/lcapWeb
  npm install
  npm run build

  sed -i "s/local_ip/$local_ip/g" ./lcapWeb/conf/env-config.js

  # 提示缺少 conf.d
  cd /
  tempPath="/etc/nginx/conf.d"
  if [ ! -d "$tempPath" ]; then
    mkdir $tempPath
  fi
  cp ${PROJECT_PATH}/shell_tpl/flyfish.conf /etc/nginx/conf.d/

  sed -i "s/IP/$local_ip/g" /etc/nginx/conf.d/flyfish.conf
  sed -i "s/PRO_PATH/${PROJECT_PATH}/g" /etc/nginx/conf.d/flyfish.conf

  systemctl restart nginx

  echo "部署前端结束。"
}

deploy_flyfish_server() {

  sed -i "s/PRO_PATH/${PROJECT_PATH}/g" ${PROJECT_PATH}/lcapServer/config/config.development.js
  
  cd ${PROJECT_PATH}/lcapServer/lib/chrome-linux/
  unzip ./chrome-core.zip

  echo "开始部署FlyFish后端："
  cd ${PROJECT_PATH}/lcapServer/changelog
  npm install

  cd ${PROJECT_PATH}/lcapServer/
  npm install --production

  echo "开始初始化数据库："
  cd ${PROJECT_PATH}/lcapServer/changelog
  NODE_ENV=development node ./scripts/initDatabase.js
  echo "初始化数据库结束。"

  cd ${PROJECT_PATH}/lcapServer/ && npm run development
  
  echo "初始化组件开发环境:"
  cd ${PROJECT_PATH}/lcapWeb/lcapWeb/www/components
  npm install

  sed -i "s/PRO_PATH/${PROJECT_PATH}/g" ${PROJECT_PATH}/lcapDataServer/lcap-server/src/main/resources/application.properties
  echo "lcapDataServer部署："
  cd ${PROJECT_PATH}/lcapDataServer && mvn clean package -Dmaven.test.skip=true -Dmaven.gitcommitid.skip=true -am -pl lcap-server
  cd ./lcap-server/target
  tar -zxvf lcapDataServer-\$\{git.build.version\}-\$\{git.commit.time\}-\$\{git.commit.id.abbrev\}.tar.gz
  cd ./lcapDataServer
  ./bin/lcapDataServer start

  echo "部署后端结束。"
}

deploy_flyfish_code_server() {
  echo "开始部署FlyFish Code Server:"
  cd ${PROJECT_PATH}/lcapCodeServer/
  npm run linux-start

  echo "部署FlyFish Code Server结束。"
}

function echo_flyfish_info() {
  echo " "
  echo "=========FlyFish访问信息================"
  echo "平台访问地址：http://$local_ip:8089"
  echo "平台默认用户：admin"
  echo "平台默认密码：utq#SpV!"
  echo "======================================="
  echo " "
}

function install_flyfish() {

  get_local_ip

  init_system

  deploy_flyfish_web

  deploy_flyfish_server

  deploy_flyfish_code_server

  echo_flyfish_info
}

stop_flyfish() {

  echo "停止运行FlyFish前端："
  systemctl stop nginx

  cd ~
  source nvm/nvm.sh

  echo "停止运行FlyFish后端："
  cd ${PROJECT_PATH}/lcapServer/
  npm run stop
  cd ${PROJECT_PATH}/lcapDataServer/lcap-server/target/lcapDataServer
  ./bin/lcapDataServer stop

  echo "停止运行Code Server:"
  cd ${PROJECT_PATH}/lcapCodeServer/
  npm run stop

}

remove_system() {
  echo "开始移除基础环境：nginx mongodb pm2 node.js nvm maven jdk"

  echo "start uninstall nginx"
  # systemctl stop nginx
  # chkconfig nginx off
  systemctl disable nginx.service
  yum remove nginx -y
  rm -rf /usr/sbin/nginx
  rm -rf /etc/nginx
  rm -rf /etc/init.d/nginx
  rm -rf /etc/yum.repos.d/nginx.repo

  echo "start uninstall mongodb"
  systemctl stop mongod.service
  yum erase $(rpm -qa | grep mongodb-org) -y
  rm -r /var/log/mongodb
  rm -r /var/lib/mongo
  rm -rf /etc/yum.repos.d/mongodb-org-4.0.repo

  echo "start uninstall node.js && nvm"
  npm uninstall -g pm2
  rm -rf .pm2
  rm -rf /usr/local/node/
  sed -i '/NODE_HOME/d' /etc/profile
  cd ~
  rm -rf nvm
  sed -i '/nvm/d' ~/.bashrc

  echo "start uninstall maven && jdk"
  yum remove -y maven
  yum -y remove java-1.8.0-openjdk.x86_64 java-1.8.0-openjdk-devel.x86_64 tzdata-java.noarch
  sed -i '/M2_HOME/d' /etc/profile
  sed -i '/JAVA_HOME/d' /etc/profile
  sed -i '/JRE_HOME/d' /etc/profile

  echo "基础环境移除完毕。"
}

remove_flyfish() {
  echo "开始删除FlyFish源码："
  cd /
  rm -rf ${PROJECT_PATH}
}

function uninstall_flyfish() {
  read -p "是否卸载FlyFish？是(Y)，否（N）" value
  if [[ $value == "Y" ]] || [[ $value == "y" ]]; then

    stop_flyfish

    remove_system

    remove_flyfish

    echo "卸载成功！"
    exit 1
  elif [[ $value == "N" ]] || [[ $value == "n" ]]; then
    echo "取消卸载！"
    exit 1
  else
    echo "请输入Y或者N"
    exit 1
  fi
}

get_source_code() {

  echo "获取FlyFish最新代码"
  git checkout main
  git pull origin main

}

# function update_flyfish() {
#   read -p "是否更新FlyFish？是(Y)，否（N）" value

#   if [[ $value == "Y" ]] || [[ $value == "y" ]]; then

#     get_local_ip

#     stop_flyfish

#     reinstall_flyfish

#     echo_flyfish_info

#     echo "更新成功！"
#     exit 1
#   elif [[ $value == "N" ]] || [[ $value == "n" ]]; then
#     echo "取消更新！"
#     exit 1
#   else
#     echo "请输入Y或者N"
#     exit 1
#   fi
# }

check_user

if [[ $# -eq 0 ]]; then
  echo "bash flyfish.sh [ install | uninstall ]"
  # echo "bash flyfish.sh [ install | uninstall | update ]"
else
  case $1 in
  install)
    shift
    install_flyfish
    ;;
  uninstall)
    shift
    uninstall_flyfish
    ;;
  # update)
  #   shift
  #   update_flyfish
  #   ;;
  esac
fi
