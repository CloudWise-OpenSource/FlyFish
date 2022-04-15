#!/bin/sh
CUR_DIR=$(pwd)
green() {
    echo -e "\033[;32m${1}\033[0m"
}

green "初始化数据库"
cd "$CUR_DIR/changelog" && NODE_ENV=docker /usr/local/bin/node scripts/initDatabase.js
green "初始化数据库完成"

green "项目开始启动"
cd "$CUR_DIR" && npm run docker-start