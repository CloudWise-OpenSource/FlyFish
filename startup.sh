#!/bin/bash
set -e

CUR_DIR=`pwd`
WEB_DIR="$CUR_DIR/www/solution-platform-web"
WEB_APP="$CUR_DIR/webapp"
STATIC_DIR="$CUR_DIR/www/static/solution_platform_web"
WORKSPACE_DIR="$CUR_DIR/www/static/dev_visual_component/dev_workspace"

green() {
    echo -e "\033[;32m${1}\033[0m"
}

cd $WEB_DIR
green "前端依赖安装开始"
npm install >/dev/null
green "前端依赖安装完成"

green "前端项目构建开始"
npm run publish $WEB_APP "/static/solution_platform_web/" >/dev/null
cd $WEB_APP
rsync -a platform $STATIC_DIR
green "前端项目构建完成"

cd $CUR_DIR
green "后端依赖安装开始"
npm install >/dev/null
green "后端依赖安装完成"

cd $WORKSPACE_DIR
npm install > /dev/null
