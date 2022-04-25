#!/usr/bin/env bash

CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
THIS_SCRIPT="${CURRENT_DIR}/$(basename $0)"
PROJECT_FOLDER="$(dirname ${CURRENT_DIR})"

function check_user() {
  user=root
  if [ `whoami` != "${user}" ];then
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
    (( k++ ))
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
  elif [ -z "$(echo $index| sed -n "/^[0-9]\+$/p")" ];then
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
    echo "开始准备环境：git node.js nvm pm2 mongodb nginx"

    echo "start install git"
    yum install git

    echo "start install node.js"
    mkdir -p /usr/local/node/
    cd /usr/local/node/
    wget -c https://nodejs.org/dist/v14.9.0/node-v14.9.0-linux-x64.tar.xz
    tar -xvf node-v14.9.0-linux-x64.tar.xz
    rm -rf node-v14.9.0-linux-x64.tar.xz
    echo "export NODE_HOME=/usr/local/node/node-v14.9.0-linux-x64" >> /etc/profile
    echo 'export PATH=$NODE_HOME/bin:$PATH' >> /etc/profile
    source /etc/profile
    npm config set registry https://registry.npm.taobao.org
    echo "node版本：" `node -v`

    echo "start install nvm"
    cd ~
    git clone https://gitee.com/mirrors/nvm
    `source nvm/nvm.sh`
    echo "source ~/nvm/nvm.sh" >> ~/.bashrc
    source ~/.bashrc
    NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node
    nvm install v14.9.0
    nvm alias default v14.9.0

    echo "start install pm2"
    npm install -g pm2@5.1.2

    echo "start install mongodb"
    mongodb_repo=/etc/yum.repos.d/mongodb-org-4.0.repo
    touch $mongodb_repo
    echo "[mongodb-org]" > $mongodb_repo
    echo "name=MongoDB Repository" >> $mongodb_repo
    echo "baseurl=http://mirrors.aliyun.com/mongodb/yum/redhat/7Server/mongodb-org/4.0/x86_64/" >> $mongodb_repo
    echo "gpgcheck=0" >> $mongodb_repo
    echo "enabled=1"  >> $mongodb_repo
    yum -y install mongodb-org
    systemctl start mongod.service
    mongodb_conf=/etc/mongod.conf
    sed -i "s/127.0.0.1/0.0.0.0/g" /etc/mongod.conf
    systemctl restart mongod.service
    systemctl status mongod.service

    echo "start install nginx"
    nginx_repo=/etc/yum.repos.d/nginx.repo
    touch $nginx_repo
    echo "[nginx]" > $nginx_repo
    echo "name=nginx repo" >> $nginx_repo
    echo 'baseurl=http://nginx.org/packages/centos/7/$basearch/' >> $nginx_repo
    echo "gpgcheck=0" >> $nginx_repo
    echo "enabled=1" >> $nginx_repo
    yum install -y nginx-1.20.1
    systemctl enable nginx
    systemctl start nginx
    echo "初始化环境结束。"
}

deploy_flyfish_web() {
    echo "开始部署FLyFish前端："
    cd /data/app/FlyFish/lcapWeb
    npm install
    npm run build

    sed -i "s/127.0.0.1/$local_ip/g" ./dist/conf/env-config.js

    cp FlyFish-2.1.0.conf /etc/nginx/conf.d/FlyFish-2.1.0.conf

    systemctl restart nginx

    echo "部署前端结束。"
}

deploy_flyfish_server() {
    echo "开始部署FlyFish后端："
    cd /data/app/FlyFish/lcapServer/changelog
    npm install

    cd /data/app/FlyFish/lcapServer/
    npm install

    echo " 开始初始化数据库："
    npm run init-development-database
    echo " 初始化数据库结束。"

    npm run development

    echo " 初始化组件开发环境:"
    cd /data/app/FlyFish/lcapWww/components
    npm install
    echo "部署后端结束。"
}

deploy_flyfish_code_server() {
    echo "开始部署FlyFish Code Server:"
    cd /data/app/FlyFish/lcapCodeServer/
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

function uninstall_flyfish() {
    echo ""
}

check_user

if [[ $# -eq 0 ]]; then
  echo "bash install.sh [ install | uninstall ]"
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
  esac
fi